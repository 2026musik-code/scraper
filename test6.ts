import fs from 'fs';
const fetchContent = async () => {
    const response = await fetch('https://melolo.com/id/dramas/in-bed-with-your-lies?keyword=ceo');
    const htmlContent = await response.text();
    const pattern = /https?:\/\/v\.melolo\.com\/[^"'\s\\]+\.mp4\?[^"'\s\\]+/g
    let links = Array.from(new Set(htmlContent.match(pattern) || []))
    links = links.map(l => l.replace(/\\\//g, '/').replace(/&amp;/g, '&'))
    console.log("Found links:", links.length);
    console.log("First link:", links[0]);
}
fetchContent();
