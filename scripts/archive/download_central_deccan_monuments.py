import urllib.request
import json
import time
import os

HEADERS = {
    'User-Agent': 'SyntaxusAtlasBot/2.0 (https://syntaxus.in; contact@syntaxus.in) Python-urllib/3.14',
    'Referer': 'https://commons.wikimedia.org/'
}

items = [
    {
        'id': 'bidar',
        'title': 'File:Bidar_Fort_Karnataka.jpg'
    },
    {
        'id': 'undavalli',
        'title': 'File:Undavalli_Caves.jpg'
    },
    {
        'id': 'panhala',
        'title': 'File:Panhala_Fort_-_panoramio_(1).jpg'
    },
    {
        'id': 'ramtek',
        'title': 'File:Shri_Ram_temple_and_fort_temples_of_Ramtek_01.jpg'
    }
]

def fetch_image_url(file_title):
    api_url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(file_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(api_url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        pages = data['query']['pages']
        pid = list(pages.keys())[0]
        if 'imageinfo' in pages[pid]:
            return pages[pid]['imageinfo'][0]['url']
    return None

os.makedirs('public/images/monasteries', exist_ok=True)

for item in items:
    mid = item['id']
    title = item['title']
    out_path = f"public/images/monasteries/{mid}.png"
    if os.path.exists(out_path) and os.path.getsize(out_path) > 10000:
        print(f"Skipping {mid}, already downloaded.")
        continue

    print(f"Fetching {mid} ({title})...")
    time.sleep(3)
    url = fetch_image_url(title)
    if not url:
        print(f"! Failed to get url for {mid}")
        continue
    
    print(f"Downloading from {url} -> {out_path}")
    time.sleep(3)
    req = urllib.request.Request(url, headers=HEADERS)
    with urllib.request.urlopen(req) as resp, open(out_path, 'wb') as f:
        f.write(resp.read())
    
    sz = os.path.getsize(out_path)
    print(f"SUCCESS: Saved {mid}.png ({sz} bytes)")
    time.sleep(3)

print("All downloads complete!")
