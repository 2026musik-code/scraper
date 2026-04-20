import fs from 'fs';
const html = fs.readFileSync('drama_page.html', 'utf8');

const pattern = /https?:\/\/[a-zA-Z0-9.-]+\/.*?\.mp4[^"'\s\\\\]*/g;
let links = Array.from(new Set(html.match(pattern) || []));
links = links.map(l => l.replace(/\\\//g, '/').replace(/&amp;/g, '&'));
links = [...new Set(links)];

console.log(`Found ${links.length} unique MP4 links across the entire page.`);
if (links.length > 0) {
    console.log(links.slice(0, 5));
    console.log("...");
    console.log(links.slice(-5));
}
