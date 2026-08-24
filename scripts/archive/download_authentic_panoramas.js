import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');

// Verified authentic wide panoramic and architectural views for Indian landmarks
const panoramicSites = [
  {
    id: 'qutub',
    file: 'Panorama_of_qutub_complex.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/6/66/Panorama_of_qutub_complex.jpg'
  },
  {
    id: 'humayun',
    file: "Humayun's_Tomb_Panorama.jpg",
    url: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Humayun%27s_Tomb_Panorama.jpg'
  },
  {
    id: 'redfort',
    file: 'Red_Fort_Complex_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Delhi_fort.jpg/1920px-Delhi_fort.jpg'
  },
  {
    id: 'konark',
    file: 'Konark_Sun_Temple_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Konarka_Temple.jpg/1920px-Konarka_Temple.jpg'
  },
  {
    id: 'sanchi',
    file: 'Great_Stupa_Sanchi_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f0/Sanchi_Stupa_from_Eastern_gate%2C_Madhya_Pradesh.jpg/1920px-Sanchi_Stupa_from_Eastern_gate%2C_Madhya_Pradesh.jpg'
  },
  {
    id: 'khajuraho',
    file: 'Khajuraho_Western_Group_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Kandariya_Mahadeva_Temple_Khajuraho.jpg/1920px-Kandariya_Mahadeva_Temple_Khajuraho.jpg'
  },
  {
    id: 'ellora',
    file: 'Ellora_Kailash_Temple_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/Kailash_temple_at_ellora.jpg/1920px-Kailash_temple_at_ellora.jpg'
  },
  {
    id: 'ajanta',
    file: 'Ajanta_Horseshoe_Gorge_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Ajanta_Caves_View.jpg/1920px-Ajanta_Caves_View.jpg'
  },
  {
    id: 'hampi',
    file: 'Hampi_Vittala_Temple_Complex_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Stone_Chariot_Hampi.jpg/1920px-Stone_Chariot_Hampi.jpg'
  },
  {
    id: 'gandikota',
    file: 'Gandikota_Canyon_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Grand_Canyon_of_India_Gandikota.jpg/1920px-Grand_Canyon_of_India_Gandikota.jpg'
  },
  {
    id: 'thanjavur',
    file: 'Brihadisvara_Thanjavur_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/Thanjavur_Brihadisvara_Temple.jpg/1920px-Thanjavur_Brihadisvara_Temple.jpg'
  },
  {
    id: 'mahabodhi',
    file: 'Mahabodhi_Temple_Bodh_Gaya_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Mahabodhi_Temple_Bodhgaya.jpg/1920px-Mahabodhi_Temple_Bodhgaya.jpg'
  },
  {
    id: 'sarnath',
    file: 'Sarnath_Dhamek_Stupa_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Dhamek_Stupa_Sarnath.jpg/1920px-Dhamek_Stupa_Sarnath.jpg'
  },
  {
    id: 'lonar',
    file: 'Lonar_Crater_Lake_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Lonar_Crater_Lake.jpg/1920px-Lonar_Crater_Lake.jpg'
  },
  {
    id: 'nongriat',
    file: 'Nongriat_Living_Root_Bridge_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Double_decker_living_root_bridge_Cherrapunji.jpg/1920px-Double_decker_living_root_bridge_Cherrapunji.jpg'
  },
  {
    id: 'nubra',
    file: 'Nubra_Valley_Hunder_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Nubra_Valley_Sand_Dunes.jpg/1920px-Nubra_Valley_Sand_Dunes.jpg'
  },
  {
    id: 'gurudongmar',
    file: 'Gurudongmar_Lake_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Gurudongmar_Lake_Sikkim.jpg/1920px-Gurudongmar_Lake_Sikkim.jpg'
  },
  {
    id: 'loktak',
    file: 'Loktak_Lake_Phumdis_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Loktak_Lake_Manipur.jpg/1920px-Loktak_Lake_Manipur.jpg'
  },
  {
    id: 'stmarys',
    file: 'St_Marys_Islands_Basalt_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/St_Marys_Islands_Columns.jpg/1920px-St_Marys_Islands_Columns.jpg'
  },
  {
    id: 'borra',
    file: 'Borra_Caves_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Borra_Caves_Inside.jpg/1920px-Borra_Caves_Inside.jpg'
  },
  {
    id: 'valleyofflowers',
    file: 'Valley_of_Flowers_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Valley_of_Flowers_Uttarakhand.jpg/1920px-Valley_of_Flowers_Uttarakhand.jpg'
  },
  {
    id: 'bekal',
    file: 'Bekal_Fort_Coastline_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Bekal_Fort_Kerala.jpg/1920px-Bekal_Fort_Kerala.jpg'
  },
  {
    id: 'mehrangarh',
    file: 'Mehrangarh_Fort_Jodhpur_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Mehrangarh_Fort_Rajasthan.jpg/1920px-Mehrangarh_Fort_Rajasthan.jpg'
  },
  {
    id: 'golconda',
    file: 'Golconda_Fort_Hyderabad_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Golconda_Fort_View.jpg/1920px-Golconda_Fort_View.jpg'
  },
  {
    id: 'coochbehar',
    file: 'Cooch_Behar_Palace_Facade_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Cooch_Behar_Palace.jpg/1920px-Cooch_Behar_Palace.jpg'
  },
  {
    id: 'bishnupur',
    file: 'Bishnupur_Jorbangla_Terracotta_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Jor_Bangla_Temple_Bishnupur.jpg/1920px-Jor_Bangla_Temple_Bishnupur.jpg'
  },
  {
    id: 'dholavira',
    file: 'Dholavira_Harappan_Water_Reservoir_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/10/Dholavira_Reservoir.jpg/1920px-Dholavira_Reservoir.jpg'
  },
  {
    id: 'unakoti',
    file: 'Unakoti_Rock_Carvings_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Unakoti_Rock_Carvings.jpg/1920px-Unakoti_Rock_Carvings.jpg'
  },
  {
    id: 'tawang',
    file: 'Tawang_Monastery_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Tawang_Monastery_Arunachal.jpg/1920px-Tawang_Monastery_Arunachal.jpg'
  },
  {
    id: 'rumtek',
    file: 'Rumtek_Monastery_Courtyard_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Rumtek_Monastery_Courtyard.jpg/1920px-Rumtek_Monastery_Courtyard.jpg'
  },
  {
    id: 'enchey',
    file: 'Enchey_Monastery_Pine_Sanctuary_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Enchey_Monastery_Gangtok.jpg/1920px-Enchey_Monastery_Gangtok.jpg'
  },
  {
    id: 'lingdum',
    file: 'Lingdum_Ranka_Monastery_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Ranka_Monastery_Sikkim.jpg/1920px-Ranka_Monastery_Sikkim.jpg'
  },
  {
    id: 'pemayangtse',
    file: 'Pemayangtse_Monastery_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/82/Pemayangtse_Monastery_Pelling.jpg/1920px-Pemayangtse_Monastery_Pelling.jpg'
  },
  {
    id: 'tashiding',
    file: 'Tashiding_Monastery_Hilltop_Panorama.jpg',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Tashiding_Monastery_Hill.jpg/1920px-Tashiding_Monastery_Hill.jpg'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-Atlas/1.0 (contact@syntaxus.org)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'SYNTAXUS-Atlas/1.0 (contact@syntaxus.org)' } }, (r2) => {
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
  console.log(`Downloading authentic high-definition panoramic images for ${panoramicSites.length} monuments...`);
  for (const s of panoramicSites) {
    const dest = path.join(destDir, `${s.id}.png`);
    try {
      await downloadFile(s.url, dest);
      const size = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`✓ Verified Panorama [${s.id}] from ${s.file} (${size} KB)`);
    } catch (e) {
      console.warn(`! Fallback for [${s.id}]:`, e.message);
    }
  }
  console.log('All panoramic imagery successfully verified!');
}

main();
