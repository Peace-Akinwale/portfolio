# Rebuild brief from Peace, 25 October 2026 (verbatim)

Rebuild my personal website, peaceakinwale.com, end-to-end in the existing portfolio project. I want a finished, coherent website, not another isolated HTML mockup or a redesign of only the homepage.
I’m Peace Akinwale. I write BOFU content for B2B SaaS companies and agencies, and I build AI-assisted tools. The website should make both parts of my work understandable through concrete examples.
Read this brief fully, inspect the actual project and its instructions, then implement. Make routine design and engineering decisions yourself. Ask only when something materially affects content preservation, permissions, cost or the intended result.

## 1. The two designs and where they belong

I chose:

* Number 2, seam.html, as the homepage direction.
* Number 1, dated.html, as the /portfolio direction for showcasing my work and the apps I built.

The original previews were:
http://127.0.0.1:4174/seam.html#q3
http://127.0.0.1:4174/dated.html#top
These addresses require the original local server. Find the actual source files in the portfolio project rather than treating a stopped server as a missing design. Do not confuse these with the earlier journal/studio/exhibition prototypes, which I rejected.
Keep what I liked about seam: its theme, split presentation and movement, and the question navigation:

* Is this true?
* What’s worth making?
* What does done mean?

Use dated as the foundation for /portfolio, but improve it into a complete work index. It should feel related to the homepage without repeating the homepage section for section.
Preserve the homepage’s character and movement while making it work properly on mobile, keyboard and reduced-motion settings. Don’t force a desktop split layout onto a narrow phone.

## 2. Typography and visual direction

I have now chosen Sprat. Use it for expressive display headings. Newsreader is the proposed long-form body pairing; use it if it works well with the design. Keep navigation and interface labels easy to read.
I want something distinctive, editorial and playful, with professional execution. Make it feel personal rather than like a generic SaaS template. I don’t want fake notebook graphics, meaningless sticky notes, enormous decorative objects or unexplained labels such as “inspect source 3.”
Readability matters more than making every letter unusual. Use free, properly licensed fonts, preferably self-hosted, and retain their licence files. Don’t buy fonts. I am not asking for a Sinistre derivative anymore.
Typography reference:
https://peace-live-type-preview.akindayopeaceakinwal.chatgpt.site
That was a comparison tool, not a final approved page design. Don’t carry its font-picker interface into the real website.

## 3. Preserve the website while redesigning it

Start by inventorying the live site and the local routes. Preserve existing pages, published posts, writing samples and meaningful URLs. Redesign their presentation so the entire site feels consistent.
The project was previously identified as a Next.js frontend using WordPress content, with functionality beyond static pages. Verify the current implementation. Do not assume this is a blank project, change frameworks gratuitously or migrate the CMS just to make the redesign easier.
Keep the blog and individual article pages. Preserve existing content, images, dates and working links. Keep existing services, about, contact and testimonial content unless it is superseded by the instructions below.
The current writing portfolio must not disappear when /portfolio becomes the dated-inspired work showcase. Give writing samples a clear, distinct place within the work experience. Make the distinction between articles I wrote and apps I built immediately understandable.
Keep existing /projects and /case-studies routes working if they exist. Decide their roles from the route inventory rather than creating competing, confusing indexes. Avoid changing URLs unnecessarily; if a move is essential, maintain a deliberate redirect map and preserve inbound links.
Preserve working contact forms, comments, analytics and existing application/API functionality. Do not expose secrets or break unrelated tools in the repository.

## 4. Content sources and which version wins

Read my relevant AI OS guidance and the portfolio project’s CLAUDE.md/AGENTS.md before writing or implementing.
Existing AI OS reference:
https://docs.google.com/document/d/1nLLQAxQWjNeFx4296i6CZR3wzuY-Zb67DHEnDl0Vbx8/edit
The portfolio content collection is in Notion:
https://app.notion.com/p/403992da7a57818bbbc3f25d0514ca8e
Use the current Notion pages as the main source for case-study prose and prepared images. They contain later edits than the initial research drafts. The homepage copy below overrides older homepage descriptions.
Useful existing local material, if present on this Mac:

