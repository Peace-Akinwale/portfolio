const BLOCK_TAGS = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'BLOCKQUOTE', 'HR', 'BR']);
const INLINE_TAGS = new Set(['STRONG', 'EM', 'U', 'S', 'A']);
const ALLOWED_TAGS = new Set([...BLOCK_TAGS, ...INLINE_TAGS]);
const DROP_TAGS = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'LINK', 'META', 'NOSCRIPT']);

/**
 * Browser-only: depends on DOMParser and Node globals.
 * Safe to call from 'use client' components; never import in server context.
 */
export function sanitizePastedHtml(html: string): string {
  if (!html) {
    return '';
  }

  const doc = new DOMParser().parseFromString(`<body>${html}</body>`, 'text/html');
  const body = doc.body;
  cleanNode(body);
  return body.innerHTML.trim();
}

function cleanNode(node: Node) {
  const children = Array.from(node.childNodes);
  for (const child of children) {
    if (child.nodeType === Node.TEXT_NODE) {
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) {
      child.parentNode?.removeChild(child);
      continue;
    }

    const el = child as Element;
    const tag = el.tagName.toUpperCase();

    if (DROP_TAGS.has(tag)) {
      el.parentNode?.removeChild(el);
      continue;
    }

    cleanNode(el);

    if (!ALLOWED_TAGS.has(tag)) {
      unwrap(el);
      continue;
    }

    stripAttributes(el, tag);
  }
}

function unwrap(el: Element) {
  const parent = el.parentNode;
  if (!parent) {
    return;
  }
  while (el.firstChild) {
    parent.insertBefore(el.firstChild, el);
  }
  parent.removeChild(el);
}

function stripAttributes(el: Element, tag: string) {
  const attributes = Array.from(el.attributes);
  for (const attribute of attributes) {
    if (tag === 'A' && attribute.name === 'href') {
      const value = attribute.value.trim().toLowerCase();
      if (!value.startsWith('javascript:') && !value.startsWith('data:')) {
        continue;
      }
    }
    el.removeAttribute(attribute.name);
  }
}
