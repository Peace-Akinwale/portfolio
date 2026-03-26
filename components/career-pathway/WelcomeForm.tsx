// components/career-pathway/WelcomeForm.tsx
'use client';
import { useState } from 'react';
import { DISCOVERY_SOURCES, AGE_RANGES } from '@/lib/career-pathway/constants';
import { COUNTRIES } from '@/lib/career-pathway/countries';

interface Props {
  onComplete: (name: string, discoverySource: string, ageRange: string, country: string) => void;
}

const inputClass = 'w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-accent transition';
const labelClass = 'text-xs font-bold uppercase tracking-[0.08em] text-muted-foreground mb-1.5 block';

export function WelcomeForm({ onComplete }: Props) {
  const [name, setName] = useState('');
  const [source, setSource] = useState('');
  const [ageRange, setAgeRange] = useState('');
  const [country, setCountry] = useState('');

  return (
    <div className="flex flex-col gap-6 max-w-md">
      <div>
        <label className={labelClass}>What&apos;s your name?</label>
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your first name"
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass}>Age range</label>
        <select value={ageRange} onChange={(e) => setAgeRange(e.target.value)} className={inputClass}>
          <option value="">Select...</option>
          {AGE_RANGES.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Country</label>
        <select value={country} onChange={(e) => setCountry(e.target.value)} className={inputClass}>
          <option value="">Select your country...</option>
          {COUNTRIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
      <div>
        <label className={labelClass}>Where did you find this tool?</label>
        <select value={source} onChange={(e) => setSource(e.target.value)} className={inputClass}>
          <option value="">Select...</option>
          {DISCOVERY_SOURCES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <button
        onClick={() => onComplete(name.trim(), source, ageRange, country)}
        disabled={!name.trim()}
        className="py-3 rounded-md text-xs font-bold uppercase tracking-[0.08em] text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ background: 'var(--accent)' }}
      >
        Start the Assessment →
      </button>
    </div>
  );
}
