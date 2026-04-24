import fetch from "node-fetch";

async function testHls() {
      const targetUrl = 'https://www.dramabox.com/in/video/41000102472_Fortunes-Unveiled-My-Husband-Is-a-Big-Shot/566962433_Episode-1';
      const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`;
      const response = await fetch(proxyUrl);
      const htmlContent = await response.text();
      
      let m3u8Links = Array.from(new Set(htmlContent.match(/https?:\/\/[^"'\s\\]+\.m3u8[^"'\s\\]*/g) || []));
      m3u8Links = m3u8Links.map(l => l.replace(/\\\//g, '/').replace(/\\u0026/g, '&'));
      
      const uniqueLinks: string[] = [];
      const linkBases = new Set();
      for (const link of m3u8Links) {
          const base = link.split('?')[0];
          if (!linkBases.has(base)) {
              linkBases.add(base);
              uniqueLinks.push(link);
          }
      }
      
      console.log(uniqueLinks);
}
testHls();
