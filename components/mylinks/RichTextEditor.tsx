'use client';

import { useEffect, useRef, useState } from 'react';
import { sanitizePastedHtml } from '@/lib/mylinks/paste-sanitize';

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

  function handlePaste(event: React.ClipboardEvent<HTMLDivElement>) {
    event.preventDefault();
    const html = event.clipboardData.getData('text/html');
    const text = event.clipboardData.getData('text/plain');
    const clean = html ? sanitizePastedHtml(html) : escapePlainText(text);

    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      if (editorRef.current) {
        const template = document.createElement('template');
        template.innerHTML = clean;
        editorRef.current.appendChild(template.content);
        emitChange();
      }
      return;
    }
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const template = document.createElement('template');
    template.innerHTML = clean;
    const fragment = template.content;
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);

    if (lastNode) {
      const newRange = document.createRange();
      newRange.setStartAfter(lastNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);
    }

    emitChange();
  }

  function handleBlur() {
    setFocused(false);
    if (editorRef.current) {
      const cleaned = sanitizePastedHtml(editorRef.current.innerHTML);
      if (cleaned !== editorRef.current.innerHTML) {
        editorRef.current.innerHTML = cleaned;
      }
    }
    emitChange();
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
        onPaste={handlePaste}
        onBlur={handleBlur}
        onFocus={() => setFocused(true)}
        className={`min-h-72 w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm leading-7 outline-none transition-colors focus:border-accent ${className}`}
      />
    </div>
  );
}

function escapePlainText(text: string) {
  if (!text) {
    return '';
  }
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  return escaped
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0)
    .map((line) => `<p>${line}</p>`)
    .join('');
}
