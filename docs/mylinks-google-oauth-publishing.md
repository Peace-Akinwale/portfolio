# Publishing MyLinks' Google OAuth app out of Testing mode

## Why this doc exists

While the OAuth consent screen is in **Testing** mode, refresh tokens expire after 7 days and
only manually-whitelisted test users can authorize. Publishing to **Production** removes both
limits. Because the app only uses the `documents` sensitive scope (no restricted scopes like
`drive.readonly`), publishing requires brand verification but **not** a paid security
assessment.

Expected timeline once submitted: 3–7 business days typical, up to 4–6 weeks in rare cases.
Cost: $0.

---

## Prerequisites before you start

- A hosted **privacy policy** page on `peaceakinwale.com` (see draft below).
- A **2–5 minute unlisted YouTube video** demonstrating the app using the scope (see script
  below).
- A **120×120 PNG app logo**.
- Application home page live at `https://peaceakinwale.com/projects/mylinks`.

---

## Step 1 — Open OAuth consent screen

Navigate to: https://console.cloud.google.com/apis/credentials/consent

The sidebar shows these sub-pages (Google reshuffled this UI in 2025, so older tutorials
will look different):

- **Branding**
- **Audience**
- **Data access**
- **Verification center**

---

## Step 2 — Verify scopes (Data access page)

Click **Data access**. You should see exactly **one** scope listed:

> `.../auth/documents` — See, edit, create, and delete all your Google Docs documents

If any other scope is listed (especially `drive.readonly`, `drive.file`, or any Gmail
scope), stop and remove it first. We removed `drive.readonly` in commit `9661453`; confirm
the console still reflects that.

Having only the `documents` sensitive scope means:

- **Required:** brand verification (logo, homepage, privacy policy, justification, demo video).
- **Not required:** third-party security assessment, CASA audit, app architecture review.

---

## Step 3 — Branding

Click **Branding** in the sidebar. Fill in:

| Field | Value |
|---|---|
| **App name** | `MyLinks by Peace Akinwale` |
| **User support email** | Your support email |
| **App logo** | 120×120 PNG. Simple "ML" monogram or portfolio logo variant |
| **Application home page** | `https://peaceakinwale.com/projects/mylinks` |
| **Application privacy policy link** | `https://peaceakinwale.com/privacy` (or wherever you host it) |
| **Application terms of service link** | Optional. Skip if not ready |
| **Authorized domains** | `peaceakinwale.com` |
| **Developer contact information** | Your email |

Save.

---

## Step 4 — Audience → Publish app

Click **Audience**. You'll see:

> **Publishing status: Testing**

And a prominent button: **Publish app**.

Click it. Google shows a modal:

> **Push your app to production?**
> Anyone with a Google Account will be able to grant the OAuth consent if they are not
> affected by any app policy violations. Your app will also undergo verification.

Click **Confirm**.

---

## Step 5 — Sensitive-scope verification form

Because `documents` is sensitive, Google kicks you straight into a verification form. You'll
fill in:

### 5a. Scope justification (required, free-text)

Paste or adapt:

> MyLinks is an internal-linking tool for content editors. Users import their article drafts
> from Google Docs, our system suggests relevant internal links using an LLM, and the user
> can approve which suggestions should be inserted. The `documents` scope lets us (1) read
> the draft text so the LLM can identify anchor phrases, and (2) write the user's approved
> links back into the same Google Doc at the correct positions so editors don't have to
> copy-paste them manually.

### 5b. Data handling justification (required, free-text)

> Document content is read only at the moment a user explicitly imports a draft or clicks
> "Send to Google Doc" to apply approved links. Content is not retained beyond the active
> article session. OAuth tokens are encrypted at rest in Supabase. Users can revoke access
> at any time via their Google Account → Security → Third-party access.

### 5c. Demo video

Google requires an **unlisted YouTube video**, 2–5 minutes, that shows:

1. A fresh user signing in to the app.
2. The OAuth consent screen appearing — narrate: "here the user sees what scopes MyLinks
   requests. Only `documents` — nothing else in Drive, nothing in Gmail."
3. The actual feature consuming the scope: import a Google Doc, review suggestions, click
   "Send to Google Doc", watch the links appear in the live Doc.
4. Where users can revoke access (open `myaccount.google.com/permissions`, show MyLinks
   in the list with a "Remove access" button).
5. The privacy policy page.

Record screen + narration. Use something simple like Loom (export to YouTube) or QuickTime
+ YouTube Studio.

### 5d. Homepage + privacy policy URLs

Paste the same URLs you used in the Branding page.

### 5e. Submit

Click submit. You'll see a confirmation screen with a **verification request ID**.

---

## Step 6 — Wait and monitor

- Check email (the developer contact from Step 3) every day or two.
- Google's first response is usually a "clarification requested" email listing specific
  things to fix. Common asks:
  - Sharper logo.
  - Privacy policy missing a required bullet.
  - Demo video needs to show the revocation path.
- Respond inside the Google Cloud Console, not via email reply.
- Once verification is **approved**, publishing status flips to **In production** and the
  7-day refresh-token limit goes away permanently.

During the wait:

- Testing mode stays in effect. Tokens still expire after 7 days.
- Everyone who needs to use the app should stay in the **Test users** list on the consent
  screen.

---

## Draft privacy policy content

Copy-paste into a Markdown page at `/privacy` on your site and edit the bracketed bits:

```markdown
# Privacy Policy for MyLinks

_Last updated: [DATE]_

## Who this covers

This policy applies to the MyLinks workspace at
`peaceakinwale.com/projects/mylinks`.

## What we collect

- **Google OAuth tokens** (access + refresh) when you connect Google Docs.
- **Google Doc content** that you explicitly import into a MyLinks article.
- **Site inventory** (URLs, titles, meta descriptions) from domains you ask us to crawl.
- **Account data** (name, email) stored in our Supabase database.

## How we use it

- Tokens: to read and write Google Docs you import or apply links to. We only use the
  `documents` scope — no access to your wider Drive or any other Google service.
- Doc content: sent to the OpenAI API so a language model can propose internal link
  anchors. We do not retain Doc content beyond the active article session.
- Site inventory: stored in our database so suggestions can be computed on demand.
- Account data: to authenticate you and scope data access.

## Where data lives

- Supabase Postgres (encrypted at rest).
- OpenAI API (subject to OpenAI's [data usage policies](https://openai.com/policies)).
  OpenAI does not train on API data.

## Your rights

- **Revoke Google access** anytime at
  [myaccount.google.com/permissions](https://myaccount.google.com/permissions).
- **Delete your account and data** by emailing [YOUR-EMAIL].
- **Export your data** on request.

## Third parties

We do not sell your data. We do not share it except with the processors listed above
(Supabase, OpenAI) strictly to operate the service.

## Children

Not for users under 18.

## Contact

Privacy questions → [YOUR-EMAIL].
```

---

## Alternative if verification fails

If Google rejects verification (rare with `documents`-only), options:

1. **Re-submit** with the fixes they requested.
2. **Switch to `drive.file` scope** (non-sensitive, no verification required). Downside: the
   app can only read Docs the user explicitly picks via Google's own file picker — you'd
   need to build that UI. Breaks the current "paste a Doc URL" flow.
3. **Stay in Testing mode permanently.** Add every user to the test-users list (100-user
   cap). Pain point: weekly reconnect for each user.

---

## Revoking publishing / reverting to testing

In the Audience page there is a **Back to testing** button. Clicking it immediately drops
you back into testing mode with all its restrictions. Useful if something breaks during a
migration.
