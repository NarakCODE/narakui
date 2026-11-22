'use client';

import { Audio, AudioPlayer, AudioSkin } from '@/components/ui/audio-player';

export function AudioPlayerErrorExample() {
  return (
    <AudioPlayer>
      <AudioSkin className="w-160 max-w-full">
        <Audio src="data:audio/mp4;base64,AAAA" />
      </AudioSkin>
    </AudioPlayer>
  );
}
