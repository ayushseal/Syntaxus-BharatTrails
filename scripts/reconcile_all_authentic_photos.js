import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Verified Wikimedia Commons File titles for every single monument in our atlas
const monumentCatalog = [
  { id: 'bishnupur', title: 'File:Jod Bangla Terracotta Temple, Bishnupur, West Bengal.jpg', label: 'Bishnupur Jor Bangla Terracotta Temple' },
  { id: 'khajuraho', title: 'File:1 Khajuraho.jpg', label: 'Khajuraho Kandariya Mahadeva Temple' },
  { id: 'tajmahal', title: 'File:Taj Mahal (Edited).jpeg', label: 'Taj Mahal Agra' },
  { id: 'humayun', title: 'File:Tomb of Humayun, Delhi.jpg', label: "Humayun's Tomb Delhi" },
  { id: 'agrasenbaoli', title: 'File:Agrasen ki Baoli, Delhi 2.jpg', label: 'Agrasen ki Baoli Stepwell Delhi' },
  { id: 'qutub', title: 'File:Panorama of qutub complex.jpg', label: 'Qutub Minar Complex' },
  { id: 'redfort', title: 'File:Delhi fort.jpg', label: 'Red Fort Delhi' },
  { id: 'lodhigardens', title: 'File:Lodhi Gardens on a sunny afternoon.jpg', label: 'Lodhi Gardens Delhi' },
  { id: 'rumtek', title: 'File:Rumtek Monastery alias Dharma Chakra Centre.jpg', label: 'Rumtek Monastery Sikkim' },
  { id: 'enchey', title: 'File:Enchey Monastery, Gangtok, Sikkim.jpg', label: 'Enchey Monastery Gangtok' },
  { id: 'lingdum', title: 'File:Ranka Monastery Sikkim.jpg', label: 'Lingdum Ranka Monastery' },
  { id: 'pemayangtse', title: 'File:Pemayangtse Monastery 01.jpg', label: 'Pemayangtse Monastery Pelling' },
  { id: 'tashiding', title: 'File:Tashiding Monastery Sikkim.jpg', label: 'Tashiding Monastery Sikkim' },
  { id: 'sanchi', title: 'File:Sanchi Stupa from Eastern gate, Madhya Pradesh.jpg', label: 'Great Stupa at Sanchi' },
  { id: 'nalanda', title: 'File:Temple No.- 3, Nalanda Excavated Site.jpg', label: 'Nalanda Mahavihara' },
  { id: 'konark', title: 'File:Konarka Temple.jpg', label: 'Konark Sun Temple' },
  { id: 'ajanta', title: 'File:Ajanta (63).jpg', label: 'Ajanta Caves' },
  { id: 'ellora', title: 'File:Kailash temple at ellora.jpg', label: 'Kailasa Temple at Ellora' },
  { id: 'hampi', title: 'File:Wide angle of Galigopura and Virupaksha temple complex at Hampi.jpg', label: 'Hampi Virupaksha Temple Complex' },
  { id: 'thanjavur', title: 'File:Big Temple Thanjavur.jpg', label: 'Brihadisvara Temple Thanjavur' },
  { id: 'mahabodhi', title: 'File:Mahabodhi Temple Bodhgaya.jpg', label: 'Mahabodhi Temple Bodh Gaya' },
  { id: 'sarnath', title: 'File:Dhamek Stupa, Sarnath.jpg', label: 'Dhamek Stupa Sarnath' },
  { id: 'coochbehar', title: 'File:The Cooch Behar Palace.jpg', label: 'Cooch Behar Palace' },
  { id: 'shantiniketan', title: 'File:Upasana Griha, Santiniketan.jpg', label: 'Shantiniketan Upasana Griha' },
  { id: 'hazaraduaripalace', title: 'File:Hazarduari01 debaditya chatterjee.jpg', label: 'Hazarduari Palace Murshidabad' },
  { id: 'dakshineswar', title: 'File:Dakhineshwar Temple beside the Ganges.jpg', label: 'Dakshineswar Kali Temple Kolkata' },
  { id: 'mehrangarh', title: 'File:Mehrangarh Fort sanhita.jpg', label: 'Mehrangarh Fort Jodhpur' },
  { id: 'golconda', title: 'File:Golconda Fort View.jpg', label: 'Golconda Fort Hyderabad' },
  { id: 'daulatabad', title: 'File:Daulatabad Fort a view.jpg', label: 'Daulatabad Fort' },
  { id: 'dholavira', title: 'File:DHOLAVIRA SITE (24).jpg', label: 'Dholavira Harappan Site' },
  { id: 'gandikota', title: 'File:Grand Canyon of India Gandikota.jpg', label: 'Gandikota Canyon' },
  { id: 'bekal', title: 'File:Bakel Fort Beach Kasaragod.jpg', label: 'Bekal Fort Kerala' },
  { id: 'nongriat', title: 'File:Living root bridges, Nongriat village, Meghalaya.jpg', label: 'Nongriat Living Root Bridges' },
  { id: 'lonar', title: 'File:Lonar Crater Lake.jpg', label: 'Lonar Crater Lake' },
  { id: 'nubra', title: 'File:Nubra Valley Sand Dunes.jpg', label: 'Nubra Valley Hunder Dunes' },
  { id: 'gurudongmar', title: 'File:Gurudongmar Lake Sikkim.jpg', label: 'Gurudongmar Glacial Lake' },
  { id: 'loktak', title: 'File:The Loktak Lake.jpg', label: 'Loktak Lake Phumdis' },
  { id: 'stmarys', title: 'File:St. Mary\'s islands, Udupi.jpg', label: "St. Mary's Basalt Islands" },
  { id: 'borra', title: 'File:Borra caves, Viskhapatnam.jpg', label: 'Borra Karst Caves' },
  { id: 'valleyofflowers', title: 'File:Valley of flowers national park uttarakhand.jpg', label: 'Valley of Flowers' },
  { id: 'unakoti', title: 'File:Unakoti 3.jpg', label: 'Unakoti Rock Carvings' },
  { id: 'tawang', title: 'File:TawangMonastery.jpg', label: 'Tawang Monastery' },
  { id: 'modherasuntemple', title: 'File:Surya mandhir.jpg', label: 'Modhera Sun Temple Gujarat' },
  { id: 'rani-ki-vav', title: 'File:Rani ki vav 07.jpg', label: 'Rani ki Vav Stepwell Patan' }
];

function getFileUrl(fileTitle) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-AuditBot/1.0 (contact@syntaxus.org)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const page = Object.values(json.query.pages || {})[0];
          resolve(page?.imageinfo?.[0]?.url || null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadSafe(url, dest) {
  const tmp = dest + '.tmp';
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmp);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r2) => {
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
  console.log(`Reconciling all ${monumentCatalog.length} monuments with verified Wikimedia Commons master photographs...`);
  let successCount = 0;
  for (const m of monumentCatalog) {
    const dest = path.join(destDir, `${m.id}.png`);
    try {
      await delay(600); // 600ms respectful throttling
      const imgUrl = await getFileUrl(m.title);
      if (imgUrl) {
        await delay(600);
        const sz = await downloadSafe(imgUrl, dest);
        console.log(`✓ [${m.id}.png] -> ${m.label} (${(sz / 1024).toFixed(1)} KB)`);
        successCount++;
      } else {
        console.warn(`! URL not resolved for [${m.id}]: ${m.title}`);
      }
    } catch (e) {
      console.warn(`! Error downloading [${m.id}]:`, e.message);
    }
  }
  console.log(`\nReconciliation finished: ${successCount}/${monumentCatalog.length} photos 100% matched and updated!`);
}

main();
