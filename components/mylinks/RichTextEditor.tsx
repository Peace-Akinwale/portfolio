'use client';

import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'Paste the article draft here...',
  className = '',
}: Props) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  function emitChange() {
    onChange(editorRef.current?.innerHTML ?? '');
  }

  const isEmpty = !value || value === '<br>' || value === '<div><br></div>' || value === '<p><br></p>';

  return (
    <div className="relative">
      {isEmpty && !focused ? (
        <div className="pointer-events-none absolute inset-x-4 top-3 text-sm text-muted-foreground">
          {placeholder}
        </div>
      ) : null}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={emitChange}
        onBlur={() => {
          setFocused(false);
          emitChange();
        }}
        onFocus={() => setFocused(true)}
        className={`min-h-72 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 outline-none transition-colors focus:border-accent ${className}`}
      />
    </div>
  );
}
