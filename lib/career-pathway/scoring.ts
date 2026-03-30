import type {
  Answers,
  Career,
  CareerCluster,
  CareerResultSummary,
  RecommendationTrack,
  ResultConfidenceStyle,
  ScoredCareer,
} from './types';
import { CAREERS } from './careers';
import { QUESTIONS } from './questions';
import {
  COLLECTIVIST_COUNTRIES,
  FAMILY_PRESSURE_MULTIPLIERS,
  INDIVIDUALIST_COUNTRIES,
  INCOME_URGENCY_MAX_MONTHS,
  MIN_QUALIFYING_SCORE,
  POINTS,
  REFINEMENT_CAREER_BONUS,
  REFINEMENT_CLUSTER_BONUS,
  REFINEMENT_MAX_BONUS,
  REFINEMENT_TRIGGER_SCORE,
  REMOTE_IMPORTANCE_BONUS,
} from './constants';

interface RawScore {
  career: Career;
  score: number;
}

const REFINEMENT_CLUSTER_MAP: Record<string, CareerCluster[]> = {
  clarify: ['content'],
  debug: ['technical'],
  pattern: ['data'],
  design: ['design'],
  coordinate: ['management'],
  systemize: ['ai-native'],
  write: ['content'],
  troubleshoot: ['technical'],
  analyze: ['data'],
  ux: ['design'],
  prioritize: ['management'],
  repeatable: ['ai-native'],
  teach_persuade: ['content'],
  decision_analysis: ['data'],
  screen_flow: ['design'],
  build_features: ['technical'],
  workflow_automation: ['ai-native'],
  team_planning: ['management'],
  explain: ['content'],
  logic: ['technical', 'data'],
  sketch: ['design'],
  test: ['technical'],
  stakeholders: ['management'],
  process: ['ai-native'],
};

const REFINEMENT_CAREER_MAP: Record<string, string[]> = {
  'b2b-saas-writer': ['clarify', 'write', 'teach_persuade', 'explain'],
  'technical-writer': ['clarify', 'write', 'teach_persuade', 'explain'],
  'seo-strategist': ['clarify', 'write', 'teach_persuade', 'explain'],
  'digital-marketer': ['clarify', 'teach_persuade', 'explain', 'pattern', 'analyze', 'process'],
  'email-marketer': ['clarify', 'teach_persuade', 'explain', 'pattern', 'analyze', 'process'],
  'social-media-manager': ['clarify', 'teach_persuade', 'explain', 'pattern', 'analyze'],
  'video-editor': ['design', 'screen_flow', 'sketch', 'clarify'],
  'frontend-dev': ['debug', 'troubleshoot', 'build_features', 'logic', 'test'],
  'backend-dev': ['debug', 'troubleshoot', 'build_features', 'logic', 'test'],
  'fullstack-dev': ['debug', 'troubleshoot', 'build_features', 'logic', 'test'],
  'mobile-dev': ['debug', 'troubleshoot', 'build_features', 'logic', 'test'],
  'qa-engineer': ['debug', 'troubleshoot', 'build_features', 'logic', 'test'],
  'it-support': ['debug', 'troubleshoot', 'logic', 'test', 'systemize', 'process'],
  cybersecurity: ['debug', 'troubleshoot', 'logic', 'test', 'systemize', 'process'],
  'devops-cloud': ['debug', 'troubleshoot', 'logic', 'test', 'systemize', 'process'],
  'data-analyst': ['pattern', 'analyze', 'decision_analysis', 'logic'],
  'data-engineer': ['pattern', 'analyze', 'decision_analysis', 'logic'],
  'ui-ux-designer': ['design', 'ux', 'screen_flow', 'sketch'],
  'product-designer': ['design', 'ux', 'screen_flow', 'sketch'],
  'graphic-designer': ['design', 'ux', 'screen_flow', 'sketch'],
  'product-manager': ['coordinate', 'prioritize', 'team_planning', 'stakeholders'],
  'project-manager': ['coordinate', 'prioritize', 'team_planning', 'stakeholders'],
  'ai-workflow': ['systemize', 'repeatable', 'workflow_automation', 'process'],
};