* case-studies/drafts/2026-10-24-notion-ready/
* testimonials/2026-10-24/images/

There is also a separate copy preview:
https://peace-questions-copy-preview.akindayopeaceakinwal.chatgpt.site
Important: its hosted version does NOT yet contain all my latest corrections. The corrected copy was prepared and tested locally on the MacBook Pro, but its upload was blocked. Do not use the hosted preview as the final copy source.
That separate Pro checkout was:
(a local Codex preview, not in this repo)
Do not assume that Pro-only file exists on the Air. Use the explicit corrections in this brief and the accessible source documents. If an essential image or source is missing, identify exactly what is needed rather than inventing it.

## 5. Build real case-study pages and connect them properly

Turn the actual case-study drafts into individual website pages, with readable layouts and their relevant images. They must be linked from the work index and relevant homepage sections.
The collection includes the fanout query analysis tool, AI Docs Watch, ContentDB, Aloud, an OKF, Quality Rater, Reach and the AI-search telemetry/reference project. Inspect the collection to establish the exact inventory and each item’s status. Do not invent missing projects or claim an unfinished tool is complete.
Each case study should explain the problem and why the decisions mattered, with concrete descriptions of what someone can do. Preserve my edits. Avoid replacing the drafts with generic problem/solution/results templates, invented metrics or inflated claims about my contribution.
The homepage introduces the work. /portfolio helps people choose what to explore. Individual pages supply the detail. Avoid repeating the same long paragraphs across all three.
Use the prepared, sanitized screenshots. Keep private text unreadable without blanking out the whole interface. Don’t publish raw source screenshots, credentials or identifying client information.
Use “fanout query analysis tool,” not “Fanout Notebook” or agency-branded variants. Use “an OKF,” not “Notebook OKF.” Apply this to visible images and captions too. Existing Docs Watch links may remain.
For Docs Watch, show the actual documentation before and after a change where the existing evidence supports that. Do not substitute an AI summary for the documentation comparison and label it as the original.

## 6. Radar and the blog

Radar should be a thought-leadership article about what I learned building it, not a conventional case study.
Use this exact latest article:
https://app.notion.com/p/404992da7a5781ce8b6cd42fb274dc33
Its title is “The success message was the bug: five lessons from building an AI-assisted reading tool.” I supplied the replacement text myself. It supersedes the earlier assistant-written draft and the older Radar case study.
The coaching-portal piece in the collection is also an article, not a standard case study. Give these appropriate blog/article pages and relevant links from the work showcase. Do not expose the obsolete Radar case-study page as the final website story.
Preserve my latest article wording rather than silently rewriting it. There is a known factual review item in the Radar article: “about two weeks” for the missing-system-prompt incident conflicts with the checked commit interval of roughly 8½ hours. Flag that for me before public launch instead of silently changing it or treating it as verified.
Give the blog a proper index and an excellent reading page. Use comfortable line lengths and readable mobile type. Retain existing publishing functionality so adding future posts is straightforward. No dummy posts, dead cards or invented publication dates.

## 7. Homepage copy and corrections

