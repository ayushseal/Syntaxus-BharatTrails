import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const allSpots = [
  // Delhi
  { id: 'redfort', title: 'Red_Fort' },
  { id: 'lodhigardens', title: 'Lodi_Gardens' },
  { id: 'agrasenbaoli', title: 'Agrasen_ki_Baoli' },
  { id: 'qutub', title: 'Qutb_Minar' },
  { id: 'humayun', title: "Humayun's_Tomb" },

  // West Bengal
  { id: 'shantiniketan', title: 'Santiniketan' },
  { id: 'hazaraduaripalace', title: 'Hazarduari_Palace' },
  { id: 'dakshineswar', title: 'Dakshineswar_Kali_Temple' },
  { id: 'bishnupur', title: 'Bishnupur,_Bankura' },
  { id: 'coochbehar', title: 'Cooch_Behar_Palace' },

  // Bihar
  { id: 'rajgir', title: 'Rajgir' },
  { id: 'vaishali', title: 'Vaishali_(ancient_city)' },
  { id: 'nalanda', title: 'Nalanda' },
  { id: 'mahabodhi', title: 'Mahabodhi_Temple' },

  // Tamil Nadu
  { id: 'thanjavur', title: 'Brihadisvara_Temple,_Thanjavur' },
  { id: 'gangaikondacholapuram', title: 'Gangaikonda_Cholapuram' },
  { id: 'airavatesvara', title: 'Airavatesvara_Temple' },
  { id: 'mahabalipuram', title: 'Group_of_Monuments_at_Mahabalipuram' },
  { id: 'maduraimeenakshi', title: 'Meenakshi_Temple' },

  // Maharashtra
  { id: 'ajanta', title: 'Ajanta_Caves' },
  { id: 'ellora', title: 'Kailasa_temple,_Ellora' },
  { id: 'daulatabad', title: 'Daulatabad_Fort' },
  { id: 'elephanta', title: 'Elephanta_Caves' },
  { id: 'lonar', title: 'Lonar_Lake' },

  // Gujarat
  { id: 'dholavira', title: 'Dholavira' },
  { id: 'rani-ki-vav', title: 'Rani_ki_vav' },
  { id: 'modherasuntemple', title: 'Sun_Temple,_Modhera' },

  // Andhra Pradesh
  { id: 'gandikota', title: 'Gandikota' },
  { id: 'belumcaves', title: 'Belum_Caves' },
  { id: 'lepakshi', title: 'Lepakshi' },
  { id: 'borra', title: 'Borra_Caves' },

  // Madhya Pradesh
  { id: 'sanchi', title: 'Sanchi' },
  { id: 'khajuraho', title: 'Khajuraho_Group_of_Monuments' },
  { id: 'bhimbetka', title: 'Bhimbetka_rock_shelters' },
  { id: 'udayagiricaves', title: 'Udayagiri_Caves' },
  { id: 'gwaliorfort', title: 'Gwalior_Fort' },

  // Rajasthan
  { id: 'mehrangarh', title: 'Mehrangarh' },
  { id: 'amerfort', title: 'Amer_Fort' },
  { id: 'chittorgarh', title: 'Chittor_Fort' },
  { id: 'jaisalmerfort', title: 'Jaisalmer_Fort' },

  // Karnataka
  { id: 'hampi', title: 'Hampi' },
  { id: 'badami', title: 'Badami_cave_temples' },
  { id: 'pattadakal', title: 'Pattadakal' },
  { id: 'stmarys', title: "St._Mary's_Islands" },

  // Kerala
  { id: 'bekal', title: 'Bekal_Fort' },
  { id: 'fortkochi', title: 'Fort_Kochi' },
  { id: 'padmanabhaswamy', title: 'Padmanabhaswamy_Temple' },

  // Northeast & Himalayan
  { id: 'nongriat', title: 'Living_root_bridge' },
  { id: 'tawang', title: 'Tawang_Monastery' },
  { id: 'loktak', title: 'Loktak_Lake' },
  { id: 'unakoti', title: 'Unakoti' },
  { id: 'gurudongmar', title: 'Gurudongmar_Lake' },
  { id: 'valleyofflowers', title: 'Valley_of_Flowers_National_Park' },
  { id: 'nubra', title: 'Nubra_Valley' },
  { id: 'golconda', title: 'Golconda_Fort' },
  { id: 'konark', title: 'Konark_Sun_Temple' },
  { id: 'sarnath', title: 'Sarnath' },
  { id: 'rumtek', title: 'Rumtek_Monastery' },
  { id: 'enchey', title: 'Enchey_Monastery' },
  { id: 'lingdum', title: 'Ranka_Monastery' },
  { id: 'pemayangtse', title: 'Pemayangtse_Monastery' },
  { id: 'tashiding', title: 'Tashiding_Monastery' },
];

const destDir = path.resolve(__dirname, '../public/images/monasteries');

function getWikiImageUrl(wikiTitle) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(wikiTitle)}&prop=pageimages&format=json&pithumbsize=1600`;
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-Bharat-Atlas/1.0 (contact@syntaxus.org)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const pages = json.query.pages;
          const pid = Object.keys(pages)[0];
          const imgUrl = pages[pid]?.thumbnail?.source;
          resolve(imgUrl || null);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadBinary(imgUrl, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(imgUrl, { headers: { 'User-Agent': 'SYNTAXUS-Bharat-Atlas/1.0 (contact@syntaxus.org)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'SYNTAXUS-Bharat-Atlas/1.0 (contact@syntaxus.org)' } }, (r2) => {
          r2.pipe(file);
          file.on('finish', () => file.close(resolve));
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => file.close(resolve));
      } else {
        reject(new Error(`Status ${res.statusCode}`));
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function main() {
  console.log(`Fetching authentic actual photography from Google/Wikipedia for ${allSpots.length} heritage sites...`);
  
  for (const s of allSpots) {
    const dest = path.join(destDir, `${s.id}.png`);
    try {
      const imgUrl = await getWikiImageUrl(s.title);
      if (imgUrl) {
        await downloadBinary(imgUrl, dest);
        const sz = (fs.statSync(dest).size / 1024).toFixed(1);
        console.log(`✓ Real Photo Downloaded: [${s.id}] from "${s.title}" (${sz} KB)`);
      } else {
        console.warn(`! No thumbnail found for ${s.title}, keeping existing high-res.`);
      }
    } catch (e) {
      console.warn(`✗ Error fetching ${s.id}:`, e.message);
    }
  }
  console.log('Finished updating authentic real-world photography for all spots!');
}

main();
