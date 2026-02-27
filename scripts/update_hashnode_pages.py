"""
Script to add missing hyperlinks to HigherVisibility and ManyRequests
Hashnode static pages, then trigger revalidation.
"""
import json
import sys
import urllib.request
import urllib.parse
import re

sys.stdout.reconfigure(encoding='utf-8')

API_TOKEN = '0c0544d0-9392-4a6a-bb33-5ec0dfd66ec8'
GRAPHQL_URL = 'https://gql.hashnode.com'
PUB_HOST = 'peaceakinwale.hashnode.dev'
REVALIDATE_URL = 'https://portfolio-pink-delta-52.vercel.app/api/revalidate?secret=revalidate-peace-2026'

# ---------------------------------------------------------------------------
# URL mapping for HigherVisibility entries that need links added.
# Format: (search_pattern, url)  — first match wins for each line.
# ---------------------------------------------------------------------------
HV_URL_MAP = [
    # Ecommerce (2)
    ('Shopify SEO',                                'https://www.highervisibility.com/industries/ecommerce/learn/shopify-seo-best-practices/'),
    ('How Much Does an Ecommerce Website Cost',    'https://www.highervisibility.com/industries/ecommerce/learn/ecommerce-website-cost/'),
    # PPC (8)
    ('Ecommerce PPC',                              'https://www.highervisibility.com/ppc/learn/ecommerce-ppc-guide/'),
    ('6 Common PPC Mistakes',                      'https://www.highervisibility.com/ppc/learn/common-ppc-mistakes/'),
    ('PPC Management for Small',                   'https://www.highervisibility.com/ppc/learn/ppc-management-small-businesses/'),
    ('Paid Search vs. Paid Social',                'https://www.highervisibility.com/ppc/learn/paid-search-vs-paid-social/'),
    ('PPC Pricing',                                'https://www.highervisibility.com/ppc/learn/ppc-pricing/'),
    ('Unlocking the Power of PPC',                 'https://www.highervisibility.com/ppc/learn/what-is-ppc-management/'),
    ('How to Calculate.*PPC ROI',                  'https://www.highervisibility.com/ppc/learn/what-is-ppc-management/'),
    ('Organic vs. Paid Search',                    'https://www.highervisibility.com/ppc/learn/paid-search-vs-paid-social/'),
    # SEO older batch (22)
    ('What is an SEO Consultant',                  'https://www.highervisibility.com/seo/learn/seo-consultant/'),
    ('SEO for Multiple Locations',                 'https://www.highervisibility.com/seo/learn/local-seo-for-multi-location-businesses/'),
    ('How to Open Location Pages',                 'https://www.highervisibility.com/seo/learn/local-seo-for-multi-location-businesses/'),
    ('Alternatives to SEO.*Drive Traffic',         'https://www.highervisibility.com/seo/learn/alternatives-seo-drive-traffic-revenue/'),
    ('How to Define Your Target Audience',         'https://www.highervisibility.com/seo/learn/target-audience-seo/'),
    ('Why is SEO so Expensive',                    'https://www.highervisibility.com/seo/learn/why-seo-expensive/'),
    ('6 Reasons Keyword Research',                 'https://www.highervisibility.com/seo/learn/why-keyword-research-important-seo/'),
    ('Benefits of Using Google Business Profile',  'https://www.highervisibility.com/seo/learn/gmb-optimization/'),
    ('What is Search Intent',                      'https://www.highervisibility.com/seo/learn/what-is-search-intent-seo/'),
    ('B2B SEO Services',                           'https://www.highervisibility.com/seo/learn/b2b-seo-strategy/'),
    ('User Personas for SEO',                      'https://www.highervisibility.com/seo/learn/user-personas-for-seo-how-they-can-lead-to-more-growth/'),
    ('DIY SEO vs',                                 'https://www.highervisibility.com/seo/learn/diy-seo-vs-hiring-professional/'),
    ('Common SEO Mistakes That Could Be',          'https://www.highervisibility.com/seo/learn/5-warning-signs-your-seo-strategy-needs-attention/'),
    ('5 Signs Your Website Needs SEO',             'https://www.highervisibility.com/seo/learn/5-warning-signs-your-seo-strategy-needs-attention/'),
    ('How Often Should You Update SEO',            'https://www.highervisibility.com/seo/learn/seo-strategies/'),
    ('SEO Strategies for 20',                      'https://www.highervisibility.com/seo/learn/seo-strategies/'),
    ('SEO Performance Tracking',                   'https://www.highervisibility.com/seo/learn/seo-performance-tracking/'),
    ('Building a Business Case for SEO',           'https://www.highervisibility.com/seo/learn/building-a-business-case-for-seo/'),
    ('Building an Author Box',                     'https://www.highervisibility.com/seo/learn/author-eeat-examples-seo/'),
    ('What is Local SEO.*Why is it Important',     'https://www.highervisibility.com/seo/learn/what-is-local-seo/'),
    ('What is Local SEO,',                         'https://www.highervisibility.com/seo/learn/what-is-local-seo/'),
    # Website-design (5)
    ('Making SEO Decisions with Confidence',       'https://www.highervisibility.com/website-design/learn/data-driven-marketing/'),
    ('How to Increase Online Sales',               'https://www.highervisibility.com/website-design/learn/how-to-increase-online-sales/'),
    ('Make Your Website ADA Compliant',            'https://www.highervisibility.com/website-design/learn/make-website-ada-compliant/'),
    ('Best Practices for UX.*SEO',                 'https://www.highervisibility.com/website-design/learn/ux-seo-best-practices/'),
    ('How Much Do Website Maintenance',            'https://www.highervisibility.com/website-design/learn/website-maintenance-cost/'),
]


