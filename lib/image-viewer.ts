// One viewer for public-page images, including streamed and linked images.
export function installImageViewer() {
  const cleanups = new Map<HTMLImageElement, () => void>();
  let closeActive: (() => void) | undefined;
  const imageLink = (image: HTMLImageElement) => {
    const link = image.closest('a');
    return link && /\.(?:png|jpe?g|webp|gif|avif|svg)(?:[?#].*)?$/i.test(link.href) ? link : null;
  };
  const eligible = (image: HTMLImageElement) => {
    if (image.closest('button, dialog, .client-logo, .reviewer-attribution, .client-writing-heading, .approved-title-icon, .logos, [data-no-image-viewer]')) return false;
    if (image.src.includes('/client-logos/')) return false;
    if (image.closest('a') && !imageLink(image)) return false;
    return !(image.width > 0 && image.height > 0 && image.width <= 64 && image.height <= 64);
  };
  const original = (image: HTMLImageElement) => {
    if (image.dataset.originalSrc) return image.dataset.originalSrc;
    if (imageLink(image)) return imageLink(image)!.href;
    const url = new URL(image.currentSrc || image.src, location.href);
    return url.pathname === '/_next/image' ? url.searchParams.get('url') || image.src : image.src;
  };

  function open(trigger: HTMLImageElement) {
    closeActive?.();
    const images = [...cleanups.keys()].filter(image => image.isConnected && eligible(image));
    let index = images.indexOf(trigger);
    if (index < 0) return;
    const dialog = document.createElement('dialog');
    dialog.className = 'image-viewer';
    dialog.setAttribute('aria-label', 'Image viewer');
    // Embedded mobile browsers can have a layout viewport taller than the
    // visible screen. Keep the image and controls inside the visual viewport.
    const viewport = window.visualViewport;
    const fitViewport = () => {
      dialog.style.setProperty('--viewer-height', `${viewport?.height || window.innerHeight}px`);
      dialog.style.setProperty('--viewer-width', `${viewport?.width || window.innerWidth}px`);
      dialog.style.setProperty('--viewer-top', `${viewport?.offsetTop || 0}px`);
      dialog.style.setProperty('--viewer-left', `${viewport?.offsetLeft || 0}px`);
    };
    // Restore the icon controls and uncluttered overlay from 0c32122.
    const iconButton = (label: string, className: string, path: string) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.setAttribute('aria-label', label);
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('fill', 'none');
      svg.setAttribute('stroke', 'currentColor');
      svg.setAttribute('stroke-width', '2');
      const stroke = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      stroke.setAttribute('d', path);
      stroke.setAttribute('stroke-linecap', 'round');
      stroke.setAttribute('stroke-linejoin', 'round');
      svg.append(stroke);
      button.append(svg);
      return button;
    };
    const close = iconButton('Close image viewer', 'image-viewer-close', 'M6 18L18 6M6 6l12 12');
    close.autofocus = true;
    const previous = iconButton('Previous image', 'image-viewer-previous', 'M15 19l-7-7 7-7');
    const next = iconButton('Next image', 'image-viewer-next', 'M9 5l7 7-7 7');
    const count = document.createElement('span');
    count.className = 'image-viewer-count';
    count.setAttribute('aria-live', 'polite');
    previous.hidden = next.hidden = count.hidden = images.length < 2;
    let image = document.createElement('img');
    dialog.append(close, count, previous, next, image);
    function update() {
      const nextImage = document.createElement('img');
      nextImage.src = original(images[index]);
      nextImage.alt = images[index].alt;
      // Restart the fade/zoom without delayed callbacks racing a close or another move.
      image.replaceWith(nextImage);
      image = nextImage;
      count.textContent = `${index + 1} / ${images.length}`;
    }
    const move = (delta: number) => { index = (index + delta + images.length) % images.length; update(); };
    previous.onclick = () => move(-1);
    next.onclick = () => move(1);
    const oldOverflow = document.body.style.overflow;
    const finish = () => {
      window.removeEventListener('resize', fitViewport);
      viewport?.removeEventListener('resize', fitViewport);
      viewport?.removeEventListener('scroll', fitViewport);
      dialog.remove();
      document.body.style.overflow = oldOverflow;
      if (trigger.isConnected) (imageLink(trigger) || trigger).focus({ preventScroll: true });
      closeActive = undefined;
    };
    closeActive = finish;
    close.onclick = finish;
    dialog.addEventListener('cancel', event => { event.preventDefault(); finish(); });
    dialog.addEventListener('click', event => { if (event.target === dialog) finish(); });
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    });
    let touch: { x: number; y: number } | undefined;
    dialog.addEventListener('touchstart', event => {
      touch = event.touches.length === 1 ? { x: event.touches[0].clientX, y: event.touches[0].clientY } : undefined;
    }, { passive: true });
    dialog.addEventListener('touchend', event => {
      if (!touch || !event.changedTouches[0]) return;
      const dx = event.changedTouches[0].clientX - touch.x;
      const dy = event.changedTouches[0].clientY - touch.y;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
      touch = undefined;
    }, { passive: true });
    dialog.addEventListener('touchcancel', () => { touch = undefined; });
    update();
    document.body.append(dialog);
    document.body.style.overflow = 'hidden';
    fitViewport();
    dialog.showModal();
    fitViewport();
    window.addEventListener('resize', fitViewport);
    viewport?.addEventListener('resize', fitViewport);
    viewport?.addEventListener('scroll', fitViewport);
  }

  function scan() {
    for (const [image, dispose] of cleanups) {
      if (!image.isConnected) { dispose(); cleanups.delete(image); }
    }
    document.querySelectorAll<HTMLImageElement>('main img, .prose img').forEach(image => {
      if (cleanups.has(image) || !eligible(image)) return;
      const attributes = ['role', 'tabindex', 'aria-label', 'data-image-viewer'];
      const old = attributes.map(name => image.getAttribute(name));
      image.dataset.imageViewer = 'true';
      if (!imageLink(image)) {
        image.setAttribute('role', 'button');
        image.tabIndex = 0;
        image.setAttribute('aria-label', `Enlarge image: ${image.alt || 'Article image'}`);
      }
      const click = (event: MouseEvent) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        event.preventDefault();
        open(image);
      };
      const key = (event: KeyboardEvent) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); open(image); }
      };
      const target: HTMLElement = imageLink(image) || image;
      target.addEventListener('click', click);
      target.addEventListener('keydown', key);
      cleanups.set(image, () => {
        target.removeEventListener('click', click);
        target.removeEventListener('keydown', key);
        attributes.forEach((name, i) => { if (old[i] === null) image.removeAttribute(name); else image.setAttribute(name, old[i]!); });
      });
    });
  }
  scan();
  const observer = new MutationObserver(scan);
  observer.observe(document.body, { childList: true, subtree: true });
  return () => {
    observer.disconnect();
    closeActive?.();
    cleanups.forEach(dispose => dispose());
  };
}
