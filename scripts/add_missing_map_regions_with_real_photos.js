import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const destDir = path.resolve(__dirname, '../public/images/monasteries');
const monasteriesPath = path.resolve(__dirname, '../src/data/monasteries.json');
const trailsPath = path.resolve(__dirname, '../src/data/trails.json');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const newLandmarks = [
  // Region 1: Southern Rajasthan / Malwa / Gujarat borders
  {
    id: "chittorgarh",
    name: { en: "Chittorgarh Fort & Vijay Stambha", hi: "चित्तौड़गढ़ दुर्ग एवं विजय स्तंभ" },
    tagline: "UNESCO World Heritage Site & Asia's Largest Hill Citadel of Rajput Valor",
    state: "Rajasthan",
    region: "Western & Central",
    district: "Chittorgarh",
    location: { lat: 24.8879, lng: 74.6269 },
    altitude: "590m",
    sect: "Rajput Citadel Architecture / UNESCO World Heritage Site",
    founded: "7th Century CE (Mori / Sisodia Rajputs)",
    description: {
      en: "Sprawling across a 700-acre hill overlooking the Gambhiri River, Chittorgarh Fort is the legendary capital of Mewar. Famous for the 9-story carved Vijay Stambha (Tower of Victory), Kirti Stambha, Gaumukh Reservoir, and Padmini Palace. It stands as an enduring symbol of Rajput chivalry and courage.",
      hi: "चित्तौड़गढ़ दुर्ग भारत का सबसे विशाल किला है, जो शौर्य, बलिदान और वास्तुकला का प्रतीक है।"
    },
    heroImage: "/images/monasteries/chittorgarh.png",
    offlinePackSize: "42 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "06:00", close: "18:00", bestTime: "October to March (Sunrise view from Vijay Stambha)", entryFee: { indian: "₹40", foreign: "₹600" } },
    contact: { address: "Chittorgarh Fort, Chittorgarh, Rajasthan 312001", phone: "+91 1472 241089", steward: "Archaeological Survey of India (Jaipur Circle)" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Jaipur Circle",
      capturedBy: "SYNTAXUS Rajasthan Field Unit",
      captureDate: "2024-04-12",
      hotspots: [
        { id: "hs-1", title: "Vijay Stambha (Tower of Victory)", description: "37-meter 9-story tower carved with Hindu deities, built by Rana Kumbha in 1448 CE.", position: { yaw: 0, pitch: 15 } },
        { id: "hs-2", title: "Gaumukh Spring Reservoir", description: "Natural sacred rock spring emerging from a cow's mouth carving into a deep pool.", position: { yaw: 120, pitch: -10 } }
      ]
    },
    oralHistories: [
      { id: "oh-chittor", title: "The Song of the Nine-Story Victory Tower", narrator: "Dr. Hukum Singh (Mewar Historian)", source: "monastery-approved", type: "oral-history", language: "Rajasthani & Hindi", era: "1448 CE", excerpt: "Rana Kumbha erected this tower as an architectural textbook of Hindu iconometry..." }
    ],
    nearbyServices: [
      { type: "hotel", name: "Hotel Padmini & Pratap Palace", distance: "1.5 km", approved: true },
      { type: "guide", name: "Rajasthan Tourism Approved Historical Guides", distance: "Main Fort Gate", approved: true },
      { type: "restaurant", name: "Rana Sanga Heritage Thali (Dal Baati Churma)", distance: "Fort Road", approved: true }
    ],
    wikiFile: "File:Chittorgarh_Fort_Tower_of_Victory.jpg",
    wikiPage: "Chittor_Fort"
  },
  {
    id: "udaipurpalace",
    name: { en: "City Palace & Lake Pichola", hi: "उदयपुर सिटी पैलेस एवं पिछोला झील" },
    tagline: "Granite & Marble Marvel of the Mewar Dynasty Overlooking Lake Pichola",
    state: "Rajasthan",
    region: "Western & Central",
    district: "Udaipur",
    location: { lat: 24.5764, lng: 73.6835 },
    altitude: "598m",
    sect: "Rajput-Mughal Fusion Palace Architecture",
    founded: "1559 CE (Maharana Udai Singh II)",
    description: {
      en: "Built over 400 years on the east bank of Lake Pichola, the Udaipur City Palace complex features towering granite gates, ornate mirror-mosaic galleries (Sheesh Mahal), Mor Chowk peacock courtyard, and panoramic vistas of Jag Mandir and the Lake Palace.",
      hi: "पिछोला झील के तट पर स्थित सिटी पैलेस मेवाड़ राजवंश की भव्यता का प्रतीक है।"
    },
    heroImage: "/images/monasteries/udaipurpalace.png",
    offlinePackSize: "38 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "09:00", close: "17:30", bestTime: "Sunset boat cruise on Lake Pichola", entryFee: { indian: "₹300", foreign: "₹300" } },
    contact: { address: "Old City, Udaipur, Rajasthan 313001", phone: "+91 294 2419021", steward: "Maharana of Mewar Charitable Foundation" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by MMCF Trust",
      capturedBy: "SYNTAXUS Mewar Heritage Survey",
      captureDate: "2024-04-15",
      hotspots: [
        { id: "hs-1", title: "Mor Chowk (Peacock Courtyard)", description: "Famous courtyard adorned with 5,000 glass mosaic tiles depicting dancing peacocks.", position: { yaw: 0, pitch: 5 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Fateh Prakash Palace & Jagat Niwas", distance: "Adjacent", approved: true },
      { type: "craft", name: "Udaipur Miniature Painting Guild", distance: "200m", approved: true }
    ],
    wikiPage: "City_Palace,_Udaipur"
  },
  {
    id: "mandu",
    name: { en: "Mandu Jahaz Mahal & Fortress of Joy", hi: "मांडू जहाज़ महल एवं आनंद नगरी" },
    tagline: "Historic Medieval Citadel of Afghan Architecture Floating Between Two Lakes",
    state: "Madhya Pradesh",
    region: "Western & Central",
    district: "Dhar",
    location: { lat: 22.3667, lng: 75.4000 },
    altitude: "633m",
    sect: "Malwa Sultanate Afghan Architecture",
    founded: "10th–15th Century CE (Paramara / Malwa Sultans)",
    description: {
      en: "Perched on the Vindhya ranges overlooking the Narmada valley, Mandu is famous for Jahaz Mahal (Ship Palace) built between two artificial lakes (Kapur and Munj Talao), Hindola Mahal (Swinging Palace), Roopmati's Pavilion, and Baz Bahadur's Palace.",
      hi: "विंध्य पर्वत श्रृंखलाओं में स्थित मांडू प्रेम और वास्तुकला की नगरी है।"
    },
    heroImage: "/images/monasteries/mandu.png",
    offlinePackSize: "36 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "06:00", close: "18:00", bestTime: "Monsoon (July–September) when lush green waterfalls surround the plateau", entryFee: { indian: "₹25", foreign: "₹300" } },
    contact: { address: "Mandav, Dhar District, Madhya Pradesh 454010", phone: "+91 7292 263231", steward: "ASI Bhopal Circle" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Bhopal Circle",
      capturedBy: "SYNTAXUS Malwa Team",
      captureDate: "2024-04-18",
      hotspots: [
        { id: "hs-1", title: "Jahaz Mahal Central Terrace", description: "Double-storied palace built between Munj and Kapur lakes, appearing as a floating ship.", position: { yaw: 0, pitch: 0 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "MP Tourism Malwa Resort & Jahaj Mahal Retreat", distance: "500m", approved: true }
    ],
    wikiPage: "Mandu,_Madhya_Pradesh"
  },

  // Region 2: Central India / Chhattisgarh / Eastern MP
  {
    id: "bhoramdeo",
    name: { en: "Bhoramdeo Temple (Khajuraho of Chhattisgarh)", hi: "भोरमदेव मंदिर (छत्तीसगढ़ का खजुराहो)" },
    tagline: "11th-Century Nagara Stone Temple in the Maikal Mountain Foothills",
    state: "Chhattisgarh",
    region: "Eastern Corridors",
    district: "Kabirdham (Kawardha)",
    location: { lat: 22.1158, lng: 81.2547 },
    altitude: "480m",
    sect: "Phani Nagavanshi Nagara Temple Architecture",
    founded: "1089 CE (King Gopaldev)",
    description: {
      en: "Nestled in the lush Maikal mountain range surrounded by Sal forests, Bhoramdeo is an exquisite 11th-century stone temple dedicated to Lord Shiva. Its outer walls are sculpted with hundreds of intricate bas-reliefs depicting deities, celestial nymphs, and spiritual motifs in Nagara style.",
      hi: "मैकल पर्वतमाला की गोद में स्थित भोरमदेव मंदिर छत्तीसगढ़ की मूर्तिकला का सर्वश्रेष्ठ उदाहरण है।"
    },
    heroImage: "/images/monasteries/bhoramdeo.png",
    offlinePackSize: "34 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "06:00", close: "19:00", bestTime: "Bhoramdeo Mahotsav (March) & Winter", entryFee: { indian: "Free", foreign: "Free" } },
    contact: { address: "Chhapri, Kawardha, Kabirdham, Chhattisgarh 491995", phone: "+91 7741 232120", steward: "Chhattisgarh State Archaeology & ASI" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by CG Tourism Board",
      capturedBy: "SYNTAXUS Chhattisgarh Expedition",
      captureDate: "2024-03-10",
      hotspots: [
        { id: "hs-1", title: "Main Sanctum Vimana & Mandapa", description: "Sculpted chlorite stone shikhara rising 60 feet above the forested lake.", position: { yaw: 0, pitch: 10 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Bhoramdeo Jungle Retreat & CG Tourism Motel", distance: "800m", approved: true }
    ],
    wikiPage: "Bhoramdeo_Temple"
  },
  {
    id: "sirpur",
    name: { en: "Sirpur Heritage Complex & Lakshmana Temple", hi: "सिरपुर विरासत परिसर एवं लक्ष्मण मंदिर" },
    tagline: "7th-Century Brick Architecture & Ancient Buddhist Monastic Mahavihara on Mahanadi",
    state: "Chhattisgarh",
    region: "Eastern Corridors",
    district: "Mahasamund",
    location: { lat: 21.3433, lng: 82.1783 },
    altitude: "245m",
    sect: "Somavamshi Brick Architecture & Mahayana Buddhism",
    founded: "625–650 CE (Queen Vasata)",
    description: {
      en: "Situated on the banks of the Mahanadi River, Sirpur is one of India's finest ancient brick temple sites. The 7th-century Lakshmana Temple features intricately molded terracotta bricks, paired with the excavated Anandaprabhu Kuti Vihara where Hiuen Tsang recorded 10,000 monks studying.",
      hi: "महानदी तट पर स्थित सिरपुर ईंटों से निर्मित प्राचीन मंदिरों और बौद्ध विहारों का केंद्र है।"
    },
    heroImage: "/images/monasteries/sirpur.png",
    offlinePackSize: "35 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "06:00", close: "18:00", bestTime: "Sirpur National Dance & Music Festival (January)", entryFee: { indian: "₹25", foreign: "₹300" } },
    contact: { address: "Sirpur, Mahasamund District, Chhattisgarh 493445", phone: "+91 7723 281222", steward: "ASI Raipur Circle" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Raipur Circle",
      capturedBy: "SYNTAXUS Sirpur Survey",
      captureDate: "2024-03-12",
      hotspots: [
        { id: "hs-1", title: "Lakshmana Temple Brick Shikhara", description: "Finest surviving 7th-century terracotta carved brick temple in Central India.", position: { yaw: 0, pitch: 5 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Hiuen Tsang Tourism Resort Sirpur", distance: "400m", approved: true }
    ],
    wikiPage: "Sirpur_Group_of_Monuments"
  },
  {
    id: "chitrakote",
    name: { en: "Chitrakote Waterfalls (Niagara of India)", hi: "चित्रकोट जलप्रपात (भारत का नियाग्रा)" },
    tagline: "Horseshoe Waterfall & Bastar Tribal Craft Cultural Corridor on Indravati River",
    state: "Chhattisgarh",
    region: "Eastern Corridors",
    district: "Bastar",
    location: { lat: 19.2028, lng: 81.7058 },
    altitude: "570m",
    sect: "Natural Wonder / Bastar Indigenous Heritage",
    founded: "Geological Formation (Indravati River Gorge)",
    description: {
      en: "Widest waterfall in India (nearly 300 meters across during monsoons), plunging 95 feet over horseshoe cliffs into the Indravati River gorge. Surrounding Bastar villages are globally celebrated for Dhokra bell-metal casting, terracotta figurines, and tribal woodcraft.",
      hi: "इंद्रावती नदी पर 300 मीटर चौड़ा चित्रकोट जलप्रपात भारत का नियाग्रा कहलाता है।"
    },
    heroImage: "/images/monasteries/chitrakote.png",
    offlinePackSize: "40 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "06:00", close: "19:00", bestTime: "Monsoon & Post-Monsoon (July to November)", entryFee: { indian: "Free", foreign: "Free" } },
    contact: { address: "Chitrakote, Jagdalpur, Bastar, Chhattisgarh 494010", phone: "+91 7782 222144", steward: "Chhattisgarh Tourism Board & Bastar District Administration" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Bastar District Council",
      capturedBy: "SYNTAXUS Bastar Unit",
      captureDate: "2024-03-15",
      hotspots: [
        { id: "hs-1", title: "Horseshoe Gorge Mist Point", description: "300-meter wide cataract where rainbow halos form across the spray at sunset.", position: { yaw: 0, pitch: -10 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Dandami Luxury Resort Chitrakote (CG Tourism)", distance: "Cliff top", approved: true },
      { type: "craft", name: "Bastar Dhokra Bell Metal & Wrought Iron Crafts Center", distance: "1 km", approved: true }
    ],
    wikiPage: "Chitrakote_Falls"
  },
  {
    id: "bhimbetka",
    name: { en: "Bhimbetka Paleolithic Rock Shelters", hi: "भीमबेटका पाषाण आश्रय स्थल" },
    tagline: "UNESCO World Heritage Site with 30,000-Year-Old Prehistoric Cave Art",
    state: "Madhya Pradesh",
    region: "Western & Central",
    district: "Raisen",
    location: { lat: 22.9372, lng: 77.6125 },
    altitude: "450m",
    sect: "Paleolithic & Mesolithic Prehistoric Rock Art / UNESCO Site",
    founded: "100,000–10,000 BCE",
    description: {
      en: "Spanning over 750 sandstone rock shelters amidst teak forests in the foothills of the Vindhyan range, Bhimbetka exhibits the earliest traces of human life on the Indian subcontinent. Vibrant ochre, red, and white mineral paintings depict hunting scenes, dancing rituals, bison, elephants, and community life from the Upper Paleolithic to the Medieval era.",
      hi: "भीमबेटका में 30,000 वर्ष पुराने प्रागैतिहासिक शैलचित्र मानव सभ्यता के प्राचीनतम प्रमाण हैं।"
    },
    heroImage: "/images/monasteries/bhimbetka.png",
    offlinePackSize: "38 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "07:00", close: "18:00", bestTime: "October to March", entryFee: { indian: "₹25", foreign: "₹300" } },
    contact: { address: "Bhimbetka, Raisen District, Madhya Pradesh 464990", phone: "+91 7480 231122", steward: "ASI Bhopal Circle" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Bhopal Circle",
      capturedBy: "SYNTAXUS Prehistoric Heritage Survey",
      captureDate: "2024-04-02",
      hotspots: [
        { id: "hs-1", title: "Auditorium Cave & Zoo Rock", description: "Famous rock wall displaying 453 prehistoric animal figures in natural mineral pigments.", position: { yaw: 0, pitch: 0 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "MP Tourism Highway Treat & Bhopal Retreats", distance: "5 km", approved: true }
    ],
    wikiPage: "Bhimbetka_rock_shelters"
  },

  // Region 3: Western Maharashtra / Konkan / Western Ghats
  {
    id: "elephantacaves",
    name: { en: "Elephanta Caves & Trimurti Shiva", hi: "एलीफेंटा गुफाएं एवं त्रिमूर्ति शिव" },
    tagline: "UNESCO World Heritage Rock-Cut Island Sanctuary in Mumbai Harbor",
    state: "Maharashtra",
    region: "Western & Central",
    district: "Mumbai / Raigad",
    location: { lat: 18.9633, lng: 72.9315 },
    altitude: "168m",
    sect: "Shaivite Rock-Cut Monolithic Architecture / UNESCO Site",
    founded: "5th–6th Century CE (Konkan Mauryas / Kalachuris)",
    description: {
      en: "Located on Gharapuri Island in Mumbai Harbor, Elephanta Caves contains masterfully carved rock-cut cave temples dedicated to Lord Shiva. The centerpiece is the monumental 20-foot three-headed Sadashiva Trimurti (Creator, Preserver, and Destroyer), considered one of the pinnacles of Indian sculptural art.",
      hi: "मुंबई बंदरगाह के द्वीप पर स्थित एलीफेंटा गुफाएं त्रिमूर्ति शिव की मूर्तिकला के लिए प्रसिद्ध हैं।"
    },
    heroImage: "/images/monasteries/elephantacaves.png",
    offlinePackSize: "44 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open", specialNotice: "Closed on Mondays. Ferry boats operate from Gateway of India." },
    visitingHours: { open: "09:30", close: "17:30", bestTime: "November to March (Ferry ride across Mumbai harbor)", entryFee: { indian: "₹40", foreign: "₹600" } },
    contact: { address: "Gharapuri Island, Raigad District, Maharashtra 400094", phone: "+91 22 2204 4040", steward: "ASI Mumbai Circle" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Mumbai Circle",
      capturedBy: "SYNTAXUS Konkan Unit",
      captureDate: "2024-02-14",
      hotspots: [
        { id: "hs-1", title: "Colossal Sadashiva Trimurti", description: "6-meter high relief representing Aghora, Tatpurusha, and Vamadeva Shiva aspects.", position: { yaw: 0, pitch: 0 } }
      ]
    },
    nearbyServices: [
      { type: "guide", name: "MTDC Licensed Gateway & Island Guides", distance: "Island jetty", approved: true }
    ],
    wikiPage: "Elephanta_Caves"
  },
  {
    id: "raigadfort",
    name: { en: "Raigad Fort (Capital of the Maratha Empire)", hi: "रायगढ़ दुर्ग (मराठा साम्राज्य की राजधानी)" },
    tagline: "Impregnable Clifftop Hill Fortress of Chhatrapati Shivaji Maharaj",
    state: "Maharashtra",
    region: "Western & Central",
    district: "Raigad",
    location: { lat: 18.2347, lng: 73.4411 },
    altitude: "820m",
    sect: "Maratha Military Architecture",
    founded: "1674 CE (Coronation of Chhatrapati Shivaji Maharaj)",
    description: {
      en: "Perched atop the Sahyadri mountains with sheer vertical rock cliffs on all sides, Raigad Fort was chosen by Chhatrapati Shivaji Maharaj as the capital of the Maratha Empire. Key landmarks include the Nagarkhana, Royal Court (Raj Sabha), Shivaji's Samadhi, and the famous Takmak Tok execution point.",
      hi: "सह्याद्रि की चोटियों पर स्थित रायगढ़ दुर्ग छत्रपति शिवाजी महाराज की राजधानी रहा है।"
    },
    heroImage: "/images/monasteries/raigadfort.png",
    offlinePackSize: "42 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "06:00", close: "18:00", bestTime: "Ropeway service available (Sunrise to Sunset)", entryFee: { indian: "₹25", foreign: "₹300" } },
    contact: { address: "Mahad, Raigad District, Maharashtra 402305", phone: "+91 2145 233344", steward: "ASI & MTDC" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Mumbai Circle",
      capturedBy: "SYNTAXUS Sahyadri Survey",
      captureDate: "2024-02-18",
      hotspots: [
        { id: "hs-1", title: "Nagarkhana & Royal Durbar", description: "The grand acoustic royal hall where Chhatrapati Shivaji Maharaj sat on his golden throne.", position: { yaw: 0, pitch: 5 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "MTDC Raigad Ropeway Resort", distance: "Base station", approved: true }
    ],
    wikiPage: "Raigad_Fort"
  },
  {
    id: "kaasplateau",
    name: { en: "Kaas Plateau Valley of Flowers", hi: "कास पठार (फूलों की घाटी)" },
    tagline: "UNESCO World Natural Heritage Biodiversity Hotspot in the Western Ghats",
    state: "Maharashtra",
    region: "Western & Central",
    district: "Satara",
    location: { lat: 17.7208, lng: 73.8181 },
    altitude: "1200m",
    sect: "UNESCO World Natural Heritage Plateau",
    founded: "Natural Basalt Plateau Formation",
    description: {
      en: "Formed of volcanic laterite rock, the Kaas Plateau transforms into a vibrant multicolored floral carpet during August and September. Over 850 species of flowering wild orchids, carnivorous bladderworts, and endemic plants bloom across the 10-sq-km plateau.",
      hi: "सतारा का कास पठार मानसूनी मौसम में लाखों जंगली फूलों से खिल उठता है।"
    },
    heroImage: "/images/monasteries/kaasplateau.png",
    offlinePackSize: "36 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open", specialNotice: "Eco-sensitive zone. Entry passes must be booked online during flowering season." },
    visitingHours: { open: "07:00", close: "18:00", bestTime: "August to October (Peak Floral Bloom)", entryFee: { indian: "₹100", foreign: "₹100" } },
    contact: { address: "Kaas, Satara District, Maharashtra 415013", phone: "+91 2162 234567", steward: "Forest Department Maharashtra & UNESCO Biosphere" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Maharashtra Forest Dept",
      capturedBy: "SYNTAXUS Ecological Unit",
      captureDate: "2024-09-05",
      hotspots: [
        { id: "hs-1", title: "Purple Utricularia Flower Carpet", description: "Vast expanse of endemic violet and yellow wildflowers stretching to the horizon.", position: { yaw: 0, pitch: -15 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Satara Valley Agro Tourism & Lake Resorts", distance: "3 km", approved: true }
    ],
    wikiFile: "File:Kaas_Pathar,_Satara,_Maharashtra,_India_(2018).jpg"
  },

  // Region 4: Southern Kerala & Southern Tamil Nadu
  {
    id: "maduraimeenakshi",
    name: { en: "Meenakshi Amman Temple (Madurai)", hi: "मीनाक्षी अम्मन मंदिर (मदुरै)" },
    tagline: "Historic Dravidian Temple City with 14 Soaring Gopurams & 1000-Pillar Hall",
    state: "Tamil Nadu",
    region: "Southern Peninsula",
    district: "Madurai",
    location: { lat: 9.9195, lng: 78.1193 },
    altitude: "136m",
    sect: "Dravidian Temple Architecture / Nayaka Style",
    founded: "6th Century BCE / Rebuilt 1623–1655 CE (Thirumalai Nayak)",
    description: {
      en: "Standing at the heart of the 2,500-year-old city of Madurai on the Vaigai River, Meenakshi Sundareswarar Temple is one of the grandest temple complexes in the world. Featuring 14 towering multi-tiered gopurams covered in thousands of painted mythological figures, the Golden Lotus Tank (Porthamarai Kulam), and the Hall of Thousand Pillars with carved musical stone pillars.",
      hi: "मदुरै का मीनाक्षी मंदिर अपनी 14 भव्य गोपुरमों और सहस्र स्तंभ मंडप के लिए विश्व प्रसिद्ध है।"
    },
    heroImage: "/images/monasteries/maduraimeenakshi.png",
    offlinePackSize: "48 MB",
    sacredAccessProtocol: { photographyAllowed: "restricted", interiorAccess: "permitted", currentStatus: "open", specialNotice: "Traditional attire mandatory. Mobile phones restricted inside inner sanctum." },
    visitingHours: { open: "05:00", close: "21:30", bestTime: "Evening Chithirai Festival (April/May) & Daily 21:00 Night Palliyarai Pooja", entryFee: { indian: "Free", foreign: "Free" } },
    contact: { address: "Madurai Main, Madurai, Tamil Nadu 625001", phone: "+91 452 234 4360", steward: "HR&CE Dept, Govt of Tamil Nadu" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Temple Trust & HR&CE",
      capturedBy: "SYNTAXUS Dravidian Survey",
      captureDate: "2024-01-20",
      hotspots: [
        { id: "hs-1", title: "Southern Tower Gopuram (52m)", description: "The tallest gopuram adorned with 1,511 vibrant stucco sculptures.", position: { yaw: 0, pitch: 20 } },
        { id: "hs-2", title: "Golden Lotus Tank (Porthamarai Kulam)", description: "Sacred temple pond where the ancient Tamil Sangam tested the literary merit of poems.", position: { yaw: 180, pitch: -10 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Heritage Madurai & The Gateway Hotel Pasumalai", distance: "3 km", approved: true },
      { type: "craft", name: "Madurai Sungudi Saree Weavers Guild", distance: "500m", approved: true },
      { type: "restaurant", name: "Murugan Idli Shop & Famous Jigarthanda", distance: "200m", approved: true }
    ],
    wikiPage: "Meenakshi_Temple"
  },
  {
    id: "fortkochi",
    name: { en: "Fort Kochi & Chinese Fishing Nets", hi: "फोर्ट कोच्चि एवं चीनी मछली पकड़ने के जाल" },
    tagline: "Historic Spice Trade Harbor with Portuguese, Dutch & Malabar Heritage",
    state: "Kerala",
    region: "Southern Peninsula",
    district: "Ernakulam (Kochi)",
    location: { lat: 9.9658, lng: 76.2425 },
    altitude: "4m",
    sect: "Colonial Indo-European & Malabar Spice Trade Heritage",
    founded: "14th Century CE / 1503 CE (Portuguese Fort Emmanuel)",
    description: {
      en: "A historic coastal enclave on the Arabian Sea, Fort Kochi is world-famous for its cantilevered Chinese Fishing Nets (Cheena Vala) introduced in the 14th century, St. Francis Church (where Vasco da Gama was buried), Mattancherry Dutch Palace, and Jew Town spice warehouses.",
      hi: "अरब सागर के तट पर स्थित फोर्ट कोच्चि अपने विशाल चीनी मछली पकड़ने के जालों और मसालों के व्यापार के लिए विख्यात है।"
    },
    heroImage: "/images/monasteries/fortkochi.png",
    offlinePackSize: "40 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "06:00", close: "20:00", bestTime: "Sunset at Fort Kochi beach promenade & Kochi-Muziris Biennale", entryFee: { indian: "Free", foreign: "Free" } },
    contact: { address: "Fort Kochi, Ernakulam, Kerala 682001", phone: "+91 484 221 6171", steward: "Kerala Tourism & Archaeological Survey of India" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Kerala Tourism",
      capturedBy: "SYNTAXUS Malabar Coast Unit",
      captureDate: "2024-01-25",
      hotspots: [
        { id: "hs-1", title: "Cantilevered Chinese Fishing Nets", description: "Massive 20-meter teak wood balance fishing nets lowered into Arabian sea currents at sunset.", position: { yaw: 0, pitch: 0 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Brunton Boatyard & Malabar House", distance: "Promenade", approved: true },
      { type: "craft", name: "Jew Town Spice Traders & Antique Curio Guild", distance: "1.5 km", approved: true }
    ],
    wikiPage: "Fort_Kochi"
  },
  {
    id: "padmanabhaswamy",
    name: { en: "Sree Padmanabhaswamy Temple", hi: "श्री पद्मनाभस्वामी मंदिर" },
    tagline: "Sacred Golden Dravidian-Chera Sanctum of the Travancore Royal Heritage",
    state: "Kerala",
    region: "Southern Peninsula",
    district: "Thiruvananthapuram",
    location: { lat: 8.4830, lng: 76.9436 },
    altitude: "10m",
    sect: "Chera-Dravidian Vaishnavite Temple",
    founded: "8th Century CE (Travancore Royal Dynasty)",
    description: {
      en: "Revered as one of the 108 Divya Desams, Sree Padmanabhaswamy Temple is dedicated to Lord Vishnu reclining in Anantha Shayanam posture on the serpent Adi Shesha. Featuring a 16th-century 100-foot 7-tier Dravidian gopuram, stone pillared corridor (Kulasekhara Mandapam), and Padmatheertham holy pond.",
      hi: "अनंतशयन मुद्रा में भगवान विष्णु को समर्पित पद्मनाभस्वामी मंदिर अपनी अद्वितीय वास्तुकला और आध्यात्मिकता के लिए प्रसिद्ध है।"
    },
    heroImage: "/images/monasteries/padmanabhaswamy.png",
    offlinePackSize: "45 MB",
    sacredAccessProtocol: { photographyAllowed: "restricted", interiorAccess: "permitted", currentStatus: "open", specialNotice: "Traditional Kerala Mundu/Dhoti dress code strictly enforced." },
    visitingHours: { open: "03:30", close: "19:30", bestTime: "Morning Darshan & Sunset reflection on Padmatheertham pond", entryFee: { indian: "Free", foreign: "Free" } },
    contact: { address: "West Nada, Fort, Thiruvananthapuram, Kerala 695023", phone: "+91 471 245 0233", steward: "Executive Committee & Travancore Royal Trust" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Temple Custodians",
      capturedBy: "SYNTAXUS Kerala Field Survey",
      captureDate: "2024-01-28",
      hotspots: [
        { id: "hs-1", title: "7-Tier Eastern Gopuram & Sacred Pond", description: "100-foot Dravidian gopuram reflected in the holy Padmatheertham water tank.", position: { yaw: 0, pitch: 15 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Mascot Hotel & KTDC Heritage Resorts", distance: "2 km", approved: true }
    ],
    wikiPage: "Padmanabhaswamy_Temple"
  },
  {
    id: "kanyakumari",
    name: { en: "Vivekananda Rock Memorial & Kanyakumari", hi: "विवेकानंद रॉक मेमोरियल एवं कन्याकुमारी" },
    tagline: "Sacred Island Memorial at the Triveni Sangam of Three Oceans",
    state: "Tamil Nadu",
    region: "Southern Peninsula",
    district: "Kanyakumari",
    location: { lat: 8.0780, lng: 77.5550 },
    altitude: "5m",
    sect: "National Memorial & Triveni Sangam Confluence",
    founded: "1970 CE (Swami Vivekananda Meditation Seat 1892)",
    description: {
      en: "Standing on a sacred rock island 500 meters offshore where Swami Vivekananda attained spiritual enlightenment in 1892. Flanked by the colossal 133-foot stone statue of Tamil poet-philosopher Thiruvalluvar at the southern tip of India where the Arabian Sea, Bay of Bengal, and Indian Ocean merge.",
      hi: "भारत के दक्षिणी छोर पर तीन महासागरों के संगम पर स्थित स्वामी विवेकानंद का स्मारक।"
    },
    heroImage: "/images/monasteries/kanyakumari.png",
    offlinePackSize: "38 MB",
    sacredAccessProtocol: { photographyAllowed: "permitted", interiorAccess: "permitted", currentStatus: "open" },
    visitingHours: { open: "08:00", close: "16:30", bestTime: "Sunrise and Sunset over the three oceans", entryFee: { indian: "₹20 (Ferry ₹50)", foreign: "₹20 (Ferry ₹50)" } },
    contact: { address: "Vivekanandapuram, Kanyakumari, Tamil Nadu 629702", phone: "+91 4652 246250", steward: "Vivekananda Kendra Kendra Trust" },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Vivekananda Kendra",
      capturedBy: "SYNTAXUS Southern Tip Unit",
      captureDate: "2024-01-30",
      hotspots: [
        { id: "hs-1", title: "Vivekananda Mandapam & Dhyana Mandapam", description: "Central meditation hall perched on the rocky oceanic island.", position: { yaw: 0, pitch: 5 } },
        { id: "hs-2", title: "133-Foot Thiruvalluvar Statue", description: "Colossal stone statue representing the 133 chapters of the Tirukkural.", position: { yaw: 90, pitch: 10 } }
      ]
    },
    nearbyServices: [
      { type: "hotel", name: "Hotel Sea View & TTDC Tamil Nadu Hotel", distance: "Shoreline", approved: true }
    ],
    wikiPage: "Vivekananda_Rock_Memorial"
  }
];

function fetchWikiThumbnail(title) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1600`;
    https.get(url, { headers: { 'User-Agent': 'SYNTAXUS-Atlas-Real-Landmarks/3.0 (contact@syntaxus.org)' } }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const page = Object.values(json.query.pages || {})[0];
          resolve(page?.thumbnail?.source || null);
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
  console.log(`Ingesting ${newLandmarks.length} new iconic landmarks across empty map regions...`);
  
  // 1. Download verified Wikipedia photographs
  for (const lm of newLandmarks) {
    const dest = path.join(destDir, `${lm.id}.png`);
    try {
      await delay(800);
      let imgUrl = null;
      if (lm.wikiPage) {
        imgUrl = await fetchWikiThumbnail(lm.wikiPage);
      }
      if (!imgUrl && lm.wikiFile) {
        imgUrl = await fetchWikiThumbnail(lm.wikiFile);
      }
      if (imgUrl) {
        await delay(800);
        const sz = await downloadSafe(imgUrl, dest);
        console.log(`✓ Real Photo [${lm.id}.png] -> ${lm.name.en} (${(sz / 1024).toFixed(1)} KB)`);
      } else {
        console.warn(`! Missing image URL for [${lm.id}]`);
      }
    } catch (e) {
      console.warn(`! Error downloading [${lm.id}]:`, e.message);
    }
  }

  // 2. Add to monasteries.json
  const monasteries = JSON.parse(fs.readFileSync(monasteriesPath, 'utf-8'));
  for (const lm of newLandmarks) {
    const cleanLm = { ...lm };
    delete cleanLm.wikiPage;
    delete cleanLm.wikiFile;

    const idx = monasteries.findIndex(m => m.id === lm.id);
    if (idx >= 0) monasteries[idx] = cleanLm;
    else monasteries.push(cleanLm);
  }
  fs.writeFileSync(monasteriesPath, JSON.stringify(monasteries, null, 2), 'utf-8');
  console.log(`✓ monasteries.json updated! Total active landmarks: ${monasteries.length}`);

  // 3. Add 4 New Multi-Stop Circuits to trails.json
  const trails = JSON.parse(fs.readFileSync(trailsPath, 'utf-8'));
  
  const newCircuits = [
    {
      id: "mewar-malwa-citadels",
      name: { en: "Mewar & Malwa Royal Citadel Circuit", hi: "मेवाड़ एवं मालवा शाही दुर्ग सर्किट" },
      description: "Experience the pinnacle of Rajput chivalry and Malwa Afghan romance across Udaipur's Lake Palace, Asia's largest fortress of Chittorgarh, and the floating palace of Mandu.",
      region: "Western & Central",
      difficulty: "Moderate",
      totalDistance: "310 km (Heritage Highway NH-48 & NH-52)",
      estimatedTime: "4 Days",
      featured: true,
      monasteries: ["udaipurpalace", "chittorgarh", "mandu"],
      theme: "Royal Palaces, Impregnable Hilltop Fortresses & Lake Reflections",
      highlights: ["Udaipur Mor Chowk glass peacock courtyard", "Chittorgarh 9-story carved Vijay Stambha", "Mandu Jahaz Mahal floating between two lakes"],
      bestSeason: "October to March",
      waypoints: [
        { monasteryId: "udaipurpalace", order: 1, distanceFromPrev: "Start at Udaipur Airport", timeFromPrev: "Day 1" },
        { monasteryId: "chittorgarh", order: 2, distanceFromPrev: "115 km", timeFromPrev: "2 hrs Drive" },
        { monasteryId: "mandu", order: 3, distanceFromPrev: "195 km", timeFromPrev: "3.5 hrs Drive" }
      ]
    },
    {
      id: "chhattisgarh-heritage-waterfalls",
      name: { en: "Chhattisgarh Sacred Temples & Tribal Waterfalls Circuit", hi: "छत्तीसगढ़ पावन मंदिर एवं बस्तर जलप्रपात सर्किट" },
      description: "Explore Central India's hidden marvels: the 11th-century carved stone temple of Bhoramdeo, ancient 7th-century brick Mahavihara of Sirpur, and India's widest waterfall at Chitrakote in Bastar.",
      region: "Eastern Corridors",
      difficulty: "Moderate",
      totalDistance: "390 km (Raipur Central Transit Hub)",
      estimatedTime: "4 Days",
      featured: true,
      monasteries: ["bhoramdeo", "sirpur", "chitrakote"],
      theme: "Ancient Terracotta Brick Temples, Forest Sanctuaries & Tribal Waterfalls",
      highlights: ["Bhoramdeo 11th-century Nagara temple in Maikal hills", "Sirpur 7th-century brick Lakshmana temple & Buddhist Vihara", "Chitrakote 300m horseshoe waterfall gorge in Bastar"],
      bestSeason: "July to February (Peak monsoon for waterfalls)",
      waypoints: [
        { monasteryId: "bhoramdeo", order: 1, distanceFromPrev: "135 km from Raipur", timeFromPrev: "Day 1" },
        { monasteryId: "sirpur", order: 2, distanceFromPrev: "160 km", timeFromPrev: "3 hrs Drive" },
        { monasteryId: "chitrakote", order: 3, distanceFromPrev: "260 km via Jagdalpur", timeFromPrev: "4.5 hrs Drive" }
      ]
    },
    {
      id: "sahyadri-konkan-maratha",
      name: { en: "Sahyadri & Konkan Maratha Heritage Circuit", hi: "सह्याद्रि एवं कोंकण मराठा विरासत सर्किट" },
      description: "A breathtaking journey across western Maharashtra: Mumbai Harbor's 6th-century Elephanta Trimurti, Chhatrapati Shivaji's clifftop capital fortress of Raigad, and the UNESCO Kaas Plateau flower carpet.",
      region: "Western & Central",
      difficulty: "Moderate",
      totalDistance: "260 km (Mumbai – Konkan – Satara)",
      estimatedTime: "3 Days",
      featured: true,
      monasteries: ["elephantacaves", "raigadfort", "kaasplateau"],
      theme: "UNESCO Rock Caves, Mountain Citadels & High-Altitude Floral Plateaus",
      highlights: ["Elephanta 20-foot monolithic Trimurti Shiva sculpture", "Raigad Fort acoustic royal court & coronation throne", "Kaas Plateau 850+ blooming wildflower species"],
      bestSeason: "August to March (Monsoon for flowers, Winter for forts)",
      waypoints: [
        { monasteryId: "elephantacaves", order: 1, distanceFromPrev: "Gateway of India Ferry", timeFromPrev: "Day 1 Morning" },
        { monasteryId: "raigadfort", order: 2, distanceFromPrev: "140 km via Mumbai-Goa Highway", timeFromPrev: "3 hrs Drive" },
        { monasteryId: "kaasplateau", order: 3, distanceFromPrev: "120 km via Mahabaleshwar", timeFromPrev: "2.5 hrs Drive" }
      ]
    },
    {
      id: "southern-tip-malabar-circuit",
      name: { en: "Southern Tip & Malabar Spice Coast Circuit", hi: "दक्षिणी छोर एवं मालाबार स्पाइस कोस्ट सर्किट" },
      description: "From the Dutch and Portuguese spice trading alleys of Fort Kochi and the sacred golden sanctum of Padmanabhaswamy in Kerala, to the oceanic confluence of Kanyakumari and the 14 soaring gopurams of Madurai Meenakshi.",
      region: "Southern Peninsula",
      difficulty: "Easy",
      totalDistance: "380 km (Coastal Scenic Railway & Highway)",
      estimatedTime: "5 Days",
      featured: true,
      monasteries: ["fortkochi", "padmanabhaswamy", "kanyakumari", "maduraimeenakshi"],
      theme: "Ancient Dravidian Temple Cities, Ocean Confluences & Spice Route Harbors",
      highlights: ["Fort Kochi iconic cantilevered Chinese Fishing Nets", "Padmanabhaswamy 7-tier golden Gopuram & Anantha Shayanam", "Vivekananda Rock Memorial at the three ocean confluence", "Madurai Meenakshi 1,000-pillar hall & musical stone pillars"],
      bestSeason: "October to March",
      waypoints: [
        { monasteryId: "fortkochi", order: 1, distanceFromPrev: "Start in Kochi Harbor", timeFromPrev: "Day 1" },
        { monasteryId: "padmanabhaswamy", order: 2, distanceFromPrev: "200 km via Varkala", timeFromPrev: "4 hrs Train/Drive" },
        { monasteryId: "kanyakumari", order: 3, distanceFromPrev: "90 km", timeFromPrev: "2 hrs Drive" },
        { monasteryId: "maduraimeenakshi", order: 4, distanceFromPrev: "240 km via NH-44", timeFromPrev: "4 hrs Drive" }
      ]
    }
  ];

  for (const nc of newCircuits) {
    const idx = trails.findIndex(t => t.id === nc.id);
    if (idx >= 0) trails[idx] = nc;
    else trails.push(nc);
  }
  fs.writeFileSync(trailsPath, JSON.stringify(trails, null, 2), 'utf-8');
  console.log(`✓ trails.json updated! Total circuits: ${trails.length}`);
}

main();
