import fs from 'fs';
const htmlContent = fs.readFileSync('melolo_search_ceo.html', 'utf-8');

const dramas = [];
const linkRegex = /href="([^"]*?\/id\/dramas\/([^"?/]+)(?:\?[^"]*)?)"/g;
let match;
while ((match = linkRegex.exec(htmlContent)) !== null) {
   const detailsUrl = match[1];
   const id = match[2];
   
   // Look backwards for image
   const prefixHtml = htmlContent.substring(Math.max(0, match.index - 2000), match.index);
   // Match the last img tag in this block
   const imgs = [...prefixHtml.matchAll(/<img[^>]+src="([^">]+)"/g)];
   const poster = imgs.length > 0 ? imgs[imgs.length - 1][1] : '';
   
   const title = id.replace(/-/g, ' ');
   
   if (!dramas.find(d => d.id === id)) {
       dramas.push({ url: detailsUrl, id, title, poster });
   }
}

console.log(dramas.slice(0, 3));
