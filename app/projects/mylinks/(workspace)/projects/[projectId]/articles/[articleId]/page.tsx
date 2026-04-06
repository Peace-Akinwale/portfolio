import { redirect } from 'next/navigation';

export default async function LegacyNestedArticlePage({
  params,
}: {
  params: Promise<{ articleId: string }>;
}) {
  const { articleId } = await params;
  redirect(`/projects/mylinks/articles/${articleId}`);
}

