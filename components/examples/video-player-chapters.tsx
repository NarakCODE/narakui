'use client';

import {
  ChaptersTrack,
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

export function VideoPlayerChaptersExample() {
  return (
    <VideoPlayer>
      <VideoSkin className="aspect-video w-120 max-w-full">
        <YouTubeVideo src={DEMO_YOUTUBE_URL}>
          <ChaptersTrack chapters={CHAPTERS} />
        </YouTubeVideo>
      </VideoSkin>
    </VideoPlayer>
  );
}
