import fs from 'fs';
const content = fs.readFileSync('melolo_search_ceo.html', 'utf-8');
const regex = /<img[^>]+src="([^">]+)"[^>]*>[\s\S]*?<a[^>]+href="([^">]+\/id\/dramas\/[^">]+)"[^>]*>([\s\S]*?)<\/a>/g;

let count = 0;
let match;
while ((match = regex.exec(content)) && count < 3) {
  count++;
  console.log("-------------------");
  console.log("IMG:", match[1]);
  console.log("LINK:", match[2]);
  console.log("TITLE:", match[3].trim());
}
