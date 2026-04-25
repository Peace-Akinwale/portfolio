import requests, json

TOKEN = 'V#gwS1w6fG5w$)1stj24mLc^haezP#GJTCjVxtV2nuwa6lF)!w1Ya0rrd8hNEYk3'
SITE_ID = '234825576'
HEADERS = {'Authorization': f'Bearer {TOKEN}'}

IMAGE_DIR = r'C:/AKINWALE/portfolio/public/images/case-studies/manyrequests'

new_images = {
    'scoring_sheet': f'{IMAGE_DIR}/manyrequests-business-potential-score.png',
    'wrike_clickup': f'{IMAGE_DIR}/wrike-vs-clickup-product.png',
    'retainer_model': f'{IMAGE_DIR}/agency-retainer-model-product.png',
    'design_tools':  f'{IMAGE_DIR}/design-annotation-tools-product.png',
}

import os
urls = {}
for key, path in new_images.items():
    fname = os.path.basename(path)
    with open(path, 'rb') as f:
        data = f.read()
    r = requests.post(
        f'https://public-api.wordpress.com/rest/v1.1/sites/{SITE_ID}/media/new',
        headers=HEADERS,
        files={'media[]': (fname, data, 'image/png')},
    )
    resp = r.json()
    url = resp.get('media', [{}])[0].get('URL', 'FAILED')
    urls[key] = url
    print(f'{key}: {url[:80]}')

# Fetch current content
r = requests.get(f'https://public-api.wordpress.com/rest/v1.1/sites/{SITE_ID}/posts/184', headers=HEADERS)
content = r.json().get('content', '')

# Swap old image URLs for new ones
with open('/tmp/wp_image_urls.json') as f:
    old = json.load(f)

replacements = {
    old['scoring_sheet']: urls['scoring_sheet'],
    old['wrike_clickup']: urls['wrike_clickup'],
    old['retainer_model']: urls['retainer_model'],
    old['design_tools']:  urls['design_tools'],
}

for old_url, new_url in replacements.items():
    if old_url in content:
        content = content.replace(old_url, new_url)
        print(f'Replaced: ...{old_url[-40:]}')
    else:
        print(f'NOT FOUND: ...{old_url[-40:]}')

# Update the post
r = requests.post(
    f'https://public-api.wordpress.com/rest/v1.1/sites/{SITE_ID}/posts/184',
    headers=HEADERS,
    data={'content': content},
)
print('Update status:', r.status_code)
