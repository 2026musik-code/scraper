import fs from 'fs';
const html = fs.readFileSync('drama_page.html', 'utf8');

const nextF = html.match(/self\.__next_f\.push\(([\s\S]*?)\)/g);
if (nextF) {
    console.log(`Found ${nextF.length} __next_f blocks`);
    let episodeCount = 0;
    nextF.forEach((block, idx) => {
        const matches = [...block.matchAll(/v\.melolo\.com/g)];
        if (matches.length > 0) {
            console.log(`Block ${idx} has ${matches.length} video links`);
            const mp4s = block.match(/https?:\/\/[^"'\s\\]+\.mp4\?[^"'\s\\]+/g);
            if (mp4s) console.log("MP4s:", [...new Set(mp4s)].length);
        }
    });
} else {
    console.log("No self.__next_f");
}
