import { redirect } from 'next/navigation';
import { ProfileForm } from '@/components/mylinks/ProfileForm';
import { getProfile, requireAuthenticatedUser } from '@/lib/mylinks/auth';

export default async function OnboardingPage() {
  const user = await requireAuthenticatedUser();
  const profile = await getProfile(user.id);

  if (profile) {
    redirect('/projects/mylinks/dashboard');
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            First login
          </p>
          <h1 className="mt-4 text-4xl font-bold text-foreground">Set up your beta profile</h1>
          <p className="mt-4 text-sm leading-7 text-muted-foreground">
            Before you enter the workspace, I want one small piece of context: how you found the app. That helps me understand who the beta is reaching.
          </p>
        </div>
        <ProfileForm email={user.email} />
      </div>
    </div>
  );
}

