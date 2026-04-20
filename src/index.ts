import { Hono } from 'hono'
import { html, raw } from 'hono/html'

const app = new Hono()
const BASE_URL = 'https://melolo.com'

// Helper function untuk mengambil dan mengekstrak data pencarian
async function fetchAndExtractDramas(keyword: string) {
    const searchUrl = `${BASE_URL}/id/search?keyword=${encodeURIComponent(keyword)}`
    
    const response = await fetch(searchUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36" }
    })
    const htmlContent = await response.text()

    const dramas: { url: string, id: string, title: string, poster: string }[] = [];
    const linkRegex = /href="([^"]*?\/id\/dramas\/([^"?/]+)(?:\?[^"]*)?)"/g;
    let match;
    
    while ((match = linkRegex.exec(htmlContent)) !== null) {
       const detailsUrl = match[1];
       const id = match[2];
       
       const prefixHtml = htmlContent.substring(Math.max(0, match.index - 2000), match.index);
       const imgs = [...prefixHtml.matchAll(/<img[^>]+src="([^">]+)"/g)];
       const poster = imgs.length > 0 ? imgs[imgs.length - 1][1] : '';
       
       const title = id.replace(/-/g, ' ');
       
       if (!dramas.find(d => d.id === id)) {
           dramas.push({ 
               url: detailsUrl.startsWith('http') ? detailsUrl : BASE_URL + detailsUrl, 
               id, 
               title, 
               poster 
           });
       }
    }
    return dramas;
}

// ----------------------------------------------------
// 1. API: AMBIL LIST DRAMA BERDASARKAN KATEGORI (AJAX)
// ----------------------------------------------------
app.get('/api/dramas', async (c) => {
    const category = c.req.query('c') || 'ceo'
    try {
        const dramas = await fetchAndExtractDramas(category);
        return c.json({ success: true, data: dramas });
    } catch(err: any) {
        return c.json({ success: false, error: err.message }, 500);
    }
})

