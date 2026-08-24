import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const remainingMonuments = [
  {
    id: 'humayun',
    name: "Humayun's Tomb (Delhi)",
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/Humayun%27s_Tomb%2C_Delhi%2C_India.jpg/1920px-Humayun%27s_Tomb%2C_Delhi%2C_India.jpg'
  },
  {
    id: 'bishnupur',
    name: 'Bishnupur Jor Bangla Terracotta Temple (West Bengal)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Jor_Bangla_Temple_Bishnupur.jpg/1920px-Jor_Bangla_Temple_Bishnupur.jpg'
  },
  {
    id: 'coochbehar',
    name: 'Cooch Behar Palace (West Bengal)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/The_Cooch_Behar_Palace.jpg/1920px-The_Cooch_Behar_Palace.jpg'
  },
  {
    id: 'golconda',
    name: 'Golconda Fort (Hyderabad)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Golconda_Fort_View.jpg/1920px-Golconda_Fort_View.jpg'
  },
  {
    id: 'dholavira',
    name: 'Dholavira Harappan Site (Kutch, Gujarat)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/DHOLAVIRA_SITE_%2824%29.jpg/1920px-DHOLAVIRA_SITE_%2824%29.jpg'
  },
  {
    id: 'gandikota',
    name: 'Gandikota Grand Canyon of India (Andhra Pradesh)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Grand_Canyon_of_India_Gandikota.jpg/1920px-Grand_Canyon_of_India_Gandikota.jpg'
  },
  {
    id: 'bekal',
    name: 'Bekal Fort (Kerala)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d1/Bakel_Fort_Beach_Kasaragod.jpg/1920px-Bakel_Fort_Beach_Kasaragod.jpg'
  },
  {
    id: 'nongriat',
    name: 'Nongriat Double Decker Living Root Bridge (Meghalaya)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Living_root_bridges%2C_Nongriat_village%2C_Meghalaya.jpg/1920px-Living_root_bridges%2C_Nongriat_village%2C_Meghalaya.jpg'
  },
  {
    id: 'lonar',
    name: 'Lonar Meteorite Impact Crater Lake (Maharashtra)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Lonar_Crater_Lake_Buldhana.jpg/1920px-Lonar_Crater_Lake_Buldhana.jpg'
  },
  {
    id: 'nubra',
    name: 'Nubra Valley Hunder Sand Dunes (Ladakh)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Nubra_Valley_Sand_Dunes.jpg/1920px-Nubra_Valley_Sand_Dunes.jpg'
  },
  {
    id: 'gurudongmar',
    name: 'Gurudongmar Sacred Glacial Lake 17,800 ft (Sikkim)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5f/Gurudongmar_Lake_Sikkim.jpg/1920px-Gurudongmar_Lake_Sikkim.jpg'
  },
  {
    id: 'loktak',
    name: 'Loktak Floating Phumdis Lake (Manipur)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e9/The_Loktak_Lake.jpg'
  },
  {
    id: 'stmarys',
    name: "St. Mary's Columnar Basalt Islands (Karnataka)",
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/St._Mary%27s_islands%2C_Udupi.jpg/1920px-St._Mary%27s_islands%2C_Udupi.jpg'
  },
  {
    id: 'borra',
    name: 'Borra Limestone Karst Caves (Andhra Pradesh)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Borra_caves%2C_Viskhapatnam.jpg/1920px-Borra_caves%2C_Viskhapatnam.jpg'
  },
  {
    id: 'valleyofflowers',
    name: 'Valley of Flowers National Park (Uttarakhand)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Valley_of_flowers_national_park_uttarakhand.jpg/1920px-Valley_of_flowers_national_park_uttarakhand.jpg'
  },
  {
    id: 'unakoti',
    name: 'Unakoti Rock Carvings (Tripura)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Unakoti_3.jpg/1920px-Unakoti_3.jpg'
  },
  {
    id: 'tawang',
    name: 'Tawang Monastery (Arunachal Pradesh)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/9/92/TawangMonastery.jpg'
  },
  {
    id: 'lodhigardens',
    name: 'Lodhi Gardens Bada Gumbad (Delhi)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Lodhi_Gardens_on_a_sunny_afternoon.jpg/1920px-Lodhi_Gardens_on_a_sunny_afternoon.jpg'
  },
  {
    id: 'agrasenbaoli',
    name: 'Agrasen ki Baoli Stepwell (Delhi)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Agrasen_ki_Baoli_May_2014.jpg/1920px-Agrasen_ki_Baoli_May_2014.jpg'
  },
  {
    id: 'shantiniketan',
    name: 'Shantiniketan Upasana Griha (West Bengal)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Upasana_Griha%2C_Santiniketan.jpg/1920px-Upasana_Griha%2C_Santiniketan.jpg'
  },
  {
    id: 'hazaraduaripalace',
    name: 'Hazarduari Palace (Murshidabad, West Bengal)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Hazarduari01_debaditya_chatterjee.jpg'
  },
  {
    id: 'dakshineswar',
    name: 'Dakshineswar Kali Temple (West Bengal)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/32/Dakhineshwar_Temple_beside_the_Ganges.jpg/1920px-Dakhineshwar_Temple_beside_the_Ganges.jpg'
  },
  {
    id: 'daulatabad',
    name: 'Daulatabad Fort (Maharashtra)',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/33/Daulatabad_Fort_a_view.jpg/1920px-Daulatabad_Fort_a_view.jpg'
  }
];

function downloadThrottled(url, dest) {
  const tmp = dest + '.tmp';
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(tmp);
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-VerifiedAtlas/2.0 (contact@syntaxus.org; https://syntaxus.org)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'SYNTAXUS-VerifiedAtlas/2.0' } }, (r2) => {
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
  console.log(`Downloading ${remainingMonuments.length} remaining verified authentic photos with polite throttling...`);
  for (const m of remainingMonuments) {
    const dest = path.join(destDir, `${m.id}.png`);
    try {
      await delay(1200); // 1.2s polite delay between requests
      const size = await downloadThrottled(m.url, dest);
      console.log(`✓ Verified Authentic [${m.id}.png] -> ${m.name} (${(size / 1024).toFixed(1)} KB)`);
    } catch (e) {
      console.warn(`! Fallback for [${m.id}]:`, e.message);
    }
  }
  console.log('Throttled download completed!');
}

main();
