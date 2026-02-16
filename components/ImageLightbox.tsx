'use client';

import { useEffect } from 'react';

export function ImageLightbox() {
  useEffect(() => {
    // Find all images in prose content
    const images = document.querySelectorAll('.prose img');
    const imageArray = Array.from(images) as HTMLImageElement[];
    let currentIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;

    imageArray.forEach((img, index) => {
      // Make images clickable and ensure hover works
      img.style.cursor = 'pointer';
      img.style.transition = 'transform 0.2s ease';

      img.addEventListener('click', (e) => {
        e.preventDefault();
        currentIndex = index;
        openLightbox();
      });

      // Ensure hover effect works on desktop
      img.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.02)';
      });

      img.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
      });
    });

    const openLightbox = () => {
      if (imageArray.length === 0) return;

      // Create lightbox overlay
      const lightbox = document.createElement('div');
      lightbox.id = 'image-lightbox';
      lightbox.className = 'fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4 cursor-zoom-out animate-fade-in';

      // Create close button
      const closeBtn = document.createElement('button');
      closeBtn.className = 'absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10';
      closeBtn.innerHTML = `
        <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      `;
      closeBtn.onclick = closeLightbox;

      // Create image counter (only show if multiple images)
      const counter = document.createElement('div');
      if (imageArray.length > 1) {
        counter.id = 'lightbox-counter';
        counter.className = 'absolute top-4 left-4 px-3 py-1 bg-white/10 text-white text-sm rounded-full z-10';
        updateCounter(counter);
      }

      // Create image container
      const imgContainer = document.createElement('div');
      imgContainer.id = 'lightbox-image-container';
      imgContainer.className = 'relative max-w-full max-h-full flex items-center justify-center';

      // Create image
      const img = document.createElement('img');
      img.id = 'lightbox-image';
      img.src = imageArray[currentIndex].src;
      img.alt = imageArray[currentIndex].alt;
      img.className = 'max-w-full max-h-[85vh] object-contain animate-zoom-in';
      img.style.cursor = 'default';

      // Prevent closing when clicking image
      img.onclick = (e) => e.stopPropagation();

      imgContainer.appendChild(img);

      // Create navigation buttons (only if multiple images)
      if (imageArray.length > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.id = 'lightbox-prev';
        prevBtn.className = 'absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10';
        prevBtn.innerHTML = `
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        `;
        prevBtn.onclick = (e) => {
          e.stopPropagation();
          navigateImage(-1);
        };

        const nextBtn = document.createElement('button');
        nextBtn.id = 'lightbox-next';
        nextBtn.className = 'absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 rounded-full transition-colors z-10';
        nextBtn.innerHTML = `
          <svg class="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        `;
        nextBtn.onclick = (e) => {
          e.stopPropagation();
          navigateImage(1);
        };

        lightbox.appendChild(prevBtn);
        lightbox.appendChild(nextBtn);
      }

      // Close when clicking backdrop
      lightbox.onclick = closeLightbox;

      lightbox.appendChild(closeBtn);
      if (imageArray.length > 1) {
        lightbox.appendChild(counter);
      }
      lightbox.appendChild(imgContainer);
      document.body.appendChild(lightbox);

      // Prevent body scroll
      document.body.style.overflow = 'hidden';

      // Add touch event listeners for swipe
      lightbox.addEventListener('touchstart', handleTouchStart, { passive: true });
      lightbox.addEventListener('touchend', handleTouchEnd, { passive: true });
    };

    const navigateImage = (direction: number) => {
      currentIndex = (currentIndex + direction + imageArray.length) % imageArray.length;
      updateLightboxImage();
    };

    const updateLightboxImage = () => {
      const img = document.getElementById('lightbox-image') as HTMLImageElement;
      const counter = document.getElementById('lightbox-counter');

      if (img) {
        // Add fade effect
        img.style.opacity = '0';
        setTimeout(() => {
          img.src = imageArray[currentIndex].src;
          img.alt = imageArray[currentIndex].alt;
          img.style.opacity = '1';
        }, 150);
      }

      if (counter) {
        updateCounter(counter);
      }
    };

    const updateCounter = (counter: HTMLElement) => {
      counter.textContent = `${currentIndex + 1} / ${imageArray.length}`;
    };

    const closeLightbox = () => {
      const lightbox = document.getElementById('image-lightbox');
      if (lightbox) {
        lightbox.remove();
        document.body.style.overflow = '';
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.changedTouches[0].screenX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    };

    const handleSwipe = () => {
      const swipeThreshold = 50;
      const diff = touchStartX - touchEndX;

      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
          // Swiped left - next image
          navigateImage(1);
        } else {
          // Swiped right - previous image
          navigateImage(-1);
        }
      }
    };

    // Keyboard navigation
    const handleKeyboard = (e: KeyboardEvent) => {
      const lightbox = document.getElementById('image-lightbox');
      if (!lightbox) return;

      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowLeft') {
        navigateImage(-1);
      } else if (e.key === 'ArrowRight') {
        navigateImage(1);
      }
    };

    document.addEventListener('keydown', handleKeyboard);

    return () => {
      document.removeEventListener('keydown', handleKeyboard);
    };
  }, []);

  return null;
}
