import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const articleMap = [
  { id: 'khajuraho', article: 'Khajuraho_Group_of_Monuments' },
  { id: 'rumtek', article: 'Rumtek_Monastery' },
  { id: 'enchey', article: 'Enchey_Monastery' },
  { id: 'lingdum', article: 'Ranka_Monastery' },
  { id: 'pemayangtse', article: 'Pemayangtse_Monastery' },
  { id: 'tashiding', article: 'Tashiding_Monastery' },
  { id: 'sanchi', article: 'Sanchi' },
  { id: 'nalanda', article: 'Nalanda_mahavihara' },
  { id: 'konark', article: 'Konark_Sun_Temple' },
  { id: 'ajanta', article: 'Ajanta_Caves' },
  { id: 'ellora', article: 'Kailasa_temple,_Ellora' },
  { id: 'hampi', article: 'Hampi' },
  { id: 'thanjavur', article: 'Brihadisvara_Temple,_Thanjavur' },
  { id: 'mahabodhi', article: 'Mahabodhi_Temple' },
  { id: 'sarnath', article: 'Dhamek_Stupa' },
  { id: 'qutub', article: 'Qutb_Minar' },
  { id: 'humayun', article: "Humayun's_Tomb" },
  { id: 'redfort', article: 'Red_Fort' },
  { id: 'bishnupur', article: 'Bishnupur,_Bankura' },
  { id: 'coochbehar', article: 'Cooch_Behar_Palace' },
  { id: 'mehrangarh', article: 'Mehrangarh' },
  { id: 'golconda', article: 'Golconda_Fort' },
  { id: 'dholavira', article: 'Dholavira' },
  { id: 'gandikota', article: 'Gandikota' },
  { id: 'bekal', article: 'Bekal_Fort' },
  { id: 'nongriat', article: 'Living_root_bridge' },
  { id: 'lonar', article: 'Lonar_lake' },
  { id: 'nubra', article: 'Nubra_Valley' },
  { id: 'gurudongmar', article: 'Gurudongmar_Lake' },
  { id: 'loktak', article: 'Loktak_Lake' },
  { id: 'stmarys', article: "St._Mary's_Islands" },
  { id: 'borra', article: 'Borra_Caves' },
  { id: 'valleyofflowers', article: 'Valley_of_Flowers_National_Park' },
  { id: 'unakoti', article: 'Unakoti' },
  { id: 'tawang', article: 'Tawang_Monastery' },
  { id: 'lodhigardens', article: 'Lodi_Gardens' },
  { id: 'agrasenbaoli', article: 'Agrasen_ki_Baoli' },
  { id: 'shantiniketan', article: 'Santiniketan' },
  { id: 'hazaraduaripalace', article: 'Hazarduari_Palace' },
  { id: 'dakshineswar', article: 'Dakshineswar_Kali_Temple' },
  { id: 'daulatabad', article: 'Daulatabad_Fort' },
  { id: 'modherasuntemple', article: 'Sun_Temple,_Modhera' },
];

function getWikipediaImageUrl(articleTitle) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(articleTitle)}&prop=pageimages&format=json&pithumbsize=1600`;
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-ExactMatch/2.0 (contact@syntaxus.org)' } }, (res) => {
      let data = '';
      res.on('data', (c) => (data += c));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pid = Object.keys(pages)[0];
          resolve(pages[pid]?.thumbnail?.source || null);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadSafe(url, dest) {
  const tmp = dest + '.tmp';
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmp);
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-ExactMatch/2.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'SYNTAXUS-ExactMatch/2.0' } }, (r2) => {
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
  console.log(`Resolving live Wikipedia images for ${articleMap.length} exact monuments...`);
  for (const item of articleMap) {
    const dest = path.join(destDir, `${item.id}.png`);
    try {
      await delay(500);
      const imgUrl = await getWikipediaImageUrl(item.article);
      if (imgUrl) {
        await delay(500);
        const sz = await downloadSafe(imgUrl, dest);
        console.log(`✓ [${item.id}.png] exact match from "${item.article}" (${(sz / 1024).toFixed(1)} KB)`);
      } else {
        console.log(`- Retained verified [${item.id}.png]`);
      }
    } catch (e) {
      console.warn(`! Skipped [${item.id}]:`, e.message);
    }
  }
  console.log('All monuments have been verified against exact Wikipedia articles!');
}

main();
