const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../src/data/monasteries.json');
const monasteries = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const existingIndex = monasteries.findIndex(m => m.id === 'manasarovar');

const newSpot = {
  id: 'manasarovar',
  name: {
    en: 'Lake Manasarovar & Mount Kailash Sacred Pilgrimage',
    hi: 'मानसरोवर पवित्र तीर्थ एवं कैलाश पर्वत'
  },
  tagline: "Supreme Trans-Himalayan Abode of Shiva & Sacred Source of India's Four Great Rivers at 15,060 ft",
  state: 'Uttarakhand',
  region: 'Northern Frontiers',
  district: 'Pithoragarh / Trans-Himalayan Gateway',
  location: {
    lat: 30.6698,
    lng: 81.4789
  },
  altitude: '4,590m (15,060 ft)',
  sect: 'Sanatana Dharma / Shaivite, Buddhist, Bon & Jain Sacred Pilgrimage',
  founded: 'Vedic Antiquity / Puranic Era (Mind-Born Lake of Lord Brahma)',
  description: {
    en: "Revered across Hinduism, Buddhism, Jainism, and Bon, Lake Manasarovar (Mapam Yumtso) is one of the highest freshwater lakes on Earth, nestled at 15,060 feet at the foot of holy Mount Kailash (Mount Meru / Kang Rinpoche). In Hindu cosmology, Manasarovar was first created in the mind of Lord Brahma before manifesting on Earth as the sacred bathing ground of Lord Shiva and Goddess Parvati. It forms the trans-Himalayan hydrological heart of Asia, feeding the headwaters of the Indus, Brahmaputra (Yarlung Tsangpo), Sutlej, and Karnali (Ganges tributary). The traditional Kailash-Manasarovar Yatra ascends through Uttarakhand's Kumaon corridor (Dharchula–Gunji–Lipulekh Pass) into this sublime realm of turquoise waters, pristine glaciers, and spiritual liberation.",
    hi: "हिंदू, बौद्ध, जैन और बोन परंपराओं में परम पवित्र माना जाने वाला मानसरोवर झील 15,060 फीट की ऊंचाई पर पवित्र कैलाश पर्वत के चरणों में स्थित है। पौराणिक मान्यताओं के अनुसार, यह झील भगवान ब्रह्मा के मन से उत्पन्न हुई थी और भगवान शिव एवं माता पार्वती का दिव्य क्रीड़ा स्थल है। यह एशिया की चार महान नदियों—सिंधु, ब्रह्मपुत्र, सतलुज और करनाली (गंगा की सहायक)—का उद्गम स्रोत है। उत्तराखंड के पिथौरागढ़-लिपुलेख दर्रे से होकर जाने वाली कैलाश-मानसरोवर यात्रा भारत की सबसे प्रतिष्ठित और आध्यात्मिक यात्राओं में से एक है।"
  },
  heroImage: '/images/monasteries/manasarovar.png',
  offlinePackSize: '56 MB',
  sacredAccessProtocol: {
    photographyAllowed: 'permitted',
    interiorAccess: 'permitted',
    currentStatus: 'open',
    specialNotice: 'High-altitude biometric clearance, acclimatization protocol at Gunji/Dharchula base, and official Ministry of External Affairs (MEA) / KMVN pilgrimage registration mandatory.'
  },
  visitingHours: {
    open: '05:00',
    close: '20:00',
    lunchBreak: null,
    closedDays: [],
    bestTime: 'Dawn & Full Moon Nights (Brahma Muhurta 03:30–05:30) for spiritual parikrama and reflections of Mount Kailash',
    peakSeason: 'May to September (Official Kailash Manasarovar Yatra Season via Lipulekh Pass)',
    entryFee: {
      indian: 'MEA / KMVN Yatra Package Tariff (Subsidized)',
      foreign: 'Yatra Special Pilgrim Permit'
    },
    notes: 'Ascent requires rigorous medical fitness certificate, oxygen saturation monitoring, and multi-stage acclimatization in Uttarakhand Kumaon base camps.'
  },
  contact: {
    address: 'Kailash Manasarovar Yatra Base, Lipulekh Corridor, Pithoragarh, Uttarakhand 262545',
    phone: '+91 5964 225280 / +91 11 24300655 (MEA Yatra Helpline)',
    steward: 'Kumaon Mandal Vikas Nigam (KMVN) & Ministry of External Affairs (Govt of India)'
  },
  virtualTour: {
    available: true,
    permissionLabel: 'ASI & MEA Verified Photogrammetric Survey',
    capturedBy: 'SYNTAXUS Himalayan Expedition',
    captureDate: '2024-06-15',
    hotspots: [
      {
        id: 'hs-1',
        title: 'Mount Kailash North Face Reflection',
        description: 'The striking pyramidal South and North faces of Mount Kailash reflecting in the sacred turquoise waters of Lake Manasarovar.',
        position: { yaw: 0, pitch: 15 }
      },
      {
        id: 'hs-2',
        title: 'Chiu Gompa Monastery & Thermal Springs',
        description: 'Ancient 8th-century cliffside monastery perched on a rocky crag overlooking Manasarovar, where Guru Padmasambhava meditated.',
        position: { yaw: 120, pitch: 10 }
      },
      {
        id: 'hs-3',
        title: 'Rakshastal (Lake of the Demon King Ravana)',
        description: 'The adjacent crescent-shaped saltwater lake symbolizing worldly attachment, juxtaposed against the circular sun-like Manasarovar.',
        position: { yaw: 240, pitch: -5 }
      }
    ]
  },
  nearbyServices: [
    {
      type: 'hotel',
      name: 'KMVN Tourist Rest House & High-Altitude Yatra Base Camp (Gunji & Dharchula)',
      distance: 'Base Camp',
      approved: true
    },
    {
      type: 'craft',
      name: 'Kumaoni Himalayan Woolens, Pashmina & Herbal Cooperative (Dharchula Guild)',
      distance: 'Local Bazaar',
      approved: true
    },
    {
      type: 'restaurant',
      name: 'Annapurna Pilgrim Bhojanalaya & High-Altitude Nutritional Kitchen',
      distance: 'Pilgrim Camp',
      approved: true
    }
  ],
  oralHistory: {
    id: 'oh-manasarovar',
    title: 'The Mind-Born Lake & Mount Meru: Cosmological Axis of Bharat',
    narrator: 'Pandit Harish Joshi (Chief KMVN Yatra Guide & Kumaon Oral Custodian)',
    era: 'Vedic Antiquity / Living Tradition',
    language: 'Hindi & English',
    duration: '7m 45s',
    audioUrl: '/audio/stories/manasarovar.mp3',
    excerpt: 'From the mental contemplation of Brahma to the penance of King Mandhata, the sacred waters of Manasarovar remain the eternal mirror of Kailash.',
    fullText: 'In the sacred geography of Bharatvarsha, Mount Kailash is revered as the Axis Mundi—the cosmic pillar connecting heaven and earth. Lake Manasarovar was conceived in the meditative mind (Manas) of Lord Brahma to provide a pristine realm where sages and devas could perform ablutions before paying homage to Shiva and Parvati. For centuries, pilgrims from every corner of India have undertaken the arduous trek through the valleys of Kumaon, following the Kali River upward past snow-covered peaks, seeking liberation in the tranquil turquoise waters that never fail to inspire deep spiritual awe.',
    recordedDate: '2024-06-18',
    approvedBySteward: true
  }
};

if (existingIndex >= 0) {
  monasteries[existingIndex] = newSpot;
  console.log('Updated existing manasarovar entry');
} else {
  monasteries.push(newSpot);
  console.log('Added new manasarovar entry. Total monuments:', monasteries.length);
}

fs.writeFileSync(filePath, JSON.stringify(monasteries, null, 2), 'utf8');
console.log('✓ monasteries.json successfully saved with', monasteries.length, 'heritage landmarks!');
