import fs from 'fs';
const html = fs.readFileSync('drama_page.html', 'utf8');

// Look for anything resembling episode list API
const apiEndpoints = html.match(/https?:\/\/[a-zA-Z0-9.-]+\/api\/[a-zA-Z0-9./-]+/g);
if (apiEndpoints) {
    console.log("Found APIs:", [...new Set(apiEndpoints)]);
}

// Check for things like "dramaId", "episodes", "pageNum", etc.
const keywords = ['dramaId', 'episode', 'series', 'playlist', 'graphql', 'fetch'];
keywords.forEach(k => {
    const matches = [...html.matchAll(new RegExp(`.{0,50}${k}.{0,50}`, 'gi'))];
    console.log(`Keyword '${k}': ${matches.length} matches`);
    if(matches.length > 0 && matches.length < 10) {
        console.log(matches.map(m => m[0]));
    }
});
