'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Answers, SessionResults } from '@/lib/career-pathway/types';
import { storageClearAll, storageRead } from '@/lib/career-pathway/storage';
import { STORAGE_KEYS } from '@/lib/career-pathway/constants';
import { ResultCard } from '@/components/career-pathway/ResultCard';
import { EmailForm } from '@/components/career-pathway/EmailForm';

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<SessionResults | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    const stored = storageRead<SessionResults>(STORAGE_KEYS.RESULTS);
    if (!stored || !stored.results?.length) {
      router.replace('/career-pathway');
      return;
    }

    setData(stored);
    if (stored.answers) setAnswers(stored.answers);
  }, [router]);

  function handleRetake() {
    storageClearAll([STORAGE_KEYS.RESULTS, STORAGE_KEYS.PROGRESS, STORAGE_KEYS.WELCOME]);
    router.push('/career-pathway/assessment');
  }

  if (!data) return null;

  const { results, moatResults = [], name, refinementTriggered, confidenceStyle = 'reasonably-strong' } = data;
  const displayName = name ? `, ${name}` : '';
  const familyPressureAnswer = answers.A4 as string | undefined;
  const familyPressureHigh = familyPressureAnswer === 'high-pressure' || familyPressureAnswer === 'some-pressure';
  const heading =
    confidenceStyle === 'exploratory'
      ? `Hey${displayName}, here are the directions worth testing next.`
      : `Hey${displayName}, here's the faster path now and the stronger path if you want to build for the long term.`;
  const supportingCopy =
    confidenceStyle === 'exploratory'
      ? "Your answers point to a few viable paths. We're showing both what looks most realistic to start soon and what could compound better if you can take a harder route."
      : "We're separating the easiest realistic path to start from the more demanding careers that can give you a stronger long-term moat.";
  const visibleResults = results.slice(0, 2);
  const visibleMoatResults = moatResults.slice(0, 2);
  const moatLabelOverrides = [
    'Long-Term Moat',
    'Moat Alternative',
    'Worth Building Toward',
    'Worth Building Toward',
  ] as const;

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--accent)' }}>
          Your results
        </p>
        <h1 className="text-2xl font-extrabold leading-snug sm:text-3xl" style={{ letterSpacing: '-0.02em' }}>
          {heading}
        </h1>
        <p className="text-sm text-muted-foreground">{supportingCopy}</p>
        {refinementTriggered && (
          <p className="max-w-2xl rounded-lg border px-4 py-3 text-sm text-muted-foreground" style={{ borderColor: 'var(--border)' }}>
            Your follow-up answers helped narrow these results down.
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Best path to start now</h2>
          <p className="text-sm text-muted-foreground">
            These results respect your current constraints, timeline, and what looks most realistic to start earning from.
          </p>
        </div>
        {visibleResults.map((result) => (
          <ResultCard
            key={result.career.id}
            result={result}
            userName={name}
            answers={answers}
            familyPressureHigh={familyPressureHigh}
          />
        ))}
      </div>

      {visibleMoatResults.length > 0 && (
        <div className="flex flex-col gap-5 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
          <div className="flex flex-col gap-1">
            <h2 className="text-sm font-bold uppercase tracking-[0.12em] text-muted-foreground">Stronger long-term moat path</h2>
            <p className="text-sm text-muted-foreground">
              These are the tougher, more technical paths that look more defensible if you can absorb a longer ramp and more learning friction.
            </p>
          </div>

          {visibleMoatResults.map((result) => (
            <ResultCard
              key={`moat-${result.career.id}`}
              result={result}
              userName={name}
              answers={answers}
              familyPressureHigh={familyPressureHigh}
              labelOverrides={moatLabelOverrides}
              forceTimingNote
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 border-t pt-4" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-bold">Want a copy of these results?</h2>
        <p className="text-xs text-muted-foreground">
          We&apos;ll send your start-now matches, long-term moat options, and your full answer transcript. No spam.
        </p>
        <EmailForm results={visibleResults} moatResults={visibleMoatResults} answers={answers} name={name} />
      </div>

      <div className="flex flex-col gap-2 border-t pt-4 text-sm" style={{ borderColor: 'var(--border)' }}>
        <p className="text-muted-foreground">
          If this helped, you&apos;re welcome to say Hi on LinkedIn.{' '}
          <a
            href="https://www.linkedin.com/in/peaceakinwale/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
            style={{ color: 'var(--accent)' }}
          >
            LinkedIn {'->'}
          </a>
        </p>
      </div>

      <div className="flex gap-4 pt-2 text-xs">
        <button
          onClick={handleRetake}
          className="underline underline-offset-2 text-muted-foreground transition hover:text-foreground"
        >
          Retake the assessment
        </button>
        <Link href="/career-pathway" className="underline underline-offset-2 text-muted-foreground transition hover:text-foreground">
          Back to start
        </Link>
      </div>
    </div>
  );
}
