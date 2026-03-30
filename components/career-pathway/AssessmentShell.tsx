'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Answers, AssessmentStage, SessionProgress, SessionResults } from '@/lib/career-pathway/types';
import { buildQuestionSequence, buildRefinementSequence } from '@/lib/career-pathway/questions';
import {
  applyRefinementBonuses,
  getResultConfidenceStyle,
  getTopScore,
  scoreAllCareers,
  selectLongTermResults,
  selectTopFour,
  shouldTriggerRefinement,
  toCareerResultSummaries,
} from '@/lib/career-pathway/scoring';
import { storageRead, storageWrite, storageClearAll } from '@/lib/career-pathway/storage';
import { STORAGE_KEYS, STORAGE_TTL } from '@/lib/career-pathway/constants';
import { ProgressBar } from './ProgressBar';
import { WelcomeForm } from './WelcomeForm';
import { QuestionCard } from './QuestionCard';

type Phase = 'check' | 'welcome' | 'resume-prompt' | 'questions' | 'refinement' | 'scoring';

function normalizeStoredAnswers(rawAnswers: Answers | undefined): Answers {
  if (!rawAnswers) return {};

  const answers = { ...rawAnswers };
  const a2 = answers.A2;
  if (Array.isArray(a2)) {
    answers.A2 = a2[0] ?? '';
  }

  return answers;
}

