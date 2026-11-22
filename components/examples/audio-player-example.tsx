'use client';

import { Audio, AudioPlayer, AudioSkin } from '@/components/ui/audio-player';

const AUDIO_SRC = 'https://youtube.com/shorts/MTAryPRReq8?si=nU9fzE4Tt50bhCeG';

export function AudioPlayerExample() {
  return (
    <AudioPlayer>
      <AudioSkin className="w-160 max-w-full">
        <Audio src={AUDIO_SRC} />
      </AudioSkin>
    </AudioPlayer>
  );
}
