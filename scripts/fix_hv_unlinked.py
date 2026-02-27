"""
For the HigherVisibility Hashnode page:
  - Add links to 5 articles that now have URLs
  - Delete every other article line that still lacks a hyperlink
"""
import json
import urllib.request
import sys
import re

sys.stdout.reconfigure(encoding='utf-8')

API_TOKEN  = '0c0544d0-9392-4a6a-bb33-5ec0dfd66ec8'
GQL_URL    = 'https://gql.hashnode.com'
PUB_HOST   = 'peaceakinwale.hashnode.dev'
REVAL_URL  = 'https://portfolio-pink-delta-52.vercel.app/api/revalidate?secret=revalidate-peace-2026'

# Articles that get NEW links (keep these)
NEW_LINKS = {
    'Is Link Building Still Relevant to SEO?':
        'https://www.highervisibility.com/seo/learn/is-link-building-still-relevant-to-seo/',
    'Demonstrating First-Hand Experience in YMYL Niches':
        'https://www.highervisibility.com/seo/learn/demonstrating-first-hand-experience-in-ymyl-niches/',
    'How to Optimize for Zero-Click SERPs':
        'https://www.highervisibility.com/seo/learn/zero-click-serps/',
    '2025: Why is Organic Traffic Decreasing?':
        'https://www.highervisibility.com/seo/learn/reasons-organic-traffic-dropping/',
    'Meta Tags For SEO: A Simple Guide For Beginners':
        'https://www.highervisibility.com/seo/learn/meta-tags/',
}

# Lines to preserve even though they have no article link
# (intro prose, separator, CTA)
PRESERVE_PATTERNS = [
    r'HigherVisibility.*digital marketing agency',
    r"They've been recognized",
    r'I have been contributing',
    r'Published articles include',
    r'^---$',
    r'Let us work together',
    r'Book a call',
    r'fill out this form',
]


def is_intro_or_cta(line):
    for pat in PRESERVE_PATTERNS:
        if re.search(pat, line, re.IGNORECASE):
            return True
    return False


def has_link(line):
    return bool(re.search(r'\[.+?\]\(https?://', line))


def gql(query, variables=None):
    payload = json.dumps({'query': query, 'variables': variables or {}}).encode('utf-8')
    req = urllib.request.Request(GQL_URL, data=payload,
        headers={'Content-Type': 'application/json', 'Authorization': API_TOKEN})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read().decode('utf-8'))


GET_PAGE = """
query GetStaticPage($host: String!, $slug: String!) {
  publication(host: $host) {
    staticPage(slug: $slug) { id title slug content { markdown } }
  }
}
"""

UPDATE_PAGE = """
mutation UpdateStaticPage($input: UpdateStaticPageInput!) {
  updateStaticPage(input: $input) {
    staticPage { id slug title }
  }
}
"""

# ── Fetch ──────────────────────────────────────────────────────────────────
page = gql(GET_PAGE, {'host': PUB_HOST, 'slug': 'content-for-highervisibility'})['data']['publication']['staticPage']
md   = page['content']['markdown']
lines = md.split('\n')

# ── Process line by line ───────────────────────────────────────────────────
output   = []
added    = []
removed  = []

for line in lines:
    stripped = line.strip()

    # Always keep blank lines (they separate paragraphs)
    if not stripped:
        output.append(line)
        continue

    # Always keep lines that already have a markdown link
    if has_link(stripped):
        output.append(line)
        continue

    # Always keep intro prose, separators and CTA
    if is_intro_or_cta(stripped):
        output.append(line)
        continue

    # Check if this line gets a new link
    if stripped in NEW_LINKS:
        url = NEW_LINKS[stripped]
        new_line = f'[{stripped}]({url})'
        output.append(new_line)
        added.append((stripped, url))
        continue

    # Everything else that has no link → delete
    removed.append(stripped)
    # (do not append to output)

new_md = '\n'.join(output)

# ── Report ─────────────────────────────────────────────────────────────────
print(f'Links added ({len(added)}):')
for text, url in added:
    print(f'  + {text}')
    print(f'    {url}')

print(f'\nLines removed ({len(removed)}):')
for r in removed:
    print(f'  - {r[:90]}')

# ── Push ───────────────────────────────────────────────────────────────────
result = gql(UPDATE_PAGE, {'input': {
    'id':              page['id'],
    'title':           page['title'],
    'slug':            page['slug'],
    'contentMarkdown': new_md,
}})

if 'errors' in result:
    print(f'\nERROR: {result["errors"]}')
    sys.exit(1)

print('\nSuccessfully pushed page: content-for-highervisibility')

# ── Revalidate ─────────────────────────────────────────────────────────────
req = urllib.request.Request(REVAL_URL)
with urllib.request.urlopen(req) as r:
    print(f'Revalidation: {r.read().decode("utf-8")}')