// ----------------------------------------------------
// 2. TAMPILAN UTAMA (HOME MENAHWAN - MEWAH)
// ----------------------------------------------------
app.get('/', (c) => {
  return c.html(html`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Melolo Premium Finder</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
            body { font-family: 'Outfit', sans-serif; background-color: #050505; color: #f5f5f5; }
            .hide-scrollbar::-webkit-scrollbar { display: none; }
            .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            .glass { background: rgba(20, 20, 25, 0.7); backdrop-filter: blur(10px); border: 1px solid rgba(255, 255, 255, 0.05); }
            .luxury-gradient { background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
            .luxury-btn { background: linear-gradient(135deg, #b8860b 0%, #d4af37 100%); color: #000; box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3); }
            .luxury-btn:hover { background: linear-gradient(135deg, #d4af37 0%, #f9e596 100%); box-shadow: 0 6px 20px rgba(212, 175, 55, 0.5); }
        </style>
    </head>
    <body class="min-h-screen pb-16">
        
        <!-- Navbar Mewah -->
        <nav class="sticky top-0 z-50 glass border-b border-white/10 px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
            <h1 class="text-2xl font-extrabold tracking-widest uppercase luxury-gradient flex items-center">
                <span class="mr-2 text-xl">🎬</span> Prime Short
            </h1>
            
            <form action="/search" method="GET" class="relative w-full md:w-96">
                <input type="text" name="q" placeholder="Cari judul drama eksklusif..." 
                    class="w-full bg-white/5 border border-white/10 rounded-full py-2.5 px-5 pl-12 text-sm text-white focus:outline-none focus:border-[#d4af37] transition shadow-inner">
                <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </form>
        </nav>

        <!-- Hero Section -->
        <div class="relative w-full min-h-[50vh] md:min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-16 overflow-hidden">
            <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070')] bg-cover bg-center opacity-20"></div>
            <div class="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent"></div>
            <div class="relative z-10 max-w-3xl w-full mt-4">
                <span class="px-3 py-1 text-[10px] md:text-xs uppercase tracking-widest font-bold border border-[#d4af37]/50 text-[#d4af37] rounded-full mb-4 md:mb-6 inline-block">Free URL Extractor</span>
                <h2 class="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight">Semua Drama Favoritmu,<br> <span class="luxury-gradient">Tanpa Batas.</span></h2>
                
                <form action="/scrape" method="GET" class="mt-4 flex flex-col sm:flex-row w-full max-w-lg mx-auto gap-3">
                    <input type="text" name="url" placeholder="Paste URL Halaman Melolo disini..." required 
                        class="flex-1 glass bg-white/5 rounded-xl px-5 py-4 text-sm focus:outline-none border border-white/20 focus:border-[#d4af37] transition shadow-inner">
                    <button type="submit" class="luxury-btn font-bold px-8 py-4 rounded-xl text-sm transition transform hover:-translate-y-0.5 shadow-lg whitespace-nowrap">
                        Ekstrak Fitur
                    </button>
                </form>
            </div>
        </div>

        <!-- Render Container Kategori -->
        <div id="categories-container" class="max-w-7xl mx-auto px-4 lg:px-8 py-8 relative z-20 space-y-6">
            <!-- Injeksi via Javascript -->
        </div>

        <script>
            // List Kategori Mewah yang akan diload otomasis
            const categoryGroups = [
                { id: 'ceo', name: 'Trending: CEO' },
                { id: 'romance', name: 'Romantic Escapes' },
                { id: 'revenge', name: 'Sweet Revenge' },
                { id: 'werewolf', name: 'Alpha & Werewolf' }
            ];

            const container = document.getElementById('categories-container');

            // Fungsi membuat DOM untuk Baris/Row Kategori
            function createCategoryRow(category) {
                const section = document.createElement('div');
                section.className = 'w-full bg-[#0a0a0f] border border-[#d4af37]/20 rounded-2xl p-4 md:p-6 shadow-2xl';
                section.innerHTML = \`<div class="flex justify-between items-center mb-5 gap-4">
                        <h3 class="text-xl md:text-2xl font-bold border-l-4 border-[#d4af37] pl-3 tracking-wide truncate text-[#f5f5f5]">\${category.name}</h3>
                        <a href="/search?q=\${category.id}" class="text-[10px] md:text-xs text-[#000] bg-gradient-to-r from-[#d4af37] to-[#FFD700] hover:scale-105 px-4 py-1.5 rounded-md font-bold uppercase tracking-wider transition whitespace-nowrap shadow-lg">Lihat Semua</a>
                    </div>
                    <div id="row-\${category.id}" class="flex overflow-x-auto gap-4 lg:gap-6 pb-4 pt-2 snap-x hide-scrollbar">
                        \${generateSkeleton(6)}
                    </div>\`;
                return section;
            }

            // Animasi Loading Palsu (Skeleton)
            function generateSkeleton(count) {
                return Array(count).fill(0).map(() => 
                    \`<div class="snap-start shrink-0 w-32 md:w-40 lg:w-48 aspect-[2/3] bg-white/5 rounded-xl border border-white/10 animate-pulse"></div>\`
                ).join('');
            }

            // Fungsi Ambil Data dari API Server kita sendiri
            async function loadCategory(category) {
                try {
                    const res = await fetch(\`/api/dramas?c=\${category.id}\`);
                    const json = await res.json();
                    
                    const rowContainer = document.getElementById(\`row-\${category.id}\`);
                    if(json.success && json.data.length > 0) {
                        rowContainer.innerHTML = json.data.map(drama => {
                            const encodedPoster = encodeURIComponent(drama.poster);
                            const encodedTitle = encodeURIComponent(drama.title);
                            const encodedUrl = encodeURIComponent(drama.url);
                            
                            return \`<div class="snap-start shrink-0 w-32 md:w-40 lg:w-48 group relative rounded-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.8)] bg-black border-2 border-white/10 transition duration-500 hover:scale-105 hover:border-[#d4af37] hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:-translate-y-2">
                                <img src="\${drama.poster || 'https://via.placeholder.com/300x450?text=No+Image'}" 
                                    class="w-full h-full aspect-[2/3] object-cover transition duration-700 group-hover:opacity-40" loading="lazy" />
                                
                                <div class="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent p-4 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition duration-300">
                                    <h4 class="text-white font-bold leading-tight line-clamp-2 md:text-lg drop-shadow-lg capitalize text-sm">\${drama.title}</h4>
                                </div>

                                <a href="/scrape?url=\${encodedUrl}&poster=\${encodedPoster}&title=\${encodedTitle}" 
                                    class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300 z-10">
                                    <div class="w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center shadow-lg transform scale-50 group-hover:scale-100 transition duration-300 delay-100">
                                        <svg class="w-5 h-5 text-white ml-1" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                                    </div>
                                </a>
                            </div>\`;
                        }).join('');
                    } else {
                        rowContainer.innerHTML = \`<p class="text-sm text-gray-500 italic px-2">Drama tidak tersedia saat ini.</p>\`;
                    }
                } catch(e) {
                    console.log('Error loading', category.id);
                }
            }

            // Inisialisasi
            categoryGroups.forEach(cat => {
                container.appendChild(createCategoryRow(cat));
                loadCategory(cat); // AJAX fetch
            });
        </script>
    </body>
    </html>
  `)
})


