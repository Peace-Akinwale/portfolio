import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Apps by Peace Akinwale',
  description: 'Writing and research tools by Peace Akinwale, with information about Google sign-in and Google Docs connections.',
  alternates: { canonical: 'https://peaceakinwale.com/apps' },
};

const apps = [
  { name: 'Fanlight', url: 'https://fanlight.peaceakinwale.com', description: 'Capture AI answers, the searches behind them and their cited sources, then review them in a workspace. Google sign-in identifies your account; workspace membership controls access.' },
  { name: 'MyLinks', url: 'https://mylinks.peaceakinwale.com', description: 'Find internal links for an article and review suggestions before applying them. You can separately connect Google Docs to import a document and write approved links back to it.' },
  { name: 'ContentDB', url: 'https://contentdb.peaceakinwale.com', description: 'Store source material, find quotes and read the surrounding context. Google sign-in identifies your account. Your workspace controls which sources you can access.' },
  { name: 'Read Aloud', url: 'https://readaloud.peaceakinwale.com', description: 'Listen to articles and documents in your personal audio library. Google sign-in identifies your account; the app applies its own access and listening limits.' },
];

export default function AppsPage() {
  return (
    <article className="gutter mx-auto max-w-3xl py-16 sm:py-24">
      <h1 className="display text-4xl sm:text-5xl">Apps by Peace Akinwale</h1>
      <p className="mt-6 text-lg leading-relaxed">I build tools for writing, research and working with AI. These apps are operated by Peace Akinwale. They use Google sign-in or an optional Google Docs connection where described below.</p>
      <div className="mt-10 space-y-9">
        {apps.map((app) => (
          <section key={app.name}>
            <h2 className="text-2xl font-semibold"><a className="underline underline-offset-4" href={app.url}>{app.name}</a></h2>
            <p className="mt-3 leading-relaxed">{app.description}</p>
          </section>
        ))}
        <section>
          <h2 className="text-2xl font-semibold">Draft Scorer</h2>
          <p className="mt-3 leading-relaxed">A desktop tool for reviewing article drafts and planning revisions. It runs locally on the operator’s Mac. Its optional Google connection imports an existing document by link, including private documents the connected account can access. A feature in development will let you add new content in a new tab of a selected Google Doc.</p>
        </section>
        <section>
          <h2 className="text-2xl font-semibold">Your Google connection</h2>
          <p className="mt-3 leading-relaxed">Basic sign-in uses your name, email address and profile picture. Access to document contents is a separate permission used by MyLinks and Draft Scorer. Signing in with Google does not automatically give you access to another person’s workspace or files.</p>
          <p className="mt-3 leading-relaxed">Read the <Link className="underline underline-offset-4" href="/privacy">privacy policy</Link> and <Link className="underline underline-offset-4" href="/terms">terms of use</Link>. For help, email <a className="underline underline-offset-4" href="mailto:akindayopeaceakinwale@gmail.com">akindayopeaceakinwale@gmail.com</a>.</p>
        </section>
      </div>
    </article>
  );
}
