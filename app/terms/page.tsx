import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of use for Peace Akinwale apps',
  alternates: { canonical: 'https://peaceakinwale.com/terms' },
};

export default function TermsPage() {
  return (
    <article className="gutter mx-auto max-w-3xl py-16 sm:py-24">
      <h1 className="display text-4xl sm:text-5xl">Terms of use</h1>
      <p className="mt-4 text-sm">Updated 25 November 2026</p>
      <div className="mt-8 space-y-8 leading-relaxed [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_a]:underline [&_a]:underline-offset-4">
        <section><h2>The apps</h2><p>These terms cover the personal tools operated by Peace Akinwale and listed on the <Link href="/apps">apps page</Link>. An app may also show terms specific to its features. For help, email <a href="mailto:akindayopeaceakinwale@gmail.com">akindayopeaceakinwale@gmail.com</a>.</p></section>
        <section><h2>Your account and access</h2><p>Use an account you control. Google sign-in identifies you; each app’s invitations, membership rules and usage limits determine what you can do. Do not use an account, workspace, document or source you are not authorized to access, and do not share an access token or invite with someone who should not have that access.</p></section>
        <section><h2>Your content</h2><p>You retain your rights to the content you submit. Submit only material you are permitted to use and process. The apps process that content to provide the features you request, as described in the <Link href="/privacy">privacy policy</Link>. Check AI suggestions and extracted information against the original source before relying on them.</p></section>
        <section><h2>Google connections</h2><p>You choose whether to connect Google. MyLinks can read selected documents and apply links you approve; review those changes before applying them. Draft Scorer imports selected documents and has a feature in development for adding new content in a new tab of a Google Doc. Review proposed content before approving a write. You can revoke Google access through your Google Account.</p></section>
        <section><h2>Service availability</h2><p>These tools can change, encounter errors or become unavailable. Keep copies of important source material and review outputs before publishing or making decisions. Usage limits may apply to protect service capacity. If you need to remove your account or data, contact Peace using the address above.</p></section>
      </div>
    </article>
  );
}
