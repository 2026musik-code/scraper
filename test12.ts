import fs from 'fs';
const html = fs.readFileSync('drama_page.html', 'utf8');
const regex = /.{0,60}episode.{0,60}/gi;
let count = 0;
let match;
while ((match = regex.exec(html)) !== null && count < 30) {
    console.log(match[0].replace(/\n/g, ' '));
    count++;
}
