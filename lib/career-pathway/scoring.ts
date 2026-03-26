// lib/career-pathway/scoring.ts
import type { Answers, Career, ScoredCareer } from './types';
import { CAREERS } from './careers';
import { QUESTIONS } from './questions';
import {
  POINTS,
  INCOME_URGENCY_MAX_MONTHS,
  MIN_QUALIFYING_SCORE,
  COLLECTIVIST_COUNTRIES,
  INDIVIDUALIST_COUNTRIES,
  FAMILY_PRESSURE_MULTIPLIERS,
  REMOTE_IMPORTANCE_BONUS,
} from './constants';

interface RawScore {
  career: Career;
  score: number;
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function scoreCareer(
  career: Career,
  answers: Answers,
  familyPressureMultiplier: number,
  countryContext: 'collectivist' | 'individualist' | 'unknown'
): number {
  let score = 0;
  const w = career.scoringWeights;

  // ── Interest alignment ───────────────────────────────────────────────────
  const a1 = toArray(answers['A1']);
  a1.forEach((trait) => {
    if (w.personalityTraits.includes(trait)) score += POINTS.PERSONALITY_MATCH;
  });

  const a2 = toArray(answers['A2']);
  a2.forEach((subj) => {
    if (w.schoolSubjects.includes(subj)) score += POINTS.SCHOOL_SUBJECT_MATCH;
  });

  const a3 = toArray(answers['A3']);
  a3.forEach((signal) => {
    if (w.selfEfficacySignals.includes(signal)) score += POINTS.SELF_EFFICACY_MATCH;
  });

  const b1 = answers['B1'] as string | undefined;
  if (b1 && w.problemPreferences.includes(b1)) score += POINTS.PROBLEM_PREF_MATCH;

  const b2 = answers['B2'] as string | undefined;
  if (b2 && w.workdayPreferences.includes(b2)) score += POINTS.WORKDAY_PREF_MATCH;

  // Conditional B answers
  const conditionalKeys = ['B_TECH', 'B_CONTENT', 'B_DESIGN', 'B_DATA', 'B_PM', 'B_DEVREL'];
  conditionalKeys.forEach((key) => {
    const val = answers[key] as string | undefined;
    if (val && w.conditionalAnswers.includes(val)) score += POINTS.CONDITIONAL_MATCH;
  });

  // ── Constraint compatibility ─────────────────────────────────────────────
  const c1 = answers['C1'] as string | undefined;
  if (c1) {
    const urgencyMaxMonths = INCOME_URGENCY_MAX_MONTHS[c1] ?? 999;
    const timelineMatches = urgencyMaxMonths >= career.timeToFirstIncome.min;
    if (timelineMatches) {
      score += POINTS.INCOME_URGENCY_MATCH;
    } else {
      score += POINTS.INCOME_URGENCY_MISMATCH * familyPressureMultiplier;
    }
  }

  const c3 = answers['C3'] as string | undefined;
  if (c3) {
    const hoursMap: Record<string, number> = {
      under5: 3,
      '5to15': 10,
      '15to30': 22,
      '30plus': 35,
    };
    const userHours = hoursMap[c3] ?? 0;
    if (userHours < w.minHoursPerWeek) score += POINTS.HOURS_LOW;
    else if (userHours >= w.idealHoursPerWeek) score += POINTS.HOURS_IDEAL;
  }

  const c5 = answers['C5'] as string | undefined;
  if (w.requiresCertBudget) {
    if (c5 === 'cert-yes') score += POINTS.CERT_FEASIBLE;
    else if (c5 === 'cert-maybe') score += POINTS.CERT_MAYBE;
    else if (c5 === 'cert-no') score += POINTS.CERT_INFEASIBLE;
  } else {
    score += POINTS.NO_CERT_BONUS;
  }

  const c2 = answers['C2'] as string | undefined;
  if (w.requiresDegree && c2 && ['secondary', 'no-formal'].includes(c2)) {
    score += POINTS.DEGREE_REQUIRED_MISMATCH;
  }

  const c4 = answers['C4'] as string | undefined;
  if (c4 === 'zero' && career.freeLearningPathQuality === 'limited') {
    score += POINTS.FREE_PATH_NO_BUDGET;
  }

  // ── Setup fit ────────────────────────────────────────────────────────────
  const d1 = answers['D1'] as string | undefined;
  const d2 = answers['D2'] as string | undefined;
  if (career.remoteAvailability === 'very-high') {
    if (d1 === 'solid' && d2 === 'remote-yes') score += POINTS.REMOTE_READY;
    if (d1 === 'limited' || d2 === 'remote-no') score += POINTS.REMOTE_LIMITED;
    if (countryContext === 'collectivist') score += REMOTE_IMPORTANCE_BONUS;
  }
  if (d2 === 'local-pref' && career.remoteAvailability !== 'very-high') {
    score += POINTS.LOCAL_PREF_MATCH;
  }

  // ── Values alignment ─────────────────────────────────────────────────────
  const e1 = toArray(answers['E1']);
  e1.forEach((val) => {
    if (w.valuesMatch.includes(val)) score += POINTS.VALUES_MATCH;
  });

  if (e1.includes('earning-well')) {
    if (career.earningCeiling === 'very-high') score += 5;
    else if (career.earningCeiling === 'high') score += 3;
  }

  // ── AI preference ────────────────────────────────────────────────────────
  const e2 = answers['E2'] as string | undefined;
  if (e2 && w.aiPreferenceMatch.includes(e2)) score += POINTS.AI_PREF_MATCH;
  if (e2 === 'human-central' && career.aiDisplacementRisk === 'high') score += POINTS.AI_PREF_MISMATCH;
  if (e2 === 'lean-into-ai' && career.id === 'ai-workflow') score += POINTS.AI_PREF_MATCH;

  return Math.max(0, score);
}

export function scoreAllCareers(answers: Answers): RawScore[] {
  const country = (answers['W4'] as string | undefined) ?? '';
  const countryContext = COLLECTIVIST_COUNTRIES.has(country)
    ? 'collectivist'
    : INDIVIDUALIST_COUNTRIES.has(country)
    ? 'individualist'
    : 'unknown';

  const a4Answer = (answers['A4'] as string | undefined) ?? 'supported';
  const familyPressure = FAMILY_PRESSURE_MULTIPLIERS[countryContext][a4Answer] ?? 1;

  return CAREERS.map((career) => ({
    career,
    score: scoreCareer(career, answers, familyPressure, countryContext),
  }));
}

// Resolves {name}, {trait}, {efficacy}, {problem} placeholders in whyItFitsTemplate
export function resolveWhyItFits(career: Career, answers: Answers, userName?: string): string {
  const w = career.scoringWeights;

  const a1Values = toArray(answers['A1']);
  const matchingTraitValue = a1Values.find((v) => w.personalityTraits.includes(v));
  const traitOption = matchingTraitValue
    ? QUESTIONS.find((q) => q.id === 'A1')?.options.find((o) => o.value === matchingTraitValue)
    : undefined;

  const a3Values = toArray(answers['A3']);
  const matchingEfficacyValue = a3Values.find((v) => w.selfEfficacySignals.includes(v));
  const efficacyOption = matchingEfficacyValue
    ? QUESTIONS.find((q) => q.id === 'A3')?.options.find((o) => o.value === matchingEfficacyValue)
    : undefined;

  const b1Value = answers['B1'] as string | undefined;
  const matchingProblemValue = b1Value && w.problemPreferences.includes(b1Value) ? b1Value : undefined;
  const problemOption = matchingProblemValue
    ? QUESTIONS.find((q) => q.id === 'B1')?.options.find((o) => o.value === matchingProblemValue)
    : undefined;

  if (!traitOption && !efficacyOption && !problemOption) {
    return career.whyItFitsFallback;
  }

  return career.whyItFitsTemplate
    .replace('{name}', userName || 'You')
    .replace('{trait}', traitOption?.label.toLowerCase() ?? '')
    .replace('{efficacy}', efficacyOption?.label.toLowerCase() ?? '')
    .replace('{problem}', problemOption?.label.toLowerCase() ?? '');
}

export function selectTopFour(rawScores: RawScore[]): ScoredCareer[] {
  const sorted = [...rawScores].sort((a, b) => b.score - a.score);
  const qualifying = sorted.filter((s) => s.score >= MIN_QUALIFYING_SCORE);

  if (qualifying.length === 0) return [];

  const results: ScoredCareer[] = [];
  const usedClusters = new Set<string>();

  // Position 1: highest score
  const first = qualifying[0];
  results.push({ career: first.career, score: first.score, rank: 1 });
  usedClusters.add(first.career.cluster);

  if (qualifying.length < 2) return results;

  // Position 2: second highest (any cluster)
  const second = qualifying[1];
  results.push({ career: second.career, score: second.score, rank: 2 });
  usedClusters.add(second.career.cluster);

  if (qualifying.length < 3) return results;

  // Position 3: highest from a different cluster than 1 and 2
  const third = qualifying.slice(2).find((s) => !usedClusters.has(s.career.cluster))
    ?? qualifying[2];
  results.push({ career: third.career, score: third.score, rank: 3 });
  usedClusters.add(third.career.cluster);

  if (qualifying.length < 4) return results;

  // Position 4: highest from a cluster not used in positions 1, 2, OR 3
  const fourth = qualifying.find(
    (s) => !results.some((r) => r.career.id === s.career.id) && !usedClusters.has(s.career.cluster)
  ) ?? qualifying.find((s) => !results.some((r) => r.career.id === s.career.id));

  if (fourth) {
    results.push({ career: fourth.career, score: fourth.score, rank: 4 });
  }

  return results;
}