export function AssessmentShell() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('check');
  const [name, setName] = useState('');
  const [discoverySource, setDiscoverySource] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [country, setCountry] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [resumeStage, setResumeStage] = useState<AssessmentStage>('questions');

  useEffect(() => {
    const existingResults = storageRead<SessionResults>(STORAGE_KEYS.RESULTS);
    if (existingResults?.results?.length) {
      router.replace('/career-pathway/results');
      return;
    }

    const progress = storageRead<SessionProgress>(STORAGE_KEYS.PROGRESS);
    if (progress) {
      const normalizedAnswers = normalizeStoredAnswers(progress.answers);
      setName(progress.name ?? '');
      setDiscoverySource(progress.discoverySource ?? '');
      setAnswers(normalizedAnswers);
      setCurrentIndex(progress.currentQuestion ?? 0);
      setResumeStage(progress.stage ?? 'questions');

      const welcome = storageRead<{ ageRange: string; country: string }>(STORAGE_KEYS.WELCOME);
      if (welcome) {
        setAgeRange(welcome.ageRange ?? '');
        setCountry(welcome.country ?? '');
      }

      setPhase('resume-prompt');
      return;
    }

    setPhase('welcome');
  }, [router]);

  function persistProgress(stage: AssessmentStage, nextAnswers: Answers, nextIndex: number) {
    storageWrite(
      STORAGE_KEYS.PROGRESS,
      {
        name,
        discoverySource,
        answers: normalizeStoredAnswers(nextAnswers),
        currentQuestion: nextIndex,
        stage,
      },
      STORAGE_TTL.PROGRESS
    );
  }

  function handleWelcomeComplete(enteredName: string, source: string, enteredAgeRange: string, enteredCountry: string) {
    setName(enteredName);
    setDiscoverySource(source);
    setAgeRange(enteredAgeRange);
    setCountry(enteredCountry);
    storageWrite(
      STORAGE_KEYS.WELCOME,
      { name: enteredName, discoverySource: source, ageRange: enteredAgeRange, country: enteredCountry },
      STORAGE_TTL.WELCOME
    );
    setPhase('questions');
  }

  function handleResume() {
    setPhase(resumeStage);
  }

  function handleStartOver() {
    storageClearAll([STORAGE_KEYS.PROGRESS, STORAGE_KEYS.RESULTS, STORAGE_KEYS.WELCOME]);
    setAnswers({});
    setCurrentIndex(0);
    setName('');
    setDiscoverySource('');
    setAgeRange('');
    setCountry('');
    setResumeStage('questions');
    setPhase('welcome');
  }

  function getQuestionsForPhase(currentPhase: Phase, currentAnswers: Answers) {
    return currentPhase === 'refinement' ? buildRefinementSequence() : buildQuestionSequence(currentAnswers);
  }

  function handleAnswer(value: string | string[]) {
    const questions = getQuestionsForPhase(phase, answers);
    const question = questions[currentIndex];
    const nextAnswers = { ...answers, [question.id]: value };
    setAnswers(nextAnswers);

    if (question.type === 'multi') return;

    advanceFrom(nextAnswers);
  }

  function handleMultiContinue() {
    advanceFrom(answers);
  }

  function advanceFrom(currentAnswers: Answers) {
    const stage: AssessmentStage = phase === 'refinement' ? 'refinement' : 'questions';
    const questions = getQuestionsForPhase(phase, currentAnswers);
    const nextIndex = currentIndex + 1;

    persistProgress(stage, currentAnswers, nextIndex);

    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      return;
    }

    if (phase === 'refinement') {
      finishRefinement(currentAnswers);
      return;
    }

    finishAssessment(currentAnswers);
  }

  async function persistFinalResults(finalAnswers: Answers, refinementTriggered: boolean) {
    const baseScores = scoreAllCareers(finalAnswers);
    const baseResults = selectTopFour(baseScores);
    const baseTopScore = getTopScore(baseScores);
    const finalScores = refinementTriggered ? applyRefinementBonuses(baseScores, finalAnswers) : baseScores;
    const finalResults = selectTopFour(finalScores);
    const finalTopScore = getTopScore(finalScores);
    const confidenceStyle = getResultConfidenceStyle(finalResults);
    const moatBaseScores = scoreAllCareers(finalAnswers, 'long-term');
    const moatScores = refinementTriggered ? applyRefinementBonuses(moatBaseScores, finalAnswers) : moatBaseScores;
    const moatResults = selectLongTermResults(moatScores);
    const moatConfidenceStyle = getResultConfidenceStyle(moatResults);

    storageWrite(
      STORAGE_KEYS.RESULTS,
      {
        results: finalResults,
        moatResults,
        answers: finalAnswers,
        completedAt: new Date().toISOString(),
        name,
        refinementTriggered,
        baseResults: refinementTriggered ? toCareerResultSummaries(baseResults) : undefined,
        baseTopScore,
        finalTopScore,
        confidenceStyle,
        moatConfidenceStyle,
      },
      STORAGE_TTL.RESULTS
    );

    fetch('/api/career-pathway/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: name || null,
        discoverySource: discoverySource || null,
        ageRange: ageRange || null,
        country: country || null,
        answers: finalAnswers,
        results: toCareerResultSummaries(finalResults),
        refinementTriggered,
        refinementAnswers: refinementTriggered
          ? {
              R1: finalAnswers.R1,
              R2: finalAnswers.R2,
              R3: finalAnswers.R3,
              R4: finalAnswers.R4,
            }
          : null,
        baseResults: toCareerResultSummaries(baseResults),
        baseTopScore,
        finalTopScore,
        moatResults: toCareerResultSummaries(moatResults),
      }),
    }).catch(() => {
      // Silently ignore analytics failures.
    });

    storageClearAll([STORAGE_KEYS.PROGRESS]);
    router.push('/career-pathway/results');
  }

  async function finishAssessment(finalAnswers: Answers) {
    setPhase('scoring');
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const answersWithContext = { ...finalAnswers, W4: country };
    const rawScores = scoreAllCareers(answersWithContext);

    if (shouldTriggerRefinement(rawScores)) {
      setAnswers(answersWithContext);
      setCurrentIndex(0);
      setResumeStage('refinement');
      persistProgress('refinement', answersWithContext, 0);
      setPhase('refinement');
      return;
    }

    await persistFinalResults(answersWithContext, false);
  }

  async function finishRefinement(finalAnswers: Answers) {
    setPhase('scoring');
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const answersWithContext = { ...finalAnswers, W4: country };
    await persistFinalResults(answersWithContext, true);
  }

  function handleBack() {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      return;
    }

    if (phase === 'refinement') {
      const questionAnswers = { ...answers };
      delete questionAnswers.R1;
      delete questionAnswers.R2;
      delete questionAnswers.R3;
      delete questionAnswers.R4;
      setAnswers(questionAnswers);
      setResumeStage('questions');
      setCurrentIndex(buildQuestionSequence(questionAnswers).length - 1);
      setPhase('questions');
    }
  }

  if (phase === 'check') {
    return null;
  }

  if (phase === 'scoring') {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-center">
        <div
          className="h-8 w-8 animate-spin rounded-full border-2 border-t-transparent"
          style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
        />
        <p className="text-sm font-semibold text-muted-foreground">Analysing your answers...</p>
      </div>
    );
  }

  if (phase === 'welcome') {
    return (
      <div className="flex flex-col gap-8">
        <h1 className="text-2xl font-extrabold sm:text-3xl" style={{ letterSpacing: '-0.02em' }}>
          Before we start
        </h1>
        <WelcomeForm onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  if (phase === 'resume-prompt') {
    if (resumeStage === 'refinement') {
      return (
        <div className="flex max-w-md flex-col gap-6">
          <h2 className="text-xl font-bold">You have a saved session</h2>
          <p className="text-sm text-muted-foreground">
            You were on the final quick refinement step. Want to pick up where you left off?
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleResume}
              className="rounded-md px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
              style={{ background: 'var(--accent)' }}
            >
              Resume
            </button>
            <button
              onClick={handleStartOver}
              className="rounded-md border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em]"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
            >
              Start Over
            </button>
          </div>
        </div>
      );
    }

    const questions = buildQuestionSequence(answers);
    const answeredCount = Object.keys(answers).filter((key) => !key.startsWith('R')).length;
    const total = questions.length;

    return (
      <div className="flex max-w-md flex-col gap-6">
        <h2 className="text-xl font-bold">You have a saved session</h2>
        <p className="text-sm text-muted-foreground">
          You answered {answeredCount} of {total} questions. Want to pick up where you left off?
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            onClick={handleResume}
            className="rounded-md px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white"
            style={{ background: 'var(--accent)' }}
          >
            Resume
          </button>
          <button
            onClick={handleStartOver}
            className="rounded-md border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.08em]"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  const questions = getQuestionsForPhase(phase, answers);
  const question = questions[currentIndex];
  if (!question) return null;

  const isMulti = question.type === 'multi';
  const multiValue = isMulti ? (Array.isArray(answers[question.id]) ? (answers[question.id] as string[]) : []) : [];
  const canContinueMulti = isMulti && multiValue.length > 0;

  return (
    <div className="flex flex-col gap-8">
      <ProgressBar current={currentIndex + 1} total={questions.length} phase={question.phase} />

      {phase === 'refinement' && (
      <div className="max-w-2xl rounded-xl border px-5 py-4 text-sm text-muted-foreground" style={{ borderColor: 'var(--border)' }}>
          <h2 className="mb-1 text-base font-bold text-foreground">Quick refinement</h2>
          <p>You&apos;re between a few promising paths. Answer 4 quick questions so I can narrow them down.</p>
        </div>
      )}

      <QuestionCard question={question} value={answers[question.id]} onChange={handleAnswer} />

      <div className="flex items-center gap-4">
        {(currentIndex > 0 || phase === 'refinement') && (
          <button
            onClick={handleBack}
            className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-2"
            style={{ color: 'var(--muted-foreground)' }}
          >
            Back
          </button>
        )}

        {isMulti && (
          <button
            onClick={handleMultiContinue}
            disabled={!canContinueMulti}
            className="rounded-md px-6 py-2.5 text-xs font-bold uppercase tracking-[0.08em] text-white transition disabled:opacity-40"
            style={{ background: 'var(--accent)' }}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}
