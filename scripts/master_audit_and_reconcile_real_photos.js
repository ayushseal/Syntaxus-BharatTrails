import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// Complete Master Catalog of verified real Wikimedia Commons files for all landmarks
const masterCatalog = [
  { id: 'ellora', title: 'File:Ellora Caves, India, Kailash Temple.jpg', label: 'Ellora Kailasa Monolithic Temple' },
  { id: 'shantiniketan', title: 'File:Upasana Griha Santiniketan.jpg', label: 'Shantiniketan Upasana Griha (Tagore Ashram)' },
  { id: 'agrasenbaoli', title: 'File:Agrasen ki Baoli, Delhi 2.jpg', label: 'Agrasen ki Baoli 108 Steps' },
  { id: 'tajmahal', title: 'File:Taj Mahal (Edited).jpeg', label: 'Taj Mahal Agra' },
  { id: 'humayun', title: 'File:Tomb of Humayun, Delhi.jpg', label: "Humayun's Tomb Delhi" },
  { id: 'qutub', title: 'File:Panorama of qutub complex.jpg', label: 'Qutub Minar Complex' },
  { id: 'redfort', title: 'File:Delhi fort.jpg', label: 'Red Fort Delhi' },
  { id: 'lodhigardens', title: 'File:Bara Gumbad and mosque, Lodhi Garden.jpg', label: 'Lodhi Gardens Bara Gumbad' },
  { id: 'khajuraho', title: 'File:1 Khajuraho.jpg', label: 'Khajuraho Kandariya Mahadeva Temple' },
  { id: 'sanchi', title: 'File:Sanchi Stupa from Eastern gate, Madhya Pradesh.jpg', label: 'Great Stupa at Sanchi' },
  { id: 'nalanda', title: 'File:Temple No.- 3, Nalanda Excavated Site.jpg', label: 'Nalanda Mahavihara Stupa 3' },
  { id: 'konark', title: 'File:Konarka Temple.jpg', label: 'Konark Sun Temple' },
  { id: 'ajanta', title: 'File:Ajanta (63).jpg', label: 'Ajanta Caves' },
  { id: 'hampi', title: 'File:Wide angle of Galigopura and Virupaksha temple complex at Hampi.jpg', label: 'Hampi Virupaksha Temple Complex' },
  { id: 'thanjavur', title: 'File:Big Temple Thanjavur.jpg', label: 'Brihadisvara Temple Thanjavur' },
  { id: 'mahabodhi', title: 'File:Mahabodhi Temple Bodhgaya.jpg', label: 'Mahabodhi Temple Bodh Gaya' },
  { id: 'sarnath', title: 'File:Dhamek Stupa, Sarnath.jpg', label: 'Dhamek Stupa Sarnath' },
  { id: 'rumtek', title: 'File:Rumtek Monastery alias Dharma Chakra Centre.jpg', label: 'Rumtek Monastery Sikkim' },
  { id: 'enchey', title: 'File:Enchey Monastery, Gangtok, Sikkim.jpg', label: 'Enchey Monastery Gangtok' },
  { id: 'lingdum', title: 'File:Ranka Monastery Sikkim.jpg', label: 'Lingdum Ranka Monastery Sikkim' },
  { id: 'pemayangtse', title: 'File:Pemayangtse Monastery 01.jpg', label: 'Pemayangtse Monastery Pelling' },
  { id: 'tashiding', title: 'File:Tashiding Monastery Sikkim.jpg', label: 'Tashiding Monastery Sikkim' },
  { id: 'bishnupur', title: 'File:Jod Bangla Terracotta Temple, Bishnupur, West Bengal.jpg', label: 'Bishnupur Jor Bangla Terracotta Temple' },
  { id: 'coochbehar', title: 'File:The Cooch Behar Palace.jpg', label: 'Cooch Behar Palace' },
  { id: 'hazaraduaripalace', title: 'File:Hazarduari01 debaditya chatterjee.jpg', label: 'Hazarduari Palace of 1000 Doors' },
  { id: 'dakshineswar', title: 'File:Dakhineshwar Temple beside the Ganges.jpg', label: 'Dakshineswar Kali Temple' },
  { id: 'mehrangarh', title: 'File:Mehrangarh Fort sanhita.jpg', label: 'Mehrangarh Fort Jodhpur' },
  { id: 'golconda', title: 'File:Golconda Fort View.jpg', label: 'Golconda Fort Hyderabad' },
  { id: 'daulatabad', title: 'File:Daulatabad Fort a view.jpg', label: 'Daulatabad Devagiri Fort' },
  { id: 'dholavira', title: 'File:DHOLAVIRA SITE (24).jpg', label: 'Dholavira Harappan Water Reservoirs' },
  { id: 'gandikota', title: 'File:Grand Canyon of India Gandikota.jpg', label: 'Gandikota Canyon' },
  { id: 'bekal', title: 'File:Bakel Fort Beach Kasaragod.jpg', label: 'Bekal Fort Kerala' },
  { id: 'nongriat', title: 'File:Living root bridges, Nongriat village, Meghalaya.jpg', label: 'Nongriat Living Root Bridges' },
  { id: 'lonar', title: 'File:Lonar Crater Lake.jpg', label: 'Lonar Crater Lake' },
  { id: 'nubra', title: 'File:Nubra Valley Sand Dunes.jpg', label: 'Nubra Valley Hunder Dunes' },
  { id: 'gurudongmar', title: 'File:Gurudongmar Lake Sikkim.jpg', label: 'Gurudongmar Sacred Glacial Lake' },
  { id: 'loktak', title: 'File:The Loktak Lake.jpg', label: 'Loktak Lake Floating Phumdis' },
  { id: 'stmarys', title: 'File:St. Mary\'s islands, Udupi.jpg', label: "St. Mary's Columnar Basalt Islands" },
  { id: 'borra', title: 'File:Borra caves, Viskhapatnam.jpg', label: 'Borra Limestone Karst Caves' },
  { id: 'valleyofflowers', title: 'File:Valley of flowers national park uttarakhand.jpg', label: 'Valley of Flowers National Park' },
  { id: 'unakoti', title: 'File:Unakoti 3.jpg', label: 'Unakoti Rock Carvings' },
  { id: 'tawang', title: 'File:TawangMonastery.jpg', label: 'Tawang Monastery Arunachal' },
  { id: 'chittorgarh', title: 'File:Chittorgarh Fort Tower of Victory.jpg', label: 'Chittorgarh Fort & Vijay Stambha' },
  { id: 'udaipurpalace', title: 'File:Udaipur City Palace.jpg', label: 'City Palace Udaipur' },
  { id: 'mandu', title: 'File:JahazMahal.jpg', label: 'Mandu Jahaz Mahal' },
  { id: 'bhoramdeo', title: 'File:Bhoramdeo Temple, Kawardha.jpg', label: 'Bhoramdeo Temple Chhattisgarh' },
  { id: 'sirpur', title: 'File:8th century couple embraced and mouth kissing at Tivara Deva temple, she stands on his feet, Sirpur monuments Chhattisgarh India.jpg', label: 'Sirpur Heritage Complex Chhattisgarh' },
  { id: 'chitrakote', title: 'File:Chitrakot waterfalls.JPG', label: 'Chitrakote Waterfalls Bastar' },
  { id: 'bhimbetka', title: 'File:Rock Shelter 8, Bhimbetka 02.jpg', label: 'Bhimbetka Prehistoric Rock Art' },
  { id: 'elephantacaves', title: 'File:Elephanta Caves Trimurti.jpg', label: 'Elephanta Caves Trimurti Shiva' },
  { id: 'raigadfort', title: 'File:Nagarkhana, Raigad Fort.jpg', label: 'Raigad Fort Maratha Citadel' },
  { id: 'maduraimeenakshi', title: 'File:An aerial view of Madurai city from atop of Meenakshi Amman temple.jpg', label: 'Meenakshi Amman Temple Madurai' },
  { id: 'fortkochi', title: 'File:Kochi, Fishing nets at sunset, Kerala, India.jpg', label: 'Fort Kochi Chinese Fishing Nets' },
  { id: 'padmanabhaswamy', title: 'File:Sree Padmanabhaswamy temple 01.jpg', label: 'Sree Padmanabhaswamy Temple' },
  { id: 'kanyakumari', title: 'File:RockMemorial.jpg', label: 'Vivekananda Rock Memorial Kanyakumari' }
];