Keep the opening:
“Good work starts with good questions.”
“I build AI products and I write. Most of the work is deciding what’s worth making and checking that it’s true.”
Do not add “The same three questions run through both, so this page is built around them.”
Describe my writing as work for B2B SaaS companies and agencies. Avoid the awkward “articles under my own byline and ghostwritten” introduction. Keep the surrounding voice conversational, natural and a little playful.
Use these passages in the corresponding sections:
AI Docs Watch:
“AI Docs Watch checks API documentation for product changes across AI platforms such as OpenAI and Anthropic. It keeps the before-and-after versions so readers can see exactly what changed.”
“Each change page includes a brief explaining the update and why it matters to someone using the platform. Readers can compare the original page with the updated version and follow the source link to check the details for themselves.”
ContentDB:
“I built ContentDB to help writers use the expertise already sitting in a company’s content. It brings existing articles, videos and research into a searchable library that connects to an AI tool through MCP. When you need an expert insight for a new article, you can ask your AI tool to find relevant material in that library instead of searching through old studies, ebooks and thought-leadership pieces yourself.”
AEO article teaser heading:
“What AEO checklists leave out”
Teaser:
“Many AEO guides recommend the same content changes, such as opening sections with direct answers and adding FAQs. When writers give those instructions to Claude Projects or custom GPTs, the resulting articles can start to sound alike.”
“In this article, I explain how I use original research and buyers’ own language to give an article something specific to say, alongside the structure that helps AI tools find and cite it.”
This is a summary, not a quotation. Link it to the existing article:
https://peaceakinwale.com/how-to-optimize-for-aeo
Fanout:
“Capturing searches alone wasn’t enough to justify building the tool. The team also needed to inspect the results and turn them into clear takeaways about what was happening in a client’s AI search activity.”
“A strategist can run multiple prompts at scale and export the results as JSON for further analysis in Claude. They can also use that material to build a dashboard showing a client’s visibility across those recorded AI answers.”
Garde:
“A few friends liked it, but I couldn't find a way to go viral and reach more people. I also found that there were many free, faster alternatives. After four months of building and spending out of pocket, I stopped paying for cloud resources and shut it down. I wrote about that decision too.”
That paragraph belongs to Garde, NOT Aloud. Keep them distinct and retain the relevant existing Garde article link.
Reading-app introduction:
“People can listen to a digest or star a useful post to return to later. Those saved posts give the team material to discuss and draw on when creating new content. The app handles the recurring collection and preparation, while people decide what is worth using.”
Link this to the new lessons article rather than the old case study.
How I work:
“I use AI to help me research articles and build tools, and I check whether the result does what I need it to do. For an article, that means reading the sources and checking that they support the claims. For a tool, it means trying the tasks someone will use it for and checking what happens when a step fails, so they know what went wrong and what to do next.”

## 8. Testimonials and services

Keep Melissa’s testimonial. Add Lateef’s research-depth screenshot beneath it, not a placeholder.
The testimonial collection:
https://app.notion.com/p/403992da7a5781d48fdee1172e9baf66
Use the September 21 message praising research depth and specificity. There is another screenshot about June search visibility; do not confuse them. The prepared research-depth source was Screenshot2026-10-24at23.20.33.png, and the revised local preview used assets/lateef-research-depth.png. Verify the actual pixels. Don’t rewrite an authentic testimonial.
Use this service copy:
“I write BOFU content for B2B SaaS companies and agencies, and conduct enough product research to explain what someone can actually do with your product.”

* Refresh an existing article, $400 (2,000 to 2,500 words)
* Write a new article, $600 (2,000 to 3,000 words)
* Five articles a month, $2,700

Tool-building CTA:
“Tell me about the task your team keeps doing manually. I’ll help you work out whether building a tool would make it easier, then build around how the team works.”
Don’t invent tool-development prices, delivery commitments or performance guarantees.

## 9. Writing and implementation standards

Keep the writing literal and connected. Explain why a detail matters. Avoid stock AI contrasts, repetitive rhetorical triples, unnecessary em dashes and vague claims about impact. Don’t alter approved passages just to make them sound more polished.
Use reusable components and a maintainable content structure. Keep article and case-study content easy to edit. Inspect the existing design tooling, including Scroll Craft if installed, and use it where useful without letting the tool dictate the result.
Don’t stop after writing a plan. Build the complete experience, including navigation, footer, the indexes and detail pages. Every visible CTA must have a real destination or working action.

## 10. Verification and delivery

Before calling it finished:

* Compare the route inventory before and after. Account for every existing page and published post.
* Verify homepage → portfolio → case study, blog → article, testimonial links and contact flows.
* Test the actual desktop and phone layouts, long headings, images, keyboard navigation and reduced motion.
* Check sticky navigation and anchor offsets, Back/Forward behavior and any filters.
* Run the project’s applicable build, type and test checks. State anything that was not tested.
* Check page titles, descriptions, canonical URLs, sitemap and image alternative text. Use structured data only where it accurately represents the content.
* Ensure there are no placeholder screenshots, missing assets, console errors or unexpected horizontal scrolling.

Work in a reviewable branch and preserve existing changes. Finish a production-ready build and give me a working preview with a concise account of the routes and content added. Don’t replace the live site before I review the completed preview and explicitly approve the public launch.
