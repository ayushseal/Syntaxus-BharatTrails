import {
  getOfficialAlertsTool,
  getCurrentHazardsTool,
  getSafePointsTool,
  findLowerRiskRouteTool,
  getWeatherTool,
} from "./parthTools";
import { query } from "@/lib/db";
import monasteriesData from "@/data/monasteries.json";

export interface ParthMessageInput {
  message: string;
  location?: { lat: number; lng: number };
  country?: string;
  selectedSiteId?: string;
  selectedEventId?: string;
  mode?: "emergency" | "general";
}

export interface ParthStructuredResponse {
  direct_answer: string;
  is_safe: boolean;
  target_location: string;
  current_status: string;
  immediate_action: string;
  lower_risk_option?: {
    type: string;
    name: string;
    distance_km?: number;
    address?: string;
    contact?: string;
  };
  official_advisories: string[];
  emergency_contacts: { name: string; number: string }[];
  route_guidance?: {
    distance_km: number;
    risk_score: number;
    advisory: string;
    road_closures_avoided: boolean;
  };
  sources: { name: string; type: string; timestamp: string }[];
  confidence: "HIGH" | "MEDIUM" | "LOW";
  confidence_reason: string;
  raw_markdown: string;
}

// Ollama Cloud LLM Integration
const OLLAMA_BASE_URL = "https://api.ollama.com";
const OLLAMA_DEFAULT_MODEL = process.env.OLLAMA_MODEL || "gemma4:31b";
const OLLAMA_FALLBACK_KEY = "763a038add754c838518d302a33d5ac5.wX6UoO6BnVFm41qB3QZzSJUk";

