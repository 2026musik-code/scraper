import fs from "fs";

const text = fs.readFileSync("dramabox_chapters.json", "utf-8");

const m3u8Links = Array.from(new Set(text.match(/https:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/g) || []));
const postLinks = Array.from(new Set(text.match(/https:\/\/[^"'\s\\]+\.mp4\.jpg[^"'\s\\]*/g) || []));

// Look for Episode titles like "Episode 1" 
const epsMatch = Array.from(new Set(text.match(/Episode \d+/g) || []));

console.log(`Found ${m3u8Links.length} M3U8 links`);
console.log(`Found ${postLinks.length} Poster links`);
console.log(`Found ${epsMatch.length} Episodes matched`);

console.log("Samples:", {
  m3u8: m3u8Links.slice(0, 2),
  posters: postLinks.slice(0, 2),
  episodes: epsMatch.slice(0, 5)
});
