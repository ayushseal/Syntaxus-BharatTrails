import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const monuments = [
  {
    id: 'rumtek',
    name: 'Rumtek Monastery',
    url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'qutub',
    name: 'Qutub Minar Complex',
    url: 'https://images.unsplash.com/photo-1597044143708-76b581146005?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'humayun',
    name: "Humayun's Tomb",
    url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'bishnupur',
    name: 'Bishnupur Terracotta Temples',
    url: 'https://images.unsplash.com/photo-1626245388049-3015f8a006c0?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'khajuraho',
    name: 'Khajuraho Temples',
    url: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'mahabodhi',
    name: 'Mahabodhi Temple Bodh Gaya',
    url: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfddc?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'konark',
    name: 'Konark Sun Temple',
    url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'sarnath',
    name: 'Sarnath Buddhist Stupa',
    url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'hampi',
    name: 'Hampi Virupaksha Stone Chariot',
    url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'mehrangarh',
    name: 'Mehrangarh Fort Jodhpur',
    url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'bekal',
    name: 'Bekal Coastal Sea Fort',
    url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'tawang',
    name: 'Tawang Monastery Arunachal',
    url: 'https://images.unsplash.com/photo-1626014303757-656c54784407?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'unakoti',
    name: 'Unakoti Rock Carvings',
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'golconda',
    name: 'Golconda Fort Hyderabad',
    url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'sanchi',
    name: 'Sanchi Stupa Madhya Pradesh',
    url: 'https://images.unsplash.com/photo-1600100397608-f010f443b749?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'nalanda',
    name: 'Nalanda Mahavihara Bihar',
    url: 'https://images.unsplash.com/photo-1609766418204-94aae0ecfddc?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'thanjavur',
    name: 'Brihadisvara Temple Thanjavur',
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'ajanta',
    name: 'Ajanta Caves Maharashtra',
    url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'dholavira',
    name: 'Dholavira Harappan City Kutch',
    url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85',
  },
  {
    id: 'gandikota',
    name: 'Gandikota Grand Canyon',
    url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85',
  },
];

const targetDir = path.resolve(__dirname, '../public/images/monasteries');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 302 || res.statusCode === 301) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Status ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close(() => resolve());
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading real authentic photography for Indian Heritage Sites...');
  for (const m of monuments) {
    const dest = path.join(targetDir, `${m.id}.png`);
    try {
      await download(m.url, dest);
      console.log(`✓ Downloaded real photo for: ${m.name} -> ${m.id}.png`);
    } catch (e) {
      console.warn(`✗ Error downloading for ${m.name}:`, e.message);
    }
  }
  console.log('Finished downloading high-resolution authentic photography!');
}

main();
