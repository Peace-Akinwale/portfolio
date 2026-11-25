import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy policy for Peace Akinwale apps',
  description: 'How Peace Akinwale apps use Google account information and connected documents.',
  alternates: { canonical: 'https://peaceakinwale.com/privacy' },
};

export default function PrivacyPage() {
  return (
    <article className="gutter mx-auto max-w-3xl py-16 sm:py-24">
      <h1 className="display text-4xl sm:text-5xl">Privacy policy</h1>
      <p className="mt-4 text-sm">Updated 25 November 2026</p>
      <div className="mt-8 space-y-8 leading-relaxed [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-semibold [&_p+p]:mt-3 [&_a]:underline [&_a]:underline-offset-4">
        <section>
          <h2>Who operates these apps</h2>
          <p>Peace Akinwale operates the personal apps listed on the <Link href="/apps">apps page</Link>: Fanlight, MyLinks, ContentDB, Read Aloud and Draft Scorer. This policy explains their Google sign-in and document connections. App-specific privacy pages provide additional details about other content you submit.</p>
          <p>For questions, access requests or deletion requests, email <a href="mailto:akindayopeaceakinwale@gmail.com">akindayopeaceakinwale@gmail.com</a> and name the app.</p>
        </section>
        <section>
          <h2>Google sign-in</h2>
          <p>When you sign in with Google, an app receives your Google account identifier, email address, email verification status and, when provided, your name and profile picture. These identify your account and display your profile. Each app separately checks its access rules, invitations or workspace membership.</p>
          <p>Basic sign-in does not give an app access to your Gmail, contacts or documents. Google Docs access is requested separately when you connect a document feature.</p>
        </section>
        <section>
          <h2>Google Docs in MyLinks</h2>
          <p>When you connect Google Docs, MyLinks stores the authorization tokens needed to read a document you import and apply links you approve. It requests the Google Docs permission because it supports both reading an existing document by its link and writing changes to that document.</p>
          <p>That Google permission can authorize access to all Google Docs available to your account. MyLinks uses it for documents you select in the app; it does not automatically import your entire document collection. Imported text, article records and link suggestions are stored in the app so you can return to your work. Approved changes are sent to the Google Docs API when you apply them.</p>
        </section>
        <section>
          <h2>Google Docs in Draft Scorer</h2>
          <p>Draft Scorer runs locally on the operator’s computer. Its Google connection reads a document you select by link and saves the imported draft and supported images locally. Its current importer does not write back to Google Docs. Google authorization tokens are stored in an owner-only file on that computer and can refresh the connection until access expires or is revoked.</p>
          <p>Its Google connection requests Google Docs read and write permission. This supports its document import and planned feature for adding new content in a new tab of a document you choose. The write-back feature is in development. The permission can cover all Google Docs available to your account; the app uses documents you select and does not automatically import your entire document collection. It also requests the limited Drive file permission and uses Google’s account information to identify the connected account.</p>
        </section>
        <section>
          <h2>Processing and storage</h2>
          <p>Hosted apps use Railway for application hosting and Supabase for account or database services. Draft Scorer keeps its imported drafts and Google tokens locally. Authorization tokens are used to provide the connected Google feature, including refreshing access; they are not shown to other app users.</p>
          <p>When you run an AI feature on imported text, the text needed for that request is sent to the configured model provider. MyLinks uses OpenAI and, when configured, OpenRouter and its selected model provider to generate or rank link suggestions. Draft Scorer’s AI actions use the model service configured for that action. These requests provide the feature you choose to run; Google sign-in alone does not send your document contents to a model.</p>
          <p>Workspace content can be accessible to authorized members of that workspace. A report you deliberately share can be accessible to people who receive its share link. Fanlight’s <a href="https://fanlight.peaceakinwale.com/privacy">privacy page</a> and ContentDB’s <a href="https://contentdb.peaceakinwale.com/privacy">privacy page</a> explain their app-specific handling.</p>
        </section>
        <section>
          <h2>Limits on Google data use</h2>
          <p>We use information received from Google APIs to provide the features described here. We do not sell it, use it for advertising or use it to train a general-purpose AI model. Peace Akinwale apps’ use and transfer of information received from Google APIs follows the <a href="https://developers.google.com/terms/api-services-user-data-policy">Google API Services User Data Policy</a>, including its Limited Use requirements.</p>
        </section>
        <section>
          <h2>Disconnecting and deleting data</h2>
          <p>You can revoke an app’s Google access from your <a href="https://myaccount.google.com/connections">Google Account connections</a>. Draft Scorer also offers Disconnect. Revoking access stops future authorized Google API access; it does not erase copies of drafts or other records you previously imported.</p>
          <p>Delete imported items using the app’s available controls, or email a deletion request from the address associated with the account. Include the app and the records you want removed. Local Draft Scorer data is managed on the computer where it runs. Hosted records remain until you delete them or request deletion; necessary operational and backup records may remain until they are replaced or removed.</p>
        </section>
      </div>
    </article>
  );
}
