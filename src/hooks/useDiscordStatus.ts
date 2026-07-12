import { useEffect, useState } from 'react';

const DISCORD_ID = "465079638088089608";

export interface DiscordStatus {
  status: 'online' | 'idle' | 'dnd' | 'offline';
  username: string;
  avatarUrl: string;
  customStatus?: {
    text: string;
    emojiHtml?: string;
  };
  activityText?: string;
  isListeningToSpotify: boolean;
  spotifySong?: string;
}

export const useDiscordStatus = () => {
  const [data, setData] = useState<DiscordStatus | null>(null);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const resJson = await response.json();

        if (!resJson.success || !resJson.data) return;

        const d = resJson.data;

        // Avatar
        let avatarUrl = 'https://cdn.discordapp.com/embed/avatars/0.png';
        if (d.discord_user.avatar) {
          const ext = d.discord_user.avatar.startsWith('a_') ? 'gif' : 'png';
          avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${d.discord_user.avatar}.${ext}`;
        }

        // Custom status
        let customStatus;
        const customActivity = d.activities.find((act: any) => act.type === 4);
        if (customActivity && customActivity.state) {
          let emojiHtml = '';
          if (customActivity.emoji) {
            if (customActivity.emoji.id) {
              emojiHtml = `<img src="https://cdn.discordapp.com/emojis/${customActivity.emoji.id}.png?v=1" style="height:14px;width:auto;vertical-align:middle;margin-right:4px" alt="${customActivity.emoji.name}">`;
            } else {
              emojiHtml = customActivity.emoji.name + ' ';
            }
          }
          customStatus = {
            text: customActivity.state,
            emojiHtml,
          };
        }

        // Activity text
        let activityText = 'Chilling';
        let isListeningToSpotify = false;
        let spotifySong = '';

        if (d.listening_to_spotify && d.spotify && d.spotify.song) {
          isListeningToSpotify = true;
          const song = d.spotify.song;
          const clean = song.length > 25 ? song.substring(0, 25) + '...' : song;
          activityText = clean;
          spotifySong = song;
        } else if (d.activities.length > 0) {
          const activity = d.activities.find((act: any) => act.type !== 4);
          if (activity) {
            let text = activity.name;
            if (activity.name === 'Visual Studio Code' && activity.details) {
              text = activity.details;
            } else if (activity.details) {
              text = `${activity.name} · ${activity.details}`;
            } else if (activity.state) {
              text = `${activity.name} · ${activity.state}`;
            }
            activityText = text;
          } else {
            activityText = 'Chilling / Online';
          }
        } else {
          activityText = d.discord_status === 'offline' ? 'Offline' : 'Chilling';
        }

        setData({
          status: d.discord_status,
          username: d.discord_user.username,
          avatarUrl,
          customStatus,
          activityText,
          isListeningToSpotify,
          spotifySong,
        });
      } catch (err) {
        console.error('Error fetching Discord status:', err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, []);

  return data;
};