export async function queryOllamaLLM(
  prompt: string,
  options?: {
    systemPrompt?: string;
    model?: string;
    timeoutMs?: number;
  }
): Promise<string | null> {
  const apiKey = process.env.OLLAMA_API_KEY || OLLAMA_FALLBACK_KEY;
  if (!apiKey) return null;

  const candidateModels = [
    options?.model || OLLAMA_DEFAULT_MODEL,
    "gpt-oss:20b",
    "nemotron-3-nano:30b",
  ].filter((v, i, a) => a.indexOf(v) === i);

  const timeoutMs = options?.timeoutMs || 25000;

  for (const model of candidateModels) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const res = await fetch(`${OLLAMA_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                options?.systemPrompt ||
                `You are PARTH (Pilgrim & Heritage Advanced Responsive Travel Helper), an expert AI cultural and travel copilot for Bharat (India).
Provide warm, authentic, culturally reverent, practical, and highly accurate travel guidance.
Use clean, well-structured Markdown with descriptive headers (###), bold terms, and bullet points.
Never include emergency hotline numbers or hazard alerts unless specifically asked about an emergency.`,
            },
            { role: "user", content: prompt },
          ],
          stream: false,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const content = data?.message?.content?.trim();
        if (content) return content;
      }
    } catch (err: any) {
      console.warn(`[PARTH] Ollama query attempt with ${model} failed:`, err?.message || err);
    }
  }

  return null;
}

// Known landmark / city spatial directory for instant spatial coordinate resolution
const LOCATION_DIRECTORY: { [key: string]: { name: string; state: string; country: string; lat: number; lng: number } } = {
  "taj mahal": { name: "Taj Mahal", state: "Uttar Pradesh", country: "India", lat: 27.1751, lng: 78.0421 },
  "taj": { name: "Taj Mahal", state: "Uttar Pradesh", country: "India", lat: 27.1751, lng: 78.0421 },
  "tahmahal": { name: "Taj Mahal", state: "Uttar Pradesh", country: "India", lat: 27.1751, lng: 78.0421 },
  "tajmahal": { name: "Taj Mahal", state: "Uttar Pradesh", country: "India", lat: 27.1751, lng: 78.0421 },
  "agra": { name: "Agra", state: "Uttar Pradesh", country: "India", lat: 27.1767, lng: 78.0081 },
  "fatehpur sikri": { name: "Fatehpur Sikri", state: "Uttar Pradesh", country: "India", lat: 27.0945, lng: 77.6679 },
  "delhi": { name: "Delhi", state: "Delhi", country: "India", lat: 28.6139, lng: 77.2090 },
  "red fort": { name: "Red Fort", state: "Delhi", country: "India", lat: 28.6562, lng: 77.2410 },
  "qutub minar": { name: "Qutub Minar", state: "Delhi", country: "India", lat: 28.5244, lng: 77.1855 },
  "jaipur": { name: "Jaipur", state: "Rajasthan", country: "India", lat: 26.9124, lng: 75.7873 },
  "amer fort": { name: "Amer Fort", state: "Rajasthan", country: "India", lat: 26.9855, lng: 75.8513 },
  "varanasi": { name: "Varanasi", state: "Uttar Pradesh", country: "India", lat: 25.3176, lng: 82.9739 },
  "kashi": { name: "Kashi Vishwanath", state: "Uttar Pradesh", country: "India", lat: 25.3109, lng: 83.0107 },
  "hampi": { name: "Hampi", state: "Karnataka", country: "India", lat: 15.3350, lng: 76.4600 },
  "virupaksha": { name: "Virupaksha Temple", state: "Karnataka", country: "India", lat: 15.3352, lng: 76.4598 },
  "ajanta": { name: "Ajanta Caves", state: "Maharashtra", country: "India", lat: 20.5519, lng: 75.7033 },
  "ellora": { name: "Ellora Caves", state: "Maharashtra", country: "India", lat: 20.0268, lng: 75.1780 },
  "konark": { name: "Sun Temple Konark", state: "Odisha", country: "India", lat: 19.8876, lng: 86.0945 },
  "puri": { name: "Jagannath Temple Puri", state: "Odisha", country: "India", lat: 19.8049, lng: 85.8179 },
  "goa": { name: "Goa", state: "Goa", country: "India", lat: 15.2993, lng: 74.1240 },
  "mumbai": { name: "Mumbai", state: "Maharashtra", country: "India", lat: 18.9220, lng: 72.8347 },
  "khajuraho": { name: "Khajuraho", state: "Madhya Pradesh", country: "India", lat: 24.8318, lng: 79.9199 },
  "kedarnath": { name: "Kedarnath Temple", state: "Uttarakhand", country: "India", lat: 30.7352, lng: 79.0669 },
  "badrinath": { name: "Badrinath Temple", state: "Uttarakhand", country: "India", lat: 30.7433, lng: 79.4938 },
  "joshimath": { name: "Joshimath", state: "Uttarakhand", country: "India", lat: 30.5564, lng: 79.5632 },
  "chamoli": { name: "Chamoli", state: "Uttarakhand", country: "India", lat: 30.4100, lng: 79.3300 },
  "valley of flowers": { name: "Valley of Flowers", state: "Uttarakhand", country: "India", lat: 30.7280, lng: 79.6053 },
  "spiti": { name: "Spiti Valley", state: "Himachal Pradesh", country: "India", lat: 32.2276, lng: 78.0710 },
  "tabo": { name: "Tabo Monastery", state: "Himachal Pradesh", country: "India", lat: 32.0926, lng: 78.3814 },
  "kaza": { name: "Kaza", state: "Himachal Pradesh", country: "India", lat: 32.2255, lng: 78.0712 },
  "ki monastery": { name: "Ki Monastery", state: "Himachal Pradesh", country: "India", lat: 32.2982, lng: 78.0089 },
  "manali": { name: "Manali", state: "Himachal Pradesh", country: "India", lat: 32.2432, lng: 77.1892 },
  "gangtok": { name: "Gangtok", state: "Sikkim", country: "India", lat: 27.3389, lng: 88.6065 },
  "rumtek": { name: "Rumtek Monastery", state: "Sikkim", country: "India", lat: 27.3040, lng: 88.5340 },
  "enchey": { name: "Enchey Monastery", state: "Sikkim", country: "India", lat: 27.3450, lng: 88.6250 },
  "teesta": { name: "Teesta River Basin", state: "Sikkim", country: "India", lat: 27.3389, lng: 88.6065 },
  "bandipur": { name: "Bandipur National Park", state: "Karnataka", country: "India", lat: 11.6664, lng: 76.6291 },
  "mudumalai": { name: "Mudumalai", state: "Tamil Nadu", country: "India", lat: 11.5833, lng: 76.5833 },
  // High-Altitude Lakes & Himalayan Destinations
  "gurudongmar": { name: "Gurudongmar Lake", state: "Sikkim", country: "India", lat: 28.0258, lng: 88.7089 },
  "gurudomgar": { name: "Gurudongmar Lake", state: "Sikkim", country: "India", lat: 28.0258, lng: 88.7089 },
  "lachen": { name: "Lachen", state: "Sikkim", country: "India", lat: 27.7167, lng: 88.5500 },
  "lachung": { name: "Lachung", state: "Sikkim", country: "India", lat: 27.6891, lng: 88.7430 },
  "tsomgo": { name: "Tsomgo Lake", state: "Sikkim", country: "India", lat: 27.3742, lng: 88.7619 },
  "changu": { name: "Tsomgo Lake", state: "Sikkim", country: "India", lat: 27.3742, lng: 88.7619 },
  "nathula": { name: "Nathu La Pass", state: "Sikkim", country: "India", lat: 27.3865, lng: 88.8310 },
  "yumthang": { name: "Yumthang Valley", state: "Sikkim", country: "India", lat: 27.8268, lng: 88.6958 },
  "zero point": { name: "Zero Point", state: "Sikkim", country: "India", lat: 27.9542, lng: 88.7100 },
  "pangong": { name: "Pangong Tso", state: "Ladakh", country: "India", lat: 33.7595, lng: 78.6674 },
  "tso moriri": { name: "Tso Moriri", state: "Ladakh", country: "India", lat: 14.8360, lng: 78.3100 },
  "chandratal": { name: "Chandratal Lake", state: "Himachal Pradesh", country: "India", lat: 32.4824, lng: 77.6152 },
  // International
  "nepal": { name: "Rasuwa / Bhote Koshi", state: "Bagmati Province", country: "Nepal", lat: 28.1824, lng: 85.3521 },
  "rasuwa": { name: "Rasuwa", state: "Bagmati Province", country: "Nepal", lat: 28.1824, lng: 85.3521 },
  "bhote koshi": { name: "Bhote Koshi River", state: "Bagmati Province", country: "Nepal", lat: 28.1824, lng: 85.3521 },
  "langtang": { name: "Langtang", state: "Bagmati Province", country: "Nepal", lat: 28.2140, lng: 85.5560 },
  "japan": { name: "Wajima / Noto Peninsula", state: "Ishikawa Prefecture", country: "Japan", lat: 37.3916, lng: 136.9066 },
  "wajima": { name: "Wajima", state: "Ishikawa Prefecture", country: "Japan", lat: 37.3916, lng: 136.9066 },
  "noto": { name: "Noto Peninsula", state: "Ishikawa Prefecture", country: "Japan", lat: 37.3916, lng: 136.9066 },
  "morocco": { name: "Marrakech / High Atlas", state: "Marrakech-Safi", country: "Morocco", lat: 31.1107, lng: -8.4116 },
  "marrakech": { name: "Marrakech", state: "Marrakech-Safi", country: "Morocco", lat: 31.6295, lng: -7.9811 },
  "al haouz": { name: "Al-Haouz", state: "Marrakech-Safi", country: "Morocco", lat: 31.1107, lng: -8.4116 },
  "libya": { name: "Derna / Cyrenaica", state: "Derna District", country: "Libya", lat: 32.7634, lng: 22.6367 },
  "derna": { name: "Derna", state: "Derna District", country: "Libya", lat: 32.7634, lng: 22.6367 },
  "greece": { name: "Rhodes Island", state: "South Aegean", country: "Greece", lat: 36.1428, lng: 28.0269 },
  "rhodes": { name: "Rhodes", state: "South Aegean", country: "Greece", lat: 36.1428, lng: 28.0269 },
  "lindos": { name: "Lindos", state: "South Aegean", country: "Greece", lat: 36.0911, lng: 28.0861 },
  "brazil": { name: "Porto Alegre", state: "Rio Grande do Sul", country: "Brazil", lat: -30.0346, lng: -51.2177 },
  "porto alegre": { name: "Porto Alegre", state: "Rio Grande do Sul", country: "Brazil", lat: -30.0346, lng: -51.2177 },
};

export async function processParthQuery(input: ParthMessageInput): Promise<ParthStructuredResponse> {
  const queryText = (input.message || "").toLowerCase().trim();

  // 1. Identify Target Landmark / City / Region
  let targetLocation = "General Area";
  let country = input.country || "India";
  let lat = input.location?.lat || 27.1751; // default to Delhi/Agra region if unknown
  let lng = input.location?.lng || 78.0421;
  let isExplicitLocationFound = false;

  // Search directory for matches
  for (const [key, val] of Object.entries(LOCATION_DIRECTORY)) {
    if (queryText.includes(key)) {
      targetLocation = `${val.name} (${val.state}, ${val.country})`;
      country = val.country;
      lat = val.lat;
      lng = val.lng;
      isExplicitLocationFound = true;
      break;
    }
  }

  // If not found in static dictionary, query heritage_sites database
  if (!isExplicitLocationFound) {
    try {
      const dbMatch = await query<any>(
        `SELECT id, name_en, state, district, latitude, longitude
         FROM heritage_sites
         WHERE LOWER(name_en) ILIKE $1 OR LOWER(id) ILIKE $1
         LIMIT 1`,
        [`%${queryText.replace(/[^a-z0-9]/g, "%")}%`]
      );
      if (dbMatch?.rows?.[0]) {
        const site = dbMatch.rows[0];
        targetLocation = `${site.name_en} (${site.state || site.district}, India)`;
        country = "India";
        lat = parseFloat(site.latitude);
        lng = parseFloat(site.longitude);
        isExplicitLocationFound = true;
      }
    } catch {
      // Continue with coordinates
    }
  }

  // If selectedSiteId was provided directly, resolve coordinates and location
  if (input.selectedSiteId) {
    const siteMatch = (monasteriesData as any[]).find((m) => m.id === input.selectedSiteId);
    if (siteMatch) {
      targetLocation = `${siteMatch.name?.en || siteMatch.id} (${siteMatch.state || "India"})`;
      const rawLat = siteMatch.location?.lat ?? siteMatch.latitude;
      const rawLng = siteMatch.location?.lng ?? siteMatch.longitude;
      if (rawLat && rawLng) {
        lat = typeof rawLat === "string" ? parseFloat(rawLat) : rawLat;
        lng = typeof rawLng === "string" ? parseFloat(rawLng) : rawLng;
        isExplicitLocationFound = true;
      }
    }
  }

  // Determine if this is an emergency / spatial safety decision-support query
  const isDistressQuery =
    queryText.includes("stuck") ||
    queryText.includes("trapped") ||
    queryText.includes("rescue") ||
    queryText.includes("dial 112") ||
    queryText.includes("emergency rescue") ||
    queryText.includes("stranded");

  const isEmergencyDisasterQuery =
    input.mode === "emergency" ||
    isDistressQuery ||
    queryText.includes("hazard") ||
    queryText.includes("alert") ||
    queryText.includes("warning") ||
    queryText.includes("shelter") ||
    queryText.includes("route") ||
    queryText.includes("safe") ||
    queryText.includes("evacuat") ||
    queryText.includes("safe point") ||
    queryText.includes("disaster") ||
    queryText.includes("landslide") ||
    queryText.includes("flood") ||
    queryText.includes("weather") ||
    queryText.includes("emergency") ||
    queryText.includes("helpline") ||
    queryText.includes("112");

  const shouldUseEmergencySpatialEngine = isEmergencyDisasterQuery;

  // Cultural / General Chat Assistant Mode (Powered by Ollama Cloud LLM)
  if (!shouldUseEmergencySpatialEngine) {
    let groundTruthContext = "";

    const matchedMonastery = (monasteriesData as any[]).find((m) => {
      const nameEn = (m.name?.en || "").toLowerCase();
      const id = (m.id || "").toLowerCase();
      return (
        queryText.includes(id) ||
        (nameEn && queryText.includes(nameEn)) ||
        (nameEn.replace(" monastery", "") && queryText.includes(nameEn.replace(" monastery", "").trim()))
      );
    });
    if (matchedMonastery) {
      groundTruthContext += `\nMonastery Reference Data (BharatTrails Atlas):
- Name: ${matchedMonastery.name?.en || matchedMonastery.id}
- District & State: ${matchedMonastery.district}, ${matchedMonastery.state}
- Sect: ${matchedMonastery.sect || "Tibetan Buddhism"}
- Founded: ${matchedMonastery.founded || "Ancient"}
- Altitude: ${matchedMonastery.altitude || "Mountain"}
- Tagline & Description: ${matchedMonastery.tagline || matchedMonastery.description?.en || ""}`;
    }

    // Call Ollama Cloud LLM API with key
    const llmResult = await queryOllamaLLM(input.message, {
      systemPrompt: `You are PARTH (Pilgrim & Heritage Advanced Responsive Travel Helper), an expert AI cultural and travel copilot for BharatTrails.
You provide insightful, warm, culturally reverent, and practical travel guidance for travelers exploring Indian heritage, Himalayan lakes and passes, Buddhist monasteries, temples, and historical monuments.
Guidance rules:
- Format response with clean, readable Markdown: use headers (###), bold terms, and structured bullet points or tables where appropriate.
- Provide comprehensive answers on best seasons to visit, acute mountain sickness (AMS) acclimatization protocols, permit requirements (ILP/PAP), photography etiquette, monastic dress codes, and itineraries.
- CRITICAL: Do NOT output emergency phone numbers or disaster hazard warning cards unless specifically asked about emergency distress.
${groundTruthContext ? `\nVerified Ground Truth Reference Data:\n${groundTruthContext}` : ""}`,
    });

    if (llmResult) {
      const resolvedLocation = matchedMonastery?.name?.en || (targetLocation !== "General Area" ? targetLocation : "Bharat Cultural Atlas");
      return {
        direct_answer: llmResult,
        is_safe: true,
        target_location: resolvedLocation,
        current_status: matchedMonastery ? `MONASTERY GUIDE: ${matchedMonastery.name?.en}` : (targetLocation !== "General Area" ? `HERITAGE SPOTLIGHT: ${targetLocation}` : "PARTH AI TRAVEL COPILOT"),
        immediate_action: "Enjoy your journey mindfully and respect local heritage traditions.",
        official_advisories: [],
        emergency_contacts: [],
        sources: [
          { name: "Ollama Cloud (Gemma / GPT-OSS) • BharatTrails Cultural Intelligence", type: "AI Heritage Copilot", timestamp: new Date().toISOString() },
        ],
        confidence: "HIGH",
        confidence_reason: "Generated dynamically via Ollama Cloud LLM API.",
        raw_markdown: llmResult,
      };
    }

    // Fallback if LLM times out or is offline
    const fallbackAnswer = matchedMonastery
      ? `### 🏛️ ${matchedMonastery.name?.en} (${matchedMonastery.state})\n\n${matchedMonastery.tagline || matchedMonastery.description?.en || ""}\n\n• **Sect:** ${matchedMonastery.sect || "Tibetan Buddhist"}\n• **Altitude:** ${matchedMonastery.altitude || "High Altitude"}\n• **Visiting Hours:** 06:00 - 18:00 daily.`
      : `### 🧭 PARTH AI Travel Copilot\n\nI can help you with trip planning, visiting seasons, permits, high-altitude lakes (Gurudongmar, Tsomgo, Pangong), Buddhist monasteries, and heritage monuments across Bharat. How can I assist your journey today?`;

    return {
      direct_answer: fallbackAnswer,
      is_safe: true,
      target_location: targetLocation !== "General Area" ? targetLocation : "Bharat Cultural Atlas",
      current_status: "PARTH AI TRAVEL COPILOT",
      immediate_action: "Ask specific questions about monasteries, high-altitude lakes, permits, or itineraries.",
      official_advisories: [],
      emergency_contacts: [],
      sources: [
        { name: "BharatTrails Knowledge Engine", type: "AI Heritage Assistant", timestamp: new Date().toISOString() },
      ],
      confidence: "MEDIUM",
      confidence_reason: "Operational fallback mode.",
      raw_markdown: fallbackAnswer,
    };
  }

  // 2. Fetch Relevant Official Intelligence via Tools (for Emergency & Spatial Safety queries)
  const [alerts, nearbyHazards, safePoints, weather] = await Promise.all([
    getOfficialAlertsTool(country),
    getCurrentHazardsTool(lat, lng, 80), // 80km proximity radius
    getSafePointsTool(lat, lng),
    getWeatherTool(lat, lng),
  ]);

  // Determine if there is an active hazard within proximity of the target location
  const activeNearbyHazards = nearbyHazards.filter(
    (h: any) => h.distance_km <= Math.max(h.radius_km || 40, 50)
  );

  const isSafe = activeNearbyHazards.length === 0 && !isDistressQuery;

  // Find nearest safe point
  const nearestSafePoint = safePoints[0];

  // Route guidance if not safe
  let routeResult: any = null;
  if (!isSafe && nearestSafePoint) {
    try {
      routeResult = await findLowerRiskRouteTool(
        lat,
        lng,
        nearestSafePoint.latitude,
        nearestSafePoint.longitude
      );
    } catch {
      // Continue without route
    }
  }

  // Build Synthesis
  let directAnswer = "";
  let currentStatus = "";
  let immediateAction = "";
  const officialAdvisories: string[] = [];
  const sources: { name: string; type: string; timestamp: string }[] = [];
  const confidence: "HIGH" | "MEDIUM" | "LOW" = "HIGH";
  const confidenceReason = "NDMA SACHET, ISRO NRSC & Civil Protection feeds.";

  const nearestHazard = nearbyHazards[0];

  if (isSafe) {
    directAnswer = `Visiting ${targetLocation} is verified safe. No active disaster warnings or hazardous road closures in this sector.`;
    currentStatus = `ALL CLEAR: Verified Safe (Green Zone)`;
    immediateAction = `Safe to visit. Normal tourism activities and travel corridors are open.`;
    
    if (nearestHazard && nearestHazard.distance_km) {
      officialAdvisories.push(
        `Nearest monitored event: ${nearestHazard.title} (~${nearestHazard.distance_km} km away, does not affect ${targetLocation}).`
      );
    } else {
      officialAdvisories.push(`Pan-regional monitoring indicates calm environmental conditions.`);
    }

    sources.push({
      name: country === "India" ? "NDMA SACHET / IMD Mausam" : `${country} Disaster Feeds`,
      type: "Authoritative Public Feeds (All Clear)",
      timestamp: new Date().toISOString(),
    });
  } else {
    const primaryHazard = activeNearbyHazards[0] || nearestHazard;
    const severity = primaryHazard?.severity || "ORANGE";
    
    directAnswer = `⚠️ Travel Caution: Visiting ${targetLocation} is currently NOT recommended due to an active ${primaryHazard?.hazard_type || "environmental hazard"} (${severity} Advisory).`;
    currentStatus = `${severity} SEVERITY: ${primaryHazard?.title || "Hazard Active"}`;

    if (primaryHazard?.hazard_type === "LANDSLIDE") {
      immediateAction = "Do not traverse active slope failure or rockfall corridors. Remain at a sturdy, high-ground shelter. Travel past Joshimath restricted.";
    } else if (primaryHazard?.hazard_type === "FLASH_FLOOD" || primaryHazard?.hazard_type === "FLOOD") {
      immediateAction = "Evacuate riverbanks and low-lying nallahs immediately. Move to elevated stone masonry structures or designated high ground.";
    } else if (primaryHazard?.hazard_type === "EARTHQUAKE") {
      immediateAction = "Stay outdoors in clear open fields away from cracked masonry and overhead power lines. Avoid coastal areas due to tsunami risk.";
    } else if (primaryHazard?.hazard_type === "WILDFIRE") {
      immediateAction = "Follow emergency evacuation marshals towards safe coastal or northern assembly points. European Emergency: 112.";
    } else {
      immediateAction = "Maintain vigilance, monitor official announcements on emergency channels, and avoid non-essential transit.";
    }

    if (alerts.length > 0) {
      alerts.slice(0, 2).forEach((alt) => {
        officialAdvisories.push(`${alt.source_name}: ${alt.headline}. Instructions: ${alt.instruction || "Follow District Magistrate orders."}`);
        sources.push({
          name: alt.source_name,
          type: "Official Government Alert (CAP 1.2)",
          timestamp: alt.fetched_at || new Date().toISOString(),
        });
      });
    }

    if (primaryHazard) {
      sources.push({
        name: primaryHazard.source || "Disaster Feed",
        type: "Geospatial Hazard Intelligence",
        timestamp: primaryHazard.updated_at || new Date().toISOString(),
      });
    }
  }

  if (weather) {
    sources.push({
      name: weather.source || "Meteorological Service",
      type: "Meteorological Observation Grid",
      timestamp: weather.observed_at || new Date().toISOString(),
    });
  }

  // Emergency Contacts Format by Country
  const emergencyContactsList: { name: string; number: string }[] = [];
  if (country === "India") {
    emergencyContactsList.push({ name: "National Emergency Helpline", number: "112" });
    emergencyContactsList.push({ name: "State Disaster EOC", number: "1070" });
    emergencyContactsList.push({ name: "Ambulance / Medical Response", number: "108" });
    emergencyContactsList.push({ name: "Tourist Police Helpline", number: "1363" });
  } else if (country === "Japan") {
    emergencyContactsList.push({ name: "Japan Fire & Ambulance", number: "119" });
    emergencyContactsList.push({ name: "Japan Police Emergency", number: "110" });
    emergencyContactsList.push({ name: "Japan Visitor Helpline", number: "+81 50-3816-2720" });
  } else if (country === "Morocco") {
    emergencyContactsList.push({ name: "Protection Civile Maroc", number: "141" });
    emergencyContactsList.push({ name: "Morocco Police (Sûreté)", number: "190" });
    emergencyContactsList.push({ name: "Royal Gendarmerie", number: "177" });
  } else if (country === "Libya") {
    emergencyContactsList.push({ name: "Libyan Red Crescent", number: "191" });
    emergencyContactsList.push({ name: "Libya Police Emergency", number: "190" });
  } else if (country === "Greece") {
    emergencyContactsList.push({ name: "European Emergency Number", number: "112" });
    emergencyContactsList.push({ name: "Hellenic Fire Service", number: "199" });
    emergencyContactsList.push({ name: "Greek Tourist Police", number: "1571" });
  } else if (country === "Brazil") {
    emergencyContactsList.push({ name: "Corpo de Bombeiros", number: "193" });
    emergencyContactsList.push({ name: "Defesa Civil RS", number: "199" });
    emergencyContactsList.push({ name: "Polícia Militar", number: "190" });
  } else {
    // Nepal
    emergencyContactsList.push({ name: "Nepal Police Emergency", number: "100" });
    emergencyContactsList.push({ name: "Ambulance Response", number: "102" });
    emergencyContactsList.push({ name: "Tourist Police Nepal", number: "1144" });
  }

  // Compile Clean Human Markdown
  let rawMarkdown = `### ${isSafe ? "✅" : "⚠️"} ${directAnswer}\n\n`;
  rawMarkdown += `• **Status:** ${currentStatus}\n`;
  rawMarkdown += `• **Location:** ${targetLocation}\n`;
  rawMarkdown += `• **Direct Guidance:** ${immediateAction}\n\n`;

  if (officialAdvisories.length > 0) {
    rawMarkdown += `**Official Bulletins:**\n`;
    officialAdvisories.forEach((adv) => {
      rawMarkdown += `- ${adv}\n`;
    });
    rawMarkdown += `\n`;
  }

  if (!isSafe && nearestSafePoint) {
    rawMarkdown += `**Nearest Designated Safe Shelter:**\n`;
    rawMarkdown += `- **${nearestSafePoint.name}** (${nearestSafePoint.address || nearestSafePoint.state})\n`;
    if (nearestSafePoint.contact) rawMarkdown += `- *Contact:* \`${nearestSafePoint.contact}\`\n\n`;
  }

  rawMarkdown += `> **Source Provenance:** ${sources.map((s) => s.name).join(" • ")}\n`;
  rawMarkdown += `> **Emergency Helpline:** ${emergencyContactsList[0].name} (\`${emergencyContactsList[0].number}\`)`;

  return {
    direct_answer: directAnswer,
    is_safe: isSafe,
    target_location: targetLocation,
    current_status: currentStatus,
    immediate_action: immediateAction,
    lower_risk_option: (!isSafe && nearestSafePoint)
      ? {
          type: nearestSafePoint.point_type,
          name: nearestSafePoint.name,
          distance_km: nearestSafePoint.distance_km,
          address: nearestSafePoint.address,
          contact: nearestSafePoint.contact,
        }
      : undefined,
    official_advisories: officialAdvisories,
    emergency_contacts: emergencyContactsList,
    route_guidance: (!isSafe && routeResult?.recommended_route)
      ? {
          distance_km: Math.round(routeResult.recommended_route.distance_meters / 100) / 10,
          risk_score: routeResult.recommended_route.risk_score,
          advisory: routeResult.safety_advisory,
          road_closures_avoided: routeResult.road_closure_detected,
        }
      : undefined,
    sources,
    confidence,
    confidence_reason: confidenceReason,
    raw_markdown: rawMarkdown,
  };
}
