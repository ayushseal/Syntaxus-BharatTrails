import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const monasteriesPath = path.resolve(__dirname, '../src/data/monasteries.json');

const newMonuments = [
  {
    id: "ramappa",
    name: {
      en: "Ramappa (Rudreshwara) Temple (UNESCO)",
      hi: "रामप्पा (रुद्रेश्वर) मंदिर (यूनेस्को)"
    },
    tagline: "13th-Century Kakatiya Sandbox & Floating-Brick Architectural Wonder",
    state: "Telangana",
    region: "Southern Peninsula",
    district: "Mulugu / Warangal",
    location: {
      lat: 18.2589,
      lng: 79.9431
    },
    altitude: "210m",
    sect: "Kakatiya Dynasty / Shaivite Vesara Architecture",
    founded: "1213 CE (Recharla Rudra / Kakatiya Ganapati Deva)",
    description: {
      en: "Inscribed as a UNESCO World Heritage site, the Ramappa Temple stands on a 6-foot star-shaped platform with revolutionary earthquake-resistant sandbox foundations and lightweight floating porous bricks. Its walls feature exquisite black basalt dancing bracket figures (Madanikas) that produce musical notes when struck.",
      hi: "यूनेस्को विश्व धरोहर रामप्पा मंदिर अपनी अनूठी सैंडबॉक्स तकनीक, तैरती ईंटों और काले बेसाल्ट के सजीव नृत्य शिल्पों के लिए विख्यात है।"
    },
    heroImage: "/images/monasteries/ramappa.png",
    offlinePackSize: "44 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Active living temple; remove footwear before ascending the star-shaped stone plinth."
    },
    visitingHours: {
      open: "06:00",
      close: "18:00",
      lunchBreak: null,
      closedDays: [],
      bestTime: "Morning (07:00–10:30) for morning sunrays illuminating the 12 carved black basalt dancing bracket figures",
      peakSeason: "October to March (Maha Shivaratri & Kakatiya Heritage Festival)",
      entryFee: {
        indian: "₹25 (Online: ₹20)",
        foreign: "₹300"
      },
      notes: "UNESCO World Heritage site located 65 km from Warangal beside Ramappa Lake. Children below 15 enter free."
    },
    contact: {
      address: "Palampet Village, Venkatapur Mandal, Mulugu District, Telangana 506345",
      phone: "+91 8717 288344",
      steward: "Archaeological Survey of India (Hyderabad Circle) & Ramappa Temple Trust"
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Hyderabad Circle",
      capturedBy: "SYNTAXUS Deccan Field Unit",
      captureDate: "2024-03-25",
      hotspots: [
        {
          id: "hs-1",
          title: "Star-Shaped Plinth & Carved Basalt Madanikas",
          description: "Intricately polished black basalt bracket figures showcasing classical Kakatiya dance postures and jewelry.",
          position: { yaw: 0, pitch: 10 }
        }
      ]
    },
    oralHistories: [
      {
        id: "oh-ramappa",
        title: "The Genius of Sculptor Ramappa & the Floating Bricks",
        narrator: "Dr. B. Satyanarayana (Kakatiya Epigraphist)",
        source: "monastery-approved",
        type: "oral-history",
        language: "Telugu & English",
        era: "1213 CE",
        excerpt: "Unlike most monuments named after kings or gods, this temple is uniquely named after its chief architect Ramappa, whose porous clay bricks were engineered to float on water..."
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "Haritha Kakatiya Heritage Resort Palampet", distance: "800m", approved: true },
      { type: "craft", name: "Warangal Brass & Dhokra Metalcraft Cooperative", distance: "1.2 km", approved: true },
      { type: "guide", name: "Telangana Certified Kakatiya Heritage Guides Guild", distance: "At Entrance", approved: true }
    ]
  },
  {
    id: "golgumbaz",
    name: {
      en: "Gol Gumbaz & Ibrahim Rauza (Vijayapura)",
      hi: "गोल गुंबज़ एवं इब्राहिम रौज़ा (विजयपुर)"
    },
    tagline: "World's 2nd-Largest Unsupported Acoustic Whispering Dome (1656 CE)",
    state: "Karnataka",
    region: "Southern Peninsula",
    district: "Vijayapura (Bijapur)",
    location: {
      lat: 16.8306,
      lng: 75.7356
    },
    altitude: "593m",
    sect: "Adil Shahi Deccan Indo-Islamic Architecture",
    founded: "1656 CE (Sultan Mohammed Adil Shah)",
    description: {
      en: "The mausoleum of Mohammed Adil Shah boasts the world's second-largest dome ever constructed without central pillar support (44 meters in diameter). Its upper whispering gallery echoes the faintest whisper 11 times across a 38-meter circular acoustic hall.",
      hi: "आदिल शाही वास्तुकला का अनुपम उदाहरण, जिसका 44 मीटर का विशाल गुंबद बिना किसी खंभे के टिका है और 11 बार प्रतिध्वनि उत्पन्न करता है।"
    },
    heroImage: "/images/monasteries/golgumbaz.png",
    offlinePackSize: "42 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Climb the 7-storied octagonal corner minarets to reach the acoustic Whispering Gallery."
    },
    visitingHours: {
      open: "06:00",
      close: "18:00",
      lunchBreak: null,
      closedDays: [],
      bestTime: "Early morning (06:30–09:00) before crowds to experience the 11-echo Acoustic Whispering Gallery",
      peakSeason: "October to March (Navaraspur National Music & Cultural Festival in February)",
      entryFee: {
        indian: "₹40 (Online: ₹35)",
        foreign: "₹600"
      },
      notes: "ASI Archaeological Museum inside the Naqqar Khana open 09:00–17:00 (Closed Fridays, ticket ₹5). Children below 15 free."
    },
    contact: {
      address: "Station Road, Vijayapura, Karnataka 586101",
      phone: "+91 8352 250143",
      steward: "Archaeological Survey of India (Dharwad Circle)"
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Dharwad Circle",
      capturedBy: "SYNTAXUS Karnataka Field Unit",
      captureDate: "2024-03-24",
      hotspots: [
        {
          id: "hs-1",
          title: "The Whispering Gallery Dome",
          description: "Massive 44m unsupported acoustic dome resting on intersecting petal arches without pillars.",
          position: { yaw: 0, pitch: 20 }
        }
      ]
    },
    oralHistories: [
      {
        id: "oh-golgumbaz",
        title: "Acoustics of the Adil Shahi Builders",
        narrator: "Prof. Farooqui (Deccan Architectural Historian)",
        source: "monastery-approved",
        type: "oral-history",
        language: "Urdu & English",
        era: "1656 CE",
        excerpt: "The master builder Yaqut of Dabul engineered the interlocking pendentive arches so that acoustic reflections could reverberate across the hall without dampening..."
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "KSTDC Hotel Mayura Adil Shahi Bijapur", distance: "600m", approved: true },
      { type: "craft", name: "Vijayapura Ilkal Handloom Saree Weavers Collective", distance: "1.5 km", approved: true },
      { type: "guide", name: "Deccan Sultanate Certified Heritage Tour Guides", distance: "At Gate", approved: true }
    ]
  },
  {
    id: "bidar",
    name: {
      en: "Bidar Fort & Mahmud Gawan Madrasa",
      hi: "बीदर क़िला एवं महमूद गवां मदरसा"
    },
    tagline: "15th-Century Bahmani Triple-Moated Citadel & Bidri Metalcraft Capital",
    state: "Karnataka",
    region: "Southern Peninsula",
    district: "Bidar",
    location: {
      lat: 17.9272,
      lng: 77.5317
    },
    altitude: "670m",
    sect: "Bahmani & Barid Shahi Sultanate Architecture",
    founded: "1427 CE (Sultan Ahmad Shah I Wali)",
    description: {
      en: "Perched on a red laterite plateau, Bidar Fort is famed for its triple-layered defensive moats, Persian glazed-tile Tarkash Mahal, mother-of-pearl inlaid Rangin Mahal, and the 1472 CE Mahmud Gawan Islamic University with its towering minaret.",
      hi: "लाल लेटराइट पठार पर निर्मित बीदर क़िला अपनी त्रिस्तरीय खाइयों, रंगीन महल और बिदरी हस्तशिल्प की ऐतिहासिक राजधानी के रूप में विख्यात है।"
    },
    heroImage: "/images/monasteries/bidar.png",
    offlinePackSize: "40 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Wear comfortable walking shoes for traversing the 3-km fortress battlements and Karez water system."
    },
    visitingHours: {
      open: "08:00",
      close: "18:00",
      lunchBreak: null,
      closedDays: [],
      bestTime: "Late afternoon (15:00–17:30) for golden sunrays illuminating Rangin Mahal mother-of-pearl woodwork",
      peakSeason: "October to March (Bidar Utsav in January & cool plateau winds)",
      entryFee: {
        indian: "Free",
        foreign: "Free"
      },
      notes: "ASI Protected Monument. Houses the historic Karez subterranean Persian water aqueduct system."
    },
    contact: {
      address: "Old City Fort Area, Bidar, Karnataka 585401",
      phone: "+91 8482 226242",
      steward: "Archaeological Survey of India (Dharwad Circle)"
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Dharwad Circle",
      capturedBy: "SYNTAXUS Karnataka Field Unit",
      captureDate: "2024-03-24",
      hotspots: [
        {
          id: "hs-1",
          title: "Rangin Mahal & Persian Mother-of-Pearl Inlay",
          description: "Royal residential quarters featuring vibrant Persian tiles and teakwood pillars inlaid with iridescent sea shells.",
          position: { yaw: 0, pitch: 0 }
        }
      ]
    },
    oralHistories: [
      {
        id: "oh-bidar",
        title: "The Karez Aqueducts & Bidri Silver Inlay Art",
        narrator: "Shahid Ali (National Master Craftsperson, Bidriware)",
        source: "monastery-approved",
        type: "oral-history",
        language: "Kannada & English",
        era: "1427 CE",
        excerpt: "Bidriware was born here when Persian artisans combined zinc and copper with special soil from Bidar Fort to create jet-black metal inlaid with pure silver..."
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "KSTDC Hotel Mayura Barid Shahi Bidar", distance: "900m", approved: true },
      { type: "craft", name: "Bidriware Silver Inlay Artisans Guild & Master Workshop", distance: "500m", approved: true }
    ]
  },
  {
    id: "ramtek",
    name: {
      en: "Ramtek Gad Mandir & Nagardhan Fort",
      hi: "रामटेक गढ़ मंदिर एवं नगरधन क़िला"
    },
    tagline: "Hilltop Citadel of Kalidasa's Meghaduta & 4th-Century Vakataka Capital",
    state: "Maharashtra",
    region: "Western & Central",
    district: "Nagpur",
    location: {
      lat: 21.3986,
      lng: 79.3325
    },
    altitude: "345m",
    sect: "Vakataka & Yadava Dynasties / Hemadpanthi Stone Architecture",
    founded: "4th Century CE (Queen Prabhavatigupta / Vakataka Dynasty)",
    description: {
      en: "Crowning a scenic hill 50 km northeast of Nagpur, Ramtek is the sacred hill where the great Sanskrit poet Kalidasa composed his immortal lyric poem Meghaduta. The hilltop citadel features 4th-century Vakataka shrines and 14th-century Hemadpanthi stone fortresses overlooking Ambala Lake.",
      hi: "महाकवि कालिदास की मेघदूत रचना की प्रेरणा स्थली और वाकाटक राजवंश की ऐतिहासिक राजधानी रामटेक।"
    },
    heroImage: "/images/monasteries/ramtek.png",
    offlinePackSize: "38 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Stone stairway and motorable road both lead to the summit temple complex."
    },
    visitingHours: {
      open: "06:00",
      close: "20:00",
      lunchBreak: null,
      closedDays: [],
      bestTime: "Sunrise (06:00–08:30) with panoramic views over Ambala Lake & Satpura hill forests",
      peakSeason: "November to March (Kalidasa Samaroh in November & Kartik Tripuri Purnima Mela)",
      entryFee: {
        indian: "Free",
        foreign: "Free"
      },
      notes: "Historic hill mentioned in the Ramayana as Ramagiri. Connected to Nagardhan Vakataka archaeological excavation site."
    },
    contact: {
      address: "Ramgiri Hill, Ramtek, Nagpur District, Maharashtra 441106",
      phone: "+91 7114 255122",
      steward: "Ramtek Gad Mandir Devasthan & Maharashtra State Archaeology"
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Ramtek Devasthan",
      capturedBy: "SYNTAXUS Vidarbha Field Unit",
      captureDate: "2024-03-22",
      hotspots: [
        {
          id: "hs-1",
          title: "Ramtek Hilltop Fort & Kalidasa Smarak",
          description: "High stone bastions overlooking Ambala Lake where Kalidasa wrote the cloud messenger Meghaduta.",
          position: { yaw: 0, pitch: 0 }
        }
      ]
    },
    oralHistories: [
      {
        id: "oh-ramtek",
        title: "The Cloud Messenger of Ramagiri Hill",
        narrator: "Dr. Arvind Gadgil (Sanskrit & Vidarbha Historian)",
        source: "monastery-approved",
        type: "oral-history",
        language: "Marathi & English",
        era: "400 CE",
        excerpt: "When the Yaksha was exiled from Alakapuri, he stood upon this very hill of Ramagiri and addressed the monsoon cloud moving northwards..."
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "MTDC Resort Ramtek Lakeview", distance: "1.5 km", approved: true },
      { type: "craft", name: "Nagpur Silk Weaving & Orange Blossom Artisans Guild", distance: "2 km", approved: true }
    ]
  },
  {
    id: "panhala",
    name: {
      en: "Panhala Fort & Sajja Kothi",
      hi: "पन्हाळा क़िला एवं सज्जा कोठी"
    },
    tagline: "Strategic Maratha Hilltop Fortress & Chhatrapati Shivaji Maharaj's Escape Citadel",
    state: "Maharashtra",
    region: "Western & Central",
    district: "Kolhapur",
    location: {
      lat: 16.8122,
      lng: 74.1189
    },
    altitude: "845m",
    sect: "Shilahara & Maratha Military Fort Architecture",
    founded: "1178 CE (Raja Bhoja II / Maratha Expansion 1673 CE)",
    description: {
      en: "Panhala is the largest hill fort in the Deccan with a 7-kilometer perimeter wall rising 845 meters above sea level. Famed for Chhatrapati Shivaji Maharaj's daring monsoon siege escape to Vishalgad in 1660 CE, it features massive double-walled Teen Darwaza, the Sajja Kothi royal pavilion, and subterranean granaries.",
      hi: "दक्कन का सबसे विशाल गिरिदुर्ग जहां छत्रपति शिवाजी महाराज ने सिद्धी जौहर की घेराबंदी से ऐतिहासिक पलायन किया था।"
    },
    heroImage: "/images/monasteries/panhala.png",
    offlinePackSize: "36 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Scenic hill station with pleasant cool weather; vehicles permitted up to fort plateau."
    },
    visitingHours: {
      open: "06:00",
      close: "18:30",
      lunchBreak: null,
      closedDays: [],
      bestTime: "Morning (07:00–10:00) & Sunset from Sajja Kothi overlooking Sahyadri mountain valleys",
      peakSeason: "July to February (Monsoon waterfalls & cool winter plateau breezes)",
      entryFee: {
        indian: "Free",
        foreign: "Free"
      },
      notes: "Located 20 km northwest of Kolhapur. Features the Ambarkhana three-compartment royal granary holding 25,000 khandis of grain."
    },
    contact: {
      address: "Panhala Hill, Kolhapur District, Maharashtra 416201",
      phone: "+91 231 2654321",
      steward: "Archaeological Survey of India (Mumbai Circle) & Maharashtra Tourism"
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Mumbai Circle",
      capturedBy: "SYNTAXUS Maharashtra Field Unit",
      captureDate: "2024-03-22",
      hotspots: [
        {
          id: "hs-1",
          title: "Teen Darwaza & Sajja Kothi Battlements",
          description: "Massive double-arched defense gateway and two-storied Mughal-styled observation pavilion overlooking the Konkan pass.",
          position: { yaw: 0, pitch: 0 }
        }
      ]
    },
    oralHistories: [
      {
        id: "oh-panhala",
        title: "The Midnight Escape to Vishalgad",
        narrator: "Babasaheb Purandare (Maratha Historical Chronicler)",
        source: "monastery-approved",
        type: "oral-history",
        language: "Marathi & English",
        era: "1660 CE",
        excerpt: "On a dark, stormy monsoon night in July 1660, Shiva Kashid disguised himself as Shivaji Maharaj while the real king led 600 brave warriors through the dense forest ravine..."
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "MTDC Holiday Resort Panhala", distance: "500m", approved: true },
      { type: "craft", name: "Kolhapuri Chappal Leather Artisans Cooperative", distance: "18 km", approved: true }
    ]
  },
  {
    id: "undavalli",
    name: {
      en: "Undavalli Rock-Cut Caves & Amaravati",
      hi: "उंदावल्ली गुफाएं एवं अमरावती महाचैत्य"
    },
    tagline: "7th-Century 4-Tier Monolithic Rock-Cut Temple & Anantasayana Vishnu",
    state: "Andhra Pradesh",
    region: "Southern Peninsula",
    district: "Guntur / Vijayawada",
    location: {
      lat: 16.4967,
      lng: 80.5806
    },
    altitude: "45m",
    sect: "Vishnukundin & Satavahana Rock-Cut Cave Architecture",
    founded: "7th Century CE (Vishnukundin Dynasty)",
    description: {
      en: "Carved into a solid sandstone hillside overlooking the Krishna River delta, Undavalli is a monumental 4-storey rock-cut cave temple. Its third-floor pillared mandapa enshrines a colossal 5-meter monolithic sculpture of Lord Vishnu reclining on the serpent Shesha (Anantasayana).",
      hi: "कृष्णा नदी के तट पर बलुआ पत्थर की पहाड़ी को तराश कर बनाई गई 4 मंजिला अखंड गुफा, जिसमें 5 मीटर की शेषशायी विष्णु की विशाल प्रतिमा है।"
    },
    heroImage: "/images/monasteries/undavalli.png",
    offlinePackSize: "40 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Stone staircases connect all four cave levels with safety railings."
    },
    visitingHours: {
      open: "09:00",
      close: "17:30",
      lunchBreak: null,
      closedDays: [],
      bestTime: "Morning (09:30–12:00) when sunlight illuminates the third-tier reclining Anantasayana Vishnu",
      peakSeason: "October to March (Krishna River Pushkaram & pleasant winter breezes)",
      entryFee: {
        indian: "₹25",
        foreign: "₹300"
      },
      notes: "ASI Protected Monument located 6 km from Vijayawada city across the Prakasam Barrage. Children below 15 enter free."
    },
    contact: {
      address: "Undavalli Village, Tadepalle Mandal, Guntur District, Andhra Pradesh 522501",
      phone: "+91 863 2234567",
      steward: "Archaeological Survey of India (Amaravati Circle)"
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Amaravati Circle",
      capturedBy: "SYNTAXUS Andhra Field Unit",
      captureDate: "2024-03-24",
      hotspots: [
        {
          id: "hs-1",
          title: "Colossal Anantasayana Vishnu (3rd Tier)",
          description: "5-meter monolithic reclining Vishnu resting on the cosmic serpent Sheshanaga carved from solid living sandstone.",
          position: { yaw: 0, pitch: 0 }
        }
      ]
    },
    oralHistories: [
      {
        id: "oh-undavalli",
        title: "From Buddhist Vihara to Vishnukundin Sanctuary",
        narrator: "Dr. K. Seshadri (Amaravati Archaeological Historian)",
        source: "monastery-approved",
        type: "oral-history",
        language: "Telugu & English",
        era: "650 CE",
        excerpt: "These caves began as Buddhist rock-cut monasteries during the Satavahana era before Vishnukundin master sculptors transformed them into this grand multi-tiered Hindu sanctuary..."
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "APTDC Haritha Berm Park Vijayawada", distance: "4 km", approved: true },
      { type: "craft", name: "Kondapalli Wooden Toy Artisans Village Guild", distance: "15 km", approved: true },
      { type: "guide", name: "Amaravati Heritage Shuttle & Guide Bureau", distance: "At Entrance", approved: true }
    ]
  }
];

function updateMonasteries() {
  const list = JSON.parse(fs.readFileSync(monasteriesPath, 'utf-8'));
  for (const item of newMonuments) {
    const idx = list.findIndex(m => m.id === item.id);
    if (idx >= 0) {
      list[idx] = item;
    } else {
      list.push(item);
    }
  }
  fs.writeFileSync(monasteriesPath, JSON.stringify(list, null, 2), 'utf-8');
  console.log(`✓ Added 6 new Central-Deccan monuments! Total landmarks now: ${list.length}`);
}

updateMonasteries();
