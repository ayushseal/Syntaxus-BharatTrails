const fs = require('fs');
const path = require('path');

const trailsPath = path.join(__dirname, '../src/data/trails.json');
const trails = JSON.parse(fs.readFileSync(trailsPath, 'utf8'));

const existingIndex = trails.findIndex(t => t.id === 'kailash-manasarovar-sacred-yatra');

const newTrail = {
  id: "kailash-manasarovar-sacred-yatra",
  name: {
    en: "Kailash-Manasarovar & Himalayan Sacred Alpine Circuit",
    hi: "कैलाश-मानसरोवर एवं हिमालयन पवित्र अल्पाइन सर्किट"
  },
  state: "Uttarakhand",
  region: "Northern Frontiers",
  description: "The ultimate trans-Himalayan pilgrimage corridor connecting Kumaon's ancient temple sanctuaries (Jageshwar Dham, Tungnath, Valley of Flowers) through Lipulekh Pass to sacred Lake Manasarovar and Mount Kailash at 15,060 ft.",
  monasteries: [
    "jageshwar",
    "tungnath",
    "valleyofflowers",
    "manasarovar"
  ],
  totalDistance: "680 km (Pilgrimage Corridor)",
  estimatedTime: "7 Days",
  difficulty: "Challenging (High Altitude Yatra)",
  startPoint: {
    name: "Jageshwar Dham, Almora",
    lat: 29.6394,
    lng: 79.8541
  },
  waypoints: [
    { monasteryId: "jageshwar", order: 1, distanceFromPrev: "Start at Jageshwar Dham", timeFromPrev: "Day 1 Morning" },
    { monasteryId: "tungnath", order: 2, distanceFromPrev: "170 km Kumaon-Garhwal Transit", timeFromPrev: "5.5 hours" },
    { monasteryId: "valleyofflowers", order: 3, distanceFromPrev: "95 km", timeFromPrev: "3.5 hours" },
    { monasteryId: "manasarovar", order: 4, distanceFromPrev: "415 km Trans-Himalayan Ascent (Lipulekh Pass)", timeFromPrev: "Day 5–7 Yatra" }
  ]
};

if (existingIndex >= 0) {
  trails[existingIndex] = newTrail;
} else {
  trails.push(newTrail);
}

fs.writeFileSync(trailsPath, JSON.stringify(trails, null, 2), 'utf8');
console.log('✓ Successfully updated trails.json with Kailash-Manasarovar Sacred Circuit! Total circuits:', trails.length);
