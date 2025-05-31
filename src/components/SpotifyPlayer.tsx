
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

export const SpotifyPlayer = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string>('No track selected');
  const [accessToken, setAccessToken] = useState<string>('');

  // Study music playlists (these would be real Spotify playlist IDs)
  const studyPlaylists = [
    { name: 'Lo-fi Study Beats', id: 'lofi-study' },
    { name: 'Classical Focus', id: 'classical-focus' },
    { name: 'Ambient Study', id: 'ambient-study' },
    { name: 'Nature Sounds', id: 'nature-sounds' }
  ];

  const connectSpotify = () => {
    // In a real app, this would redirect to Spotify OAuth
    const clientId = 'your-spotify-client-id'; // This would need to be configured
    const redirectUri = window.location.origin;
    const scopes = 'streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state';
    
    // For demo purposes, we'll simulate connection
    setIsConnected(true);
    setCurrentTrack('Lo-fi Study Beats - Relaxing Music');
    
    // Real implementation would be:
    // const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`;
    // window.location.href = authUrl;
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control Spotify playback
    console.log(isPlaying ? 'Pausing music' : 'Playing music');
  };

  const selectPlaylist = (playlist: { name: string; id: string }) => {
    setCurrentTrack(playlist.name);
    console.log('Selected playlist:', playlist.name);
  };

  if (!isConnected) {
    return (
      <div className="p-6 text-center">
        <DialogHeader className="mb-6">
          <DialogTitle className="flex items-center justify-center gap-2">
            <Music className="w-5 h-5" />
            Connect Spotify
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-gray-600 text-sm">
            Connect your Spotify account to play study music while you focus.
          </p>
          <Button onClick={connectSpotify} className="w-full bg-green-500 hover:bg-green-600">
            Connect Spotify Account
          </Button>
          <p className="text-xs text-gray-500">
            Note: This is a demo. In a real app, you'd need Spotify API credentials.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <DialogHeader className="mb-6">
        <DialogTitle className="flex items-center justify-center gap-2">
          <Music className="w-5 h-5" />
          Study Music
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6">
        {/* Current track */}
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 mb-1">Now Playing</p>
          <p className="font-medium">{currentTrack}</p>
        </div>

        {/* Playback controls */}
        <div className="flex items-center justify-center gap-4">
          <Button variant="ghost" size="icon">
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button onClick={togglePlayback} size="icon" className="bg-green-500 hover:bg-green-600">
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </Button>
          <Button variant="ghost" size="icon">
            <SkipForward className="w-5 h-5" />
          </Button>
        </div>

        {/* Study playlists */}
        <div>
          <h3 className="font-medium mb-3">Study Playlists</h3>
          <div className="space-y-2">
            {studyPlaylists.map((playlist) => (
              <Button
                key={playlist.id}
                variant="ghost"
                className="w-full justify-start text-left"
                onClick={() => selectPlaylist(playlist)}
              >
                {playlist.name}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
