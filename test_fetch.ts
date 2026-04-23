import fs from "fs";
import * as cheerio from "cheerio";

async function run() {
  const html = fs.readFileSync('test_fetch_index.html', 'utf-8');
  const $ = cheerio.load(html);
  
  const sections = [];
  
  $('h2, h3').each((i, el) => {
    let title = $(el).text().trim();
    if (title && !title.includes('Kategori') && !title.includes('Pusat') && !title.includes('Pilihan Editor')) {
      const container = $(el).parent().parent().parent(); 
      const dramas = [];
      container.find('a[href*="/id/dramas/"]').each((j, a) => {
         const url = $(a).attr('href');
         const parentDiv = $(a).parent();
         
         const poster = $(a).find('img').attr('src') || parentDiv.find('img').attr('src');
         const idMatch = url.match(/\/id\/dramas\/([^"?/]+)/);
         if (idMatch) {
             const id = idMatch[1];
             const dramaTitle = id.replace(/-/g, ' ');
             if (!dramas.find(d => d.id === id) && poster) { // Only take items with posters
               dramas.push({ 
                 url: url.startsWith('http') ? url : `https://melolo.com${url}`, 
                 id, 
                 title: dramaTitle, 
                 poster 
               });
             }
         }
      });
      if (dramas.length > 0) {
        sections.push({ title, dramas });
      }
    }
  });

  // What about "Pilihan Editor: Mini Seri Terpopuler"? 
  // It has a different structure:
  // .grid-cols-2 inside
  $('h3:contains("Pilihan Editor")').each((i, el) => {
    const title = "Pilihan Editor";
    const container = $(el).parent().parent();
    const dramas = [];
    container.find('a[href*="/id/dramas/"]').each((j, a) => {
        const url = $(a).attr('href');
        const idMatch = url.match(/\/id\/dramas\/([^"?/]+)/);
        if (idMatch) {
            const id = idMatch[1];
            let dramaTitle = $(a).text().replace(/^\d+\./, '').trim();
            if (!dramaTitle) dramaTitle = id.replace(/-/g, ' ');
            if (!dramas.find(d => d.id === id) && dramaTitle.length > 3) {
              dramas.push({ 
                url: url.startsWith('http') ? url : `https://melolo.com${url}`, 
                id, 
                title: dramaTitle,
                poster: `https://via.placeholder.com/300x450/111111/d4af37?text=${encodeURIComponent(dramaTitle)}` // No poster in this section usually
              });
            }
        }
    });
    if (dramas.length > 0) {
      sections.push({ title, dramas });
    }
  });

  console.log(JSON.stringify(sections.map(s => ({ title: s.title, count: s.dramas.length })), null, 2));
  console.log(JSON.stringify(sections[0].dramas.slice(0, 2), null, 2));
}
run();
