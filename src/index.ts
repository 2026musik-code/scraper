import { Hono } from 'hono'
import { html, raw } from 'hono/html'

const app = new Hono()

// Tampilan Utama (HTML + CSS)
app.get('/', (c) => {
  return c.html(html`
    <!DOCTYPE html>
    <html lang="id">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dedi Drama Scraper</title>
        <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-900 text-white p-5">
        <div class="max-w-2xl mx-auto">
            <h1 class="text-2xl font-bold mb-5 text-blue-400">🎬 Melolo Video Finder</h1>
            
            <form action="/scrape" method="POST" class="mb-8">
                <input type="text" name="url" placeholder="Paste URL Halaman Drama Disini..." 
                    class="w-full p-3 rounded bg-gray-800 border border-gray-700 mb-3 text-white focus:outline-none focus:border-blue-500">
                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 p-3 rounded font-bold transition">
                    Cari Video
                </button>
            </form>

            <div id="results">
            </div>
        </div>
    </body>
    </html>
  `)
})

// Proxy untuk memutar video tanpa diblokir (Bypass Hotlink)
app.get('/proxy-video', async (c) => {
  const url = c.req.query('url')
  if (!url) return c.text("URL tidak ditemukan", 400)

  const reqHeaders = new Headers()
  // Teruskan header Range agar video bisa di-seek (dipercepat/dimundurkan)
  const range = c.req.header('range')
  if (range) reqHeaders.set('Range', range)
  
  // Set header agar server asal mengira request dari websitenya
  reqHeaders.set('User-Agent', 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36')
  reqHeaders.set('Referer', 'https://melolo.com/')

  try {
    const response = await fetch(url, { headers: reqHeaders })
    
    // Copy headers balasan dari server asli ke client kita
    const resHeaders = new Headers(response.headers)
    resHeaders.set('Access-Control-Allow-Origin', '*')

    return new Response(response.body, {
      status: response.status,
      headers: resHeaders
    })
  } catch (err) {
    return c.text("Gagal memuat video", 500)
  }
})

// Logika Scraper
app.post('/scrape', async (c) => {
  const body = await c.req.parseBody()
  const targetUrl = body.url

  // Type assertion for TS to understand targetUrl is a string
  if (!targetUrl || typeof targetUrl !== 'string') return c.text("URL tidak boleh kosong!")

  try {
    // 1. Ambil Halaman Web Target
    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
        "Referer": "https://melolo.com/"
      }
    })

    const htmlContent = await response.text()

    // 2. Regex Diperbaiki agar tidak terpotong saat extract parameter panjang (seperti &t=... &expired=...)
    // Kadang tanda hubung dan ampersand di link bisa memutus regex lama
    const pattern = /https?:\/\/v\.melolo\.com\/[^"'\s\\]+\.mp4\?[^"'\s\\]+/g
    let links = Array.from(new Set(htmlContent.match(pattern) || []))
    
    // Perbaikan URI yang di-escape (json backslash dan HTML entity)
    links = links.map(l => l.replace(/\\\//g, '/').replace(/&amp;/g, '&'))

    if (links.length === 0) {
      return c.html(html`<p class="text-red-500">Video tidak ditemukan di halaman ini.</p><a href="/" class="text-blue-400">Kembali</a>`)
    }

    // 3. Tampilkan List Video & Player (Gunakan Server Proxy)
    const listHtml = links.map((link, index) => `
      <div class="bg-gray-800 p-4 rounded-lg mb-4 border-l-4 border-blue-500">
        <p class="text-sm font-bold mb-2 text-gray-400">Video #${index + 1}</p>
        
        <!-- Pemutar Video Menggunakan Proxy -->
        <video controls class="w-full rounded mb-3 bg-black" referrerpolicy="no-referrer" preload="none">
            <source src="/proxy-video?url=${encodeURIComponent(link)}" type="video/mp4">
            Browser kamu tidak mendukung video player.
        </video>

        <div class="flex gap-2">
            <a href="${link}" target="_blank" class="text-xs bg-gray-700 text-center p-2 rounded hover:bg-gray-600 flex-1 break-all">
                Buka Link Asli Server
            </a>
        </div>
      </div>
    `).join('')

    return c.html(html`
      <!DOCTYPE html>
      <html lang="id">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Hasil Scrape - Melolo</title>
          <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-gray-900 text-white min-h-screen">
          <div class="max-w-2xl mx-auto p-5 relative">
            <a href="/" class="text-blue-400 mb-5 inline-block">← Kembali Cari Lagi</a>
            <h2 class="text-xl font-bold mb-5">Ditemukan ${links.length} Video:</h2>
            <div>
              ${raw(listHtml)}
            </div>
          </div>
      </body>
      </html>
    `)

  } catch (err: any) {
    return c.text("Terjadi kesalahan: " + err.message)
  }
})

export default app
