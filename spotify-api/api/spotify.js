// Vercel Serverless Function — Spotify now playing + recently played
//
// Deployed as its own Vercel project (Root Directory: spotify-api).
// The portfolio itself stays on GitHub Pages and calls this endpoint.
//
// Environment variables (set in Vercel → Project → Settings → Environment Variables):
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET
//   SPOTIFY_REFRESH_TOKEN   (scopes: user-read-recently-played, optionally user-read-currently-playing)

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played?limit=6';

const ALLOWED_ORIGINS = new Set([
    'https://muskz.tech',
    'https://www.muskz.tech',
    'https://mustafakemalz.github.io',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:4173',
]);

const CACHE_MS = 60 * 1000;
let cached = null;
let cachedAt = 0;

let accessToken = null;
let accessTokenExpiresAt = 0;

async function getAccessToken() {
    if (accessToken && Date.now() < accessTokenExpiresAt) return accessToken;

    const clientId = (process.env.SPOTIFY_CLIENT_ID || '').trim();
    const clientSecret = (process.env.SPOTIFY_CLIENT_SECRET || '').trim();
    const refreshToken = (process.env.SPOTIFY_REFRESH_TOKEN || '').trim();

    if (!clientId || !clientSecret || !refreshToken) {
        throw new Error('missing_env');
    }

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok || !data.access_token) {
        throw new Error(`token_${data.error || response.status}`);
    }

    accessToken = data.access_token;
    // Refresh a minute before Spotify's expiry (usually 3600 s)
    accessTokenExpiresAt = Date.now() + Math.max(0, (data.expires_in || 3600) - 60) * 1000;
    return accessToken;
}

function formatTrack(track) {
    if (!track || track.type !== 'track') return null;
    const images = track.album?.images || [];
    return {
        name: track.name,
        artist: (track.artists || []).map((a) => a.name).join(', '),
        album: track.album?.name || '',
        albumArt: images[1]?.url || images[0]?.url || '',
        url: track.external_urls?.spotify || '',
        durationMs: track.duration_ms || 0,
    };
}

async function getNowPlaying(token) {
    const response = await fetch(NOW_PLAYING_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
    });
    // 204: nothing playing. 401/403: refresh token lacks the currently-playing scope.
    if (response.status !== 200) return null;

    const data = await response.json().catch(() => null);
    const track = formatTrack(data?.item);
    if (!track || !data.is_playing) return null;
    return { ...track, progressMs: data.progress_ms || 0 };
}

async function getRecentlyPlayed(token) {
    const response = await fetch(RECENTLY_PLAYED_ENDPOINT, {
        headers: { Authorization: `Bearer ${token}` },
    });
    if (!response.ok) throw new Error(`recent_${response.status}`);

    const data = await response.json();
    return (data.items || [])
        .map((item) => {
            const track = formatTrack(item.track);
            return track ? { ...track, playedAt: item.played_at } : null;
        })
        .filter(Boolean);
}

export default async function handler(req, res) {
    const origin = req.headers.origin;
    if (origin && ALLOWED_ORIGINS.has(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Vary', 'Origin');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(204).end();
    if (req.method !== 'GET') return res.status(405).json({ error: 'method_not_allowed' });

    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=120');

    try {
        const now = Date.now();
        if (cached && now - cachedAt < CACHE_MS) {
            return res.status(200).json(cached);
        }

        const token = await getAccessToken();
        const [nowPlaying, recent] = await Promise.all([
            getNowPlaying(token).catch(() => null),
            getRecentlyPlayed(token),
        ]);

        cached = { nowPlaying, recent, timestamp: now };
        cachedAt = now;
        return res.status(200).json(cached);
    } catch (error) {
        // Log only the error code, never credentials or tokens
        console.error('spotify handler:', error instanceof Error ? error.message : 'unknown');
        res.setHeader('Cache-Control', 'no-store');
        return res.status(502).json({ error: 'spotify_unavailable' });
    }
}
