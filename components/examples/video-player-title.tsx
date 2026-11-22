'use client';

import {
  Title,
  VideoPlayer,
  VideoSkin,
  YouTubeVideo,
} from '@/components/ui/video-player';

const DEMO_YOUTUBE_URL = 'https://youtu.be/hX9S94XsySk?si=Zv6Tdz3OiAAhGlnd';

export function VideoPlayerTitleExample() {
  return (
    <VideoPlayer title="Demo video">
      <VideoSkin className="aspect-video w-120 max-w-full">
        <YouTubeVideo src={DEMO_YOUTUBE_URL} />
        <Title description="A second line under the title." />
      </VideoSkin>
    </VideoPlayer>
  );
}

export function VideoPlayerFullscreenTitleExample() {
  return (
    <VideoPlayer title="Demo video">
      <VideoSkin className="aspect-video w-120 max-w-full">
        <YouTubeVideo src={DEMO_YOUTUBE_URL} />
        <Title
          description="This title shows only in fullscreen."
          visibility="fullscreen"
        />
      </VideoSkin>
    </VideoPlayer>
  );
}
