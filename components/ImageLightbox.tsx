'use client';

import { useEffect } from 'react';

export function ImageLightbox() {
  useEffect(() => {
    // Find all images in prose content
    const images = document.querySelectorAll('.prose img');

    images.forEach((img) => {
      const imageElement = img as HTMLImageElement;

      // Make images clickable
      imageElement.style.cursor = 'pointer';

      imageElement.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(imageElement.src, imageElement.alt);
      });
    });

    // ESC key to close
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const openLightbox = (src: string, alt: string) => {
    // Create lightbox overlay
    const lightbox = document.createElement('div');
    lightbox.id = 'image-lightbox';
    lightbox.className = 'fixed inset-0 bg-black/70 z-[100] flex items-center justify-center p-4 cursor-zoom-out animate-fade-in';

    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors';
    closeBtn.innerHTML = `
      <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
      </svg>
    `;
    closeBtn.onclick = closeLightbox;

    // Create image
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = 'max-w-full max-h-full object-contain animate-zoom-in';
    img.style.cursor = 'default';

    // Prevent closing when clicking image
    img.onclick = (e) => e.stopPropagation();

    // Close when clicking backdrop
    lightbox.onclick = closeLightbox;

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(img);
    document.body.appendChild(lightbox);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    const lightbox = document.getElementById('image-lightbox');
    if (lightbox) {
      lightbox.remove();
      document.body.style.overflow = '';
    }
  };

  return null;
}
