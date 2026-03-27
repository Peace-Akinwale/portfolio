import { getAnsweredQuestionSections } from './questions';
import type { Answers, Question } from './types';

export interface TranscriptQuestion {
  id: string;
  text: string;
  selectedValues: string[];
  selectedLabels: string[];
  options: Question['options'];
}

export interface TranscriptSection {
  title: string;
  questions: TranscriptQuestion[];
}

export function buildTranscriptSections(answers: Answers): TranscriptSection[] {
  return getAnsweredQuestionSections(answers).map((section) => ({
    title: section.title,
    questions: section.questions.map((question) => {
      const rawValue = answers[question.id];
      const selectedValues = Array.isArray(rawValue) ? rawValue : rawValue ? [rawValue] : [];
      const selectedLabels = question.options
        .filter((option) => selectedValues.includes(option.value))
        .map((option) => option.label);

      return {
        id: question.id,
        text: question.text,
        selectedValues,
        selectedLabels,
        options: question.options,
      };
    }),
  }));
}
