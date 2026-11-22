'use client';

import {
  Video,
  VideoPlayer,
  VideoSkin,
} from '@/components/ui/video-player';

const DEMO_YOUTUBE_URL = 'https://youtu.be/hX9S94XsySk?si=Zv6Tdz3OiAAhGlnd';
const DEMO_POSTER = 'https://i.ytimg.com/vi/hX9S94XsySk/maxresdefault.jpg';

export function VideoPlayerPosterExample() {
  return (
    <VideoPlayer poster={DEMO_POSTER}>
      <VideoSkin className="aspect-video w-160 max-w-full">
        <Video src={DEMO_YOUTUBE_URL} playsInline />
      </VideoSkin>
    </VideoPlayer>
  );
}
