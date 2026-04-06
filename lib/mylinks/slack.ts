import { sendSlackNotification } from '@/lib/slack';

export async function sendMylinksSlackNotification(title: string, lines: string[]) {
  await sendSlackNotification({
    tool: 'MyLinks',
    title,
    lines,
    preferredEnvNames: ['MYLINKS_SLACK_WEBHOOK'],
  });
}
