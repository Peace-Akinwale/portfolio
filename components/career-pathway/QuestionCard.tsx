// components/career-pathway/QuestionCard.tsx
'use client';
import type { Question } from '@/lib/career-pathway/types';

interface Props {
  question: Question;
  value: string | string[] | undefined;
  onChange: (value: string | string[]) => void;
}

export function QuestionCard({ question, value, onChange }: Props) {
  const isMulti = question.type === 'multi';
  const selected = isMulti
    ? (Array.isArray(value) ? value : [])
    : (typeof value === 'string' ? value : '');

  function handleOption(optionValue: string) {
    if (!isMulti) {
      onChange(optionValue);
      return;
    }
    const current = selected as string[];
    if (current.includes(optionValue)) {
      onChange(current.filter((v) => v !== optionValue));
    } else if (!question.maxSelections || current.length < question.maxSelections) {
      onChange([...current, optionValue]);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl sm:text-2xl font-bold leading-snug text-foreground" style={{ letterSpacing: '-0.02em' }}>
        {question.text}
      </h2>
      {isMulti && question.maxSelections && (
        <p className="text-sm text-muted-foreground">Pick up to {question.maxSelections}</p>
      )}
      <div className="flex flex-col gap-2">
        {question.options.map((opt) => {
          const isSelected = isMulti
            ? (selected as string[]).includes(opt.value)
            : selected === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => handleOption(opt.value)}
              className="text-left px-4 py-3 rounded-lg border text-sm font-medium transition-all"
              style={{
                borderColor: isSelected ? 'var(--accent)' : 'var(--border)',
                background: isSelected ? 'var(--accent)' : 'var(--background)',
                color: isSelected ? '#fff' : 'var(--foreground)',
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
