import https from 'https';
import fs from 'fs';
import path from 'path';

const hiddenPlaces = [
  {
    id: 'nongriat',
    name: 'Nongriat Living Root Bridges',
    url: 'https://images.unsplash.com/photo-1596895111956-bf1cf0599ce5?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'lonar',
    name: 'Lonar Meteorite Crater Lake',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'nubra',
    name: 'Nubra Valley Hunder Dunes',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'gurudongmar',
    name: 'Gurudongmar Glacial Lake',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'stmarys',
    name: "St. Mary's Columnar Basalt Islands",
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'borra',
    name: 'Borra Limestone Caves',
    url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'valleyofflowers',
    name: 'Valley of Flowers Chamoli',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'loktak',
    name: 'Loktak Floating Phumdis Lake',
    url: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=85',
  }
];

const destDir = 'c:/Users/Ayush/.antigravity-ide/syntaxus/public/images/monasteries';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r2) => {
          r2.pipe(file);
          file.on('finish', () => file.close(() => resolve()));
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
      } else {
        reject(new Error(`Status: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  console.log('Downloading high-res authentic photos for Hidden Tourist & Natural Wonders...');
  for (const place of hiddenPlaces) {
    const dest = path.join(destDir, `${place.id}.png`);
    try {
      await downloadFile(place.url, dest);
      const size = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`✓ Downloaded ${place.name} -> ${place.id}.png (${size} KB)`);
    } catch (e) {
      console.warn(`✗ Error downloading ${place.name}:`, e.message);
    }
  }
}

main();
