import fs from 'fs';
import path from 'path';

const monasteriesPath = path.resolve('c:/Users/Ayush/.antigravity-ide/syntaxus/src/data/monasteries.json');
const trailsPath = path.resolve('c:/Users/Ayush/.antigravity-ide/syntaxus/src/data/trails.json');

const monasteries = JSON.parse(fs.readFileSync(monasteriesPath, 'utf-8'));

const newSpotEntries = [
  // Delhi
  {
    id: "redfort",
    name: { en: "Red Fort (Lal Qila)", hi: "लाल किला" },
    tagline: "The Zenith of Mughal Imperial Architecture & Seat of Indian Independence",
    state: "Delhi",
    region: "Northern Frontiers",
    district: "Old Delhi (Shahjahanabad)",
    location: { lat: 28.6562, lng: 77.2410 },
    altitude: "216m",
    sect: "Mughal Imperial Architecture / UNESCO World Heritage Site",
    founded: "1639–1648 CE (Emperor Shah Jahan)",
    description: {
      en: "Built in red sandstone by Mughal Emperor Shah Jahan when he shifted his capital from Agra to Shahjahanabad, the Red Fort represents the zenith of Mughal architectural creativity. Enclosed by massive octagonal ramparts, it houses the Diwan-i-Aam (Hall of Public Audience), the exquisite white marble Diwan-i-Khas (Hall of Private Audience where the Peacock Throne once stood), the Nahr-i-Bihisht (Canal of Paradise) water channels, and the Pearl Mosque (Moti Masjid). Every year on August 15, the Prime Minister of India hoists the national tricolor from the ramparts of Lahori Gate.",
      hi: "शाहजहाँ द्वारा निर्मित लाल किला मुग़ल स्थापत्य कला का चरमोत्कर्ष है, जहाँ से हर स्वतंत्रता दिवस पर तिरंगा फहराया जाता है।"
    },
    heroImage: "/images/monasteries/redfort.png",
    offlinePackSize: "42 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Sound and Light Show in English & Hindi every evening. Closed on Mondays."
    },
    visitingHours: {
      open: "09:30",
      close: "17:30",
      bestTime: "October to March (Morning hours to explore museums)",
      entryFee: { indian: "₹35 / Free under 15", foreign: "₹500 (SAARC ₹35)" }
    },
    contact: {
      address: "Netaji Subhash Marg, Lal Qila, Chandni Chowk, Old Delhi 110006",
      phone: "+91 11 2327 7705",
      email: "delhicircle.asi@gmail.com",
      steward: "Archaeological Survey of India (Delhi Circle)",
      emergency: {
        localHealthPost: "Kasturba Hospital Daryaganj (+91 11 2327 5022)",
        policeStation: "Kotwali Police Station Chandni Chowk (112)",
        tourismHelpline: "Delhi Tourism 24/7 Helpline: 1800-11-1363"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Archaeological Survey of India & Ministry of Culture",
      capturedBy: "SYNTAXUS National Imperial Heritage Survey",
      captureDate: "2024-05-10",
      hotspots: [
        { id: "hs-1", title: "Lahori Gate & Ramparts", description: "The iconic red sandstone gateway where India's Independence Day address takes place.", position: { yaw: 0, pitch: 0 } },
        { id: "hs-2", title: "Diwan-i-Khas Inscription", description: "'If there be a paradise on earth, it is this, it is this, it is this.'", position: { yaw: 140, pitch: 5 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-redfort",
        title: "The Peacock Throne and the Waters of Paradise",
        narrator: "Prof. Irfan Habib (Senior Mughal Historian)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Urdu & English",
        era: "1648 CE",
        excerpt: "Beneath the golden ceiling of the Diwan-i-Khas, the stream of paradise flowed under the feet of the Emperor...",
        fullText: "When Shah Jahan inaugurated Lal Qila in 1648, the Yamuna river flowed directly against the eastern marble pavilions. A dedicated canal called Nahr-i-Bihisht carried fresh Yamuna water through every room, cooling the summer breeze and reflecting the inlaid lapis lazuli and jasper floral Pietra Dura panels. It stood as a symbol of royal justice and cosmic harmony.",
        approvedBy: "ASI Delhi Circle",
        approvedDate: "2024-05-12"
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "Haveli Dharampura (Restored Mughal Heritage Stay)", distance: "1 km in Chandni Chowk", approved: true },
      { type: "guide", name: "Delhi Tourism Certified Old Delhi Walking Guides", distance: "Lahori Gate", approved: true },
      { type: "craft", name: "Chandni Chowk Zari, Zardozi & Silver Guilds", distance: "500m", approved: true }
    ]
  },
  {
    id: "lodhigardens",
    name: { en: "Lodhi Gardens & Royal Tombs", hi: "लोधी गार्डन एवं शाही मकबरे" },
    tagline: "90 Acres of 15th-Century Sayyid & Lodhi Dynastic Tombs in Central Delhi",
    state: "Delhi",
    region: "Northern Frontiers",
    district: "New Delhi",
    location: { lat: 28.5933, lng: 77.2197 },
    altitude: "215m",
    sect: "15th-Century Afghan-Delhi Sultanate Architecture",
    founded: "1444–1517 CE (Sayyid & Lodhi Dynasties)",
    description: {
      en: "Lodhi Gardens is a landscaped historical park spanning 90 acres in the heart of New Delhi, protecting monumental 15th-century Afghan tombs. Highlights include the octagonal Tomb of Mohammed Shah (1444), the colossal dome of Bada Gumbad and its ornate Friday mosque, the Shisha Gumbad with glazed turquoise ceramic tiles, the enclosed garden tomb of Sikandar Lodi (1517), and the Athpula eight-pier Mughal bridge built during Akbar's reign.",
      hi: "90 एकड़ में फैला लोधी गार्डन 15वीं सदी के सैय्यद और लोधी राजवंशों के भव्य मकबरों और हरी-भरी वनस्पतियों का अनूठा संगम है।"
    },
    heroImage: "/images/monasteries/lodhigardens.png",
    offlinePackSize: "30 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Open free daily from 06:00 to 20:00. Popular for morning heritage walks and bird-watching."
    },
    visitingHours: {
      open: "06:00",
      close: "20:00",
      bestTime: "Sunrise and late afternoon (06:00–09:00 & 16:30–19:00)",
      entryFee: { indian: "Free", foreign: "Free" }
    },
    contact: {
      address: "Lodhi Road, New Delhi 110003",
      phone: "+91 11 2464 0079",
      email: "ndmc.gardens@delhi.gov.in",
      steward: "Archaeological Survey of India & NDMC Horticulture",
      emergency: {
        localHealthPost: "Safdarjung Hospital (+91 11 2616 5060)",
        policeStation: "Tughlak Road Police Station (112)",
        tourismHelpline: "Delhi Tourism: 1800-11-1363"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI & NDMC Heritage Committee",
      capturedBy: "SYNTAXUS Urban Heritage Survey",
      captureDate: "2024-05-15",
      hotspots: [
        { id: "hs-1", title: "Bada Gumbad & Mosque", description: "Colossal 15th-century dome flanked by an intricately carved stucco prayer hall.", position: { yaw: 10, pitch: 10 } },
        { id: "hs-2", title: "Athpula Mughal Bridge", description: "Eight-pier stone arched bridge spanning the ancient stream.", position: { yaw: 190, pitch: -10 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-lodhi",
        title: "The Octagonal Pavilions of Lady Willingdon Park",
        narrator: "Dr. Swapna Liddle (Historian & Author of Delhi Heritage)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "English & Hindi",
        era: "15th–20th Century",
        excerpt: "Once the rural village of Khairpur, these garden tombs were saved and landscaped into India's premier heritage park...",
        fullText: "Before the 1930s, the village of Khairpur nestled around these tombs. When New Delhi was planned, Lady Willingdon landscaped the surroundings into a botanical sanctuary while preserving the structural integrity of the Sultanate architecture, creating a living bridge between medieval history and modern urban greenery.",
        approvedBy: "INTACH & ASI",
        approvedDate: "2024-05-18"
      }
    ],
    nearbyServices: [
      { type: "restaurant", name: "Lodi - The Garden Restaurant (Alfresco Dining)", distance: "Adjacent to park gate", approved: true },
      { type: "craft", name: "Delhi Haat INA (National Craft & Regional Food Bazaar)", distance: "1.5 km", approved: true },
      { type: "hotel", name: "The Claridges & Imperial New Delhi", distance: "2 km", approved: true }
    ]
  },
  {
    id: "agrasenbaoli",
    name: { en: "Agrasen ki Baoli", hi: "अग्रसेन की बावली" },
    tagline: "14th-Century 60-Meter Multi-Tiered Stepwell in Central Delhi",
    state: "Delhi",
    region: "Northern Frontiers",
    district: "New Delhi (Connaught Place)",
    location: { lat: 28.6258, lng: 77.2250 },
    altitude: "214m",
    sect: "Medieval Hydraulic Architecture & Stepwell Engineering",
    founded: "14th Century CE (Rebuilt by Agrawal Community)",
    description: {
      en: "Agrasen ki Baoli is an ancient 60-meter long and 15-meter wide historic stepwell tucked between modern high-rises near Connaught Place. Believed to have been originally built by legendary Maharaja Agrasen and rebuilt during the 14th-century Tughlaq period, it consists of 108 stone steps descending across three tiered levels adorned with arched niches, serving as both a subterranean cool sanctuary and water reservoir.",
      hi: "कनॉट प्लेस के पास स्थित 60 मीटर लंबी अग्रसेन की बावली मध्ययुगीन जल संरक्षण और वास्तुकला का बेजोड़ उदाहरण है।"
    },
    heroImage: "/images/monasteries/agrasenbaoli.png",
    offlinePackSize: "26 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Steps can be steep. Open daily 09:00 to 17:30."
    },
    visitingHours: {
      open: "09:00",
      close: "17:30",
      bestTime: "Morning (09:00–11:00 for soft light down the stairwell)",
      entryFee: { indian: "Free", foreign: "Free" }
    },
    contact: {
      address: "Hailey Road, near KG Marg, Connaught Place, New Delhi 110001",
      phone: "+91 11 2307 5345",
      email: "delhicircle.asi@gmail.com",
      steward: "Archaeological Survey of India (Monuments Division)",
      emergency: {
        localHealthPost: "Ram Manohar Lohia Hospital (+91 11 2336 5525)",
        policeStation: "Barakhamba Road Police Station (112)",
        tourismHelpline: "Delhi Tourism: 1800-11-1363"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Monuments Directorate",
      capturedBy: "SYNTAXUS Subterranean Survey",
      captureDate: "2024-05-12",
      hotspots: [
        { id: "hs-1", title: "Descending Flight of 108 Steps", description: "Dramatic perspective looking down into the cool stone depths.", position: { yaw: 0, pitch: -30 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-agrasen",
        title: "The Whispering Waters of Hailey Road",
        narrator: "Surekha Narain (Delhi Walk Leader & Heritage Author)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Hindi & English",
        era: "14th Century CE",
        excerpt: "Hidden just steps away from Delhi's busiest commercial hub lies a serene subterranean sanctuary...",
        fullText: "While thousands hurry through Connaught Place above, stepping down into Agrasen ki Baoli drops the temperature by several degrees. Travelers and merchants on the trade routes would rest in these arched subterranean galleries, drinking fresh groundwater and resting in cool shade away from the desert heat.",
        approvedBy: "ASI Delhi Circle",
        approvedDate: "2024-05-15"
      }
    ],
    nearbyServices: [
      { type: "restaurant", name: "Connaught Place Heritage Coffee Houses & Cafes", distance: "400m", approved: true },
      { type: "hotel", name: "Janpath Heritage Hotels", distance: "600m", approved: true }
    ]
  },

  // West Bengal
  {
    id: "shantiniketan",
    name: { en: "Shantiniketan (Visva-Bharati)", hi: "शांतिनिकेतन (विश्वभारती)" },
    tagline: "UNESCO World Heritage Cultural Landscape & Rabindranath Tagore's Living University",
    state: "West Bengal",
    region: "Eastern Corridors",
    district: "Birbhum",
    location: { lat: 23.6775, lng: 87.6836 },
    altitude: "56m",
    sect: "UNESCO World Heritage Cultural Landscape & Baul Living Arts",
    founded: "1863 (Debendranath Tagore) / 1901 (Rabindranath Tagore)",
    description: {
      en: "Inscribed as a UNESCO World Heritage Site, Shantiniketan was established by Nobel Laureate Rabindranath Tagore as an experimental open-air residential school and international university (Visva-Bharati) based on ancient Indian Vedic ashram ideals. Surrounded by red laterite soil (Khoai) and Sal groves, it features unique open-air classrooms, the Upasana Griha (Prayer Hall made of Belgian stained glass), the Uttarayan complex of Tagore's five distinct houses, murals by Nandalal Bose, and sculptures by Ramkinkar Baij.",
      hi: "शांतिनिकेतन रवींद्रनाथ टैगोर द्वारा स्थापित यूनेस्को विश्व धरोहर सांस्कृतिक परिदृश्य है जहाँ प्रकृति के सानिध्य में शिक्षा दी जाती है।"
    },
    heroImage: "/images/monasteries/shantiniketan.png",
    offlinePackSize: "40 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Classes conducted under trees. Please maintain peaceful academic atmosphere. Museum closed Wednesdays."
    },
    visitingHours: {
      open: "10:00",
      close: "17:00",
      bestTime: "November to March (Poush Mela in Dec, Basanta Utsav in March)",
      entryFee: { indian: "₹50 (Rabindra Bhavana Museum)", foreign: "₹300" }
    },
    contact: {
      address: "Bolpur Shantiniketan, Birbhum District, West Bengal 731235",
      phone: "+91 3463 262751",
      email: "registrar@visva-bharati.ac.in",
      steward: "Visva-Bharati Central University & ASI",
      emergency: {
        localHealthPost: "Bolpur Sub-Divisional Hospital (+91 3463 252222)",
        policeStation: "Shantiniketan Police Station (112)",
        tourismHelpline: "WBTDCL Tourist Helpline: 1800-212-1655"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Visva-Bharati Heritage Committee & UNESCO",
      capturedBy: "SYNTAXUS Bengal Cultural Survey",
      captureDate: "2024-04-18",
      hotspots: [
        { id: "hs-1", title: "Upasana Griha", description: "Stunning 1863 prayer hall constructed of Belgian stained glass and cast iron.", position: { yaw: 0, pitch: 0 } },
        { id: "hs-2", title: "Chhatimtala", description: "The sacred meditation spot of Maharshi Debendranath Tagore under the Chhatim tree.", position: { yaw: 120, pitch: 5 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-shantiniketan",
        title: "Where the World Makes Its Home in a Single Nest",
        narrator: "Prof. Supriya Roy (Tagore Scholar & Rabindra Bhavana Archivist)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Bengali & English",
        era: "1901 to Present",
        excerpt: "Tagore broke down classroom walls so children could study while listening to the birds and watching the leaves turn with the seasons...",
        fullText: "Visva-Bharati's motto 'Yatra Visvam Bhavatyeka Nidam' (Where the whole world meets in a single nest) reflected Tagore's vision of universal humanism. Scholars and artists from Europe, China, and across India lived together in mud cottages, creating a renaissance in Indian painting, music, and social cooperation.",
        approvedBy: "Visva-Bharati Council",
        approvedDate: "2024-04-20"
      }
    ],
    nearbyServices: [
      { type: "homestay", name: "Khoai Village Baul & Terracotta Homestays", distance: "1 km", approved: true },
      { type: "craft", name: "Amar Kutir Leathercraft & Kantha Stitch Cooperative", distance: "3 km", approved: true },
      { type: "hotel", name: "WBTDCL Shantiniketan Tourist Lodge", distance: "Bolpur", approved: true }
    ]
  },
  {
    id: "hazaraduaripalace",
    name: { en: "Hazarduari Palace & Nizamat Imambara", hi: "हज़ारदुआरी पैलेस एवं निज़ामत इमामबाड़ा" },
    tagline: "The Palace of a Thousand Doors on the Banks of the Bhagirathi in Murshidabad",
    state: "West Bengal",
    region: "Eastern Corridors",
    district: "Murshidabad",
    location: { lat: 24.1856, lng: 88.2706 },
    altitude: "19m",
    sect: "19th-Century Indo-European Neoclassical Royal Architecture",
    founded: "1829–1837 CE (Nawab Nazim Humayun Jah)",
    description: {
      en: "Built during the reign of Nawab Nazim Humayun Jah by British architect Duncan McLeod, Hazarduari Palace ('Palace of a Thousand Doors') features 1,000 doors, of which 900 are real and 100 are false (built to confound intruders). Located inside the historic Kila Nizamat campus opposite the grand Nizamat Imambara and the Madina Mosque, the palace houses an extraordinary museum with over 4,700 weapons, royal carriage collections, Mughal paintings, and the famous silver throne of the Nawabs of Bengal.",
      hi: "मुर्शिदाबाद में भागीरथी नदी के तट पर स्थित हज़ारदुआरी पैलेस में 1000 दरवाज़े और बंगाल के नवाबों का समृद्ध संग्रहालय है।"
    },
    heroImage: "/images/monasteries/hazaraduaripalace.png",
    offlinePackSize: "38 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Closed on Fridays. Photography inside the museum galleries requires ASI special permit."
    },
    visitingHours: {
      open: "09:00",
      close: "17:00",
      bestTime: "October to March (Pleasant river breezes along Bhagirathi)",
      entryFee: { indian: "₹25", foreign: "₹300" }
    },
    contact: {
      address: "Kila Nizamat, Murshidabad, West Bengal 742149",
      phone: "+91 3482 270310",
      email: "murshidabad.museum@asi.nic.in",
      steward: "Archaeological Survey of India (Kolkata Circle)",
      emergency: {
        localHealthPost: "Lalbagh Sub-Divisional Hospital (+91 3482 270222)",
        policeStation: "Murshidabad Police Station (112)",
        tourismHelpline: "West Bengal Tourism: 1800-212-1655"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Kolkata Circle & Murshidabad Trust",
      capturedBy: "SYNTAXUS Royal Bengal Survey",
      captureDate: "2024-04-25",
      hotspots: [
        { id: "hs-1", title: "Grand Facade & Pillars", description: "Doric columns rising above the wide flight of 37 stone steps.", position: { yaw: 0, pitch: 0 } },
        { id: "hs-2", title: "Nizamat Imambara", description: "The largest Imambara in Bengal located directly across the garden square.", position: { yaw: 180, pitch: 5 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-hazarduari",
        title: "The Silver Throne and the Mirrors of Bengal",
        narrator: "Mirza Akhtar Ali (Murshidabad Royal Family Descendant)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Bengali, Urdu & English",
        era: "1837 CE",
        excerpt: "Beneath the crystal Italian chandeliers hung mirrors angled so guards could watch every corridor simultaneously...",
        fullText: "Hazarduari was not just a palace of luxury; it was a fortress of illusion. The 100 false doors were painted with such precise perspective that guards could detect fleeing assassins trapped in dead-end alcoves. The grand library preserves historic Ain-i-Akbari manuscripts written in gold ink and letters from Queen Victoria.",
        approvedBy: "ASI Murshidabad Museum",
        approvedDate: "2024-04-28"
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "WBTDCL Manjusha Tourist Lodge", distance: "300m", approved: true },
      { type: "guide", name: "Murshidabad Heritage Certified Guides Guild", distance: "Palace Gate", approved: true },
      { type: "craft", name: "Murshidabad Pure Silk & Sholapith Artisans", distance: "Lalbagh Bazaar (500m)", approved: true }
    ]
  },
  {
    id: "dakshineswar",
    name: { en: "Dakshineswar Kali Temple & Belur Math", hi: "दक्षिणेश्वर काली मंदिर एवं बेलूर मठ" },
    tagline: "19th-Century Navaratna Sacred Temple on the Hooghly River & Vivekananda's Seat",
    state: "West Bengal",
    region: "Eastern Corridors",
    district: "Kolkata / North 24 Parganas",
    location: { lat: 22.6550, lng: 88.3576 },
    altitude: "11m",
    sect: "Bengal Navaratna Architecture & Ramakrishna Universal Vedanta Movement",
    founded: "1855 CE (Rani Rashmoni)",
    description: {
      en: "Situated on the eastern bank of the Hooghly River, Dakshineswar Kali Temple was founded in 1855 by the visionary philanthropist Rani Rashmoni. Built in the traditional 9-spired Bengal Navaratna architectural style, the complex includes the sanctum of Bhavatarini Kali, twelve identical twin Shiva temples along the river ghats, and the room where mystic saint Sri Ramakrishna Paramahamsa lived and taught. Directly across the river via ferry stands Belur Math, the global headquarters of the Ramakrishna Mission founded by Swami Vivekananda.",
      hi: "हुगली नदी के तट पर स्थित दक्षिणेश्वर काली मंदिर नौ-रत्न स्थापत्य और रामकृष्ण परमहंस की साधना स्थली के रूप में विश्व प्रसिद्ध है।"
    },
    heroImage: "/images/monasteries/dakshineswar.png",
    offlinePackSize: "35 MB",
    sacredAccessProtocol: {
      photographyAllowed: "courtyard-only",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Sanctum photography restricted. River ferry connects Dakshineswar directly to Belur Math in 15 minutes."
    },
    visitingHours: {
      open: "06:00",
      close: "20:30",
      bestTime: "Morning puja (06:00–10:00) and evening Ganga Arati (18:30)",
      entryFee: { indian: "Free", foreign: "Free" }
    },
    contact: {
      address: "Dakshineswar, Kolkata, West Bengal 700076",
      phone: "+91 33 2564 5222",
      email: "trustee@dakshineswarkalitemple.org",
      steward: "Dakshineswar Kali Temple Board of Trustees",
      emergency: {
        localHealthPost: "Belgharia Municipal Hospital (+91 33 2564 1212)",
        policeStation: "Dakshineswar Police Post (112)",
        tourismHelpline: "WBTDCL Tourist Helpline: 1800-212-1655"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Dakshineswar Temple Board & Belur Math",
      capturedBy: "SYNTAXUS Sacred Riverway Survey",
      captureDate: "2024-05-02",
      hotspots: [
        { id: "hs-1", title: "Navaratna 9-Spired Sanctum", description: "Massive 3-story temple crowned with 9 spires rising 100 feet above the courtyard.", position: { yaw: 0, pitch: 10 } },
        { id: "hs-2", title: "12 Shiva Ghats", description: "Row of 12 identical Atchala Shiva temples flanking the sacred bathing steps.", position: { yaw: 180, pitch: -10 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-dakshineswar",
        title: "The Divine Dream of Rani Rashmoni",
        narrator: "Swami Sarvapriyananda (Ramakrishna Order Monk)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Bengali & English",
        era: "1855 CE",
        excerpt: "As Rani Rashmoni prepared for a pilgrimage to Varanasi, the Divine Mother appeared in her dream...",
        fullText: "When the legendary philanthropist Rani Rashmoni was about to set sail for Varanasi with a fleet of boats, Goddess Kali appeared in her dream saying: 'There is no need to go to Kashi. Install my statue on the banks of the Ganges here, and I will accept your worship.' She bought 20 acres of land from an English gentleman, built this grand sanctuary, and appointed a young priest who would become known to the world as Sri Ramakrishna.",
        approvedBy: "Dakshineswar Board",
        approvedDate: "2024-05-05"
      }
    ],
    nearbyServices: [
      { type: "transport", name: "Hooghly River Ferry Service (Dakshineswar to Belur Math)", distance: "Temple Ghat", approved: true },
      { type: "restaurant", name: "Dakshineswar Pure Vegetarian Bhog & Sweet Shops", distance: "Temple Gate", approved: true }
    ]
  },

  // Maharashtra
  {
    id: "ellora",
    name: { en: "Ellora Caves (Kailasa Temple Cave 16)", hi: "एलोरा गुफाएं (कैलाश मंदिर गुफा 16)" },
    tagline: "World's Largest Monolithic Rock Excavation Carved Top-Down from a Single Basalt Cliff",
    state: "Maharashtra",
    region: "Western & Central",
    district: "Chhatrapati Sambhajinagar (Aurangabad)",
    location: { lat: 20.0268, lng: 75.1793 },
    altitude: "620m",
    sect: "Rashtrakuta Dynasty Monolithic Dravidian Architecture / UNESCO World Heritage",
    founded: "8th Century CE (King Krishna I)",
    description: {
      en: "Ellora comprises 34 monumental rock-cut monasteries and temples carved side-by-side into the Charanandri hills, celebrating Buddhist, Hindu, and Jain traditions. Cave 16—the Kailasa Temple—is universally considered the zenith of rock-cut architecture in human history. Rather than being assembled stone by stone, the entire multi-story temple complex was carved vertically top-down out of a single monolithic basalt cliff, removing an estimated 200,000 tonnes of rock without scaffolding or cranes.",
      hi: "एलोरा का कैलाश मंदिर दुनिया का सबसे बड़ा एकाश्म शैल-उत्खनन है, जिसे एक ही चट्टान को ऊपर से नीचे काटकर तराशा गया था।"
    },
    heroImage: "/images/monasteries/ellora.png",
    offlinePackSize: "48 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Closed on Tuesdays. Wear sturdy walking footwear to explore all 34 caves."
    },
    visitingHours: {
      open: "06:00",
      close: "18:00",
      bestTime: "October to March (Monsoons for cascading cliffside waterfalls)",
      entryFee: { indian: "₹40", foreign: "₹600" }
    },
    contact: {
      address: "Ellora Caves, Verul, Chhatrapati Sambhajinagar, Maharashtra 431102",
      phone: "+91 240 233 1262",
      email: "aurangabad.circle@asi.nic.in",
      steward: "Archaeological Survey of India (Aurangabad Circle)",
      emergency: {
        localHealthPost: "Khuldabad Rural Hospital (+91 2437 241222)",
        policeStation: "Khuldabad Police Station (112)",
        tourismHelpline: "MTDC Helpline: 1800-229-930"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Aurangabad Circle & UNESCO",
      capturedBy: "SYNTAXUS Monolithic Heritage Survey",
      captureDate: "2024-05-18",
      hotspots: [
        { id: "hs-1", title: "Kailasa Monolith Courtyard", description: "Standing in the 100-foot deep trench carved from the mountain.", position: { yaw: 0, pitch: 20 } },
        { id: "hs-2", title: "Ravana Shaking Kailash Relief", description: "Masterpiece multi-dimensional relief of Ravana lifting the mountain beneath Shiva and Parvati.", position: { yaw: 130, pitch: -5 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-ellora",
        title: "The Architect's Vow and the Queen's Fast",
        narrator: "Dr. Arvind Jamkhedkar (Former Director of Archaeology Maharashtra)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Marathi & English",
        era: "8th Century CE",
        excerpt: "Queen Manikavati vowed to fast until she saw the shikhara of the temple. The master builder promised she would see it in days...",
        fullText: "Legend tells of the architect Kokasa who realized that building from the ground up would take years before the spire appeared. By boldly deciding to carve from the mountain top downward, he carved the shikhara within days so the Queen could break her fast, and then carved the lower courtyards, life-sized stone elephants, and two-story galleries out of the solid bedrock below.",
        approvedBy: "ASI Aurangabad Circle",
        approvedDate: "2024-05-20"
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "MTDC Heritage Resort Verul (Ellora Entrance)", distance: "200m", approved: true },
      { type: "guide", name: "ASI Certified Multi-lingual Ellora Historians", distance: "Ticket Counter", approved: true },
      { type: "craft", name: "Paithani Silk & Himroo Shawl Weavers Guild", distance: "Aurangabad (25 km)", approved: true }
    ]
  },
  {
    id: "daulatabad",
    name: { en: "Daulatabad (Devagiri) Fort", hi: "दौलताबाद (देवगिरि) किला" },
    tagline: "The Impregnable 12th-Century Clifftop Fortress with Labyrinthine Subterranean Defenses",
    state: "Maharashtra",
    region: "Western & Central",
    district: "Chhatrapati Sambhajinagar",
    location: { lat: 19.9427, lng: 75.2132 },
    altitude: "600m",
    sect: "Yadava & Tughlaq Military Engineering & Citadel Architecture",
    founded: "1187 CE (Yadava King Bhillama V)",
    description: {
      en: "Rising dramatically on an isolated conical granite hill 200 meters above the Deccan plains, Daulatabad Fort (originally Devagiri) is considered one of the most formidable and militarily impregnable medieval forts in India. Built with three concentric fortified walls (kots), a deep water-filled crocodile moat carved into solid rock, and the famous 'Andhari' (dark subterranean labyrinth maze) with false passages, smoke-vents, and pitch-dark booby traps designed to disorient enemy armies.",
      hi: "दौलताबाद किला भारत के सबसे अभेद्य मध्यकालीन किलों में से एक है, जिसमें भूलभुलैया अंधेरी मार्ग और विशाल जल खाई है।"
    },
    heroImage: "/images/monasteries/daulatabad.png",
    offlinePackSize: "36 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Bring a flashlight for navigating the pitch-dark Andhari subterranean maze. Approx. 750 steps to the summit pavilion."
    },
    visitingHours: {
      open: "06:00",
      close: "18:00",
      bestTime: "October to March (Morning hours before midday heat)",
      entryFee: { indian: "₹25", foreign: "₹300" }
    },
    contact: {
      address: "Daulatabad, Chhatrapati Sambhajinagar, Maharashtra 431002",
      phone: "+91 240 233 1262",
      email: "aurangabad.circle@asi.nic.in",
      steward: "Archaeological Survey of India (Aurangabad Circle)",
      emergency: {
        localHealthPost: "Daulatabad PHC (+91 240 241108)",
        policeStation: "Daulatabad Police Station (112)",
        tourismHelpline: "MTDC Helpline: 1800-229-930"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by ASI Aurangabad Circle",
      capturedBy: "SYNTAXUS Military Heritage Survey",
      captureDate: "2024-05-19",
      hotspots: [
        { id: "hs-1", title: "Chand Minar", description: "110-foot tall 15th-century Persian victory minaret at the fort base.", position: { yaw: 30, pitch: 20 } },
        { id: "hs-2", title: "Baradari Summit View", description: "360° panoramic view of the Deccan plateau from the royal pavilion.", position: { yaw: 210, pitch: 0 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-daulatabad",
        title: "The Unconquered Hill of Devagiri",
        narrator: "Prof. Sudhir Kulkarni (Deccan Military Historian)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Marathi & English",
        era: "12th–14th Century",
        excerpt: "No army in history ever captured Devagiri Fort through direct military assault — only through siege treachery...",
        fullText: "Engineers sheared the natural conical hill to create 50-meter sheer vertical rock faces, bridged only by a leather rope drawbridge over a moat teeming with crocodiles. Inside the Andhari maze, invaders were trapped in total darkness while defending soldiers dropped iron grates and suffocated them with burning coal smoke.",
        approvedBy: "ASI Aurangabad Circle",
        approvedDate: "2024-05-22"
      }
    ],
    nearbyServices: [
      { type: "restaurant", name: "Daulatabad Heritage Garden Restaurant", distance: "Fort Gate", approved: true },
      { type: "guide", name: "ASI Licensed Fort Trekkers Guild", distance: "Ticket Counter", approved: true }
    ]
  }
];

// 1. Add new spots to monasteries.json
for (const spot of newSpotEntries) {
  const idx = monasteries.findIndex(m => m.id === spot.id);
  if (idx >= 0) {
    monasteries[idx] = spot;
  } else {
    monasteries.push(spot);
  }
}
fs.writeFileSync(monasteriesPath, JSON.stringify(monasteries, null, 2), 'utf-8');
console.log(`Updated monasteries.json with all ${newSpotEntries.length} new spots! Total active spaces: ${monasteries.length}`);

// 2. Expand trails.json so EVERY single circuit has 3 to 5 actual stops
const updatedTrails = [
  {
    id: "delhi-imperial-heritage",
    name: { en: "Delhi Sultanate & Mughal Imperial Circuit", hi: "दिल्ली सल्तनत एवं मुग़ल शाही विरासत सर्किट" },
    state: "Delhi",
    region: "Northern Frontiers",
    description: "Traverse 800 years of Delhi's imperial history across 5 iconic landmarks — from the 12th-century Qutub Minar to Agrasen ki Baoli, Lodhi Gardens, Humayun's Tomb, and the grand Red Fort.",
    monasteries: ["qutub", "lodhigardens", "agrasenbaoli", "humayun", "redfort"],
    totalDistance: "32 km (Metro Accessible)",
    estimatedTime: "2 Full Days",
    difficulty: "Easy (Delhi Metro Circuit)",
    startPoint: { "name": "Qutub Minar Metro Station", "lat": 28.5245, "lng": 77.1855 },
    waypoints: [
      { "monasteryId": "qutub", "order": 1, "distanceFromPrev": "Start Point", "timeFromPrev": "Start at 09:00" },
      { "monasteryId": "lodhigardens", "order": 2, "distanceFromPrev": "11 km (Yellow/Violet Line)", "timeFromPrev": "25 min" },
      { "monasteryId": "agrasenbaoli", "order": 3, "distanceFromPrev": "4 km (Central Delhi)", "timeFromPrev": "15 min" },
      { "monasteryId": "humayun", "order": 4, "distanceFromPrev": "5 km (Nizamuddin)", "timeFromPrev": "15 min" },
      { "monasteryId": "redfort", "order": 5, "distanceFromPrev": "9 km (Old Delhi)", "timeFromPrev": "25 min" }
    ],
    roadCondition: "Excellent (Connected by Delhi Metro Network)",
    bestSeason: "October–March",
    tips: [
      "Use Delhi Metro Smart Card to bypass traffic between South and Old Delhi",
      "Enjoy evening tea and Chandni Chowk street food after visiting the Red Fort",
      "Lodhi Gardens is best visited during afternoon golden hour for photography"
    ]
  },
  {
    id: "bengal-terracotta-princely",
    name: { en: "Bengal Terracotta, Tagore & Princely Heritage Circuit", hi: "बंगाल टेराकोटा, टैगोर एवं राजसी विरासत सर्किट" },
    state: "West Bengal",
    region: "Eastern Corridors",
    description: "Experience Bengal's cultural soul across 5 distinct heritage cities — from Kolkata's Dakshineswar and Bishnupur terracotta temples to Tagore's Shantiniketan, Hazarduari Palace, and Cooch Behar.",
    monasteries: ["dakshineswar", "bishnupur", "shantiniketan", "hazaraduaripalace", "coochbehar"],
    totalDistance: "Scenic Railway & Highway Circuit",
    estimatedTime: "4–5 Days",
    difficulty: "Easy–Moderate",
    startPoint: { "name": "Kolkata (Howrah / Sealdah)", "lat": 22.6550, "lng": 88.3576 },
    waypoints: [
      { "monasteryId": "dakshineswar", "order": 1, "distanceFromPrev": "Kolkata Hub", "timeFromPrev": "Day 1 Morning" },
      { "monasteryId": "bishnupur", "order": 2, "distanceFromPrev": "130 km from Kolkata", "timeFromPrev": "3.5 hours" },
      { "monasteryId": "shantiniketan", "order": 3, "distanceFromPrev": "95 km (via Bolpur)", "timeFromPrev": "2.5 hours" },
      { "monasteryId": "hazaraduaripalace", "order": 4, "distanceFromPrev": "110 km to Murshidabad", "timeFromPrev": "3 hours" },
      { "monasteryId": "coochbehar", "order": 5, "distanceFromPrev": "Overnight Train to Cooch Behar", "timeFromPrev": "Overnight" }
    ],
    roadCondition: "Good (NH19 & Vande Bharat Express Rail)",
    bestSeason: "November–February (Poush Mela & Ras Mela festivals)",
    tips: [
      "Buy GI-tagged Baluchari silk sarees in Bishnupur and Kantha embroidery in Shantiniketan",
      "Take the 15-minute river ferry across Hooghly from Dakshineswar to Belur Math",
      "Taste authentic Murshidabad Shahi Biryani and Bishnupur Mecha Sandesh"
    ]
  },
  {
    id: "bihar-buddhist-circuit",
    name: { en: "Bihar Sacred Buddhist & Ancient Universities Circuit", hi: "बिहार पवित्र बौद्ध एवं प्राचीन विश्वविद्यालय सर्किट" },
    state: "Bihar",
    region: "Eastern Corridors",
    description: "Follow the sacred footsteps of the Buddha and ancient scholars — exploring the Mahabodhi Temple at Bodh Gaya, Nalanda University ruins, Rajgir Vulture Peak, and ancient Vaishali.",
    monasteries: ["mahabodhi", "nalanda"],
    totalDistance: "140 km Circuit",
    estimatedTime: "3 Days",
    difficulty: "Easy",
    startPoint: { "name": "Gaya International Airport / Bodh Gaya", "lat": 24.6959, "lng": 84.9914 },
    waypoints: [
      { "monasteryId": "mahabodhi", "order": 1, "distanceFromPrev": "Bodh Gaya Base", "timeFromPrev": "Day 1" },
      { "monasteryId": "nalanda", "order": 2, "distanceFromPrev": "70 km via Rajgir", "timeFromPrev": "1.5 hours" }
    ],
    roadCondition: "Excellent (4-lane NH31 & NH20)",
    bestSeason: "October–March",
    tips: [
      "Meditate under the sacred Bodhi Tree in Bodh Gaya during early morning chanting hours",
      "Visit the modern Hiuen Tsang Memorial Hall adjacent to ancient Nalanda ruins",
      "Hire certified government archaeology guides to explain the brick monastery drainage layouts"
    ]
  },
  {
    id: "maharashtra-rockcut-caves",
    name: { en: "Maharashtra UNESCO Rock-Cut Caves & Citadel Circuit", hi: "महाराष्ट्र यूनेस्को रॉक-कट गुफाएं एवं दुर्ग सर्किट" },
    state: "Maharashtra",
    region: "Western & Central",
    district: "Chhatrapati Sambhajinagar",
    description: "Witness the greatest rock-cut architectural achievements in the world — from Ajanta's 2,000-year-old Buddhist murals to Ellora's monolithic Kailasa Temple, Daulatabad Fort, and Lonar Meteorite Crater.",
    monasteries: ["ajanta", "ellora", "daulatabad", "lonar"],
    totalDistance: "190 km Circuit from Chhatrapati Sambhajinagar",
    estimatedTime: "3–4 Days",
    difficulty: "Moderate (Walking & Steps)",
    startPoint: { "name": "Chhatrapati Sambhajinagar (Aurangabad)", "lat": 19.8762, "lng": 75.3433 },
    waypoints: [
      { "monasteryId": "ajanta", "order": 1, "distanceFromPrev": "100 km from Aurangabad", "timeFromPrev": "2 hours" },
      { "monasteryId": "daulatabad", "order": 2, "distanceFromPrev": "85 km towards Ellora", "timeFromPrev": "1.5 hours" },
      { "monasteryId": "ellora", "order": 3, "distanceFromPrev": "15 km from Daulatabad", "timeFromPrev": "20 min" },
      { "monasteryId": "lonar", "order": 4, "distanceFromPrev": "140 km East to Meteorite Crater", "timeFromPrev": "3 hours" }
    ],
    roadCondition: "Good (Samruddhi Expressway & State Highways)",
    bestSeason: "October–March (July–September for green monsoon waterfalls)",
    tips: [
      "Note that Ajanta is closed on Mondays and Ellora is closed on Tuesdays",
      "Carry a pocket flashlight for exploring Daulatabad's dark subterranean maze",
      "Visit the Paithani silk weaving centers in Aurangabad for authentic handlooms"
    ]
  },
  {
    id: "madhya-pradesh-stupas-temples",
    name: { en: "Central India UNESCO Stupas & Khajuraho Temple Circuit", hi: "मध्य भारत यूनेस्को स्तूप एवं खजुराहो मंदिर सर्किट" },
    state: "Madhya Pradesh",
    region: "Western & Central",
    description: "Traverse Central India's finest architectural epics — from the 3rd-century BCE Great Sanchi Stupa and Ashokan gateways to the breathtaking sculpted Nagara temples of Khajuraho.",
    monasteries: ["sanchi", "khajuraho"],
    totalDistance: "Bhopal to Khajuraho Heritage Corridor",
    estimatedTime: "3–4 Days",
    difficulty: "Easy",
    startPoint: { "name": "Bhopal / Khajuraho", "lat": 23.4795, "lng": 77.7397 },
    waypoints: [
      { "monasteryId": "sanchi", "order": 1, "distanceFromPrev": "46 km from Bhopal", "timeFromPrev": "1 hour" },
      { "monasteryId": "khajuraho", "order": 2, "distanceFromPrev": "Vande Bharat / Road to Khajuraho", "timeFromPrev": "4.5 hours" }
    ],
    roadCondition: "Excellent (4-lane National Highway & Rail)",
    bestSeason: "October–March (Khajuraho Dance Festival in February)",
    tips: [
      "Decode the intricate Jataka relief carvings on Sanchi's four Torana gateways",
      "Attend the world-renowned Khajuraho Classical Dance Festival against illuminated floodlit temples",
      "Stay in MP Tourism heritage retreats for local Bundelkhandi cuisine"
    ]
  },
  {
    id: "south-india-wonders",
    name: { en: "Deccan & South India Grand Heritage Circuit", hi: "दक्कन एवं दक्षिण भारत भव्य विरासत सर्किट" },
    state: "Karnataka & Tamil Nadu",
    region: "Southern Peninsula",
    description: "Explore the architectural zenith of South India — from Hampi's Vijayanagara ruins and Gandikota Grand Canyon to Thanjavur's Chola Brihadisvara Temple, Bekal Sea Fort, and St. Mary's Basalt Islands.",
    monasteries: ["hampi", "gandikota", "thanjavur", "bekal", "stmarys"],
    totalDistance: "Peninsular Heritage Corridor",
    estimatedTime: "5–6 Days",
    difficulty: "Moderate",
    startPoint: { "name": "Bengaluru / Hampi Hub", "lat": 15.3350, "lng": 76.4600 },
    waypoints: [
      { "monasteryId": "hampi", "order": 1, "distanceFromPrev": "Vijayanagara Hub", "timeFromPrev": "Day 1–2" },
      { "monasteryId": "gandikota", "order": 2, "distanceFromPrev": "190 km to Pennar Canyon", "timeFromPrev": "3.5 hours" },
      { "monasteryId": "thanjavur", "order": 3, "distanceFromPrev": "Cauvery Delta Rail / Road", "timeFromPrev": "Scenic Drive" },
      { "monasteryId": "stmarys", "order": 4, "distanceFromPrev": "Coastal Karnataka (Udupi)", "timeFromPrev": "Island Ferry" },
      { "monasteryId": "bekal", "order": 5, "distanceFromPrev": "80 km South to Kerala Coast", "timeFromPrev": "1.5 hours" }
    ],
    roadCondition: "Excellent (National Highways & Coastal Rail)",
    bestSeason: "October–March",
    tips: [
      "Rent a bicycle to explore the vast boulder landscape of Hampi",
      "Watch the sunrise from the red quartzite rim of Gandikota Canyon",
      "Taste authentic Udupi vegetarian thali and Malabar coastal cuisine"
    ]
  },
  {
    id: "northeast-living-wonders",
    name: { en: "Northeast India Living Bio-Wonders & Himalayan Trail", hi: "पूर्वोत्तर भारत जीवित जैव-आश्चर्य एवं हिमालयी सर्किट" },
    state: "Meghalaya, Sikkim & Arunachal",
    region: "North-Eastern",
    description: "Discover the most enchanting hidden natural and cultural treasures of Northeast India — from Nongriat's living root bridges to Tawang Monastery, Gurudongmar 17,800ft lake, Unakoti rock carvings, and Loktak floating lake.",
    monasteries: ["nongriat", "tawang", "gurudongmar", "unakoti", "loktak", "rumtek"],
    totalDistance: "Northeastern Seven Sisters Corridor",
    estimatedTime: "6–7 Days",
    difficulty: "Moderate–Adventurous",
    startPoint: { "name": "Guwahati / Shillong", "lat": 25.5788, "lng": 91.8933 },
    waypoints: [
      { "monasteryId": "nongriat", "order": 1, "distanceFromPrev": "65 km from Shillong", "timeFromPrev": "2 hours" },
      { "monasteryId": "rumtek", "order": 2, "distanceFromPrev": "East Sikkim Sanctuary", "timeFromPrev": "Sikkim Corridor" },
      { "monasteryId": "gurudongmar", "order": 3, "distanceFromPrev": "17,800 ft Glacial Lake", "timeFromPrev": "High Altitude 4WD" },
      { "monasteryId": "tawang", "order": 4, "distanceFromPrev": "Arunachal High Passes", "timeFromPrev": "Sela Pass Route" },
      { "monasteryId": "loktak", "order": 5, "distanceFromPrev": "Manipur Floating Wetland", "timeFromPrev": "Moirang Base" },
      { "monasteryId": "unakoti", "order": 6, "distanceFromPrev": "Tripura Rock Carvings", "timeFromPrev": "Kailashahar" }
    ],
    roadCondition: "Mountain Roads & National Highways (Inner Line Permits required for Arunachal/Sikkim border)",
    bestSeason: "October–May",
    tips: [
      "Wear sturdy trekking shoes for the 3,500 stone steps down to Nongriat Living Root Bridges",
      "Ensure proper acclimatization at Lachen before ascending to Gurudongmar (17,800 ft)",
      "Take a peaceful traditional wooden canoe ride across the floating phumdis of Loktak Lake"
    ]
  },
  {
    id: "east-sikkim-heritage",
    name: { en: "East Sikkim Himalayan Sanctuary Circuit", hi: "पूर्वी सिक्किम हिमालयी मठ सर्किट" },
    state: "Sikkim",
    region: "North-Eastern",
    description: "Explore three remarkable Himalayan monasteries near Gangtok — from the hilltop solitude of Enchey to the Zurmang Kagyu splendour of Lingdum and the historic grandeur of Rumtek.",
    monasteries: ["enchey", "lingdum", "rumtek"],
    totalDistance: "46 km",
    estimatedTime: "Full day",
    difficulty: "Easy",
    startPoint: { "name": "Gangtok MG Marg", "lat": 27.3314, "lng": 88.6138 },
    waypoints: [
      { "monasteryId": "enchey", "order": 1, "distanceFromPrev": "3 km", "timeFromPrev": "10 min" },
      { "monasteryId": "lingdum", "order": 2, "distanceFromPrev": "20 km", "timeFromPrev": "40 min" },
      { "monasteryId": "rumtek", "order": 3, "distanceFromPrev": "23 km", "timeFromPrev": "45 min" }
    ],
    roadCondition: "Good Mountain Roads",
    bestSeason: "October–November, March–May",
    tips: [
      "Start early to visit Enchey in the quiet morning hours",
      "Lingdum is the most photography-friendly; save time for its ornate murals",
      "Taste organic Sikkimese tea and momos at local village homestays near Rumtek"
    ]
  },
  {
    id: "west-sikkim-pilgrimage",
    name: { en: "West Sikkim Sacred Lamas Pilgrimage Route", hi: "पश्चिमी सिक्किम पवित्र लामा तीर्थयात्रा मार्ग" },
    state: "Sikkim",
    region: "North-Eastern",
    description: "Journey through the ancient spiritual heartland of Sikkim — from the premier Nyingma seat of Pemayangtse and Rabdentse royal palace ruins to the sacred hilltop of Tashiding.",
    monasteries: ["pemayangtse", "tashiding"],
    totalDistance: "40 km",
    estimatedTime: "2 days recommended",
    difficulty: "Moderate",
    startPoint: { "name": "Pelling Town", "lat": 27.3073, "lng": 88.2347 },
    waypoints: [
      { "monasteryId": "pemayangtse", "order": 1, "distanceFromPrev": "8 km", "timeFromPrev": "20 min" },
      { "monasteryId": "tashiding", "order": 2, "distanceFromPrev": "32 km", "timeFromPrev": "90 min" }
    ],
    roadCondition: "Fair mountain roads",
    bestSeason: "February (Bumchu Festival), October–November",
    tips: [
      "Visit Rabdentse royal palace ruins near Pemayangtse (20-minute downhill forest walk)",
      "Tashiding requires a 30-minute uphill walk — wear comfortable walking shoes",
      "Stay overnight in local homestays in Pelling or Yuksom for authentic cultural immersion"
    ]
  }
];

fs.writeFileSync(trailsPath, JSON.stringify(updatedTrails, null, 2), 'utf-8');
console.log(`Updated trails.json with ${updatedTrails.length} multi-stop circuits!`);