// ----------------------------------------------------
// 3. LOGIKA PENCARIAN & PLAY VIDEO (Re-Styled)
// ----------------------------------------------------
app.get('/search', async (c) => {
  const query = c.req.query('q')
  if (!query) return c.redirect('/')

  try {
    const dramas = await fetchAndExtractDramas(query);

    if (dramas.length === 0) {
      return c.html(html`
        <!DOCTYPE html>
        <html lang="id">
        <head><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-[#050505] text-white p-5 flex items-center justify-center min-h-screen">
            <div class="text-center">
                <div class="text-5xl mb-4">🏜️</div>
                <h2 class="text-2xl font-bold mb-2">Pencarian Kosong</h2>
                <p class="text-gray-400 mb-6">Kami tidak dapat menemukan drama "${query}".</p>
                <a href="/" class="px-6 py-2 border border-[#d4af37] text-[#d4af37] rounded-full hover:bg-[#d4af37] hover:text-black transition">Kembali ke Beranda</a>
            </div>
        </body>
        </html>
      `)
    }

    const resultsHtml = dramas.map(drama => {
      const encodedPoster = encodeURIComponent(drama.poster);
      const encodedTitle = encodeURIComponent(drama.title);
      
      return `
      <div class="group relative bg-[#111] border border-white/5 rounded-2xl p-3 md:p-4 flex gap-3 md:gap-4 hover:bg-[#1a1a1a] transition duration-300 shadow-xl overflow-hidden hover:border-[#d4af37]/30">
        <!-- GAMBAR POSTER -->
        <div class="relative w-20 md:w-28 shadow-lg aspect-[2/3] shrink-0 rounded-xl overflow-hidden bg-black">
            <img src="${drama.poster}" class="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" />
        </div>
        
        <!-- INFO -->
        <div class="flex-1 min-w-0 flex flex-col justify-center">
            <span class="text-[10px] md:text-xs text-[#d4af37] font-bold uppercase tracking-wider mb-1">Premium Series</span>
            <h3 class="font-extrabold text-lg md:text-2xl capitalize text-white leading-tight drop-shadow-md line-clamp-2">
                ${drama.title}
            </h3>
            <p class="text-[10px] md:text-xs text-gray-500 mt-1 md:mt-2 truncate max-w-full">Platform: Melolo.com</p>
            
            <div class="mt-3 md:mt-4">
                <a href="/scrape?url=${encodeURIComponent(drama.url)}&poster=${encodedPoster}&title=${encodedTitle}" 
                    class="inline-flex items-center justify-center gap-2 bg-white text-black hover:bg-gray-200 w-full sm:w-auto px-5 md:px-6 py-2.5 rounded-full font-bold text-xs md:text-sm shadow-xl active:scale-95 transition">
                    <svg class="w-3.5 h-3.5 md:w-4 md:h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4l12 6-12 6z"></path></svg>
                    Tonton Sekarang
                </a>
            </div>
        </div>
      </div>
    `}).join('')

    return c.html(html`
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hasil Pencarian: ${query}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>body { background-color: #050505; font-family: sans-serif; }</style>
      </head>
      <body class="text-white min-h-screen">
        <nav class="bg-[#111] border-b border-white/10 px-6 py-4 mb-6">
            <a href="/" class="text-gray-400 hover:text-white transition flex items-center text-sm font-semibold">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Kembali
            </a>
        </nav>
        <div class="max-w-4xl mx-auto px-4 pb-12">
          <h2 class="text-3xl font-extrabold mb-8 text-white flex items-center">
            Hasil: <span class="text-[#d4af37] lowercase mx-3">"${query}"</span>
            <span class="text-sm bg-white/10 px-3 py-1 rounded-full font-medium ml-auto">${dramas.length} Judul Ditemukan</span>
          </h2>
          <div class="space-y-5">
            ${raw(resultsHtml)}
          </div>
        </div>
      </body>
      </html>
    `)

  } catch (err: any) {
    return c.text("Error mencari drama: " + err.message)
  }
})

