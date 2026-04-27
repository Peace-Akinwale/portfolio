'use client';
import { useEffect } from 'react';

export function BlogPageBackground() {
  useEffect(() => {
    document.body.style.background = '#ffffff';
    return () => {
      document.body.style.background = '';
    };
  }, []);
  return null;
}
