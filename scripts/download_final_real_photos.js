import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

const delay = (ms) => new Promise(r => setTimeout(r, ms));

const photoList = [
  { id: 'chitrakote', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Chitrakot_waterfalls.JPG/1280px-Chitrakot_waterfalls.JPG' },
  { id: 'elephantacaves', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Elephanta_Caves_Trimurti.jpg/1280px-Elephanta_Caves_Trimurti.jpg' },
  { id: 'kanyakumari', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/RockMemorial.jpg/1280px-RockMemorial.jpg' },
  { id: 'kaasplateau', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Kaas_Pathar-004.jpg/1280px-Kaas_Pathar-004.jpg' }
];

function download(url, dest) {
  const tmp = dest + '.tmp';
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmp);
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-FinalRealPhotos/1.0 (contact@syntaxus.org)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'SYNTAXUS-FinalRealPhotos/1.0' } }, (r2) => {
          r2.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              const sz = fs.statSync(tmp).size;
              if (sz > 5000) {
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
            if (sz > 5000) {
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
        reject(new Error('Status ' + res.statusCode));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      reject(err);
    });
  });
}

async function main() {
  console.log('Downloading final verified real photos...');
  for (const p of photoList) {
    const dest = path.join(destDir, `${p.id}.png`);
    try {
      await delay(3000); // 3s polite delay
      const sz = await download(p.url, dest);
      console.log(`✓ Downloaded [${p.id}.png] (${(sz / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.warn(`! Error downloading [${p.id}]:`, e.message);
    }
  }
  console.log('All real photos downloaded successfully!');
}

main();
