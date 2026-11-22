'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  MuxVideo,
  TimedSlot,
  Title,
  UpNext,
  usePlayer,
  VideoPlayer,
  VideoSkin,
} from '@/components/ui/video-player';

const DEMO_PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';
const UP_NEXT_THUMB =
  'https://image.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/animated.gif?width=320&start=4&end=8';

function SkipIntroButton() {
  const player = usePlayer();
  return (
    <Button size="small" onClick={() => player.seek(35)}>
      Skip intro
    </Button>
  );
}

function JumpControls() {
  const player = usePlayer();
  const duration = usePlayer((state) => state.duration);

  return (
    <div className="flex items-center gap-2">
      <Button size="small" onClick={() => player.seek(5)}>
        Jump to the intro
      </Button>
      <Button
        size="small"
        onClick={() => player.seek(Math.max(0, (duration || 80) - 8))}
      >
        Jump near the end
      </Button>
    </div>
  );
}

export function VideoPlayerPromptExample() {
  const [videoNumber, setVideoNumber] = useState(1);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <VideoPlayer key={videoNumber} title={`Video ${videoNumber}`}>
        <VideoSkin className="aspect-video w-160 max-w-full">
          <MuxVideo playbackId={DEMO_PLAYBACK_ID} playsInline />
          <Title description="A badge and skip button show between 0:05 and 0:35. Up next appears 10 seconds before the end." />
          <TimedSlot start={5} end={35} placement="top-end" transitionIn="fade">
            <span className="rounded-md bg-bg-tooltip px-2.5 py-1 text-body-small-medium text-text-tooltip">
              Intro
            </span>
          </TimedSlot>
          <TimedSlot start={5} end={35}>
            <SkipIntroButton />
          </TimedSlot>
          <UpNext
            title={`Video ${videoNumber + 1}`}
            description="A short description of the video that plays next."
            thumbnailSrc={UP_NEXT_THUMB}
            onSelect={() => setVideoNumber((n) => n + 1)}
            onComplete={() => setVideoNumber((n) => n + 1)}
          />
        </VideoSkin>
        <JumpControls />
      </VideoPlayer>
    </div>
  );
}
