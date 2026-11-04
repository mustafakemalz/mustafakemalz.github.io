// Public endpoints used by the static site. Nothing here is secret.

// The Spotify function in /spotify-api is deployed as its own Vercel project.
// Name that project "muskz-spotify-api" so this default URL matches, or set
// VITE_SPOTIFY_API_URL at build time to point somewhere else.
export const SPOTIFY_API_URL: string =
  import.meta.env.VITE_SPOTIFY_API_URL || 'https://muskz-spotify-api.vercel.app/api/spotify';

export const SPOTIFY_PROFILE_URL = 'https://open.spotify.com/user/0wu2ixnxr61i99ci84hgtlolr';
export const KICK_URL = 'https://kick.com/muskz';
