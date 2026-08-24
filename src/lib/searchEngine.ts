/**
 * High-Precision, Typo-Tolerant & SEO-Optimized Search Engine for Bharat Heritage & Tourism Atlas
 * Resolves fuzzy queries (e.g. "gurudom" -> Gurudongmar) while strictly eliminating false positives (e.g. "guru" -> Meenakshi).
 */

// Comprehensive Curated SEO Aliases & Keywords for All 58 Monuments
export const HERITAGE_SEO_ALIASES: Record<string, string[]> = {
  // --- North Sikkim & Northeast ---
  gurudongmar: [
    "gurudom",
    "gurudong",
    "gurudongmar",
    "gurudongmar lake",
    "guru dongmar",
    "guru dongmar lake",
    "gurudom lake",
    "gurudong lake",
    "guru rinpoche",
    "padmasambhava lake",
    "north sikkim sacred lake",
    "highest lake in india",
    "17800 ft glacial lake",
    "lachen",
    "dzumsa",
    "kangchengyao",
    "siniolchu",
    "holy frozen lake",
  ],
  manasarovar: [
    "manasarovar",
    "manas sarovar",
    "manas",
    "mansarovar",
    "kailash mansarovar",
    "lake mansarovar",
    "mount kailash",
    "kailash parbat",
    "kailash yatra",
    "mapam yumtso",
    "chiu gompa",
    "rakshastal",
    "lipulekh",
    "dharchula",
    "gunji",
    "kumaon yatra",
    "sacred lake",
    "shiva abode",
  ],
  rumtek: [
    "rumtek",
    "rumteck",
    "dharma chakra centre",
    "karmapa",
    "black hat",
    "kagyu",
    "kagyupa",
    "gangtok",
    "sikkim monastery",
  ],
  pemayangtse: [
    "pemayangtse",
    "pemayangste",
    "pemayangze",
    "perfect sublime lotus",
    "nyingma",
    "lhatsun chenpo",
    "sangngag choeling",
    "pelling",
    "west sikkim",
    "zandogpalri",
  ],
  tashiding: [
    "tashiding",
    "thongwa rangdrol",
    "sacred stupa",
    "rathong river",
    "yuksom",
    "bhumchu",
    "holy water festival",
    "sikkim",
  ],
  enchey: [
    "enchey",
    "solitary temple",
    "drupthob karpo",
    "gangtok",
    "vajrayana",
    "flying lama",
    "sikkim",
  ],
  ralang: [
    "ralang",
    "palchen chosling",
    "kagyupa",
    "ravangla",
    "south sikkim",
    "pang lhabsol",
  ],
  lingdum: [
    "lingdum",
    "ranka",
    "ranka monastery",
    "zurmang kagyu",
    "east sikkim",
    "gangtok",
  ],
  tawang: [
    "tawang",
    "tawang monastery",
    "galden namgey lhatse",
    "arunachal pradesh",
    "monpa",
    "merak lama",
    "dalai lama birth route",
    "highest monastery",
  ],
  nongriat: [
    "nongriat",
    "living root bridge",
    "double decker root bridge",
    "cherrapunji",
    "sohra",
    "meghalaya",
    "khasi bioengineering",
    "rainbow falls",
  ],
  unakoti: [
    "unakoti",
    "unokoti",
    "one less than a crore",
    "shaivite rock carvings",
    "tripura",
    "kailashahar",
    "bas-relief shiva",
    "raghunandan hills",
  ],
  loktak: [
    "loktak",
    "loktak lake",
    "phumdis",
    "floating lake",
    "keibul lamjao",
    "sangai deer",
    "manipur",
    "moirang",
    "sendra island",
  ],

  // --- Central & Deccan Sultanates / Forts (AICTE PS ID 26202 Expansion) ---
  ramappa: [
    "ramappa",
    "ramapa",
    "ramappa temple",
    "kakatiya",
    "rudreswara",
    "ramalingeswara",
    "palampet",
    "mulugu",
    "warangal",
    "floating bricks",
    "sandbox foundation",
    "recharla rudra",
    "telangana unesco",
  ],
  golgumbaz: [
    "golgumbaz",
    "gol gumbaz",
    "gol gumbad",
    "golgumbad",
    "bijapur",
    "vijayapura",
    "mohammed adil shah",
    "whispering gallery",
    "acoustic dome",
    "largest dome in india",
    "deccan sultanate",
    "karnataka",
  ],
  bidar: [
    "bidar",
    "bidar fort",
    "rangin mahal",
    "tarkash mahal",
    "gagan mahal",
    "bahmani sultanate",
    "barid shahi",
    "mahmud gawan",
    "bidriware",
    "karnataka fort",
    "karez water system",
  ],
  undavalli: [
    "undavalli",
    "undavalli caves",
    "undavali",
    "undavalli rock cut",
    "anantasayana vishnu",
    "reclining vishnu",
    "vishnukundina",
    "guntur",
    "vijayawada",
    "krishna river",
    "andhra pradesh caves",
  ],
  ramtek: [
    "ramtek",
    "ramtek fort",
    "ramtek gad mandir",
    "ramagiri",
    "kalidasa",
    "meghaduta",
    "vakataka",
    "prabhavatigupta",
    "shri ram temple nagpur",
    "maharashtra fort",
  ],
  panhala: [
    "panhala",
    "panhala fort",
    "panhalgad",
    "chhatrapati shivaji maharaj",
    "baji prabhu deshpande",
    "pawan khind",
    "teen darwaza",
    "sajja kothi",
    "kolhapur",
    "maratha hill fort",
  ],
  golconda: [
    "golconda",
    "golconda fort",
    "golkonda",
    "qutb shahi",
    "kohinoor diamond",
    "fateh darwaza",
    "acoustic clapping portico",
    "hyderabad",
    "telangana",
  ],

  // --- Classical Indian Heritage, UNESCO Sanctuaries & Wonders ---
  maduraimeenakshi: [
    "meenakshi",
    "meenakshi amman",
    "madurai meenakshi",
    "meenakshi sundareswarar",
    "gopuram",
    "1000 pillar hall",
    "golden lotus tank",
    "porthamarai kulam",
    "madurai",
    "tamil nadu temple",
    "pandya nayaka",
  ],
  "taj-mahal": [
    "taj",
    "taj mahal",
    "tajmahal",
    "mumtaz mahal",
    "shah jahan",
    "agra",
    "uttar pradesh",
    "seven wonders of the world",
    "white marble",
    "yamuna river",
    "mughal architecture",
  ],
  "agra-fort": [
    "agra fort",
    "red fort of agra",
    "jahangiri mahal",
    "khas mahal",
    "diwan-i-aam",
    "akbar fort",
    "agra",
    "uttar pradesh",
  ],
  "fatehpur-sikri": [
    "fatehpur sikri",
    "fatehpur",
    "buland darwaza",
    "salim chishti",
    "panch mahal",
    "ibadat khana",
    "akbar capital",
    "agra",
  ],
  "humayun-tomb": [
    "humayun tomb",
    "humayun's tomb",
    "humayun",
    "bega begum",
    "charbagh garden",
    "delhi",
    "nizamuddin",
    "mughal garden tomb",
  ],
  "qutub-complex": [
    "qutub minar",
    "qutb minar",
    "qutub complex",
    "iron pillar of delhi",
    "quwwat ul islam",
    "ala-i-darwaza",
    "mehrauli",
    "delhi",
    "qutb-ud-din aibak",
  ],
  "red-fort": [
    "red fort",
    "lal qila",
    "shahjahanabad",
    "lahori gate",
    "diwan-i-khas",
    "moti masjid",
    "old delhi",
    "mughal palace",
  ],
  "jantar-mantar": [
    "jantar mantar",
    "samrat yantra",
    "sawai jai singh",
    "jaipur",
    "astronomical observatory",
    "rajasthan unesco",
    "sundial",
  ],
  "agrasen-ki-baoli": [
    "agrasen ki baoli",
    "ugrasen ki baoli",
    "stepwell delhi",
    "hailey road",
    "connaught place",
    "delhi stepwell",
  ],

  khajuraho: [
    "khajuraho",
    "khajura",
    "kajuraho",
    "khajuraho temples",
    "kandariya mahadeva",
    "lakshmana temple",
    "chandela dynasty",
    "chhatarpur",
    "madhya pradesh unesco",
    "erotic sculptures",
    "nagara architecture",
  ],
  sanchi: [
    "sanchi",
    "sanchi stupa",
    "great stupa of sanchi",
    "emperor ashoka",
    "torana gateways",
    "buddhist stupa",
    "raisin",
    "bhopal",
    "madhya pradesh",
  ],
  dakshineswar: [
    "dakshineswar",
    "dakshineshwar",
    "dakshineswar kali temple",
    "bhavatarini",
    "rani rashmoni",
    "sri ramakrishna paramahamsa",
    "hooghly river",
    "kolkata",
    "west bengal",
    "navaratna temple",
  ],
  bishnupur: [
    "bishnupur",
    "vishnupur",
    "bishnupur terracotta",
    "jor bangla",
    "rasmancha",
    "shyam rai",
    "madan mohan",
    "malla dynasty",
    "bankura",
    "terracotta temples",
    "west bengal",
  ],
  "cooch-behar-palace": [
    "cooch behar",
    "coochbehar",
    "victor jubilee palace",
    "maharaja nripendra narayan",
    "koch dynasty",
    "west bengal palace",
    "buckingham palace replica",
  ],
  konark: [
    "konark",
    "konarka",
    "konark sun temple",
    "black pagoda",
    "king narasimhadeva",
    "eastern ganga dynasty",
    "puri",
    "odisha unesco",
    "chariot wheels",
    "sundial wheels",
  ],
  mahabodhi: [
    "mahabodhi",
    "mahabodhi temple",
    "bodh gaya",
    "bodhgaya",
    "bodhi tree",
    "diamond throne",
    "vajrasana",
    "lord buddha enlightenment",
    "gaya",
    "bihar unesco",
  ],
  nalanda: [
    "nalanda",
    "nalanda mahavihara",
    "ancient nalanda university",
    "kumaragupta",
    "dharmaganj library",
    "hiuen tsang",
    "xuanzang",
    "rajgir",
    "bihar unesco",
  ],
  sarnath: [
    "sarnath",
    "dhamek stupa",
    "chaukhandi stupa",
    "deer park",
    "dhammacakkappavattana",
    "first sermon",
    "varanasi",
    "uttar pradesh",
    "ashoka pillar lion capital",
  ],

  hampi: [
    "hampi",
    "hamp",
    "vijayanagara empire",
    "virupaksha temple",
    "vittala temple",
    "stone chariot",
    "krishnadevaraya",
    "tungabhadra river",
    "bellary",
    "karnataka unesco",
  ],
  thanjavur: [
    "thanjavur",
    "thanjavur big temple",
    "brihadeeswarar temple",
    "peruvudaiyar kovil",
    "rajaraja chola",
    "great living chola temples",
    "tamil nadu unesco",
    "granite temple",
  ],
  mamallapuram: [
    "mamallapuram",
    "mahabalipuram",
    "shore temple",
    "pancha rathas",
    "descent of the ganges",
    "arjuna penance",
    "pallava dynasty",
    "narasimhavarman",
    "coromandel coast",
    "tamil nadu unesco",
  ],
  gandikota: [
    "gandikota",
    "grand canyon of india",
    "pennar river gorge",
    "gandikota fort",
    "pemmasani nayaks",
    "madhavaraya temple",
    "kadapa",
    "andhra pradesh",
  ],
  bekal: [
    "bekal",
    "bekal fort",
    "kasaragod",
    "kerala beach fort",
    "shivappa nayaka",
    "keladi nayakas",
    "arabian sea coastal fortress",
  ],
  "st-marys-island": [
    "st marys island",
    "st mary",
    "st marys",
    "columnar basaltic lava",
    "udupi",
    "malpe",
    "karnataka geological monument",
    "vasco da gama",
  ],
  "borra-caves": [
    "borra caves",
    "borra",
    "araku valley",
    "anantagiri hills",
    "stalactites and stalagmites",
    "gosthani river",
    "visakhapatnam",
    "andhra pradesh caves",
  ],

  ajanta: [
    "ajanta",
    "ajanta caves",
    "ajanta frescoes",
    "padmapani",
    "buddhist cave paintings",
    "waghur river gorge",
    "vakataka dynasty",
    "aurangabad",
    "chhatrapati sambhajinagar",
    "maharashtra unesco",
  ],
  ellora: [
    "ellora",
    "ellora caves",
    "kailash temple",
    "kailasa cave 16",
    "monolithic rock cut temple",
    "rashtrakuta",
    "krishna i",
    "charanandri hills",
    "maharashtra unesco",
  ],
  "elephanta-caves": [
    "elephanta",
    "elephanta caves",
    "trimurti sadashiva",
    "gharapuri",
    "mumbai harbour",
    "konkan mauryas",
    "rashtrakuta shiva",
    "maharashtra unesco",
  ],
  lonar: [
    "lonar",
    "lonar crater lake",
    "hypervelocity meteorite impact",
    "saline soda lake",
    "buldhana",
    "ramsar site",
    "maharashtra geological wonder",
  ],

  dholavira: [
    "dholavira",
    "dholavir",
    "harappan city",
    "indus valley civilization",
    "rann of kutch",
    "khadir bet",
    "ancient water reservoirs",
    "gujarat unesco",
  ],
  lothal: [
    "lothal",
    "harappan dockyard",
    "ancient tidal port",
    "indus valley maritime",
    "bhal region",
    "ahmedabad",
    "gujarat ivc",
  ],
  "rani-ki-vav": [
    "rani ki vav",
    "queen's stepwell",
    "patan",
    "solanki dynasty",
    "chaulukya",
    "queen udayamati",
    "maru-gurjara architecture",
    "gujarat unesco",
  ],

  mehrangarh: [
    "mehrangarh",
    "mehrangarh fort",
    "jodhpur",
    "rao jodha",
    "blue city fort",
    "sheesh mahal jodhpur",
    "moti mahal",
    "marwar rathore",
    "rajasthan fort",
  ],
  kumbhalgarh: [
    "kumbhalgarh",
    "kumbhalgarh fort",
    "great wall of india",
    "rana kumbha",
    "mewar fortress",
    "badal mahal",
    "second longest continuous wall",
    "rajasthan unesco",
  ],
  chittorgarh: [
    "chittorgarh",
    "chittor fort",
    "vijay stambha",
    "kirti stambha",
    "padmini palace",
    "rana kumbha",
    "mewar capital",
    "rajasthan unesco",
  ],

  "valley-of-flowers": [
    "valley of flowers",
    "chamoli",
    "bhyundar valley",
    "pushpawati river",
    "brahma kamal",
    "nanda devi biosphere",
    "uttarakhand unesco",
    "alpine floral meadow",
  ],
  nubra: [
    "nubra",
    "nubra valley",
    "diskit monastery",
    "hunder sand dunes",
    "bactrian double hump camel",
    "shyok river",
    "siachen gateway",
    "ladakh high altitude valley",
  ],
  sirpur: [
    "sirpur",
    "shirpur",
    "laxman temple",
    "brick temple",
    "mahasamund",
    "somavamsi dynasty",
    "queen vasata",
    "chhattisgarh heritage",
    "mahanadi river",
  ],
};

