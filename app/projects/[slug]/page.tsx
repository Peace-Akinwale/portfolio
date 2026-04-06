import Image from 'next/image';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getStaticPage } from '@/lib/hashnode/client';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

const PROJECT_ARTICLE_SLUGS = new Set([
  'linkedin-router',
  'mystyleguide',
  'portfolio-project',
  'editorial-style-guide',
]);

const PROJECT_COVER_IMAGES: Record<string, string> = {
  'linkedin-router':
    'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772456192/LinkedIn_Router_dashboard_yeangn.png',
  'mystyleguide':
    'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772458150/mystyleguide_uyokzm.png',
  'portfolio-project': '/images/blog/second-thorough-prompt.png',
  'editorial-style-guide':
    'https://res.cloudinary.com/cloud-blog-publisher/image/upload/v1772467301/claude_projext_vvozy6.png',
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === 'career-pathway') {
    return {
      title: 'Career Pathway Assessment',
      alternates: {
        canonical: 'https://peaceakinwale.com/projects/career-pathway',
      },
    };
  }

  const staticPage = await getStaticPage(slug);
  if (!staticPage) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: staticPage.title,
    description: staticPage.title,
    alternates: {
      canonical: `https://peaceakinwale.com/projects/${slug}`,
    },
    openGraph: {
      title: staticPage.title,
      url: `/projects/${slug}`,
      images: PROJECT_COVER_IMAGES[slug] ? [PROJECT_COVER_IMAGES[slug]] : [],
    },
  };
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  if (slug === 'career-pathway') {
    redirect('/career-pathway');
  }

  if (!PROJECT_ARTICLE_SLUGS.has(slug)) {
    notFound();
  }

  const staticPage = await getStaticPage(slug);
  if (!staticPage) {
    notFound();
  }

  const coverImage = PROJECT_COVER_IMAGES[slug];
  const wordCount = staticPage.content.html.replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
  const readTime = Math.max(1, Math.round(wordCount / 200));

  return (
    <article className="mx-auto max-w-4xl px-6 py-16">
      <header className="mb-12">
        <div className="mb-4">
          <Link
            href="/projects"
            className="text-sm uppercase tracking-wider text-muted-foreground transition-colors hover:text-accent"
          >
            Projects
          </Link>
        </div>

        <h1 className="text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          {staticPage.title}
        </h1>

        <div className="mt-6 flex items-center gap-4 text-muted-foreground">
          <span className="rounded-sm bg-muted px-3 py-1 text-sm font-medium">{readTime} min read</span>
        </div>

        {coverImage ? (
          <div className="relative mb-12 mt-8 aspect-[16/9] overflow-hidden bg-muted">
            <Image src={coverImage} alt={staticPage.title} fill className="object-cover" priority />
          </div>
        ) : null}
      </header>

      <div
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: staticPage.content.html }}
      />
    </article>
  );
}