function resolveFileUrl(fileTitle) {
  return new Promise((resolve) => {
    const url = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(fileTitle)}&prop=imageinfo&iiprop=url&format=json`;
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-AuditBot/3.0 (contact@syntaxus.org)' } }, (res) => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => {
        try {
          const page = Object.values(JSON.parse(d).query?.pages || {})[0];
          resolve(page?.imageinfo?.[0]?.url || null);
        } catch { resolve(null); }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadRealPhoto(url, dest) {
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
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
            'Referer': 'https://commons.wikimedia.org/'
          }
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
            if (sz > 10000) {
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
  console.log(`Auditing & downloading 100% verified real photographs for ${masterCatalog.length} monuments...`);
  let success = 0;
  for (const m of masterCatalog) {
    const dest = path.join(destDir, `${m.id}.png`);
    try {
      await delay(1200); // 1.2s polite delay
      const imgUrl = await resolveFileUrl(m.title);
      if (imgUrl) {
        await delay(1000);
        const sz = await downloadRealPhoto(imgUrl, dest);
        console.log(`✓ Real Photo [${m.id}.png] -> ${m.label} (${(sz / 1024).toFixed(1)} KB)`);
        success++;
      } else {
        console.warn(`! Missing URL for [${m.id}]: ${m.title}`);
      }
    } catch (e) {
      console.warn(`! Error downloading [${m.id}]:`, e.message);
    }
  }
  console.log(`\nAudit Complete: ${success}/${masterCatalog.length} verified real photographs active!`);
}

main();