/**
 * Normalizes text for clean keyword comparison.
 */
export function normalizeStr(str: string): string {
  if (!str) return "";
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // remove diacritics
    .replace(/[^a-z0-9\s]/g, " ") // strip symbols
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Standard Levenshtein Distance
 */
export function levenshteinDistance(s1: string, s2: string): number {
  const m = s1.length;
  const n = s2.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const d: number[][] = [];
  for (let i = 0; i <= m; i++) d[i] = [i];
  for (let j = 0; j <= n; j++) d[0][j] = j;

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1,
        d[i][j - 1] + 1,
        d[i - 1][j - 1] + cost
      );
    }
  }
  return d[m][n];
}

/**
 * Robust token-against-word matching with strict character validation
 */
function matchTokenAgainstWord(queryToken: string, targetWord: string): number {
  if (!queryToken || !targetWord) return 0;

  // 1. Exact Match
  if (queryToken === targetWord) return 100;

  // 2. Direct Substring Match
  // E.g. "guru" in "gurudongmar" (targetWord startsWith "guru")
  if (targetWord.startsWith(queryToken)) {
    // If targetWord begins with queryToken, high score!
    return 95;
  }

  if (targetWord.includes(queryToken)) {
    // Word contains queryToken inside (e.g. "fort" in "kolhapurfort")
    if (queryToken.length >= 4) return 88;
    if (queryToken.length === 3) return 80;
  }

  // 3. Short Query Strictness (queries <= 4 chars like "lake", "guru", "taj", "fort")
  if (queryToken.length <= 4) {
    if (queryToken[0] !== targetWord[0]) {
      return 0; // First letter must match for short queries
    }
    // For short queries, only permit 1-character typo if word lengths are within 1
    if (Math.abs(queryToken.length - targetWord.length) <= 1) {
      const dist = levenshteinDistance(queryToken, targetWord);
      if (dist <= 1 && queryToken.length >= 4) {
        return 75;
      }
    }
    return 0;
  }

  // 4. Longer Query Typo Tolerance (e.g. "gurudom" vs "gurudongmar" length >= 5)
  // Check if first 2 characters match to eliminate random cross-word collisions
  if (queryToken.substring(0, 2) === targetWord.substring(0, 2)) {
    const minLen = Math.min(queryToken.length, targetWord.length);
    if (minLen >= 5) {
      const qSub = queryToken.substring(0, minLen);
      const tSub = targetWord.substring(0, minLen);
      const dist = levenshteinDistance(qSub, tSub);

      if (dist === 1) return 85; // e.g. "gurudom" vs "gurudon" (distance 1)
      if (dist === 2 && minLen >= 7) return 72;
    }

    const fullDist = levenshteinDistance(queryToken, targetWord);
    if (fullDist <= 1) return 82;
    if (fullDist <= 2 && queryToken.length >= 6) return 70;
  }

  return 0;
}

