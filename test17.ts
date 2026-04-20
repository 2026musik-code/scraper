import fs from 'fs';
const html = fs.readFileSync('drama_page.html', 'utf8');
const index = html.indexOf('Semua Episode');
if (index !== -1) {
    console.log(html.substring(index - 200, index + 300).replace(/\n/g, ' '));
}
