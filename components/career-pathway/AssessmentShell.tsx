// components/career-pathway/AssessmentShell.tsx
'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Answers } from '@/lib/career-pathway/types';
import { buildQuestionSequence } from '@/lib/career-pathway/questions';
import { scoreAllCareers, selectTopFour } from '@/lib/career-pathway/scoring';
import { storageRead, storageWrite, storageClearAll } from '@/lib/career-pathway/storage';
import { STORAGE_KEYS, STORAGE_TTL } from '@/lib/career-pathway/constants';
import { ProgressBar } from './ProgressBar';
import { WelcomeForm } from './WelcomeForm';
import { QuestionCard } from './QuestionCard';

type Phase = 'check' | 'welcome' | 'resume-prompt' | 'questions' | 'scoring';

export function AssessmentShell() {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>('check');
  const [name, setName] = useState('');
  const [discoverySource, setDiscoverySource] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [country, setCountry] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [currentIndex, setCurrentIndex] = useState(0);

  // On mount: check for existing session
  useEffect(() => {
    const existingResults = storageRead(STORAGE_KEYS.RESULTS);
    if (existingResults) {
      router.replace('/career-pathway/results');
      return;
    }
    const progress = storageRead<{ name: string; discoverySource: string; answers: Answers; currentQuestion: number }>(
      STORAGE_KEYS.PROGRESS
    );
    if (progress) {
      setName(progress.name ?? '');
      setDiscoverySource(progress.discoverySource ?? '');
      setAnswers(progress.answers ?? {});
      setCurrentIndex(progress.currentQuestion ?? 0);
      // Restore ageRange and country from the welcome key (not stored in progress)
      const welcome = storageRead<{ ageRange: string; country: string }>(STORAGE_KEYS.WELCOME);
      if (welcome) {
        setAgeRange(welcome.ageRange ?? '');
        setCountry(welcome.country ?? '');
      }
      setPhase('resume-prompt');
    } else {
      setPhase('welcome');
    }
  }, [router]);

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
    setPhase('questions');
  }

  function handleStartOver() {
    storageClearAll([STORAGE_KEYS.PROGRESS, STORAGE_KEYS.RESULTS, STORAGE_KEYS.WELCOME]);
    setAnswers({});
    setCurrentIndex(0);
    setName('');
    setDiscoverySource('');
    setAgeRange('');
    setCountry('');
    setPhase('welcome');
  }

  function handleAnswer(value: string | string[]) {
    const questions = buildQuestionSequence(answers);
    const q = questions[currentIndex];
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    const nextIndex = currentIndex + 1;
    storageWrite(
      STORAGE_KEYS.PROGRESS,
      { name, discoverySource, answers: newAnswers, currentQuestion: nextIndex },
      STORAGE_TTL.PROGRESS
    );

    const updatedQuestions = buildQuestionSequence(newAnswers);
    if (nextIndex < updatedQuestions.length) {
      setCurrentIndex(nextIndex);
    } else {
      finishAssessment(newAnswers);
    }
  }

  async function finishAssessment(finalAnswers: Answers) {
    setPhase('scoring');

    await new Promise((r) => setTimeout(r, 1500));

    const answersWithContext = { ...finalAnswers, W4: country };
    const rawScores = scoreAllCareers(answersWithContext);
    const top4 = selectTopFour(rawScores);

    storageWrite(
      STORAGE_KEYS.RESULTS,
      { results: top4, answers: answersWithContext, completedAt: new Date().toISOString(), name },
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
        results: top4.map((r) => ({ careerId: r.career.id, score: r.score, rank: r.rank })),
      }),
    }).catch(() => {/* silently ignore analytics failures */});

    storageClearAll([STORAGE_KEYS.PROGRESS]);
    router.push('/career-pathway/results');
  }

  function handleBack() {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  }

  // ── Render ────────────────────────────────────────────────────────────────
  if (phase === 'check') {
    return null;
  }

  if (phase === 'scoring') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] gap-4 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin" style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }} />
        <p className="text-sm font-semibold text-muted-foreground">Analysing your answers...</p>
      </div>
    );
  }

  if (phase === 'welcome') {
    return (
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold" style={{ letterSpacing: '-0.02em' }}>
            Before we start
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            Two quick questions — then your assessment begins.
          </p>
        </div>
        <WelcomeForm onComplete={handleWelcomeComplete} />
      </div>
    );
  }

  if (phase === 'resume-prompt') {
    const questions = buildQuestionSequence(answers);
    const answeredCount = Object.keys(answers).length;
    const total = questions.length;
    return (
      <div className="flex flex-col gap-6 max-w-md">
        <h2 className="text-xl font-bold">You have a saved session</h2>
        <p className="text-sm text-muted-foreground">
          You answered {answeredCount} of {total} questions. Want to pick up where you left off?
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleResume}
            className="px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-[0.08em] text-white"
            style={{ background: 'var(--accent)' }}
          >
            Resume
          </button>
          <button
            onClick={handleStartOver}
            className="px-5 py-2.5 rounded-md text-xs font-bold uppercase tracking-[0.08em] border"
            style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // Phase: questions
  const questions = buildQuestionSequence(answers);
  const q = questions[currentIndex];
  if (!q) return null;

  return (
    <div className="flex flex-col gap-8">
      <ProgressBar
        current={currentIndex + 1}
        total={questions.length}
        phase={q.phase}
      />
      <QuestionCard
        question={q}
        value={answers[q.id]}
        onChange={handleAnswer}
      />
      <div className="flex gap-4 items-center">
        {currentIndex > 0 && (
          <button
            onClick={handleBack}
            className="text-xs font-bold uppercase tracking-[0.08em] underline underline-offset-2"
            style={{ color: 'var(--muted-foreground)' }}
          >
            ← Back
          </button>
        )}
      </div>
    </div>
  );
}
