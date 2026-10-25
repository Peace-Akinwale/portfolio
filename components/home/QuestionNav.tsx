'use client';

import { useEffect, useRef } from 'react';

// The three questions, sticky under the header. The one whose section has
// crossed 40% of the viewport is marked current. Plain anchors, so it works
// without JavaScript and with the keyboard.
export function QuestionNav({ items }: { items: readonly { id: string; label: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const list = ref.current;
    if (!list) return;
    const links = Array.from(list.querySelectorAll<HTMLAnchorElement>('a[href^="#"]'));
    const sections = links.map((a) => document.getElementById(a.getAttribute('href')!.slice(1)));
    let ticking = false;
    function update() {
      const line = window.innerHeight * 0.4;
      let idx = -1;
      sections.forEach((s, i) => {
        if (s && s.getBoundingClientRect().top <= line) idx = i;
      });
      links.forEach((a, i) => {
        if (i === idx) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        update();
        ticking = false;
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', update);
    update();
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', update);
    };
  }, []);

  return (
    <nav className="qnav" aria-label="Questions">
      <ol ref={ref}>
        {items.map((q) => (
          <li key={q.id}>
            <a href={`#${q.id}`}>{q.label}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
