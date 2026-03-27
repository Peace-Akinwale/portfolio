export type CareerCluster =
  | 'technical'
  | 'content'
  | 'design'
  | 'data'
  | 'marketing'
  | 'management'
  | 'ai-native';

export type EntryDifficulty = 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high';
export type FreeLearningQuality = 'excellent' | 'good' | 'moderate' | 'limited';
export type RemoteAvailability = 'very-high' | 'high' | 'medium-high' | 'medium';
export type AiDisplacementRisk = 'low' | 'low-medium' | 'medium' | 'medium-high' | 'high';
export type HumanJudgmentLevel = 'very-high' | 'high' | 'medium-high' | 'medium';
export type DegreeDependence = 'none' | 'low' | 'moderate' | 'high';
export type PortfolioImportance = 'low' | 'moderate' | 'high' | 'critical';
export type EarningCeiling = 'moderate' | 'high' | 'very-high';
export type AssessmentStage = 'questions' | 'refinement';
export type ResultConfidenceStyle = 'strong' | 'reasonably-strong' | 'exploratory';

export interface IncomeRange {
  min: number;
  max: number;
}

export interface CareerResource {
  title: string;
  url: string;
  description: string;
}

export interface MicroAction {
  title: string;
  url: string;
  timeMinutes: number;
}

export interface ScoringWeights {
  personalityTraits: string[];
  schoolSubjects: string[];
  selfEfficacySignals: string[];
  problemPreferences: string[];
  workdayPreferences: string[];
  conditionalAnswers: string[];
  minHoursPerWeek: number;
  idealHoursPerWeek: number;
  maxIncomeUrgencyMonths: number;
  requiresDegree: boolean;
  requiresCertBudget: boolean;
  requiresPaidTools: boolean;
  valuesMatch: string[];
  aiPreferenceMatch: string[];
}

export interface Career {
  id: string;
  title: string;
  cluster: CareerCluster;
  subtitle: string;
  timeToFirstIncome: { min: number; max: number; unit: 'months' };
  entryDifficulty: EntryDifficulty;
  requiresCertification: boolean;
  certificationDetails?: string;
  degreeDependence: DegreeDependence;
  portfolioImportance: PortfolioImportance;
  entryDescription: string;
  freeLearningPathQuality: FreeLearningQuality;
  remoteAvailability: RemoteAvailability;
  aiDisplacementRisk: AiDisplacementRisk;
  humanJudgmentCentrality: HumanJudgmentLevel;
  aiRealityDescription: string;
  incomeRanges: {
    us: IncomeRange;
    uk: IncomeRange;
    global_remote: IncomeRange;
  };
  earningCeiling: EarningCeiling;
  scoringWeights: ScoringWeights;
  whyItFitsTemplate: string;
  whyItFitsFallback: string;
  dailyLifeDescription: string;
  honestCaveat: string;
  resources: {
    startHere: MicroAction;
    learning: CareerResource[];
    youtubeExplainer?: CareerResource;
    youtubeExplainers?: CareerResource[];
  };
}

export interface ScoredCareer {
  career: Career;
  score: number;
  rank: 1 | 2 | 3 | 4;
}

export interface CareerResultSummary {
  careerId: string;
  score: number;
  rank: 1 | 2 | 3 | 4;
}

export type SingleAnswer = string;
export type MultiAnswer = string[];
export type Answer = SingleAnswer | MultiAnswer;
export type Answers = Record<string, Answer>;

export interface SessionProgress {
  currentQuestion: number;
  answers: Answers;
  name: string;
  discoverySource: string;
  stage: AssessmentStage;
}

export interface SessionResults {
  results: ScoredCareer[];
  answers: Answers;
  completedAt: string;
  name: string;
  refinementTriggered: boolean;
  baseResults?: CareerResultSummary[];
  baseTopScore?: number;
  finalTopScore?: number;
  confidenceStyle?: ResultConfidenceStyle;
}

export interface RefinementMetadata {
  triggered: boolean;
  baseResults: CareerResultSummary[];
  finalResults: CareerResultSummary[];
  baseTopScore: number;
  finalTopScore: number;
  refinementAnswers: Answers;
}

export type QuestionType = 'single' | 'multi';

export interface QuestionOption {
  value: string;
  label: string;
}

export interface Question {
  id: string;
  phase: string;
  text: string;
  type: QuestionType;
  options: QuestionOption[];
  maxSelections?: number;
  conditional?: {
    dependsOn: string;
    showWhen: string;
  };
}
