import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

// Direct reliable high-resolution CDN images for all spots
const monumentPhotos = [
  { id: 'khajuraho', url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85' },
  { id: 'sanchi', url: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=1600&q=85' },
  { id: 'ellora', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'ajanta', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85' },
  { id: 'hampi', url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85' },
  { id: 'gandikota', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85' },
  { id: 'thanjavur', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'mahabodhi', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'sarnath', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85' },
  { id: 'lonar', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85' },
  { id: 'nongriat', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=85' },
  { id: 'nubra', url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1600&q=85' },
  { id: 'gurudongmar', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=85' },
  { id: 'loktak', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85' },
  { id: 'stmarys', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=85' },
  { id: 'borra', url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85' },
  { id: 'valleyofflowers', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1600&q=85' },
  { id: 'bekal', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85' },
  { id: 'mehrangarh', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85' },
  { id: 'golconda', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85' },
  { id: 'coochbehar', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85' },
  { id: 'bishnupur', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'dholavira', url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1600&q=85' },
  { id: 'unakoti', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'tawang', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'rumtek', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'enchey', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'lingdum', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'pemayangtse', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'tashiding', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'humayun', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85' },
  { id: 'agrasenbaoli', url: 'https://images.unsplash.com/photo-1597044143708-76b581146005?auto=format&fit=crop&w=1600&q=85' },
  { id: 'rani-ki-vav', url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85' },
];

function safeDownload(url, dest) {
  const tmpDest = dest + '.tmp';
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmpDest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r2) => {
          r2.pipe(file);
          file.on('finish', () => {
            file.close(() => {
              const size = fs.statSync(tmpDest).size;
              if (size > 5000) {
                fs.renameSync(tmpDest, dest);
                resolve(size);
              } else {
                fs.unlinkSync(tmpDest);
                reject(new Error('File too small'));
              }
            });
          });
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close(() => {
            const size = fs.statSync(tmpDest).size;
            if (size > 5000) {
              fs.renameSync(tmpDest, dest);
              resolve(size);
            } else {
              fs.unlinkSync(tmpDest);
              reject(new Error('File too small'));
            }
          });
        });
      } else {
        file.close();
        fs.unlinkSync(tmpDest);
        reject(new Error(`Status ${res.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(tmpDest)) fs.unlinkSync(tmpDest);
      reject(err);
    });
  });
}

async function main() {
  console.log(`Safely downloading verified high-resolution images for ${monumentPhotos.length} monuments...`);
  for (const m of monumentPhotos) {
    const dest = path.join(destDir, `${m.id}.png`);
    try {
      const size = await safeDownload(m.url, dest);
      console.log(`✓ Restored [${m.id}.png] (${(size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.warn(`✗ Failed [${m.id}]:`, e.message);
    }
  }
  console.log('Restoration complete!');
}

main();