def get_url_for_line(text):
    """Return the first matching URL for a line of text, or None."""
    for pattern, url in HV_URL_MAP:
        if re.search(pattern, text, re.IGNORECASE):
            return url
    return None


def gql_request(query, variables=None):
    payload = json.dumps({'query': query, 'variables': variables or {}}).encode('utf-8')
    req = urllib.request.Request(
        GRAPHQL_URL,
        data=payload,
        headers={'Content-Type': 'application/json', 'Authorization': API_TOKEN},
    )
    with urllib.request.urlopen(req) as resp:
        return json.loads(resp.read().decode('utf-8'))


GET_PAGE = """
query GetStaticPage($host: String!, $slug: String!) {
  publication(host: $host) {
    staticPage(slug: $slug) {
      id
      title
      slug
      content { markdown }
    }
  }
}
"""

UPDATE_PAGE = """
mutation UpdateStaticPage($input: UpdateStaticPageInput!) {
  updateStaticPage(input: $input) {
    staticPage {
      id
      slug
      title
      content { markdown }
    }
  }
}
"""


def fetch_page(slug):
    data = gql_request(GET_PAGE, {'host': PUB_HOST, 'slug': slug})
    return data['data']['publication']['staticPage']


def add_links_to_hv_markdown(md):
    """
    For each line in the HV page markdown that lacks a hyperlink,
    try to match it to a known URL and wrap the text in [text](url).
    Returns (updated_markdown, list_of_changes).
    """
    lines = md.split('\n')
    updated = []
    changes = []

    for line in lines:
        # Skip blank lines
        if not line.strip():
            updated.append(line)
            continue

        # Skip lines that already contain a markdown link  [...](...)
        if re.search(r'\[.+?\]\(.+?\)', line):
            updated.append(line)
            continue

        # Try to find a matching URL
        url = get_url_for_line(line.strip())
        if url:
            new_line = f'[{line.strip()}]({url})'
            updated.append(new_line)
            changes.append((line.strip(), url))
        else:
            updated.append(line)

    return '\n'.join(updated), changes


def add_missing_mr_link(md):
    """
    Add the missing ManyRequests link if not already present.
    """
    missing_url = 'https://www.manyrequests.com/blog/10-tools-you-need-to-set-up-your-productized-service-business'
    if missing_url in md:
        print('ManyRequests: link already present, skipping.')
        return md, False

    # Insert before the last line (CTA section) or at the end
    # Find a good insertion point — just before the last non-empty line
    new_entry = '10 Tools You Need to Set Up Your [Productized Service Business](https://www.manyrequests.com/blog/10-tools-you-need-to-set-up-your-productized-service-business)'

    # Append before the trailing newline (or at end)
    lines = md.rstrip('\n').split('\n')
    lines.append('')
    lines.append(new_entry)
    return '\n'.join(lines), True


def push_page(page_id, title, slug, new_markdown):
    result = gql_request(UPDATE_PAGE, {
        'input': {
            'id': page_id,
            'title': title,
            'slug': slug,
            'contentMarkdown': new_markdown,
        }
    })
    if 'errors' in result:
        print(f'ERROR pushing page {slug}: {result["errors"]}')
        return False
    print(f'Successfully pushed page: {slug}')
    return True


def trigger_revalidation():
    try:
        req = urllib.request.Request(REVALIDATE_URL)
        with urllib.request.urlopen(req) as resp:
            body = resp.read().decode('utf-8')
            print(f'Revalidation response: {body}')
    except Exception as e:
        print(f'Revalidation error: {e}')


# ---------------------------------------------------------------------------
# MAIN
# ---------------------------------------------------------------------------
print('=' * 60)
print('STEP 1: Update HigherVisibility page')
print('=' * 60)

hv_page = fetch_page('content-for-highervisibility')
hv_id = hv_page['id']
hv_md = hv_page['content']['markdown']

hv_new_md, hv_changes = add_links_to_hv_markdown(hv_md)

print(f'\nLinks added ({len(hv_changes)}):')
for text, url in hv_changes:
    print(f'  + [{text[:55]}] -> {url}')

if hv_changes:
    ok = push_page(hv_id, hv_page['title'], hv_page['slug'], hv_new_md)
else:
    print('No changes needed for HigherVisibility page.')
    ok = True

print()
print('=' * 60)
print('STEP 2: Update ManyRequests page')
print('=' * 60)

mr_page = fetch_page('b2b-content-for-manyrequests')
mr_id = mr_page['id']
mr_md = mr_page['content']['markdown']

mr_new_md, mr_changed = add_missing_mr_link(mr_md)
if mr_changed:
    ok2 = push_page(mr_id, mr_page['title'], mr_page['slug'], mr_new_md)
else:
    ok2 = True

print()
print('=' * 60)
print('STEP 3: Trigger revalidation')
print('=' * 60)
trigger_revalidation()

print()
print('Done.')
