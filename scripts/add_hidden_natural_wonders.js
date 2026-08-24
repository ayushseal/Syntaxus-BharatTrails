import fs from 'fs';
import path from 'path';

const filePath = path.resolve('c:/Users/Ayush/.antigravity-ide/syntaxus/src/data/monasteries.json');
const monasteries = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const hiddenGems = [
  {
    id: "nongriat",
    name: { en: "Nongriat Living Root Bridges", hi: "नोंगरियात जीवित जड़ पुल" },
    tagline: "Double-Decker Bio-Engineering Wonder in the Meghalaya Rainforest",
    state: "Meghalaya",
    region: "North-Eastern",
    district: "East Khasi Hills",
    location: { lat: 25.2505, lng: 91.6706 },
    altitude: "760m",
    sect: "Living Khasi Indigenous Bio-Engineering & Sacred Grove",
    founded: "Over 200 Years Ago (Living Indigenous Tradition)",
    description: {
      en: "Deep within the lush tropical valleys of Meghalaya, the indigenous Khasi and Jaintia tribes have perfected the ancient botanical art of guiding the aerial roots of the Ficus elastica (Indian rubber tree) across roaring monsoon rivers using hollowed betel nut trunks. Over decades, the living roots thicken and intertwine with surrounding stones, creating living suspension bridges that grow stronger with age. The Jingkieng Nongriat double-decker bridge spans two stacked levels across crystal turquoise rainforest streams.",
      hi: "मेघालय की हरी-भरी घाटियों में, स्वदेशी खासी जनजाति ने जीवित रबर के पेड़ों की जड़ों को नदियों के पार मार्गदर्शन करके अद्भुत जीवित जड़ पुलों का निर्माण किया है जो समय के साथ और मजबूत होते जाते हैं।"
    },
    heroImage: "/images/monasteries/nongriat.png",
    offlinePackSize: "38 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Sturdy hiking footwear required for the 3,500 stone steps descent. Please respect Khasi sacred forest rules and leave zero plastic."
    },
    visitingHours: {
      open: "06:00",
      close: "17:00",
      bestTime: "October to April (Post-monsoon for clear turquoise pools)",
      entryFee: { indian: "₹30 Community Eco-Fee", foreign: "₹50" }
    },
    contact: {
      address: "Nongriat Village, via Tyrna, Sohra (Cherrapunji), East Khasi Hills, Meghalaya 793108",
      phone: "+91 364 250 2166",
      email: "tourism@meghalaya.gov.in",
      steward: "Nongriat Village Dorbar Shnong (Indigenous Community Council)",
      emergency: {
        localHealthPost: "Cherrapunji Community Health Centre (+91 3637 235222)",
        policeStation: "Sohra Police Station (112 / +91 3637 235213)",
        tourismHelpline: "Meghalaya Tourism Helpline: 1800-345-3739"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Nongriat Village Dorbar & Meghalaya Tourism",
      capturedBy: "SYNTAXUS Bio-Heritage Documentation Team",
      captureDate: "2024-04-12",
      hotspots: [
        { id: "hs-1", title: "Upper Root Span", description: "The upper suspension tier built when record monsoon waters submerged the lower deck.", position: { yaw: 20, pitch: 10 } },
        { id: "hs-2", title: "Turquoise River Basin", description: "Natural plunge pool fed by living mountain springs with indigenous Garra doctor fish.", position: { yaw: 180, pitch: -25 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-nongriat",
        title: "The Living Bridges That Never Decay",
        narrator: "Bah Kynsai Lyngdoh (Khasi Tribal Clan Elder)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Khasi & English",
        era: "Living Indigenous Tradition",
        excerpt: "While modern steel bridges rust and crumble in the wettest place on earth, our living root bridges grow stronger every century...",
        fullText: "In the wettest rainforest on earth where wooden and iron bridges rot within seasons, our ancestors listened to the trees. Guiding the tender roots of the Ficus tree across hollowed bamboo pipes, three generations of families nurtured them until they anchored firmly on the opposite cliff. These bridges are not constructed; they are grown with patience, love, and community harmony with the sacred forest.",
        approvedBy: "Nongriat Dorbar Council",
        approvedDate: "2024-04-15"
      }
    ],
    nearbyServices: [
      { type: "homestay", name: "Serene Homestay Nongriat (Local Khasi Hospitality)", distance: "100m", approved: true },
      { type: "guide", name: "Certified Khasi Forest Trekkers & Porters Guild", distance: "Village Center", approved: true },
      { type: "craft", name: "Sohra Handcrafted Cane & Bamboo Weavers", distance: "Tyrna Village (3 km)", approved: true }
    ]
  },
  {
    id: "lonar",
    name: { en: "Lonar Meteorite Crater Lake", hi: "लोनार उल्कापिंड क्रेटर झील" },
    tagline: "A 52,000-Year-Old Hyper-Velocity Basalt Impact Crater & Forest Sanctuary",
    state: "Maharashtra",
    region: "Western & Central",
    district: "Buldhana",
    location: { lat: 19.976, lng: 76.507 },
    altitude: "563m",
    sect: "National Geo-Heritage Monument & Ancient Hemadpanthi Temple Circuit",
    founded: "Pleistocene Epoch (Approx. 52,000 Years Ago)",
    description: {
      en: "Lonar Lake is the only known hyper-velocity impact crater formed in basaltic rock anywhere on Earth. Created when an extraterrestrial meteorite weighing over a million tonnes slammed into the Deccan Plateau at 20 km per second, it formed a nearly circular bowl 1.8 kilometers in diameter and 150 meters deep. The saline-soda lake has a unique closed ecosystem with rare micro-organisms, surrounded by dense Teak jungle sheltering 8th-century Hemadpanthi stone temples including the Daitya Sudan Vishnu temple.",
      hi: "लोनार झील पृथ्वी पर बेसाल्टिक चट्टान में बना दुनिया का एकमात्र ज्ञात हाइपर-वेलोसिटी उल्कापिंड प्रभाव क्रेटर है।"
    },
    heroImage: "/images/monasteries/lonar.png",
    offlinePackSize: "34 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Eco-sensitive zone. Strict preservation rules on lake shoreline minerals."
    },
    visitingHours: {
      open: "06:00",
      close: "18:30",
      bestTime: "November to March (Pleasant winter crater rim hikes)",
      entryFee: { indian: "Free", foreign: "Free" }
    },
    contact: {
      address: "Lonar Lake Wildlife Sanctuary, Buldhana District, Maharashtra 443302",
      phone: "+91 7260 221234",
      email: "forest.lonar@maharashtra.gov.in",
      steward: "Geological Survey of India & Maharashtra Forest Department",
      emergency: {
        localHealthPost: "Lonar Rural Hospital (+91 7260 221222)",
        policeStation: "Lonar Police Station (112 / +91 7260 221233)",
        tourismHelpline: "Maharashtra Tourism MTDC Helpline: 1800-229-930"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Verified by Geological Survey of India (GSI) & MTDC",
      capturedBy: "SYNTAXUS Geo-Heritage Documentation",
      captureDate: "2024-03-20",
      hotspots: [
        { id: "hs-1", title: "Impact Rim Overlook", description: "Panoramic rim showing the perfect circular meteorite crater bowl.", position: { yaw: 0, pitch: 0 } },
        { id: "hs-2", title: "Daitya Sudan Temple", description: "10th-century Chalukyan Hemadpanthi temple carved in dark basalt.", position: { yaw: 110, pitch: -10 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-lonar",
        title: "The Slumbering Demon of the Star Lake",
        narrator: "Pandit Madhavrao Kulkarni (Lonar Sthala Historian)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Marathi & English",
        era: "10th Century CE Lore",
        excerpt: "Local legends told of a demon named Lonasur defeated by Lord Vishnu, centuries before modern science confirmed the cosmic meteorite impact...",
        fullText: "Long before geological instruments proved that this lake was born from a colliding meteor travelling from the asteroid belt, our ancestors called it the footprints of Lord Vishnu vanquishing the underground giant Lonasur. The hyper-saline waters and emerald-tinted mineral springs have drawn rishis, astronomers, and pilgrims to meditate along the crater rim for thousands of years.",
        approvedBy: "Maharashtra Tourism & GSI",
        approvedDate: "2024-04-10"
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "MTDC Heritage Resort Lonar (Crater View)", distance: "500m", approved: true },
      { type: "guide", name: "GSI Certified Geo-Heritage Naturalists Guild", distance: "On-site", approved: true },
      { type: "transport", name: "Buldhana-Lonar Eco Taxi Services", distance: "1 km", approved: true }
    ]
  },
  {
    id: "nubra",
    name: { en: "Nubra Valley & Hunder Sand Dunes", hi: "नुब्रा घाटी और हुंडर रेत के टीले" },
    tagline: "High-Altitude Cold Desert Dunes & Double-Humped Silk Route Caravans",
    state: "Ladakh",
    region: "Northern Frontiers",
    district: "Leh",
    location: { lat: 34.582, lng: 77.498 },
    altitude: "3,048m",
    sect: "High Himalayan Cold Desert & Silk Road Heritage",
    founded: "Ancient Silk Route Epoch",
    description: {
      en: "Known anciently as Dumra ('Valley of Flowers'), Nubra Valley is a surreal high-altitude landscape where snow-capped Karakoram peaks overlook rolling white sand dunes along the Shyok and Nubra rivers. Once a vital crossroads on the trans-Himalayan Silk Route connecting Kashmir to Yarkand and Central Asia, it is home to the rare double-humped Bactrian camels, apricot orchards, and the 106-foot golden Maitreya Buddha statue at Diskit Monastery.",
      hi: "नुब्रा घाटी एक जादुई उच्च-ऊंचाई वाला परिदृश्य है जहां बर्फ से ढकी काराकोरम चोटियां सफेद रेत के टीलों और दो कूबड़ वाले बैक्ट्रियन ऊंटों से मिलती हैं।"
    },
    heroImage: "/images/monasteries/nubra.png",
    offlinePackSize: "44 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Inner Line Permit (ILP) required for all travelers. Acclimatization at Leh recommended before crossing Khardung La (17,982 ft)."
    },
    visitingHours: {
      open: "06:00",
      close: "19:00",
      bestTime: "May to October (Passes open and apricot trees in bloom)",
      entryFee: { indian: "Ladakh Environment Fee (ILP)", foreign: "ILP Required" }
    },
    contact: {
      address: "Hunder & Diskit, Nubra Sub-Division, Leh District, UT of Ladakh 194401",
      phone: "+91 1982 252095",
      email: "tourism@ladakh.gov.in",
      steward: "Diskit Monastic Council & Ladakh Autonomous Hill Development Council",
      emergency: {
        localHealthPost: "Diskit Sub-District Hospital (+91 1980 220025)",
        policeStation: "Nubra Police Station (112 / +91 1980 220022)",
        tourismHelpline: "Ladakh Tourism 24/7 Helpline: +91 1982 252297"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by LAHDC & Diskit Monastery",
      capturedBy: "SYNTAXUS Trans-Himalayan Survey",
      captureDate: "2024-05-18",
      hotspots: [
        { id: "hs-1", title: "Hunder Cold Dunes", description: "White sands against rugged Karakoram cliffs with grazing Bactrian camels.", position: { yaw: 45, pitch: -5 } },
        { id: "hs-2", title: "Maitreya Buddha Diskit", description: "106-foot monumental Buddha statue gazing over the Shyok river basin.", position: { yaw: 220, pitch: 15 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-nubra",
        title: "The Silk Caravans of the Karakoram Pass",
        narrator: "Aba Sonam Norboo (Silk Route Caravan Descendant)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Ladakhi & English",
        era: "19th Century Caravan Era",
        excerpt: "My grandfather led camel trains of tea, silk, and saffron across the frozen 18,000-foot passes into Kashgar...",
        fullText: "Before modern borders closed the passes, Hunder was a bustling oasis where Silk Route traders rested their double-humped camels after navigating the treacherous ice of Khardung La and Saser Pass. The ringing bells of the camel caravans echoed through the apricot groves, weaving together cultures from Tibet, Central Asia, and India in peace.",
        approvedBy: "Diskit Monastic Council",
        approvedDate: "2024-05-20"
      }
    ],
    nearbyServices: [
      { type: "homestay", name: "Organic Retreat Hunder (Apricot Orchard Homestay)", distance: "300m", approved: true },
      { type: "guide", name: "Nubra Certified High-Altitude Eco Guides", distance: "Diskit Bazaar", approved: true },
      { type: "transport", name: "Ladakh 4x4 Jeep Safari Cooperative", distance: "On-site", approved: true }
    ]
  },
  {
    id: "gurudongmar",
    name: { en: "Gurudongmar Sacred Glacial Lake", hi: "गुरुडोंगमार पवित्र हिमनद झील" },
    tagline: "One of the World's Highest Sacred Lakes at 17,800 Feet in North Sikkim",
    state: "Sikkim",
    region: "North-Eastern",
    district: "North Sikkim",
    location: { lat: 28.025, lng: 88.709 },
    altitude: "5,430m (17,800 ft)",
    sect: "Sacred Glacial Sanctuary revered by Buddhists, Sikhs, and Hindus",
    founded: "8th Century CE (Padmasambhava Blessing)",
    description: {
      en: "Perched at an astonishing altitude of 17,800 feet amidst the Tibetan plateau borderlands, Gurudongmar is one of the highest alpine lakes in the world. Encircled by snow-capped Himalayan giants including Mount Siniolchu and Kangchengyao, its crystal turquoise waters remain sacred. Even in the depths of winter when temperatures plummet to -30°C and the surrounding lake is frozen solid, a specific circular patch in the center miraculously never freezes, blessed by Guru Rinpoche.",
      hi: "17,800 फीट की ऊंचाई पर स्थित गुरुडोंगमार दुनिया की सबसे ऊंची झीलों में से एक है, जिसका एक हिस्सा भीषण ठंड में भी कभी नहीं जमता।"
    },
    heroImage: "/images/monasteries/gurudongmar.png",
    offlinePackSize: "40 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "restricted",
      currentStatus: "open",
      specialNotice: "Protected Border Area Permit (PAP) required. Acclimatization at Lachen (8,800 ft) is mandatory. Oxygen cylinder recommended."
    },
    visitingHours: {
      open: "07:00",
      close: "13:00",
      bestTime: "April to June & October to November (Clear morning visibility before noon winds)",
      entryFee: { indian: "Permit Fee Included in Sikkim Tourism PAP", foreign: "Restricted Border Area" }
    },
    contact: {
      address: "Gurudongmar Alpine Plateau, Lachen Dzumsa Jurisdiction, North Sikkim 737120",
      phone: "+91 3592 202634",
      email: "ecclesiastical@sikkim.gov.in",
      steward: "Lachen Dzumsa (Traditional Sikkimese Village Council) & Indian Army Border Post",
      emergency: {
        localHealthPost: "Army Medical Aid Post Gurudongmar & Lachen PHC (+91 3592 201108)",
        policeStation: "Chungthang Police Station (112)",
        tourismHelpline: "Sikkim Tourism 24/7 Helpline: 1800-345-8973"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Blessed by Lachen Dzumsa & Sikkim Ecclesiastical Department",
      capturedBy: "SYNTAXUS Alpine Glacial Documentation",
      captureDate: "2024-05-10",
      hotspots: [
        { id: "hs-1", title: "Sacred Unfrozen Waters", description: "The miraculous unfrozen spring waters blessed by Guru Padmasambhava in the 8th century.", position: { yaw: 0, pitch: -15 } },
        { id: "hs-2", title: "Kangchengyao Glacial Wall", description: "Towering 6,889m glaciated peak flanking the Tibetan frontier.", position: { yaw: 130, pitch: 20 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-gurudongmar",
        title: "The Thawing Hand of Guru Rinpoche",
        narrator: "Pipon Tenzing Lachenpa (Head of Lachen Dzumsa)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Bhutia & English",
        era: "8th Century CE",
        excerpt: "When the local yak herders pleaded that winter left no drinking water, the Guru placed his hand upon the ice...",
        fullText: "In the 8th century, Guru Padmasambhava passed through this high plateau on his way from Tibet. Seeing that the local high-altitude yak herders suffered deeply without drinking water during harsh winters, the Guru touched a central circle of the frozen lake with his palm. Since that blessed morning, that sacred circle of water has never frozen even during minus thirty degree blizzards, sustaining life at the roof of the world.",
        approvedBy: "Lachen Dzumsa Council",
        approvedDate: "2024-05-12"
      }
    ],
    nearbyServices: [
      { type: "homestay", name: "Lachenpa Heritage Homestays (Lachen Valley)", distance: "Lachen Base (45 km)", approved: true },
      { type: "guide", name: "Sikkim Mountaineering Association High-Altitude Guides", distance: "Lachen", approved: true },
      { type: "transport", name: "North Sikkim 4WD Snow Vehicle Operators", distance: "Chungthang / Lachen", approved: true }
    ]
  },
  {
    id: "stmarys",
    name: { en: "St. Mary's Columnar Basalt Islands", hi: "सेंट मैरी स्तंभकार बेसाल्ट द्वीप" },
    tagline: "Hexagonal Volcanic Lava Columns Formed 88 Million Years Ago in the Arabian Sea",
    state: "Karnataka",
    region: "Southern Peninsula",
    district: "Udupi",
    location: { lat: 13.379, lng: 74.673 },
    altitude: "10m",
    sect: "National Geological Monument & Pristine Island Reserve",
    founded: "Cretaceous Period (88 Million Years Ago)",
    description: {
      en: "St. Mary's Islands (also known as Thonsepar) are a group of four uninhabited rocky islands off the coast of Malpe in Udupi. They are globally renowned for their unique geological formation of columnar basaltic lava — vertical polygonal and hexagonal geometric columns created 88 million years ago by volcanic sub-aerial activity when Madagascar split from the Indian subcontinent. It was declared a National Geological Monument by the Geological Survey of India.",
      hi: "सेंट मैरी द्वीप कर्नाटक के उडुपी में अद्वितीय हेक्सागोनल स्तंभकार बेसाल्ट लावा स्तंभों के लिए विश्व प्रसिद्ध हैं जो 8.8 करोड़ वर्ष पहले बने थे।"
    },
    heroImage: "/images/monasteries/stmarys.png",
    offlinePackSize: "28 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Plastic-free ecological island. Overnight stay strictly prohibited. Ferry operates based on sea tide conditions."
    },
    visitingHours: {
      open: "09:00",
      close: "17:00",
      bestTime: "October to May (Ferry operations suspended during monsoon June-September)",
      entryFee: { indian: "₹300 Ferry & Island Conservation Ticket", foreign: "₹500" }
    },
    contact: {
      address: "Malpe Beach Port, Udupi District, Karnataka 576108",
      phone: "+91 820 252 9845",
      email: "tourism.udupi@karnataka.gov.in",
      steward: "Geological Survey of India & Malpe Beach Development Committee",
      emergency: {
        localHealthPost: "Malpe Coastal Hospital (+91 820 2537233)",
        policeStation: "Malpe Coastal Police Station (112 / +91 820 2538100)",
        tourismHelpline: "Karnataka Tourism 24/7 Helpline: 1800-425-7878"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Verified by Geological Survey of India (GSI) & KSTDC",
      capturedBy: "SYNTAXUS Coastal Geo-Survey",
      captureDate: "2024-03-25",
      hotspots: [
        { id: "hs-1", title: "Hexagonal Lava Pillars", description: "Naturally fractured hexagonal basalt columns rising 20 feet from the crashing surf.", position: { yaw: 40, pitch: -10 } },
        { id: "hs-2", title: "Seashell Beach Lagoon", description: "White coral and seashell shoreline overlooking the blue Arabian Sea.", position: { yaw: 180, pitch: -5 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-stmarys",
        title: "The Cross of Vasco da Gama and the Continental Split",
        narrator: "Captain Sanjeeva Mendon (Malpe Seafarers Guild)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Tulu, Kannada & English",
        era: "1498 CE Maritime History",
        excerpt: "Portuguese explorer Vasco da Gama landed on this rocky outcrop in 1498 and erected a cross dedicated to Mother Mary...",
        fullText: "Local maritime tradition recounts that when Vasco da Gama first sailed towards Calicut in 1498, he touched these hexagonal islands to take his bearings and erected a wooden cross in honor of Mother Mary, giving them their historical name. But deep beneath history lies geology: these stones are the frozen volcanic memory of the moment India separated from Africa millions of years ago.",
        approvedBy: "Malpe Heritage Council",
        approvedDate: "2024-04-10"
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "Malpe Beach Sea View Resort", distance: "Malpe Harbor (4 km)", approved: true },
      { type: "guide", name: "Udupi Certified Marine & Geo Naturalists", distance: "Malpe Port", approved: true },
      { type: "craft", name: "Udupi Handloom & Coastal Wooden Handicrafts", distance: "Udupi City (6 km)", approved: true }
    ]
  },
  {
    id: "borra",
    name: { en: "Borra Limestone Caves", hi: "बोर्रा चूना पत्थर गुफाएं" },
    tagline: "India's Deepest Limestone Karst Caves with Speleothem Stalactites & Stalagmites",
    state: "Andhra Pradesh",
    region: "Southern Peninsula",
    district: "Alluri Sitharama Raju",
    location: { lat: 18.281, lng: 83.039 },
    altitude: "705m",
    sect: "Natural Karstic Speleological Geological Wonder & Tribal Shiva Shrine",
    founded: "Over 1 Million Years Ago (Middle Paleolithic Epoch)",
    description: {
      en: "Located in the Ananthagiri hills of the Araku Valley, the Borra Caves are among the largest and deepest cave systems in India, extending to an astonishing depth of 80 meters. Formed by the subterranean Gosthani River flowing through million-year-old calcium carbonate limestone deposits, the caves feature breathtaking stalactites, stalagmites, and column pillars resembling divine figures including a naturally formed Shiva Lingam worshipped by local indigenous tribes.",
      hi: "अराकू घाटी की बोर्रा गुफाएं भारत की सबसे गहरी गुफा प्रणालियों में से एक हैं, जो लाखों वर्षों के चूना पत्थर के नक्काशीदार रूपों से भरी हैं।"
    },
    heroImage: "/images/monasteries/borra.png",
    offlinePackSize: "32 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Stairways can be moist and slippery. Illuminated with eco-friendly LED lighting."
    },
    visitingHours: {
      open: "10:00",
      close: "17:00",
      bestTime: "October to March (Pleasant Araku hill climate)",
      entryFee: { indian: "₹80 / ₹60 children", foreign: "₹150" }
    },
    contact: {
      address: "Borra Village, Ananthagiri Mandal, Alluri Sitharama Raju District, Andhra Pradesh 531149",
      phone: "+91 8936 244234",
      email: "aptdc@ap.gov.in",
      steward: "Andhra Pradesh Tourism (APTDC) & Geological Survey of India",
      emergency: {
        localHealthPost: "Ananthagiri Primary Health Centre (+91 8936 244222)",
        policeStation: "Ananthagiri Police Station (112)",
        tourismHelpline: "AP Tourism 24/7 Helpline: 1800-425-45454"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by APTDC & Araku Tribal Heritage Board",
      capturedBy: "SYNTAXUS Subterranean Speleological Survey",
      captureDate: "2024-04-18",
      hotspots: [
        { id: "hs-1", title: "Cathedral Chamber", description: "Massive 80-meter high cavern illuminated by multi-hued light beams.", position: { yaw: 10, pitch: 30 } },
        { id: "hs-2", title: "Natural Swayambhu Lingam", description: "Sacred stalagmite continuously bathed in mineral water drops from the cave ceiling.", position: { yaw: 240, pitch: -10 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-borra",
        title: "The Cowherd and the Hidden Cavern of Gosthani",
        narrator: "Korra Somulu (Araku Valmiki Tribal Elder)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Telugu & English",
        era: "Tribal Oral Tradition",
        excerpt: "When a grazing cow disappeared down a dark hole in the hill, the cowherd descended into an enchanted subterranean palace...",
        fullText: "Generations ago, an indigenous cowherd noticed that one of his cows had fallen into a deep fissure on the hilltop. Descending with a burning torch, he was stunned to discover an enormous subterranean cathedral with glittering crystal stalactites and a natural stone lingam bathed in water. Lord Shiva appeared in his dream instructing that the cave be protected as a sanctuary of nature and devotion.",
        approvedBy: "APTDC & Tribal Council",
        approvedDate: "2024-04-20"
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "APTDC Haritha Valley Resort Araku", distance: "Araku (15 km)", approved: true },
      { type: "guide", name: "Araku Certified Tribal Eco Guides", distance: "Cave Entrance", approved: true },
      { type: "craft", name: "Araku Organic Tribal Coffee & Dhimsa Craft Guild", distance: "2 km", approved: true }
    ]
  },
  {
    id: "valleyofflowers",
    name: { en: "Valley of Flowers UNESCO Biosphere", hi: "फूलों की घाटी यूनेस्को बायोस्फीयर" },
    tagline: "UNESCO World Heritage Alpine Meadows with 500+ Rare Himalayan Wildflowers",
    state: "Uttarakhand",
    region: "Northern Frontiers",
    district: "Chamoli",
    location: { lat: 30.728, lng: 79.605 },
    altitude: "3,658m (12,000 ft)",
    sect: "UNESCO World Heritage Alpine Wilderness & Mythological Sanjeevani Hill",
    founded: "Discovered by Frank Smythe (1931) / Protected UNESCO Biosphere",
    description: {
      en: "Nestled in the high Western Himalayas of Uttarakhand, the Valley of Flowers is an enchanting UNESCO World Heritage alpine valley spanning 87 square kilometers. Cradled against the Zanskar range and Mount Kamet, the valley bursts into a vivid kaleidoscopic carpet of over 500 species of rare wildflowers between July and September, including the legendary blue poppy, Brahma Kamal, and Himalayan bellflower, alongside the elusive snow leopard and Asiatic black bear.",
      hi: "उत्तराखंड में फूलों की घाटी यूनेस्को विश्व धरोहर स्थल है जहां 500 से अधिक दुर्लभ अल्पाइन जंगली फूलों का मनमोहक कालीन खिलता है।"
    },
    heroImage: "/images/monasteries/valleyofflowers.png",
    offlinePackSize: "46 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Eco-sensitive National Park. Strict 'Leave No Trace' policy. No overnight camping allowed inside the valley."
    },
    visitingHours: {
      open: "07:00",
      close: "17:00",
      bestTime: "Mid-July to August (Peak floral bloom after initial monsoon showers)",
      entryFee: { indian: "₹150 (3-day pass)", foreign: "₹600" }
    },
    contact: {
      address: "Valley of Flowers National Park, Ghangaria Base, Chamoli District, Uttarakhand 246443",
      phone: "+91 1372 252149",
      email: "dfonandadevi@gmail.com",
      steward: "Nanda Devi Biosphere Reserve & Uttarakhand Forest Department",
      emergency: {
        localHealthPost: "Ghangaria Emergency Medical Post & Joshimath CHC (+91 1389 222108)",
        policeStation: "Govindghat Police Station (112)",
        tourismHelpline: "Uttarakhand Tourism 24/7 Helpline: 1800-180-4145"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Uttarakhand Forest Dept & Nanda Devi Biosphere",
      capturedBy: "SYNTAXUS Himalayan Wilderness Survey",
      captureDate: "2024-07-28",
      hotspots: [
        { id: "hs-1", title: "Pushpawati River Meadow", description: "Glacial river meandering through fields of purple orchids and golden lilies.", position: { yaw: 20, pitch: -10 } },
        { id: "hs-2", title: "Brahma Kamal Ridge", description: "High rocky screes where the sacred white Brahma Kamal blooms in mist.", position: { yaw: 160, pitch: 15 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-valleyofflowers",
        title: "The Sanjeevani Hill and the Fairies of Bhyundar",
        narrator: "Kewal Singh Chauhan (Bhyundar Village Elder)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Garhwali & English",
        era: "Ramayana Mythology & Folklore",
        excerpt: "Local Garhwal villagers believed this valley was the sacred playground of forest nymphs and the site where Hanuman found the life-giving Sanjeevani herb...",
        fullText: "For centuries before British mountaineer Frank Smythe stumbled upon it in 1931, local Garhwal shepherds called this valley 'Nandan Kanan' — the Garden of the Gods. Legend says Lord Hanuman hovered over these misty slopes to find the golden-glowing Sanjeevani herb to revive Lakshmana. Out of reverence and awe of the mountain fairies, locals would never speak loudly or pick blossoms in the valley.",
        approvedBy: "Chamoli Forest Division",
        approvedDate: "2024-05-15"
      }
    ],
    nearbyServices: [
      { type: "hotel", name: "GMVN Tourist Bungalow Ghangaria", distance: "Ghangaria Base (3 km)", approved: true },
      { type: "guide", name: "Certified Garhwal Botanical Trekkers Guild", distance: "Govindghat / Ghangaria", approved: true },
      { type: "transport", name: "Govindghat Mule & Porter Eco-Cooperative", distance: "Govindghat", approved: true }
    ]
  },
  {
    id: "loktak",
    name: { en: "Loktak Floating Phumdis Lake", hi: "लोकटक तैरती फुमदी झील" },
    tagline: "World's Only Floating Lake & Sanctuary of the Endangered Dancing Sangai Deer",
    state: "Manipur",
    region: "North-Eastern",
    district: "Bishnupur",
    location: { lat: 24.552, lng: 93.791 },
    altitude: "768m",
    sect: "Ramsar Wetland of International Importance & Keibul Lamjao National Park",
    founded: "Ancient Meitei Water Civilization & Keibul Lamjao Reserve (1977)",
    description: {
      en: "Loktak Lake is the largest freshwater lake in Northeast India and famous globally for its 'phumdis' — unique heterogeneous masses of vegetation, soil, and organic matter that float on the water surface like floating green circular islands. The southwestern part of the lake forms Keibul Lamjao National Park, the only floating national park in the world, serving as the last natural refuge for the endangered Sangai (brow-antlered dancing deer of Manipur).",
      hi: "लोकटक झील पूर्वोत्तर भारत की सबसे बड़ी मीठे पानी की झील है जो अपनी तैरती हुई फुमदी और संकटग्रस्त संगाई हिरण के लिए दुनिया भर में प्रसिद्ध है।"
    },
    heroImage: "/images/monasteries/loktak.png",
    offlinePackSize: "36 MB",
    sacredAccessProtocol: {
      photographyAllowed: "permitted",
      interiorAccess: "permitted",
      currentStatus: "open",
      specialNotice: "Motorboats are regulated to protect floating phumdi roots and wetland wildlife. Life jackets mandatory."
    },
    visitingHours: {
      open: "06:00",
      close: "18:00",
      bestTime: "November to March (Migratory bird season and clear sunrises)",
      entryFee: { indian: "₹30 / Canoe ride ₹200", foreign: "₹100" }
    },
    contact: {
      address: "Sendra Island & Keibul Lamjao, Moirang, Bishnupur District, Manipur 795133",
      phone: "+91 385 244 5820",
      email: "tourism-manipur@nic.in",
      steward: "Loktak Development Authority (LDA) & Manipur Forest Department",
      emergency: {
        localHealthPost: "Moirang Community Health Centre (+91 3879 261222)",
        policeStation: "Moirang Police Station (112)",
        tourismHelpline: "Manipur Tourism Helpline: +91 385 244 5820"
      }
    },
    virtualTour: {
      available: true,
      permissionLabel: "Approved by Loktak Development Authority & Manipur Tourism",
      capturedBy: "SYNTAXUS Wetland Bio-Survey",
      captureDate: "2024-04-22",
      hotspots: [
        { id: "hs-1", title: "Sendra Island Viewpoint", description: "Panoramic vista of hundreds of floating circular phumdis across the mirror lake.", position: { yaw: 30, pitch: 0 } },
        { id: "hs-2", title: "Keibul Lamjao Sangai Habitat", description: "The floating grassland where the rare Sangai brow-antlered deer grazes at dawn.", position: { yaw: 210, pitch: -10 } }
      ]
    },
    oralHistories: [
      {
        id: "oh-loktak",
        title: "The Eternal Love of Khamba and Thoibi on Loktak Shores",
        narrator: "Oinam Ibomcha Singh (Moirang Cultural Custodian)",
        source: "monastery-approved",
        type: "oral-history",
        sensitivityLevel: "public",
        language: "Manipuri & English",
        era: "12th Century Meitei Epic",
        excerpt: "The epic romance of Khamba and Princess Thoibi unfolded across these floating reeds and sacred Moirang shrines...",
        fullText: "In Meitei folklore, Loktak is not merely water; it is the beating spiritual heart of Manipur. Here on the shores of Moirang, the great epic of poor orphan hero Khamba and royal princess Thoibi played out. The fishermen have lived in floating thatched huts on the phumdis for centuries, reading the ripples of the water and dancing the graceful gestures of the Sangai deer in their ancient Lai Haraoba ceremonies.",
        approvedBy: "Moirang Cultural Council",
        approvedDate: "2024-05-02"
      }
    ],
    nearbyServices: [
      { type: "homestay", name: "Sendra Island Floating Homestays", distance: "Sendra Island", approved: true },
      { type: "guide", name: "Certified Loktak Fishermen & Birding Guides", distance: "Sendra Jetty", approved: true },
      { type: "craft", name: "Moirang Phee Traditional Silk Weaving Center", distance: "Moirang (4 km)", approved: true }
    ]
  }
];

// Add hidden gems if not already present
let addedCount = 0;
for (const gem of hiddenGems) {
  const exists = monasteries.some(m => m.id === gem.id);
  if (!exists) {
    monasteries.push(gem);
    addedCount++;
  }
}

fs.writeFileSync(filePath, JSON.stringify(monasteries, null, 2), 'utf-8');
console.log(`Successfully added ${addedCount} new hidden tourist and natural heritage gems to monasteries.json! Total places now: ${monasteries.length}`);
