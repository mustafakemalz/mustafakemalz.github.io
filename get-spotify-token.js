/**
 * ============================================
 *  SPOTIFY REFRESH TOKEN ALMA SCRIPTI
 * ============================================
 * 
 * Bu script'i sadece BİR KEZ çalıştırman yeterli.
 * Amacı: Spotify hesabından kalıcı bir "refresh_token" almak.
 * 
 * KULLANIM:
 * 1. Aşağıdaki CLIENT_ID ve CLIENT_SECRET değerlerini
 *    Spotify Developer Dashboard'dan al ve buraya yaz.
 * 
 * 2. Terminal'de çalıştır:
 *    node get-spotify-token.js
 * 
 * 3. Tarayıcı açılacak, Spotify'a giriş yap ve izin ver.
 * 
 * 4. Terminal'de "REFRESH TOKEN" yazdırılacak.
 *    Bu token'ı Vercel environment variable olarak kaydet:
 *    - SPOTIFY_REFRESH_TOKEN = <bu token>
 *    - SPOTIFY_CLIENT_ID = <client id>
 *    - SPOTIFY_CLIENT_SECRET = <client secret>
 */

const http = require('http');
const { execSync } = require('child_process');

// ╔══════════════════════════════════════════════╗
// ║  BU DEĞERLERİ SPOTIFY DASHBOARD'DAN AL!     ║
// ╚══════════════════════════════════════════════╝
const CLIENT_ID = 'd09effbb0a9d47a6a19f4fdd9c3cc314';
const CLIENT_SECRET = 'f4773b3e3cb2459282d41f612698af75';
const REDIRECT_URI = 'http://127.0.0.1:8888/callback';
const SCOPES = 'user-read-recently-played user-read-currently-playing';

// Step 1: Build authorization URL
const authUrl = `https://accounts.spotify.com/authorize?` +
    `client_id=${CLIENT_ID}` +
    `&response_type=code` +
    `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
    `&scope=${encodeURIComponent(SCOPES)}` +
    `&show_dialog=true`;

console.log('\n╔══════════════════════════════════════════════╗');
console.log('║     SPOTIFY TOKEN ALMA İŞLEMİ BAŞLIYOR       ║');
console.log('╚══════════════════════════════════════════════╝\n');
console.log('🌐 Tarayıcı açılıyor...\n');

// Open browser
try {
    // Windows
    execSync(`start "" "${authUrl}"`);
} catch {
    try {
        // macOS
        execSync(`open "${authUrl}"`);
    } catch {
        // Linux
        execSync(`xdg-open "${authUrl}"`);
    }
}

// Step 2: Start local server to catch the callback
const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:8888`);

    if (url.pathname === '/callback') {
        const code = url.searchParams.get('code');
        const error = url.searchParams.get('error');

        if (error) {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end('<html><body style="background:#050505;color:#ff4444;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh;font-size:1.5rem;">❌ İzin reddedildi. Tekrar dene.</body></html>');
            console.log('❌ Kullanıcı izni reddetti.');
            server.close();
            process.exit(1);
            return;
        }

        if (code) {
            console.log('✅ Authorization code alındı! Token exchange yapılıyor...\n');

            // Step 3: Exchange code for tokens
            try {
                const basic = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

                const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Basic ${basic}`,
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: new URLSearchParams({
                        grant_type: 'authorization_code',
                        code: code,
                        redirect_uri: REDIRECT_URI,
                    }),
                });

                const tokenData = await tokenResponse.json();

                if (tokenData.error) {
                    console.log('❌ Token hatası:', tokenData.error_description);
                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`<html><body style="background:#050505;color:#ff4444;font-family:monospace;display:flex;justify-content:center;align-items:center;height:100vh;font-size:1.2rem;">❌ Hata: ${tokenData.error_description}</body></html>`);
                } else {
                    console.log('╔══════════════════════════════════════════════╗');
                    console.log('║              TOKEN BAŞARIYLA ALINDI!          ║');
                    console.log('╚══════════════════════════════════════════════╝');
                    console.log('');
                    console.log('🔑 REFRESH TOKEN (bunu Vercel\'e kaydet):');
                    console.log('──────────────────────────────────────────');
                    console.log(tokenData.refresh_token);
                    console.log('──────────────────────────────────────────');
                    console.log('');
                    console.log('📋 Vercel Environment Variables:');
                    console.log(`   SPOTIFY_CLIENT_ID     = ${CLIENT_ID}`);
                    console.log(`   SPOTIFY_CLIENT_SECRET  = ${CLIENT_SECRET}`);
                    console.log(`   SPOTIFY_REFRESH_TOKEN  = ${tokenData.refresh_token}`);
                    console.log('');
                    console.log('💡 Vercel Dashboard → Settings → Environment Variables');
                    console.log('   veya terminal\'de: vercel env add SPOTIFY_REFRESH_TOKEN');

                    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
                    res.end(`
                        <html>
                        <body style="background:#050505;color:#d2ff00;font-family:'Inter',monospace;display:flex;flex-direction:column;justify-content:center;align-items:center;height:100vh;gap:20px;">
                            <div style="font-size:3rem;">✅</div>
                            <div style="font-size:1.5rem;font-weight:900;">TOKEN ALINDI!</div>
                            <div style="color:#888;font-size:0.9rem;">Terminal'e bak ve refresh token'ı kopyala.</div>
                            <div style="color:#888;font-size:0.8rem;">Bu sekmeyi kapatabilirsin.</div>
                        </body>
                        </html>
                    `);
                }
            } catch (err) {
                console.error('❌ Fetch hatası:', err.message);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal error');
            }

            setTimeout(() => {
                server.close();
                process.exit(0);
            }, 2000);
        }
    }
});

server.listen(8888, '127.0.0.1', () => {
    console.log('🔄 Callback sunucusu çalışıyor: http://127.0.0.1:8888');
    console.log('⏳ Spotify\'dan izin bekleniyor...\n');
});
