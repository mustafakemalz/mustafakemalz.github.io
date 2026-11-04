# muskz-spotify-api

Serverless endpoint for the Journey page's "Now" panel. The portfolio stays on GitHub Pages; only this folder is deployed to Vercel.

`GET /api/spotify` returns

```json
{
  "nowPlaying": { "name": "", "artist": "", "album": "", "albumArt": "", "url": "", "durationMs": 0, "progressMs": 0 },
  "recent": [{ "name": "", "artist": "", "album": "", "albumArt": "", "url": "", "durationMs": 0, "playedAt": "" }],
  "timestamp": 0
}
```

`nowPlaying` is `null` when nothing is playing. On failure it answers `502 { "error": "spotify_unavailable" }`. Responses are cached for 60 seconds and CORS is limited to muskz.tech, mustafakemalz.github.io and local dev ports.

## Deploy

1. Vercel → Add New → Project → import `mustafakemalz.github.io`
2. Root Directory: `spotify-api`, Framework Preset: Other, no build command
3. Environment Variables: `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `SPOTIFY_REFRESH_TOKEN`
4. Deploy, then open `https://<project>.vercel.app/api/spotify` to check

The refresh token needs the `user-read-recently-played` scope, and `user-read-currently-playing` for the live track.
