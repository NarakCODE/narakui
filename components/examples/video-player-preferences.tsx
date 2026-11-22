'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  MuxVideo,
  Title,
  UserPreferences,
  useUserPreferences,
  VideoPlayer,
  VideoSkin,
} from '@/components/ui/video-player';

const DEMO_PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';

const PREFERENCE_LABELS = [
  ['volume', 'volume'],
  ['muted', 'muted'],
  ['playbackRate', 'speed'],
  ['captions', 'captions'],
  ['captionsOff', 'captions off'],
] as const;

export function VideoPlayerPreferencesExample() {
  const [videoNumber, setVideoNumber] = useState(1);
  const [mounted, setMounted] = useState(false);
  const prefs = useUserPreferences();

  useEffect(() => {
    setMounted(true);
  }, []);

  const summary = mounted
    ? PREFERENCE_LABELS.flatMap(([key, label]) =>
        prefs[key] === undefined ? [] : [`${label} ${String(prefs[key])}`],
      ).join(', ') || 'none yet'
    : 'none yet';

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <VideoPlayer key={videoNumber} title={`Video ${videoNumber}`}>
        <VideoSkin className="aspect-video w-160 max-w-full">
          <MuxVideo playbackId={DEMO_PLAYBACK_ID} playsInline />
          <Title description="Change the volume, speed, or captions, then load the next video." />
          <UserPreferences />
        </VideoSkin>
      </VideoPlayer>

      <div className="flex items-center gap-2">
        <Button size="small" onClick={() => setVideoNumber((n) => n + 1)}>
          Next video
        </Button>
        <Button
          size="small"
          mode="tertiary"
          onClick={() => useUserPreferences.getState().reset()}
        >
          Forget preferences
        </Button>
      </div>

      <p className="max-w-full text-center text-body-small-regular text-text-secondary">
        Saved preferences: <span className="text-text-primary">{summary}</span>
      </p>
    </div>
  );
}
