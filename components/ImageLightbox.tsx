'use client';

import { useEffect } from 'react';
import { installImageViewer } from '@/lib/image-viewer';

export function ImageLightbox({ routeKey }: { routeKey?: string | null }) {
  useEffect(() => installImageViewer(), [routeKey]);
  return null;
}
