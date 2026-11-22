'use client';

import {
  Audio,
  AudioPlayer,
  AudioSkin,
  MuteButton,
  PlayButton,
  TimeSlider,
} from '@/components/ui/audio-player';

const AUDIO_SRC = 'https://youtube.com/shorts/MTAryPRReq8?si=nU9fzE4Tt50bhCeG';

function MinimalControls() {
  return (
    <div className="flex w-full items-center gap-2 p-1 text-text-primary">
      <PlayButton />
      <TimeSlider />
      <MuteButton />
    </div>
  );
}

export function AudioPlayerCustomControlsExample() {
  return (
    <AudioPlayer>
      <AudioSkin className="w-96 max-w-full" controls={<MinimalControls />}>
        <Audio src={AUDIO_SRC} />
      </AudioSkin>
    </AudioPlayer>
  );
}
