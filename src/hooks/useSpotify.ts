import { useEffect, useState } from 'react';
import { SPOTIFY_API_URL } from '../config';

export interface SpotifyTrack {
  name: string;
  artist: string;
  album: string;
  albumArt: string;
  url: string;
  durationMs: number;
  playedAt?: string;
  progressMs?: number;
}

export type SpotifyState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; track: SpotifyTrack; isLive: boolean };

const REFRESH_MS = 60_000;

const isTrack = (value: unknown): value is SpotifyTrack => {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  return typeof v.name === 'string' && typeof v.artist === 'string' && typeof v.url === 'string';
};

// Only accept https links from Spotify's own domains before putting them in href/src
const isSafeUrl = (value: string, hosts: string[]) => {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && hosts.some((h) => url.hostname === h || url.hostname.endsWith(`.${h}`));
  } catch {
    return false;
  }
};

const sanitize = (track: SpotifyTrack): SpotifyTrack => ({
  ...track,
  url: isSafeUrl(track.url, ['spotify.com']) ? track.url : '',
  albumArt: isSafeUrl(track.albumArt, ['scdn.co', 'spotifycdn.com']) ? track.albumArt : '',
});

export const useSpotify = (): SpotifyState => {
  const [state, setState] = useState<SpotifyState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;
    let timer: number | undefined;
    const controller = new AbortController();

    const load = async () => {
      timer = undefined;
      try {
        const response = await fetch(SPOTIFY_API_URL, { signal: controller.signal });
        if (!response.ok) throw new Error(String(response.status));
        const data = await response.json();

        const live = isTrack(data?.nowPlaying) ? data.nowPlaying : null;
        const recent = Array.isArray(data?.recent) ? data.recent.find(isTrack) : null;
        const track = live || recent;

        if (cancelled) return;
        if (track) {
          setState({ status: 'ready', track: sanitize(track), isLive: Boolean(live) });
        } else {
          setState({ status: 'error' });
        }
      } catch {
        if (!cancelled && !controller.signal.aborted) {
          setState((prev) => (prev.status === 'ready' ? prev : { status: 'error' }));
        }
      }

      if (!cancelled && document.visibilityState === 'visible') {
        timer = window.setTimeout(load, REFRESH_MS);
      }
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible' && timer === undefined) load();
      if (document.visibilityState === 'hidden' && timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    load();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelled = true;
      controller.abort();
      if (timer !== undefined) window.clearTimeout(timer);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return state;
};
