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
    const toolbar = document.createElement('div');
    toolbar.className = 'image-viewer-toolbar';
    const fullSize = document.createElement('a');
    fullSize.textContent = 'Open full-size image';
    fullSize.target = '_blank';
    fullSize.rel = 'noopener';
    const close = document.createElement('button');
    close.textContent = 'Close';
    close.type = 'button';
    close.autofocus = true;
    toolbar.append(fullSize, close);
    let image = document.createElement('img');
    const controls = document.createElement('div');
    controls.className = 'image-viewer-controls';
    const count = document.createElement('span');
    count.setAttribute('aria-live', 'polite');
    const previous = document.createElement('button');
    previous.type = 'button';
    previous.textContent = 'Previous';
    const next = document.createElement('button');
    next.type = 'button';
    next.textContent = 'Next';
    controls.append(previous, count, next);
    controls.hidden = images.length < 2;
    dialog.append(toolbar, image, controls);
    function update() {
      const nextImage = document.createElement('img');
      nextImage.src = original(images[index]);
      nextImage.alt = images[index].alt;
      // Restart the fade/zoom without delayed callbacks racing a close or another move.
      image.replaceWith(nextImage);
      image = nextImage;
      fullSize.href = image.src;
      count.textContent = `${index + 1} / ${images.length}`;
    }
    const move = (delta: number) => { index = (index + delta + images.length) % images.length; update(); };
    previous.onclick = () => move(-1);
    next.onclick = () => move(1);
    const oldOverflow = document.body.style.overflow;
    const finish = () => {
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
    dialog.showModal();
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
