import fs from 'fs';
fetch('https://melolo.com/id/search?keyword=ceo')
  .then(r => r.text())
  .then(t => {
    fs.writeFileSync('melolo_search_ceo.html', t);
    console.log("saved");
  });
