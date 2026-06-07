const fs = require('fs');
const f = 'F:/u-claw/u-claw/u-claw/portable/data/.openclaw/workspace/games-site/_posts';
const md = fs.readdirSync(f).filter(x => x.endsWith('.md') && x !== 'progress.json');

console.log('Total markdown files:', md.length);

// Date range
const dates = md.map(n => n.substring(0,10)).sort();
console.log('Date range:', dates[0], 'to', dates[dates.length-1]);

// By year
const byYear = {};
md.forEach(n => {
  const y = n.substring(0,4);
  byYear[y] = (byYear[y] || 0) + 1;
});
console.log('By year:', byYear);

// Top categories
const cats = {};
let catCount = 0;
md.forEach(n => {
  const c = fs.readFileSync(f + '/' + n, 'utf8');
  const m = c.match(/^category: "([^"]+)"/m);
  if (m) {
    cats[m[1]] = (cats[m[1]] || 0) + 1;
    catCount++;
  }
});
const sorted = Object.entries(cats).sort((a, b) => b[1] - a[1]).slice(0, 10);
console.log('Top 10 categories:', sorted);
console.log('Files with category:', catCount);

// Total size
let totalSize = 0;
md.forEach(n => totalSize += fs.statSync(f + '/' + n).size);
console.log('Total size (MB):', (totalSize / 1024 / 1024).toFixed(1));
console.log('Average file size (KB):', Math.round(totalSize / md.length / 1024));

// Update progress.json
const pg = { total: 5312, completed: md.length, failed: 0, lastUpdate: new Date().toISOString() };
fs.writeFileSync(f + '/progress.json', JSON.stringify(pg, null, 2));
console.log('Progress updated:', JSON.stringify(pg));