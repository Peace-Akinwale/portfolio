import { createServiceClient } from '@/lib/mylinks/supabase/server';
import type { Database, Json } from '@/lib/mylinks/types/database';

export type NotificationType =
  | 'google_connected'
  | 'admin_user_connected_google'
  | 'suggestions_ready';

export type NotificationRow = Database['public']['Tables']['notifications']['Row'];

export interface CreateNotificationInput {
  recipientId: string;
  type: NotificationType;
  message: string;
  metadata?: Record<string, Json>;
}

export async function createNotification(input: CreateNotificationInput) {
  const client = await createServiceClient();
  const { data, error } = await client
    .from('notifications')
    .insert({
      recipient_id: input.recipientId,
      type: input.type,
      message: input.message,
      metadata: input.metadata ?? null,
    })
    .select()
    .single();

  if (error) {
    console.error('[mylinks/notifications] insert failed:', error);
    return null;
  }

  return data as NotificationRow;
}

export async function listNotifications(recipientId: string, limit = 50) {
  const client = await createServiceClient();
  const { data, error } = await client
    .from('notifications')
    .select('*')
    .eq('recipient_id', recipientId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('[mylinks/notifications] list failed:', error);
    return [];
  }

  return (data ?? []) as NotificationRow[];
}

export async function countUnread(recipientId: string) {
  const client = await createServiceClient();
  const { count, error } = await client
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('recipient_id', recipientId)
    .is('read_at', null);

  if (error) {
    console.error('[mylinks/notifications] count failed:', error);
    return 0;
  }

  return count ?? 0;
}

export async function markRead(recipientId: string, notificationId: string) {
  const client = await createServiceClient();
  const { error } = await client
    .from('notifications')
    .update({ read_at: new Date().toISOString() })
    .eq('id', notificationId)
    .eq('recipient_id', recipientId);

  if (error) {
    console.error('[mylinks/notifications] markRead failed:', error);
    return false;
  }

  return true;
}