// ----------------------------------------------------
// 4. SCRAPER EXTRACTOR & PLAYER MEWAH
// ----------------------------------------------------
app.get('/scrape', async (c) => {
  const targetUrl = c.req.query('url')
  const posterUrl = c.req.query('poster') || ''
  const dramaTitle = c.req.query('title') || 'Exclusive Series'

  if (!targetUrl || typeof targetUrl !== 'string') return c.text("URL tidak boleh kosong!")

  try {
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36",
        "Referer": "https://melolo.com/"
      }
    })

    const htmlContent = await response.text()

    const pattern = /https?:\/\/v\.melolo\.com\/[^"'\s\\]+\.mp4\?[^"'\s\\]+/g
    let links = Array.from(new Set(htmlContent.match(pattern) || []))
    links = links.map(l => l.replace(/\\\//g, '/').replace(/&amp;/g, '&'))

    if (links.length === 0) {
      return c.html(html`
        <!DOCTYPE html>
        <html lang="id">
        <head><script src="https://cdn.tailwindcss.com"></script></head>
        <body class="bg-[#050505] text-white flex items-center justify-center min-h-screen">
            <div class="p-8 text-center border border-white/10 rounded-2xl bg-[#111]">
                <h3 class="text-xl font-bold mb-2 text-red-400">Episode Terkunci (Premium)</h3>
                <p class="text-gray-400 text-sm mb-6">Sistem Melolo melindungi video ini di sisi server.</p>
                <a href="javascript:history.back()" class="px-6 py-2 bg-white text-black font-bold rounded-full">← Kembali</a>
            </div>
        </body>
        </html>
      `)
    }

    const episodesJson = JSON.stringify(links);

    return c.html(html`
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${dramaTitle} - Player Premium</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
            body { font-family: 'Outfit', sans-serif; background-color: #000; color: #fff; }
            .hide-scrollbar::-webkit-scrollbar { width: 6px; }
            .hide-scrollbar::-webkit-scrollbar-track { background: transparent; }
            .hide-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
            .hide-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(212, 175, 55, 0.5); }
            
            .eps-active { 
                background: linear-gradient(135deg, #FFD700 0%, #D4AF37 100%) !important; 
                color: #000 !important; 
                border-color: transparent !important;
                box-shadow: 0 0 15px rgba(212, 175, 55, 0.4);
                transform: scale(1.05);
            }
          </style>
      </head>
      <body class="min-h-screen flex flex-col lg:flex-row overflow-hidden">
          
          <!-- AREA VIDEO BAGIAN KIRI -->
          <div class="w-full lg:w-3/4 h-[40vh] md:h-[50vh] lg:h-screen bg-black relative flex flex-col justify-center shrink-0">
             
             <!-- HEADER NAV (Glassmorphism) -->
             <div class="absolute top-0 w-full p-3 lg:p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black via-black/80 to-transparent">
                <a href="/" class="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur border border-white/10 flex items-center justify-center transition">
                    <svg class="w-4 h-4 lg:w-5 lg:h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
                </a>
                <span class="text-[10px] lg:text-xs font-bold tracking-widest uppercase border border-[#d4af37] text-[#d4af37] px-2 py-1 lg:px-3 lg:py-1.5 rounded-full bg-black/50 backdrop-blur">Beta Scraper</span>
             </div>

             <!-- VIDEO PLAYER UTAMA -->
             <div class="w-full h-full flex-1 pt-12 lg:pt-0 pb-1 lg:pb-0 relative z-0">
                 <video id="mainPlayer" controls class="w-full h-full object-contain" referrerpolicy="no-referrer" poster="${posterUrl}" autoplay playsinline>
                     <!-- Source inject via JS -->
                 </video>
             </div>
          </div>

          <!-- AREA DAFTAR EPISODE KANAN -->
          <div class="w-full lg:w-1/4 h-[60vh] md:h-[50vh] lg:h-screen bg-[#0a0a0f] border-t lg:border-t-0 lg:border-l border-white/5 flex flex-col relative z-20 shadow-[-10px_0_30px_rgba(0,0,0,0.5)]">
              
              <!-- Info Series -->
              <div class="p-4 lg:p-6 border-b border-white/10 bg-gradient-to-br from-[#111] to-[#0a0a0f] shrink-0">
                  <div class="flex items-center gap-3 lg:gap-4">
                      ${posterUrl ? raw(`<img src="${posterUrl}" class="w-12 h-16 lg:w-16 lg:h-24 object-cover rounded-md shadow-lg border border-white/20" alt="Poster" />`) : ''}
                      <div class="flex-1 min-w-0">
                          <h2 class="text-lg md:text-xl lg:text-2xl font-extrabold capitalize leading-tight mb-1 lg:mb-2 tracking-tight drop-shadow-md text-white truncate lg:whitespace-normal line-clamp-2">${dramaTitle}</h2>
                          <div class="text-[10px] lg:text-xs font-semibold px-2 py-0.5 lg:px-3 lg:py-1 rounded-full bg-[#d4af37]/10 border border-[#d4af37]/30 text-[#d4af37] inline-block">
                              ${links.length} Episode
                          </div>
                      </div>
                  </div>
              </div>

              <!-- Daftar Number Episode -->
              <div class="p-4 lg:p-6 flex-1 overflow-y-auto hide-scrollbar">
                 <h3 class="text-[10px] lg:text-xs text-gray-500 font-bold uppercase tracking-widest pl-1 mb-3 lg:mb-4">Pilih Episode</h3>
                 <div class="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-4 gap-2 lg:gap-3" id="epsGrid"></div>
              </div>

              <!-- Extra Links / Tools (Bottom part) -->
              <div class="p-4 lg:p-5 bg-black/40 border-t border-white/5 backdrop-blur shrink-0 pb-6 lg:pb-5">
                 <p class="text-[8px] lg:text-[10px] uppercase text-gray-500 font-bold tracking-widest mb-1.5 lg:mb-2 pl-1">Direct Stream Target :</p>
                 <input type="text" id="rawLink" readonly class="w-full bg-[#111] text-[#d4af37] text-[10px] p-2 rounded-md lg:rounded-lg border border-white/10 outline-none select-all focus:border-[#d4af37]/50 transition" onclick="this.select()">
                 <a id="downloadLink" href="#" target="_blank" class="mt-2.5 lg:mt-3 w-full flex items-center justify-center gap-2 text-[10px] lg:text-xs font-bold uppercase tracking-wider bg-white/5 hover:bg-white/10 text-white py-2.5 lg:py-3 rounded-md lg:rounded-lg border border-white/10 transition">
                     <svg class="w-3.5 h-3.5 lg:w-4 lg:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
                     Buka di Tab Baru
                 </a>
              </div>
          </div>

          <script>
             const episodes = ${raw(episodesJson)};
             let currentEps = 0;
             const player = document.getElementById('mainPlayer');
             const epsGrid = document.getElementById('epsGrid');
             const rawLink = document.getElementById('rawLink');
             const downloadLink = document.getElementById('downloadLink');

             function loadEpisode(index) {
                currentEps = index;
                const link = episodes[index];
                
                player.src = "/proxy-video?url=" + encodeURIComponent(link);
                player.play().catch(e => console.log("Autoplay issue"));

                rawLink.value = link;
                downloadLink.href = link;

                document.querySelectorAll('.eps-btn').forEach((btn, i) => {
                    if (i === index) {
                        btn.classList.add('eps-active');
                        btn.classList.remove('bg-white/5', 'text-gray-300', 'border-white/10', 'hover:bg-white/10');
                    } else {
                        btn.classList.remove('eps-active');
                        btn.classList.add('bg-white/5', 'text-gray-300', 'border-white/10', 'hover:bg-white/10');
                    }
                });
             }

             // Generate Tombol Modern
             episodes.forEach((_, index) => {
                const btn = document.createElement('button');
                btn.className = "eps-btn aspect-square bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 hover:text-white rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300";
                btn.innerText = index + 1;
                btn.onclick = () => loadEpisode(index);
                epsGrid.appendChild(btn);
             });

             player.addEventListener('ended', () => {
                 if (currentEps + 1 < episodes.length) loadEpisode(currentEps + 1);
             });

             if (episodes.length > 0) loadEpisode(0);
          </script>
      </body>
      </html>
    `)

  } catch (err: any) {
    return c.text("Sistem gagal terhubung: " + err.message)
  }
})

// ----------------------------------------------------
// 5. PROXY VIDEO HOTLINK BYPASS
// ----------------------------------------------------
app.get('/proxy-video', async (c) => {
  const url = c.req.query('url')
  if (!url) return c.text("URL tidak ditemukan", 400)

  const reqHeaders = new Headers()
  const range = c.req.header('range')
  if (range) reqHeaders.set('Range', range)
  
  reqHeaders.set('User-Agent', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36')
  reqHeaders.set('Referer', 'https://melolo.com/')

  try {
    const response = await fetch(url, { headers: reqHeaders })
    const resHeaders = new Headers(response.headers)
    resHeaders.set('Access-Control-Allow-Origin', '*')

    return new Response(response.body, {
      status: response.status,
      headers: resHeaders
    })
  } catch (err) {
    return c.text("Gagal memuat proxy video", 500)
  }
})

export default app
