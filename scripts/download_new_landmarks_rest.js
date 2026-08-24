import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const items = [
  { id: 'udaipurpalace', page: 'City_Palace,_Udaipur' },
  { id: 'mandu', page: 'Mandu,_Madhya_Pradesh' },
  { id: 'bhoramdeo', page: 'Bhoramdeo_Temple' },
  { id: 'sirpur', page: 'Sirpur_Group_of_Monuments' },
  { id: 'chitrakote', page: 'Chitrakote_Falls' },
  { id: 'elephantacaves', page: 'Elephanta_Caves' },
  { id: 'kaasplateau', page: 'Kaas_Plateau_Reserved_Forest' },
  { id: 'maduraimeenakshi', page: 'Meenakshi_Temple' },
  { id: 'fortkochi', page: 'Fort_Kochi' },
  { id: 'padmanabhaswamy', page: 'Padmanabhaswamy_Temple' },
  { id: 'kanyakumari', page: 'Vivekananda_Rock_Memorial' }
];

function fetchSummaryImage(pageTitle) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(pageTitle)}`;
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-HeritageAtlas/2.0 (contact@syntaxus.org; https://syntaxus.org)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.thumbnail?.source || null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadFileSafe(url, dest) {
  const tmp = dest + '.tmp';
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmp);
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-HeritageAtlas/2.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'SYNTAXUS-HeritageAtlas/2.0' } }, (r2) => {
          r2.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              const sz = fs.statSync(tmp).size;
              if (sz > 5000) {
                fs.renameSync(tmp, dest);
                resolve(sz);
              } else {
                fs.unlinkSync(tmp);
                reject(new Error('File size too small: ' + sz));
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
              reject(new Error('File size too small: ' + sz));
            }
          });
        });
      } else {
        file.close();
        if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
        reject(new Error('HTTP Status ' + res.statusCode));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
      reject(err);
    });
  });
}

async function main() {
  console.log(`Downloading real Wikipedia photographs for ${items.length} landmarks with 2s polite delay...`);
  for (const it of items) {
    const dest = path.join(destDir, `${it.id}.png`);
    try {
      await delay(2000);
      const imgUrl = await fetchSummaryImage(it.page);
      if (imgUrl) {
        await delay(1000);
        const sz = await downloadFileSafe(imgUrl, dest);
        console.log(`✓ Verified Real Photo [${it.id}.png] (${(sz / 1024).toFixed(1)} KB)`);
      } else {
        console.log(`- Image not in summary for ${it.page}`);
      }
    } catch (e) {
      console.warn(`! Error downloading [${it.id}]:`, e.message);
    }
  }
  console.log('Download batch completed!');
}

main();
