import fs from 'fs';
const html = fs.readFileSync('drama_page.html', 'utf8');
const words = ['Buka aplikasi', 'Unduh aplikasi', 'Tonton kelanjutannya', 'Buka App', 'Unclock', 'Beli'];
words.forEach(w => {
    if (html.includes(w)) console.log(`Contains "${w}"`);
});