function toArray(value: string | string[] | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function getAiWorkflowReadiness(answers: Answers): number {
  const a3 = new Set(toArray(answers.A3 as string | string[] | undefined));
  const automationSignals = ['build-website-app', 'data-sense', 'project-track', 'explain-technical'];
  const readinessChecks = [
    automationSignals.some((signal) => a3.has(signal)),
    ['technical', 'data-analysis'].includes((answers.B1 as string | undefined) ?? ''),
    ['building', 'analysing'].includes((answers.B2 as string | undefined) ?? ''),
    ['lean-into-ai', 'ai-as-tool'].includes((answers.E2 as string | undefined) ?? ''),
    !['under5'].includes((answers.C3 as string | undefined) ?? ''),
  ];

  return readinessChecks.filter(Boolean).length;
}

function getTrackUrgencyScore(
  career: Career,
  c1: string,
  familyPressureMultiplier: number,
  track: RecommendationTrack
): number {
  const urgencyMaxMonths = INCOME_URGENCY_MAX_MONTHS[c1] ?? 999;
  const timelineMatches = urgencyMaxMonths >= career.timeToFirstIncome.min;

  if (track === 'long-term') {
    if (timelineMatches) return Math.round(POINTS.INCOME_URGENCY_MATCH * 0.4);
    return Math.round(POINTS.INCOME_URGENCY_MISMATCH * 0.35 * familyPressureMultiplier);
  }

  if (timelineMatches) return POINTS.INCOME_URGENCY_MATCH;
  return Math.round(POINTS.INCOME_URGENCY_MISMATCH * familyPressureMultiplier);
}

function getTrackHoursScore(userHours: number, minHours: number, idealHours: number, track: RecommendationTrack): number {
  if (userHours < minHours) {
    return track === 'long-term' ? Math.round(POINTS.HOURS_LOW * 0.5) : POINTS.HOURS_LOW;
  }
  if (userHours >= idealHours) {
    return track === 'long-term' ? Math.round(POINTS.HOURS_IDEAL * 0.6) : POINTS.HOURS_IDEAL;
  }
  return 0;
}

function getTrackCertScore(c5: string | undefined, requiresCertBudget: boolean, track: RecommendationTrack): number {
  if (!requiresCertBudget) {
    return track === 'long-term' ? 0 : POINTS.NO_CERT_BONUS;
  }

  if (c5 === 'cert-yes') return POINTS.CERT_FEASIBLE;
  if (c5 === 'cert-maybe') return track === 'long-term' ? Math.round(POINTS.CERT_MAYBE * 0.5) : POINTS.CERT_MAYBE;
  if (c5 === 'cert-no') return track === 'long-term' ? Math.round(POINTS.CERT_INFEASIBLE * 0.5) : POINTS.CERT_INFEASIBLE;
  return 0;
}

function getStrategyAdjustment(career: Career, answers: Answers, track: RecommendationTrack): number {
  const strategy = answers.E3 as string | undefined;
  if (!strategy) return 0;

  if (track === 'immediate') {
    if (strategy === 'start-now') {
      if (career.timeToFirstIncome.min <= 6) return POINTS.STRATEGY_MATCH;
      if (career.timeToFirstIncome.min <= 12) return Math.round(POINTS.STRATEGY_MATCH * 0.5);
      return -POINTS.STRATEGY_MATCH;
    }
    if (strategy === 'balanced') {
      if (career.timeToFirstIncome.min <= 12) return Math.round(POINTS.STRATEGY_MATCH * 0.5);
      if (career.timeToFirstIncome.min > 18) return -Math.round(POINTS.STRATEGY_MATCH * 0.5);
    }
    return 0;
  }

  if (strategy === 'long-term-moat') {
    const isMoatCluster = career.cluster === 'technical' || career.cluster === 'data';
    return isMoatCluster ? POINTS.STRATEGY_MATCH : -Math.round(POINTS.STRATEGY_MATCH * 0.5);
  }
  if (strategy === 'balanced' && (career.cluster === 'technical' || career.cluster === 'data')) {
    return Math.round(POINTS.STRATEGY_MATCH * 0.5);
  }
  return 0;
}

function getLongTermMoatBonus(career: Career): number {
  let bonus = 0;

  if (career.earningCeiling === 'very-high') bonus += 10;
  else if (career.earningCeiling === 'high') bonus += 6;

  if (career.aiDisplacementRisk === 'low') bonus += 8;
  else if (career.aiDisplacementRisk === 'low-medium') bonus += 5;
  else if (career.aiDisplacementRisk === 'medium') bonus += 2;

  if (career.humanJudgmentCentrality === 'very-high') bonus += 6;
  else if (career.humanJudgmentCentrality === 'high') bonus += 4;
  else if (career.humanJudgmentCentrality === 'medium-high') bonus += 2;

  if (career.cluster === 'technical' || career.cluster === 'data') bonus += 6;

  if (career.entryDifficulty === 'high' || career.entryDifficulty === 'medium-high') bonus += 3;
  else if (career.entryDifficulty === 'medium') bonus += 2;

  if (career.id === 'ai-workflow') bonus -= 6;

  return bonus;
}

function scoreCareer(
  career: Career,
  answers: Answers,
  familyPressureMultiplier: number,
  countryContext: 'collectivist' | 'individualist' | 'unknown',
  track: RecommendationTrack
): number {
  let score = 0;
  const weights = career.scoringWeights;

  const a1 = toArray(answers.A1 as string | string[] | undefined);
  a1.forEach((trait) => {
    if (weights.personalityTraits.includes(trait)) score += POINTS.PERSONALITY_MATCH;
  });

  const a2 = toArray(answers.A2 as string | string[] | undefined);
  a2.forEach((subject) => {
    if (weights.schoolSubjects.includes(subject)) score += POINTS.SCHOOL_SUBJECT_MATCH;
  });

  const a3 = toArray(answers.A3 as string | string[] | undefined);
  a3.forEach((signal) => {
    if (weights.selfEfficacySignals.includes(signal)) score += POINTS.SELF_EFFICACY_MATCH;
  });

  const b1 = answers.B1 as string | undefined;
  if (b1 && weights.problemPreferences.includes(b1)) score += POINTS.PROBLEM_PREF_MATCH;

  const b2 = answers.B2 as string | undefined;
  if (b2 && weights.workdayPreferences.includes(b2)) score += POINTS.WORKDAY_PREF_MATCH;

  ['B_TECH', 'B_CONTENT', 'B_DESIGN', 'B_DATA', 'B_PM', 'B_DEVREL'].forEach((key) => {
    const value = answers[key] as string | undefined;
    if (value && weights.conditionalAnswers.includes(value)) score += POINTS.CONDITIONAL_MATCH;
  });

  const c1 = answers.C1 as string | undefined;
  if (c1) {
    score += getTrackUrgencyScore(career, c1, familyPressureMultiplier, track);
  }

  const c3 = answers.C3 as string | undefined;
  if (c3) {
    const hoursMap: Record<string, number> = {
      under5: 3,
      '5to15': 10,
      '15to30': 22,
      '30plus': 35,
    };
    const userHours = hoursMap[c3] ?? 0;
    score += getTrackHoursScore(userHours, weights.minHoursPerWeek, weights.idealHoursPerWeek, track);
  }

  const c5 = answers.C5 as string | undefined;
  score += getTrackCertScore(c5, weights.requiresCertBudget, track);

  const c2 = answers.C2 as string | undefined;
  if (weights.requiresDegree && c2 && ['secondary', 'no-formal'].includes(c2)) {
    score += POINTS.DEGREE_REQUIRED_MISMATCH;
  }

  const c4 = answers.C4 as string | undefined;
  if (c4 === 'zero' && career.freeLearningPathQuality === 'limited') {
    score += POINTS.FREE_PATH_NO_BUDGET;
  }

  const d1 = answers.D1 as string | undefined;
  const d2 = answers.D2 as string | undefined;
  if (career.remoteAvailability === 'very-high') {
    if (d1 === 'solid' && d2 === 'remote-yes') score += POINTS.REMOTE_READY;
    if (d1 === 'limited' || d2 === 'remote-no') score += POINTS.REMOTE_LIMITED;
    if (countryContext === 'collectivist') score += REMOTE_IMPORTANCE_BONUS;
  }
  if (d2 === 'local-pref' && career.remoteAvailability !== 'very-high') {
    score += POINTS.LOCAL_PREF_MATCH;
  }

  const e1 = toArray(answers.E1 as string | string[] | undefined);
  e1.forEach((value) => {
    if (weights.valuesMatch.includes(value)) score += POINTS.VALUES_MATCH;
  });

  if (e1.includes('earning-well')) {
    if (career.earningCeiling === 'very-high') score += 5;
    else if (career.earningCeiling === 'high') score += 3;
  }

  const e2 = answers.E2 as string | undefined;
  if (e2 && weights.aiPreferenceMatch.includes(e2)) score += POINTS.AI_PREF_MATCH;
  if (e2 === 'human-central' && career.aiDisplacementRisk === 'high') score += POINTS.AI_PREF_MISMATCH;
  if (e2 === 'lean-into-ai' && career.id === 'ai-workflow') score += POINTS.AI_PREF_MATCH;

  score += getStrategyAdjustment(career, answers, track);

  if (career.id === 'ai-workflow' && getAiWorkflowReadiness(answers) < 3) {
    score += POINTS.AI_WORKFLOW_WEAK_FIT;
  }

  if (track === 'long-term') {
    score += getLongTermMoatBonus(career);
  }

  return Math.max(0, score);
}

export function scoreAllCareers(answers: Answers, track: RecommendationTrack = 'immediate'): RawScore[] {
  const country = (answers.W4 as string | undefined) ?? '';
  const countryContext = COLLECTIVIST_COUNTRIES.has(country)
    ? 'collectivist'
    : INDIVIDUALIST_COUNTRIES.has(country)
      ? 'individualist'
      : 'unknown';

  const familyPressureAnswer = (answers.A4 as string | undefined) ?? 'supported';
  const familyPressureMultiplier = FAMILY_PRESSURE_MULTIPLIERS[countryContext][familyPressureAnswer] ?? 1;

  return CAREERS.map((career) => ({
    career,
    score: scoreCareer(career, answers, familyPressureMultiplier, countryContext, track),
  }));
}

export function getTopScore(rawScores: RawScore[]): number {
  if (!rawScores.length) return 0;
  return [...rawScores].sort((a, b) => b.score - a.score)[0]?.score ?? 0;
}

export function shouldTriggerRefinement(rawScores: RawScore[]): boolean {
  return getTopScore(rawScores) < REFINEMENT_TRIGGER_SCORE;
}

export function applyRefinementBonuses(rawScores: RawScore[], answers: Answers): RawScore[] {
  const allowedCareerIds = new Set(
    [...rawScores]
      .sort((a, b) => b.score - a.score)
      .slice(0, 6)
      .map((rawScore) => rawScore.career.id)
  );
  const refinementAnswers = ['R1', 'R2', 'R3', 'R4']
    .map((key) => answers[key] as string | undefined)
    .filter((value): value is string => Boolean(value));

  return rawScores.map((rawScore) => {
    if (!allowedCareerIds.has(rawScore.career.id)) {
      return rawScore;
    }

    const alignedSignals = REFINEMENT_CAREER_MAP[rawScore.career.id] ?? [];
    let bonus = 0;

    refinementAnswers.forEach((signal) => {
      const alignedClusters = REFINEMENT_CLUSTER_MAP[signal] ?? [];
      if (alignedClusters.includes(rawScore.career.cluster)) {
        bonus += REFINEMENT_CLUSTER_BONUS;
      }
      if (alignedSignals.includes(signal)) {
        bonus += REFINEMENT_CAREER_BONUS;
      }
    });

    return {
      career: rawScore.career,
      score: rawScore.score + Math.min(bonus, REFINEMENT_MAX_BONUS),
    };
  });
}

export function resolveWhyItFits(career: Career, answers: Answers, userName?: string): string {
  const weights = career.scoringWeights;

  const a1Values = toArray(answers.A1 as string | string[] | undefined);
  const matchingTraitValue = a1Values.find((value) => weights.personalityTraits.includes(value));
  const traitOption = matchingTraitValue
    ? QUESTIONS.find((question) => question.id === 'A1')?.options.find((option) => option.value === matchingTraitValue)
    : undefined;

  const a3Values = toArray(answers.A3 as string | string[] | undefined);
  const matchingEfficacyValue = a3Values.find((value) => weights.selfEfficacySignals.includes(value));
  const efficacyOption = matchingEfficacyValue
    ? QUESTIONS.find((question) => question.id === 'A3')?.options.find((option) => option.value === matchingEfficacyValue)
    : undefined;

  const b1Value = answers.B1 as string | undefined;
  const matchingProblemValue = b1Value && weights.problemPreferences.includes(b1Value) ? b1Value : undefined;
  const problemOption = matchingProblemValue
    ? QUESTIONS.find((question) => question.id === 'B1')?.options.find((option) => option.value === matchingProblemValue)
    : undefined;

  if (!traitOption && !efficacyOption && !problemOption) {
    return career.whyItFitsFallback;
  }

  const template = career.whyItFitsTemplate;
  if (template.includes('{trait}') && !traitOption) return career.whyItFitsFallback;
  if (template.includes('{efficacy}') && !efficacyOption) return career.whyItFitsFallback;
  if (template.includes('{problem}') && !problemOption) return career.whyItFitsFallback;

  return template
    .replace('{name}', userName || 'You')
    .replace('{trait}', traitOption?.label.toLowerCase() ?? '')
    .replace('{efficacy}', efficacyOption?.label.toLowerCase() ?? '')
    .replace('{problem}', problemOption ? `<em>${problemOption.label.toLowerCase()}</em>` : '');
}

function buildRankedResults(rawScores: RawScore[], minimumScore: number): ScoredCareer[] {
  const sorted = [...rawScores].sort((a, b) => b.score - a.score);
  const qualifying = sorted.filter((score) => score.score >= minimumScore);

  if (qualifying.length === 0) return [];

  const results: ScoredCareer[] = [];
  const usedClusters = new Set<string>();

  const first = qualifying[0];
  results.push({ career: first.career, score: first.score, rank: 1 });
  usedClusters.add(first.career.cluster);

  if (qualifying.length < 2) return results;

  const second = qualifying[1];
  results.push({ career: second.career, score: second.score, rank: 2 });
  usedClusters.add(second.career.cluster);

  if (qualifying.length < 3) return results;

  const third = qualifying.slice(2).find((score) => !usedClusters.has(score.career.cluster)) ?? qualifying[2];
  results.push({ career: third.career, score: third.score, rank: 3 });
  usedClusters.add(third.career.cluster);

  if (qualifying.length < 4) return results;

  const fourth = qualifying.find(
    (score) => !results.some((result) => result.career.id === score.career.id) && !usedClusters.has(score.career.cluster)
  ) ?? qualifying.find((score) => !results.some((result) => result.career.id === score.career.id));

  if (fourth) {
    results.push({ career: fourth.career, score: fourth.score, rank: 4 });
  }

  return results;
}

export function selectTopFour(rawScores: RawScore[]): ScoredCareer[] {
  return buildRankedResults(rawScores, MIN_QUALIFYING_SCORE);
}

export function selectLongTermResults(rawScores: RawScore[]): ScoredCareer[] {
  const moatMinimumScore = MIN_QUALIFYING_SCORE - 4;
  const moatCandidates = rawScores.filter(
    (score) => score.career.cluster === 'technical' || score.career.cluster === 'data'
  );
  const preferredResults = buildRankedResults(moatCandidates, moatMinimumScore);
  if (preferredResults.length > 0) return preferredResults;
  return buildRankedResults(rawScores, moatMinimumScore);
}

export function getTopGap(results: Array<{ score: number }>): number {
  if (results.length < 2) return results[0]?.score ?? 0;
  return results[0].score - results[1].score;
}

export function getResultConfidenceStyle(results: Array<{ score: number }>): ResultConfidenceStyle {
  const topScore = results[0]?.score ?? 0;
  const topGap = getTopGap(results);

  if (topScore >= 70 && topGap >= 8) {
    return 'strong';
  }

  if (topScore >= 60 && topGap >= 5) {
    return 'reasonably-strong';
  }

  return 'exploratory';
}

export function toCareerResultSummaries(results: ScoredCareer[]): CareerResultSummary[] {
  return results.map((result) => ({
    careerId: result.career.id,
    score: result.score,
    rank: result.rank,
  }));
}
