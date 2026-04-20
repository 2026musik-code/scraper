import fs from 'fs';
const checkStatus = async (ep) => {
    const response = await fetch(`https://melolo.com/id/dramas/in-bed-with-your-lies/${ep}`);
    console.log(`${ep} status:`, response.status);
    const htmlContent = await response.text();
    const pattern = /https?:\/\/v\.melolo\.com\/[^"'\s\\]+\.mp4\?[^"'\s\\]+/g
    let links = Array.from(new Set(htmlContent.match(pattern) || []))
    console.log(`Links in ${ep}:`, links.length);
}
const run = async () => {
    await checkStatus('ep1');
    await checkStatus('ep5');
    await checkStatus('ep15');
}
run();
