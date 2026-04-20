import fs from 'fs';
const checkApi = async () => {
    try {
        const res = await fetch('https://melolo.com/api/episode/list?dramaId=in-bed-with-your-lies');
        console.log(res.status, await res.text());
    } catch(e) {
        console.log("Error", e.message);
    }
}
checkApi();
