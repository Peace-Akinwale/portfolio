import requests, json

TOKEN = 'V#gwS1w6fG5w$)1stj24mLc^haezP#GJTCjVxtV2nuwa6lF)!w1Ya0rrd8hNEYk3'
SITE_ID = '234825576'
HEADERS = {'Authorization': f'Bearer {TOKEN}'}

with open('/tmp/wp_image_urls.json') as f:
    img = json.load(f)

TITLE = 'How I wrote 44 product-led articles for ManyRequests and made the product useful inside the piece'

CONTENT = f"""
<p style="color:#6b7280;font-size:0.85em"><em>By Peace Akinwale &middot; [FILL: date] &middot; 8 min read</em></p>

<table style="width:100%;border-collapse:collapse;margin:2em 0">
  <tbody>
    <tr>
      <td style="padding:1em;border:1px solid #e5e7eb;vertical-align:top"><p style="font-size:2em;font-weight:800;margin:0;color:#b45309">44</p><p style="font-size:0.8em;margin:0.25em 0 0;color:#6b7280">Articles published</p></td>
      <td style="padding:1em;border:1px solid #e5e7eb;vertical-align:top"><p style="font-size:2em;font-weight:800;margin:0;color:#b45309">22</p><p style="font-size:0.8em;margin:0.25em 0 0;color:#6b7280">High-fit topics where the product could be shown directly</p></td>
      <td style="padding:1em;border:1px solid #e5e7eb;vertical-align:top"><p style="font-weight:800;margin:0">Page one</p><p style="font-size:0.8em;margin:0.25em 0 0;color:#6b7280">For &#8220;Workfront alternatives&#8221; and &#8220;design annotation tools&#8221;</p></td>
      <td style="padding:1em;border:1px solid #e5e7eb;vertical-align:top"><p style="font-weight:800;margin:0">Active</p><p style="font-size:0.8em;margin:0.25em 0 0;color:#6b7280">Retainer still running</p></td>
    </tr>
  </tbody>
</table>

<figure style="margin:2em 0">
  <img src="{img['homepage']}" alt="ManyRequests homepage &#8212; The Client Portal Built For Agencies" style="width:100%;border-radius:8px;border:1px solid #e5e7eb" />
</figure>

<hr />

<h2>Overview</h2>

<p>ManyRequests did not need more blog posts that mentioned the product once near the end and called that product-led content. They needed articles that could rank for the right searches, answer the reader properly, and show where the product fit while the reader was still making up their mind.</p>

<p>I&#8217;ve written 44 articles for ManyRequests over roughly 20 months. Most of them sit close to the bottom of the funnel. Comparison pages, alternatives pages, workflow guides, and operational topics where agency owners are already trying to decide what tool to use or how to run a cleaner system. The goal was simple. Make the article useful enough to earn trust, then make the product feel like a logical next step inside the article itself.</p>

<p>That approach worked. According to Regine Garcia, Head of Content at ManyRequests, the product-led posts led to more traffic and demo requests.</p>

<h3>Results at a glance</h3>
<ul>
  <li>44 published articles across BOFU and product-adjacent agency operations topics</li>
  <li>22 high-fit topics where the product could be explained and shown directly in the body</li>
  <li>Page one visibility for searches like &#8220;Workfront alternatives&#8221; and &#8220;design annotation tools&#8221; at the time of review</li>
  <li>Retainer still active</li>
</ul>

<figure style="margin:2em 0">
  <div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:8px">
    <iframe src="https://www.youtube.com/embed/jYtpAL8aPyE?si=2YFGZwcHvBzKUZ2f" title="ManyRequests product demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen style="position:absolute;top:0;left:0;width:100%;height:100%"></iframe>
  </div>
</figure>

<hr />

<h2>The Challenge</h2>
<h3>A crowded category where the easy version of this work is familiar</h3>

<p>ManyRequests sells client portal and agency management software for creative agencies and productized service businesses. That puts them in a crowded search space. They are competing with generic project management tools, alternatives sites, affiliate roundups, and bigger software brands with more authority.</p>

<p>The easy version of this work is familiar. Pick a competitor keyword, write a listicle, add the client&#8217;s logo at the top, mention the product in the conclusion, and move on. That kind of article can rank for a while, but it usually does a weak job of helping the reader understand why this product matters.</p>

<p>ManyRequests wanted something better. The brief was not just to publish content. It was to write articles where the product could do real work inside the body of the piece.</p>

<hr />

<h2>How I Approached the Work</h2>
<h3>Three things I did consistently across 44 articles</h3>

<h4>Step 01 &#8212; I chose topics where I could explain how the product works inside the article</h4>

<p>Before I wrote anything, I looked at each topic through a simple question: can I show the reader where ManyRequests fits before the article is over?</p>

<p>If the answer was yes, the topic moved up. If the fit was weak, I either changed the angle or treated the piece as broader educational content instead of trying to force the product into it.</p>

<p>That is what pushed the work toward topics like Workfront alternatives, ClickUp alternatives, client-facing project management tool, retainer management software, and design annotation tools. In those searches, the reader is already comparing tools or trying to solve an operational problem that ManyRequests actually helps with.</p>

<p>That filter also helped on broader topics like agency retainer model. It kept me honest. If the product could not help explain the workflow, I had no reason to wedge it into the piece.</p>

<figure style="margin:2em 0">
  <img src="{img['scoring_sheet']}" alt="Editorial scoring sheet used to evaluate topic fit for ManyRequests" style="width:100%;border-radius:8px;border:1px solid #e5e7eb" />
  <figcaption style="font-size:0.8em;color:#6b7280;margin-top:0.5em">Figure 2 &#8212; Editorial scoring sheet preview</figcaption>
</figure>

<h4>Step 02 &#8212; I showed the product through workflows, screenshots, and customer proof</h4>

<p>Once a topic passed that first filter, I tried to make the product useful inside the article. Not visible. Useful.</p>

<p>That usually meant three things:</p>
<ul>
  <li>Explain the workflow, not just the feature</li>
  <li>Show the product where a screenshot helps the reader understand the step</li>
  <li>Use customer examples where proof matters more than marketing copy</li>
</ul>

<p>You can see that pattern clearly in the work.</p>

<p><strong>Wrike vs ClickUp</strong></p>
<p>The reader is not just comparing task management tools. They are often trying to figure out what works for an agency that has to manage clients, approvals, billing, and delivery in one place. That gave me room to explain why a client portal, proofing, and white-label delivery matter in the first place, and where ManyRequests fits better than another internal PM tool.</p>

<figure style="margin:2em 0">
  <img src="{img['wrike_clickup']}" alt="Top of the Wrike vs ClickUp article on the ManyRequests blog" style="width:100%;border-radius:8px;border:1px solid #e5e7eb" />
  <figcaption style="font-size:0.8em;color:#6b7280;margin-top:0.5em">Figure 3 &#8212; Wrike vs ClickUp article</figcaption>
</figure>

<p><strong>Agency Retainer Model</strong></p>
<p>The product fit is less obvious at first, which is why I like it as proof. The article is teaching the reader how to structure and run a retainer. That gave me a practical place to show add-on services, intake forms, and cleaner request handling inside ManyRequests. The product was not tacked on. It was part of the operational advice.</p>

<figure style="margin:2em 0">
  <img src="{img['retainer_model']}" alt="Top of the Agency Retainer Model article on the ManyRequests blog" style="width:100%;border-radius:8px;border:1px solid #e5e7eb" />
  <figcaption style="font-size:0.8em;color:#6b7280;margin-top:0.5em">Figure 4 &#8212; Agency Retainer Model article</figcaption>
</figure>

<p><strong>Design Annotation Tools</strong></p>
<p>The fit is direct. The feature is the topic. That article let me explain the dashboard, markup flow, and video feedback with screenshots and concrete use cases instead of generic feature copy.</p>

<figure style="margin:2em 0">
  <img src="{img['design_tools']}" alt="Top of the Design Annotation Tools article on the ManyRequests blog" style="width:100%;border-radius:8px;border:1px solid #e5e7eb" />
  <figcaption style="font-size:0.8em;color:#6b7280;margin-top:0.5em">Figure 5 &#8212; Design Annotation Tools article</figcaption>
</figure>

<h4>Step 03 &#8212; I wrote each article to answer the next question a buyer would ask</h4>

<p>Search intent gets someone into the article. It does not finish the job.</p>

<p>A reader searching &#8220;Workfront alternatives&#8221; is also wondering whether the alternative works for agencies, whether clients can submit requests cleanly, whether the team can manage billing, whether feedback stays organized, and whether the whole thing still works once the agency grows.</p>

<p>So I wrote the body to answer those follow-up questions inside the piece. That is part of what made the work feel product-led without turning it into a sales page. The product showed up where the reader naturally needed an answer, not where the brand wanted one more mention.</p>

<hr />

<h2>The Results</h2>
<h3>What the work produced</h3>

<p>This work produced a large body of published content for ManyRequests and helped strengthen the bottom of their funnel around commercial and product-adjacent searches.</p>

<ul>
  <li>44 published articles across comparisons, alternatives, workflow guides, and agency operations topics</li>
  <li>Strong concentration around high-intent searches where ManyRequests had real product fit</li>
  <li>Page one visibility for &#8220;Workfront alternatives&#8221; and &#8220;design annotation tools&#8221; during review</li>
  <li>Ongoing retainer &#8212; which usually tells you as much as any vanity metric</li>
</ul>

<blockquote style="border-left:4px solid #b45309;padding:1em 1.5em;margin:2em 0;background:#fef9f0">
  <p>&#8220;Peace specializes in product-led blog content, and it really shows in his work. He doesn&#8217;t chase keywords. He takes time to deeply understand the product, the user journeys, and how content can actually drive adoption and conversions. <strong>His top-performing posts are product-led ones, which has led to more traffic and demo requests for ManyRequests.</strong>&#8221;</p>
  <p style="margin-top:1em;display:flex;align-items:center;gap:0.75em">
    <img src="{img['regine']}" alt="Regine Garcia" style="width:40px;height:40px;border-radius:50%;object-fit:cover;display:inline-block;vertical-align:middle;margin-right:0.5em" />
    <span><strong>Regine Garcia</strong> &mdash; <span style="color:#6b7280">Head of Content &middot; ManyRequests</span></span>
  </p>
</blockquote>

<hr />

<p>What worked here was not just volume. It was product judgment.</p>

<p>The articles did not treat ManyRequests like a logo to attach at the end of a post. They used the product to help explain the problem, the workflow, and the decision the reader was already trying to make. That is what made the content more useful, and more commercial, at the same time.</p>

<hr />

<h2>Want articles like these for your product?</h2>

<p>If your blog publishes regularly but the product never really shows up in the work, that&#8217;s usually where I start.</p>

<p><a href="https://peaceakinwale.com/services">See services &rarr;</a> &nbsp;&nbsp;&nbsp; <a href="https://calendly.com/akindayopeaceakinwale/30min">Book a discovery call</a></p>
"""

r = requests.post(
    f'https://public-api.wordpress.com/rest/v1.1/sites/{SITE_ID}/posts/new',
    headers=HEADERS,
    data={
        'title': TITLE,
        'content': CONTENT,
        'status': 'draft',
        'type': 'page',
        'slug': 'case-studies-manyrequests',
    }
)

resp = r.json()
print('Status:', r.status_code)
print('Post ID:', resp.get('ID'))
print('URL:', resp.get('URL'))
print('Edit:', f"https://wordpress.com/page/peaceakinwale.wordpress.com/{resp.get('ID')}")
