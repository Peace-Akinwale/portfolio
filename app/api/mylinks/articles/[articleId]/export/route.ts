import { NextResponse } from 'next/server';
import { Document, ExternalHyperlink, HeadingLevel, Packer, Paragraph, TextRun } from 'docx';
import { normalizeSuggestions } from '@/lib/mylinks/article-preview';
import { requireAuthenticatedUser } from '@/lib/mylinks/auth';
import { createServiceClient } from '@/lib/mylinks/supabase/server';

function paragraphFromText(text: string) {
  return new Paragraph({
    children: [new TextRun(text)],
  });
}

function looksLikeHeading(text: string) {
  const trimmed = text.trim();
  if (!trimmed) {
    return false;
  }

  return (
    /^#{1,6}\s/.test(trimmed) ||
    (/^[A-Z0-9"'(]/.test(trimmed) &&
      trimmed.length <= 90 &&
      trimmed.split(/\s+/).filter(Boolean).length <= 12 &&
      !/[.!?]$/.test(trimmed))
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ articleId: string }> }
) {
  const user = await requireAuthenticatedUser();
  const { articleId } = await params;
  const serviceClient = await createServiceClient();
  const { data: article } = await serviceClient.from('articles').select('*').eq('id', articleId).maybeSingle();
  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 });
  }

  const { data: project } = await serviceClient
    .from('projects')
    .select('id')
    .eq('id', article.project_id)
    .eq('owner_id', user.id)
    .maybeSingle();
  if (!project) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { data: suggestions } = await serviceClient
    .from('suggestions')
    .select('*')
    .eq('article_id', articleId)
    .eq('status', 'approved')
    .order('sort_order');

  const normalized = normalizeSuggestions(article.content_text, (suggestions ?? []) as never);
  const paragraphs = article.content_text
    .split(/\n+/)
    .map((paragraphText) => paragraphText.trim())
    .filter(Boolean);
  const docChildren: Paragraph[] = [
    new Paragraph({
      text: article.title,
      heading: HeadingLevel.HEADING_1,
    }),
  ];

  let cursor = 0;
  for (const paragraphText of paragraphs) {
    const paragraphStart = article.content_text.indexOf(paragraphText, cursor);
    const paragraphEnd = paragraphStart + paragraphText.length;
    cursor = paragraphEnd;

    const paragraphSuggestions = normalized
      .filter((suggestion) => suggestion.char_start >= paragraphStart && suggestion.char_end <= paragraphEnd)
      .sort((left, right) => left.char_start - right.char_start);

    if (paragraphSuggestions.length === 0) {
      docChildren.push(
        looksLikeHeading(paragraphText)
          ? new Paragraph({ text: paragraphText, heading: HeadingLevel.HEADING_2 })
          : paragraphFromText(paragraphText)
      );
      continue;
    }

    const children: Array<TextRun | ExternalHyperlink> = [];
    let relativeCursor = 0;

    for (const suggestion of paragraphSuggestions) {
      const start = suggestion.char_start - paragraphStart;
      const end = suggestion.char_end - paragraphStart;
      if (start > relativeCursor) {
        children.push(new TextRun(paragraphText.slice(relativeCursor, start)));
      }

      children.push(
        new ExternalHyperlink({
          link: suggestion.target_url,
          children: [
            new TextRun({
              text: paragraphText.slice(start, end),
              style: 'Hyperlink',
            }),
          ],
        })
      );

      relativeCursor = end;
    }

    if (relativeCursor < paragraphText.length) {
      children.push(new TextRun(paragraphText.slice(relativeCursor)));
    }
    docChildren.push(
      looksLikeHeading(paragraphText)
        ? new Paragraph({ children, heading: HeadingLevel.HEADING_2 })
        : new Paragraph({ children })
    );
  }

  const document = new Document({
    sections: [
      {
        children: docChildren,
      },
    ],
  });

  const buffer = await Packer.toBuffer(document);
  const body = new Uint8Array(buffer);

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'Content-Disposition': `attachment; filename="${article.title.replace(/[^a-z0-9]+/gi, '-').toLowerCase() || 'linked-draft'}.docx"`,
    },
  });
}
