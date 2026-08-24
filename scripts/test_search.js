const fs = require('fs');
const monasteries = JSON.parse(fs.readFileSync('src/data/monasteries.json', 'utf8'));
const { searchHeritageMonuments } = require('../src/lib/searchEngine.ts');

const queries = ['lake', 'lakes', 'fort', 'guru', 'gurudom', 'manas', 'meenakshi', 'taj', 'ramappa'];

queries.forEach(q => {
  const results = searchHeritageMonuments(q, monasteries);
  console.log(`[TEST] Query: "${q}" (${results.length} matches) ->`, results.map(r => r.name.en));
});
