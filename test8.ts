import fs from 'fs';
const fetchContent = async () => {
    const response = await fetch('https://melolo.com/id/dramas/in-bed-with-your-lies?keyword=ceo');
    const htmlContent = await response.text();
    fs.writeFileSync('drama_page.html', htmlContent);
    console.log("Saved drama_page.html, size:", htmlContent.length);
}
fetchContent();
