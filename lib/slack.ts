function getSlackWebhookUrl(preferredEnvNames: string[] = []) {
  const envNames = ['ALL_NOTIFICATIONS_SLACK_WEBHOOK', ...preferredEnvNames];

  for (const name of envNames) {
    const value = process.env[name]?.trim();
    if (value) {
      return value;
    }
  }

  return '';
}

export async function sendSlackNotification(options: {
  tool: string;
  title: string;
  lines: Array<string | null | undefined>;
  preferredEnvNames?: string[];
}) {
  const webhookUrl = getSlackWebhookUrl(options.preferredEnvNames);
  if (!webhookUrl) {
    return;
  }

  const text = [
    `*${options.title}*`,
    `*Tool:* ${options.tool}`,
    ...options.lines.filter(Boolean),
  ].join('\n');

  await fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text }),
  }).catch(() => {
    // Slack should never block user workflows.
  });
}
