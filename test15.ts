import fs from 'fs';
const html = fs.readFileSync('drama_page.html', 'utf8');

const regexAnchors = /<a [^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
let match;
while ((match = regexAnchors.exec(html)) !== null) {
    if (match[1].includes('ep')) {
        console.log(match[1], "=>", match[2].trim());
    }
}
