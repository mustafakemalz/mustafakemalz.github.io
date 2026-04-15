// Vercel Serverless Function - Spotify Recently Played
// Environment Variables Required:
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET
//   SPOTIFY_REFRESH_TOKEN

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const RECENTLY_PLAYED_ENDPOINT = 'https://api.spotify.com/v1/me/player/recently-played';

// Cache to avoid hitting Spotify rate limits
let cachedData = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute cache

async function getAccessToken() {
    const client_id = (process.env.SPOTIFY_CLIENT_ID || '').trim();
    const client_secret = (process.env.SPOTIFY_CLIENT_SECRET || '').trim();
    const refresh_token = (process.env.SPOTIFY_REFRESH_TOKEN || '').trim();

    const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

    const response = await fetch(TOKEN_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Basic ${basic}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: refresh_token,
        }),
    });

    return response.json();
}

async function getRecentlyPlayed(accessToken) {
    const response = await fetch(`${RECENTLY_PLAYED_ENDPOINT}?limit=10`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
        },
    });

    return response.json();
}

export default async function handler(req, res) {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate=30');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    try {
        // Check cache
        const now = Date.now();
        if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
            return res.status(200).json(cachedData);
        }

        // Get fresh access token
        const { access_token, error: tokenError } = await getAccessToken();

        if (tokenError || !access_token) {
            console.error('Token error:', tokenError);
            return res.status(500).json({ error: 'Failed to get access token' });
        }

        // Fetch recently played tracks
        const data = await getRecentlyPlayed(access_token);

        if (data.error) {
            console.error('Spotify API error:', data.error);
            return res.status(500).json({ error: 'Failed to fetch tracks' });
        }

        // Format the response
        const tracks = data.items.map(item => ({
            name: item.track.name,
            artist: item.track.artists.map(a => a.name).join(', '),
            album: item.track.album.name,
            albumArt: item.track.album.images[0]?.url || '',
            albumArtSmall: item.track.album.images[2]?.url || item.track.album.images[0]?.url || '',
            url: item.track.external_urls.spotify,
            playedAt: item.played_at,
            duration: item.track.duration_ms,
            previewUrl: item.track.preview_url,
        }));

        const result = { tracks, timestamp: now };

        // Update cache
        cachedData = result;
        cacheTimestamp = now;

        return res.status(200).json(result);
    } catch (error) {
        console.error('Handler error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}