/**
 * Calculates search score for candidate text against a query
 */
export function calculateMatchScore(query: string, text: string): number {
  const normQuery = normalizeStr(query);
  const normText = normalizeStr(text);

  if (!normQuery || !normText) return 0;

  // Exact full phrase match
  if (normText === normQuery) return 100;
  if (normText.startsWith(normQuery)) return 95;
  if (normText.includes(normQuery)) return 90;

  const queryTokens = normQuery.split(" ").filter((t) => t.length > 0);
  const targetWords = normText.split(" ").filter((w) => w.length > 0);

  if (queryTokens.length === 0 || targetWords.length === 0) return 0;

  let totalScore = 0;
  for (const qToken of queryTokens) {
    let bestWordScore = 0;
    for (const tWord of targetWords) {
      const s = matchTokenAgainstWord(qToken, tWord);
      if (s > bestWordScore) {
        bestWordScore = s;
      }
    }
    totalScore += bestWordScore;
  }

  return Math.round(totalScore / queryTokens.length);
}

/**
 * High-Precision Search Engine: Filters and sorts monuments with strict relevance.
 */
export function searchHeritageMonuments<T = any>(query: string, list: T[]): T[] {
  const trimmed = query.trim();
  if (!trimmed) return list;

  const scoredResults: { item: T; score: number }[] = [];

  for (const m of list) {
    const item: any = m;
    const siteId = item.id || "";
    const nameEn = typeof item.name === "string" ? item.name : item.name?.en || "";
    const nameHi = typeof item.name === "object" ? item.name?.hi || "" : "";
    const district = item.district || "";
    const state = item.state || "";
    const sect = item.sect || "";
    const tagline = item.tagline || "";

    // 1. Direct Name Match (Top Priority)
    const scoreNameEn = calculateMatchScore(trimmed, nameEn) * 2.0;
    const scoreNameHi = calculateMatchScore(trimmed, nameHi) * 2.0;
    const scoreId = calculateMatchScore(trimmed, siteId.replace(/-/g, " ")) * 1.8;

    // 2. Curated SEO Aliases (Top Priority)
    let scoreAliases = 0;
    const aliases = HERITAGE_SEO_ALIASES[siteId] || [];
    for (const alias of aliases) {
      const aScore = calculateMatchScore(trimmed, alias) * 1.8;
      if (aScore > scoreAliases) {
        scoreAliases = aScore;
      }
    }

    // 3. Location & Style (Secondary Priority)
    const scoreDistrict = calculateMatchScore(trimmed, district) * 1.1;
    const scoreState = calculateMatchScore(trimmed, state) * 1.1;
    const scoreTagline = calculateMatchScore(trimmed, tagline) * 0.7;
    const scoreSect = calculateMatchScore(trimmed, sect) * 0.7;

    const maxScore = Math.max(
      scoreNameEn,
      scoreNameHi,
      scoreId,
      scoreAliases,
      scoreDistrict,
      scoreState,
      scoreTagline,
      scoreSect
    );

    // Strict inclusion threshold: Only items that meaningfully match the query
    if (maxScore >= 70) {
      scoredResults.push({ item: m, score: maxScore });
    }
  }

  // Sort descending by relevance score
  scoredResults.sort((a, b) => b.score - a.score);

  return scoredResults.map((r) => r.item);
}
