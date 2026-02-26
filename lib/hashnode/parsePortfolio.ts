export interface PortfolioProject {
  title: string;
  link?: string;
  linkText?: string;
  description?: string;
}

export interface PortfolioSection {
  heading: string;
  clientName: string;
  introHtml?: string;
  projects: PortfolioProject[];
  readMoreLink?: string;
}

export interface ParsedPortfolio {
  sections: PortfolioSection[];
  pastAchievementsHtml?: string;
  ctaHtml?: string;
}

/** Headings that indicate a CTA section, not portfolio content */
const CTA_PATTERNS = [
  /work\s+together/i,
  /hire\s+me/i,
  /get\s+in\s+touch/i,
  /contact/i,
  /let['']?s\s+talk/i,
  /book\s+a\s+call/i,
  /ready\s+to/i,
];

/**
 * Parse Hashnode static page HTML into structured portfolio data.
 * Splits by headings, extracts list items with links.
 */
export function parsePortfolioHtml(html: string, pageTitle?: string): ParsedPortfolio {
  const result: ParsedPortfolio = { sections: [] };

  // Check for "Past Achievements" section — capture everything from that heading to the end
  // (or until the CTA heading). Matches h1, h2, or h3.
  const pastAchievementsRegex =
    /(<h[123][^>]*>.*?Past\s+Achievements.*?<\/h[123]>)([\s\S]*?)(?=<h[23][^>]*>.*?(?:work\s+together|hire\s+me|contact|book\s+a\s+call).*?<\/h[23]>|$)/i;
  const pastMatch = html.match(pastAchievementsRegex);
  if (pastMatch) {
    result.pastAchievementsHtml = pastMatch[0];
    html = html.replace(pastMatch[0], '');
  }

  // Check for CTA sections — keep as raw HTML, don't parse as cards
  const ctaRegex =
    /(<h[23][^>]*>([\s\S]*?)<\/h[23]>)([\s\S]*?)(?=<h[23][^>]*>|$)/gi;
  let ctaMatch;
  while ((ctaMatch = ctaRegex.exec(html)) !== null) {
    const ctaHeading = ctaMatch[2].replace(/<[^>]+>/g, '').trim();
    if (CTA_PATTERNS.some(p => p.test(ctaHeading))) {
      result.ctaHtml = ctaMatch[0];
      html = html.replace(ctaMatch[0], '');
      break;
    }
  }

  // Split HTML into sections by <h2>, <h3>, or standalone <strong> headings
  // Pattern: capture each heading and everything until the next heading or end
  const sectionRegex =
    /<h[23][^>]*>([\s\S]*?)<\/h[23]>([\s\S]*?)(?=<h[23][^>]*>|$)/gi;

  let match;
  while ((match = sectionRegex.exec(html)) !== null) {
    const rawHeading = match[1];
    const sectionBody = match[2];

    // Strip HTML tags from heading
    const heading = rawHeading.replace(/<[^>]+>/g, '').trim();
    if (!heading) continue;

    const section: PortfolioSection = { heading, clientName: extractClientName(heading), projects: [] };

    // Extract list items
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(sectionBody)) !== null) {
      const liContent = liMatch[1];
      const project = parseLiContent(liContent);
      if (project.title) {
        section.projects.push(project);
      }
    }

    // If no <li> items found, try parsing <p> tags as items
    if (section.projects.length === 0) {
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pMatch;
      while ((pMatch = pRegex.exec(sectionBody)) !== null) {
        const text = pMatch[1].replace(/<[^>]+>/g, '').trim();
        if (!text || /read\s+more/i.test(text)) continue;
        const project = parseLiContent(pMatch[1]);
        if (project.title) {
          section.projects.push(project);
        }
      }
    }

    // Look for "Read more" link in the section body
    const readMoreRegex =
      /<a[^>]+href=["']([^"']+)["'][^>]*>[^<]*read\s+more[^<]*<\/a>/i;
    const readMoreMatch = sectionBody.match(readMoreRegex);
    if (readMoreMatch) {
      section.readMoreLink = readMoreMatch[1];
    }

    if (section.projects.length > 0 || section.readMoreLink) {
      result.sections.push(section);
    }
  }

  // Fallback: if no h2/h3 sections found, try parsing the entire HTML as one section
  if (result.sections.length === 0) {
    // Try to derive a client name from the page title in an <h1>
    const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
    const pageHeading = h1Match
      ? h1Match[1].replace(/<[^>]+>/g, '').trim()
      : (pageTitle || 'Portfolio');

    const fallbackSection: PortfolioSection = {
      heading: pageHeading,
      clientName: extractClientName(pageHeading),
      projects: [],
    };

    // Try <li> items first
    const liRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(html)) !== null) {
      const project = parseLiContent(liMatch[1]);
      if (project.title) {
        fallbackSection.projects.push(project);
      }
    }

    // If no <li> items, try <p> tags — separate intro paragraphs from article entries
    if (fallbackSection.projects.length === 0) {
      const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
      let pMatch;
      const introParagraphs: string[] = [];
      let foundFirstArticle = false;

      while ((pMatch = pRegex.exec(html)) !== null) {
        const inner = pMatch[1];
        const text = inner.replace(/<[^>]+>/g, '').trim();
        if (!text) continue;
        if (/read\s+more/i.test(text)) continue;

        const hasLink = /<a[^>]+href/i.test(inner);
        const isLong = text.length > 100;
        // Transitional phrases like "Published articles include:" or "here are some of my pieces:"
        const isTransition = /articles\s+include|pieces\s*:|here\s+are/i.test(text);

        if (!foundFirstArticle && (isLong || isTransition || !hasLink)) {
          // This is intro/description text — preserve as HTML
          introParagraphs.push(pMatch[0]);
        } else {
          // Article entry — linked or not (once past the intro, all paragraphs are articles)
          foundFirstArticle = true;
          const project = parseLiContent(inner);
          if (project.title) {
            fallbackSection.projects.push(project);
          }
        }
      }

      if (introParagraphs.length > 0) {
        fallbackSection.introHtml = introParagraphs.join('\n');
      }
    }

    if (fallbackSection.projects.length > 0) {
      result.sections.push(fallbackSection);
    }
  }

  return result;
}

function parseLiContent(content: string): PortfolioProject {
  const project: PortfolioProject = { title: '' };

  const linkMatch = content.match(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
  if (linkMatch) {
    project.link = linkMatch[1];
    project.linkText = linkMatch[2].replace(/<[^>]+>/g, '').trim();
  }

  // Always use the full stripped text as title — never split on link position
  project.title = content.replace(/<[^>]+>/g, '').trim();

  return project;
}

function extractClientName(heading: string): string {
  const match = heading.match(/\bfor\s+([A-Z][^\s,.:]+)/i);
  return match ? match[1] : heading.split(/\s+/).slice(0, 2).join(' ');
}
