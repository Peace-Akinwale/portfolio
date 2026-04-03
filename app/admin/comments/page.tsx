import { cookies } from 'next/headers';
import { CommentsAdmin } from '@/components/admin/CommentsAdmin';
import { COMMENT_ADMIN_COOKIE, hasCommentAdminPassword, isValidCommentAdminSession } from '@/lib/comments/admin';

export const dynamic = 'force-dynamic';

export default async function CommentsAdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get(COMMENT_ADMIN_COOKIE)?.value;
  const authenticated = isValidCommentAdminSession(session);

  return (
    <CommentsAdmin
      initialAuthenticated={authenticated}
      hasPassword={hasCommentAdminPassword()}
    />
  );
}
