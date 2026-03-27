// lib/career-pathway/constants.ts

import type { CareerCluster } from './types';

export const POINTS = {
  PERSONALITY_MATCH: 5,
  SCHOOL_SUBJECT_MATCH: 3,
  SELF_EFFICACY_MATCH: 8,
  PROBLEM_PREF_MATCH: 10,
  WORKDAY_PREF_MATCH: 5,
  CONDITIONAL_MATCH: 12,
  INCOME_URGENCY_MATCH: 10,
  INCOME_URGENCY_MISMATCH: -15,
  HOURS_IDEAL: 5,
  HOURS_LOW: -8,
  CERT_FEASIBLE: 8,
  CERT_INFEASIBLE: -12,
  CERT_MAYBE: -4,
  NO_CERT_BONUS: 3,
  DEGREE_REQUIRED_MISMATCH: -8,
  FREE_PATH_NO_BUDGET: -3,
  REMOTE_READY: 8,
  REMOTE_LIMITED: -5,
  LOCAL_PREF_MATCH: 4,
  VALUES_MATCH: 5,
  AI_PREF_MATCH: 5,
  AI_PREF_MISMATCH: -3,
} as const;

export const STORAGE_TTL = {
  PROGRESS: 30 * 24 * 60 * 60 * 1000,
  RESULTS: 90 * 24 * 60 * 60 * 1000,
  WELCOME: 90 * 24 * 60 * 60 * 1000,
} as const;

export const STORAGE_KEYS = {
  PROGRESS: 'career-pathway-progress',
  RESULTS: 'career-pathway-results',
  WELCOME: 'career-pathway-welcome',
} as const;

export const MIN_QUALIFYING_SCORE = 20;
export const REFINEMENT_TRIGGER_SCORE = 60;
export const REFINEMENT_CLUSTER_BONUS = 2;
export const REFINEMENT_CAREER_BONUS = 1;
export const REFINEMENT_MAX_BONUS = 6;

export const CLUSTERS: Record<CareerCluster, string> = {
  technical: 'Technical',
  content: 'Content & Writing',
  design: 'Design',
  data: 'Data',
  marketing: 'Marketing',
  management: 'Management',
  'ai-native': 'AI-Native',
};

export const DISCOVERY_SOURCES = [
  'LinkedIn',
  'Twitter / X',
  'WhatsApp',
  'A friend',
  'Google',
  'Other',
] as const;

export const AGE_RANGES = [
  'Under 18',
  '18–22',
  '23–25',
  '26+',
] as const;

export const COLLECTIVIST_COUNTRIES = new Set([
  // Sub-Saharan Africa
  'Nigeria','Ghana','Kenya','Ethiopia','Tanzania','Uganda','Cameroon','Senegal',
  'Zimbabwe','Mozambique','Zambia','Rwanda','Côte d\'Ivoire','Mali','Burkina Faso',
  'Malawi','Somalia','South Sudan','Niger','Chad','Congo (Democratic Republic)',
  'Congo (Republic)','Angola','Namibia','Botswana','Lesotho','Eswatini',
  'Mauritius','Madagascar','Sierra Leone','Liberia','Guinea','Benin','Togo',
  // South & Southeast Asia
  'India','Pakistan','Bangladesh','Philippines','Indonesia','Vietnam','Myanmar',
  'Sri Lanka','Nepal','Cambodia','Laos','Thailand','Malaysia',
  // Latin America
  'Brazil','Mexico','Colombia','Peru','Argentina','Venezuela','Ecuador',
  'Bolivia','Paraguay','Uruguay','Guatemala','Honduras','El Salvador',
  'Nicaragua','Costa Rica','Panama','Dominican Republic','Cuba','Haiti',
  // Middle East & North Africa
  'Egypt','Morocco','Algeria','Tunisia','Libya','Sudan','Iraq','Jordan',
  'Lebanon','Syria','Yemen','Saudi Arabia','Iran',
  // East Asia (moderate collectivism)
  'China','South Korea','Japan',
]);

export const INDIVIDUALIST_COUNTRIES = new Set([
  'United States','United Kingdom','Canada','Australia','New Zealand',
  'Germany','France','Netherlands','Sweden','Norway','Denmark','Finland',
  'Switzerland','Austria','Belgium','Ireland','Spain','Portugal','Italy',
  'Poland','Czech Republic','Hungary','Slovakia','Romania','Bulgaria',
  'Croatia','Slovenia','Estonia','Latvia','Lithuania',
  'Singapore','Israel',
]);

export const FAMILY_PRESSURE_MULTIPLIERS: Record<string, Record<string, number>> = {
  collectivist: {
    'high-pressure': 1.5,
    'some-pressure': 1.25,
    'low-pressure': 1.1,
    'supported': 1.0,
  },
  individualist: {
    'high-pressure': 1.5,
    'some-pressure': 1.0,
    'low-pressure': 1.0,
    'supported': 1.0,
  },
  unknown: {
    'high-pressure': 1.5,
    'some-pressure': 1.0,
    'low-pressure': 1.0,
    'supported': 1.0,
  },
};

export const REMOTE_IMPORTANCE_BONUS = 5;

export const INCOME_URGENCY_MAX_MONTHS: Record<string, number> = {
  'urgent': 6,
  'within-year': 12,
  'one-two-years': 24,
  'no-rush': 999,
};
