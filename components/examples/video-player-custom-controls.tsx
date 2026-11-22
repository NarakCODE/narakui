'use client';

import {
  FullscreenButton,
  PlayButton,
  TimeSlider,
  VideoPlayer,
  VideoSkin,
  YouTubeVideo,
} from '@/components/ui/video-player';

const DEMO_YOUTUBE_URL = 'https://youtu.be/hX9S94XsySk?si=Zv6Tdz3OiAAhGlnd';

function MinimalControls() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-30 bg-linear-to-t from-black/75 to-transparent px-4 pt-8 pb-3 text-white">
      <div className="pointer-events-auto flex items-center gap-3">
        <PlayButton />
        <TimeSlider />
        <FullscreenButton />
      </div>
    </div>
  );
}

export function VideoPlayerCustomControlsExample() {
  return (
    <VideoPlayer>
      <VideoSkin
        className="aspect-video w-120 max-w-full"
        controls={<MinimalControls />}
      >
        <YouTubeVideo src={DEMO_YOUTUBE_URL} />
      </VideoSkin>
    </VideoPlayer>
  );
}
