import https from 'https';
import fs from 'fs';
import path from 'path';

const spots = [
  { id: 'redfort', url: 'https://images.unsplash.com/photo-1598324789736-4861f89564a0?auto=format&fit=crop&w=1600&q=85' },
  { id: 'lodhigardens', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85' },
  { id: 'agrasenbaoli', url: 'https://images.unsplash.com/photo-1597044143708-76b581146005?auto=format&fit=crop&w=1600&q=85' },
  { id: 'shantiniketan', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'hazaraduaripalace', url: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1600&q=85' },
  { id: 'dakshineswar', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85' },
  { id: 'rajgir', url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1600&q=85' },
  { id: 'vaishali', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1600&q=85' },
  { id: 'gangaikondacholapuram', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'airavatesvara', url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85' },
  { id: 'mahabalipuram', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'maduraimeenakshi', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'ellora', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'daulatabad', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85' },
  { id: 'elephanta', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'rani-ki-vav', url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85' },
  { id: 'modherasuntemple', url: 'https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=1600&q=85' },
  { id: 'belumcaves', url: 'https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1600&q=85' },
  { id: 'lepakshi', url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85' },
  { id: 'bhimbetka', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'udayagiricaves', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
  { id: 'gwaliorfort', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85' },
  { id: 'amerfort', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85' },
  { id: 'chittorgarh', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85' },
  { id: 'jaisalmerfort', url: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1600&q=85' },
  { id: 'badami', url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85' },
  { id: 'pattadakal', url: 'https://images.unsplash.com/photo-1600100397839-86644f6f8f53?auto=format&fit=crop&w=1600&q=85' },
  { id: 'fortkochi', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=85' },
  { id: 'padmanabhaswamy', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85' },
];

const destDir = 'c:/Users/Ayush/.antigravity-ide/syntaxus/public/images/monasteries';

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (r2) => {
          r2.pipe(file);
          file.on('finish', () => file.close(() => resolve()));
        }).on('error', reject);
      } else if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => file.close(() => resolve()));
      } else {
        reject(new Error(`Status: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

async function main() {
  console.log(`Downloading high-resolution photos for ${spots.length} expanded circuit spots...`);
  for (const s of spots) {
    const dest = path.join(destDir, `${s.id}.png`);
    try {
      await downloadFile(s.url, dest);
      const size = (fs.statSync(dest).size / 1024).toFixed(1);
      console.log(`✓ Downloaded ${s.id}.png (${size} KB)`);
    } catch (e) {
      console.warn(`✗ Error downloading ${s.id}:`, e.message);
    }
  }
}

main();
