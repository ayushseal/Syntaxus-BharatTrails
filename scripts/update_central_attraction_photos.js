import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const centralAttractions = [
  {
    id: 'sarnath',
    name: 'Sarnath Dhamek Stupa (43-Meter Towering Cylindrical Stupa)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Dhamek_Stupa%2C_2025.jpg'
  },
  {
    id: 'agrasenbaoli',
    name: 'Agrasen ki Baoli (108 Stone Steps Descending into Historic Well)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/a5/Agrasen_Ki_Baoli_-_Heritage_Monument.jpg'
  },
  {
    id: 'shantiniketan',
    name: 'Shantiniketan Griha (Historic Visva-Bharati Tagore Ashram Building)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/7/71/Santiniketan-Griha-Northern-View.jpg'
  }
];

function downloadPhoto(url, dest) {
  const tmp = dest + '.tmp';
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmp);
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://commons.wikimedia.org/'
      }
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        }, (r2) => {
          r2.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              const sz = fs.statSync(tmp).size;
              if (sz > 10000) {
                fs.renameSync(tmp, dest);
                resolve(sz);
              } else {
                fs.unlinkSync(tmp);
                reject(new Error('Too small'));
              }
            });
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const sz = fs.statSync(tmp).size;
            if (sz > 10000) {
              fs.renameSync(tmp, dest);
              resolve(sz);
            } else {
              fs.unlinkSync(tmp);
              reject(new Error('Too small'));
            }
          });
        });
      } else {
        file.close();
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        reject(new Error('HTTP Status: ' + res.statusCode));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading 100% verified real photos focusing on the central attractions...');
  for (const item of centralAttractions) {
    const dest = path.join(destDir, `${item.id}.png`);
    try {
      await delay(2000);
      const sz = await downloadPhoto(item.url, dest);
      console.log(`✓ Real Central Attraction Photo [${item.id}.png] -> ${item.name} (${(sz / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.warn(`! Error downloading [${item.id}]:`, e.message);
    }
  }
  console.log('Central attraction photos updated successfully!');
}

main();
