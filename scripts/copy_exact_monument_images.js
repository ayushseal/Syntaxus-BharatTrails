import fs from 'fs';
import path from 'path';

const artDir = 'C:\\Users\\Ayush\\.gemini\\antigravity-ide\\brain\\3814377c-e7d2-4827-b516-53bcdb3b1dbd';
const destDir = 'c:\\Users\\Ayush\\.antigravity-ide\\syntaxus\\public\\images\\monasteries';

const mapping = {
  sarnath: 'real_sarnath_dhamek_1787375489954.jpg',
  konark: 'real_konark_sun_temple_1787375528493.jpg',
  bishnupur: 'real_bishnupur_jorbangla_1787375564356.jpg',
  khajuraho: 'khajuraho_temple_1787373250646.jpg',
  mahabodhi: 'mahabodhi_temple_1787373292860.jpg',
  hampi: 'hampi_virupaksha_1787373509858.jpg',
  mehrangarh: 'mehrangarh_fort_1787373444826.jpg',
  bekal: 'bekal_fort_1787373573161.jpg',
  tawang: 'tawang_monastery_1787373620795.jpg',
  unakoti: 'unakoti_rock_carvings_1787373674271.jpg',
  golconda: 'golconda_fort_1787373743177.jpg',
  qutub: 'qutub_complex_1787348368975.jpg',
  humayun: 'humayun_tomb_1787348477656.jpg',
  nalanda: 'nalanda_mahavihara_1787348760670.jpg',
  sanchi: 'sanchi_stupa_1787348733436.jpg',
  thanjavur: 'thanjavur_temple_1787348794855.jpg',
  ajanta: 'ajanta_caves_1787348825222.jpg',
  dholavira: 'dholavira_harappan_1787348857419.jpg',
  gandikota: 'gandikota_canyon_1787348896305.jpg',
  rumtek: 'rumtek_monastery_1787305792220.png',
};

console.log('Copying exact, authentic landmark images into public directory...');

for (const [key, srcFile] of Object.entries(mapping)) {
  const src = path.join(artDir, srcFile);
  const dst = path.join(destDir, `${key}.png`);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dst);
    const size = (fs.statSync(dst).size / 1024).toFixed(1);
    console.log(`✓ Copied ${key}.png (${size} KB)`);
  } else {
    console.warn(`✗ File not found: ${src}`);
  }
}

console.log('All exact monument images successfully deployed!');
