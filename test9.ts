import fs from 'fs';
const html = fs.readFileSync('drama_page.html', 'utf8');

// Look for NEXT_DATA or typical state hydration scripts
const scriptMatches = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
if (scriptMatches) {
    console.log("Found __NEXT_DATA__!");
    const data = JSON.parse(scriptMatches[1]);
    const fs = require('fs');
    fs.writeFileSync('next_data.json', JSON.stringify(data, null, 2));
    console.log("Saved next_data.json");
} else {
    console.log("No __NEXT_DATA__ found. Let's look for any large JSON.");
    const jsonMatches = html.match(/<script[^>]*>([\s\S]*?JSON\.parse\([\s\S]*?)<\/script>/g);
    if (jsonMatches) {
        console.log("Found json matches", jsonMatches.length);
    } else {
        // Let's just find "v.melolo.com" occurrences.
        const occurrences = [...html.matchAll(/v\.melolo\.com/g)];
        console.log(`Found ${occurrences.length} occurrences of v.melolo.com`);
    }
}
