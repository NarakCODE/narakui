'use client';

import {
  ChaptersTrack,
  Title,
  VideoPlayer,
  VideoSkin,
  YouTubeVideo,
} from '@/components/ui/video-player';

const DEMO_YOUTUBE_URL = 'https://youtu.be/hX9S94XsySk?si=Zv6Tdz3OiAAhGlnd';

const CHAPTERS = [
  { startTime: 0, title: 'Introduction' },
  { startTime: 20, title: 'Part one' },
  { startTime: 45, title: 'Part two' },
  { startTime: 70, title: 'Wrap-up' },
];

export function VideoPlayerExample() {
  return (
    <VideoPlayer title="Demo video">
      <VideoSkin className="aspect-video w-160 max-w-full">
        <YouTubeVideo src={DEMO_YOUTUBE_URL}>
          <ChaptersTrack chapters={CHAPTERS} />
        </YouTubeVideo>
        <Title description="Hover the timeline to inspect chapters or open settings." />
      </VideoSkin>
    </VideoPlayer>
  );
}
