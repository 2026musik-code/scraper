import fs from 'fs';
const content = fs.readFileSync('melolo_search_ceo.html', 'utf-8');
const firstCard = content.substring(content.indexOf('Jatuh Cinta pada Pengacara Perceraianku') - 700, content.indexOf('Jatuh Cinta pada Pengacara Perceraianku') + 400);
console.log(firstCard);
