import fs from 'fs';
const fetchEp = async () => {
    const response = await fetch('https://melolo.com/id/dramas/in-bed-with-your-lies/ep10');
    const htmlContent = await response.text();
    const pattern = /https?:\/\/v\.melolo\.com\/[^"'\s\\]+\.mp4\?[^"'\s\\]+/g
    let links = Array.from(new Set(htmlContent.match(pattern) || []))
    links = links.map(l => l.replace(/\\\//g, '/').replace(/&amp;/g, '&'))
    console.log("Found links in ep10:", links.length);
    if (links.length > 0) {
        console.log("First link:", links[0]);
    }
}
fetchEp();
