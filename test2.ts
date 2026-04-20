import fs from 'fs';
const content = fs.readFileSync('melolo_search_ceo.html', 'utf-8');
const dramas = content.split('<a ').filter(c => c.includes('/id/dramas/')).slice(0, 5);
console.log(dramas.map(d => '<a ' + d).join('\n---\n'));
