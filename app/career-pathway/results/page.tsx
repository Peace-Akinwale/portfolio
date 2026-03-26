// app/career-pathway/results/page.tsx
'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ScoredCareer, Answers } from '@/lib/career-pathway/types';
import { storageRead, storageClearAll } from '@/lib/career-pathway/storage';
import { STORAGE_KEYS } from '@/lib/career-pathway/constants';
import { ResultCard } from '@/components/career-pathway/ResultCard';
import { EmailForm } from '@/components/career-pathway/EmailForm';
import Link from 'next/link';

interface StoredResults {
  results: ScoredCareer[];
  answers: Answers;
  completedAt: string;
  name: string;
}

export default function ResultsPage() {
  const router = useRouter();
  const [data, setData] = useState<StoredResults | null>(null);
  const [answers, setAnswers] = useState<Answers>({});

  useEffect(() => {
    const stored = storageRead<StoredResults>(STORAGE_KEYS.RESULTS);
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

  const { results, name } = data;
  const displayName = name ? `, ${name}` : '';

  const a4 = answers['A4'] as string | undefined;
  const familyPressureHigh = a4 === 'high-pressure' || a4 === 'some-pressure';

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <p
          className="text-xs font-bold uppercase tracking-[0.15em]"
          style={{ color: 'var(--accent)' }}
        >
          Your results
        </p>
        <h1
          className="text-2xl sm:text-3xl font-extrabold leading-snug"
          style={{ letterSpacing: '-0.02em' }}
        >
          {results.length < 4
            ? `Hey${displayName}, we found ${results.length} strong match${results.length !== 1 ? 'es' : ''}.`
            : `Hey${displayName}, here's what we found.`}
        </h1>
        <p className="text-sm text-muted-foreground">
          These are options, not directives. Explore them — then take one action in the next 48 hours.
        </p>
      </div>

      {/* Result cards */}
      <div className="flex flex-col gap-5">
        {results.map((r) => (
          <ResultCard key={r.career.id} result={r} userName={name} answers={answers} familyPressureHigh={familyPressureHigh} />
        ))}
      </div>

      {/* Email section */}
      <div className="flex flex-col gap-3 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
        <h2 className="text-sm font-bold">Want a copy of these results?</h2>
        <p className="text-xs text-muted-foreground">
          We&apos;ll send all 4 matches, why they fit, and your full answer transcript. No spam.
        </p>
        <EmailForm results={results} answers={answers} name={name} />
      </div>

      {/* LinkedIn attribution */}
      <div className="flex flex-col gap-2 pt-4 border-t text-sm" style={{ borderColor: 'var(--border)' }}>
        <p className="text-muted-foreground">
          If this helped, you&apos;re welcome to say Hi on LinkedIn.{' '}
          <a
            href="https://www.linkedin.com/in/peaceakinwale/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline underline-offset-2"
            style={{ color: 'var(--accent)' }}
          >
            LinkedIn →
          </a>
        </p>
      </div>

      {/* Retake / back */}
      <div className="flex gap-4 text-xs pt-2">
        <button
          onClick={handleRetake}
          className="underline underline-offset-2 text-muted-foreground hover:text-foreground transition"
        >
          Retake the assessment
        </button>
        <Link href="/career-pathway" className="underline underline-offset-2 text-muted-foreground hover:text-foreground transition">
          Back to start
        </Link>
      </div>
    </div>
  );
}
