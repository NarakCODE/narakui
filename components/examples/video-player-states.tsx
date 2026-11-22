'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BufferingIndicator,
  Video,
  VideoPlayer,
  VideoSkin,
  YouTubeVideo,
} from '@/components/ui/video-player';

const DEMO_YOUTUBE_URL = 'https://youtu.be/hX9S94XsySk?si=Zv6Tdz3OiAAhGlnd';

export function VideoPlayerLoadingExample() {
  return (
    <div className="aspect-video w-96 max-w-full">
      <Skeleton className="size-full rounded-xl" />
    </div>
  );
}

export function VideoPlayerBufferingExample() {
  return (
    <div inert className="w-96 max-w-full">
      <VideoPlayer>
        <VideoSkin className="aspect-video w-full">
          <YouTubeVideo src={DEMO_YOUTUBE_URL} />
          <BufferingIndicator className="grid" />
        </VideoSkin>
      </VideoPlayer>
    </div>
  );
}

export function VideoPlayerErrorExample() {
  const [src, setSrc] = useState<string | undefined>(undefined);

  useEffect(() => {
    setSrc('data:video/mp4;base64,AAAA');
  }, []);

  return (
    <VideoPlayer>
      <VideoSkin className="aspect-video w-96 max-w-full">
        <Video src={src} playsInline />
      </VideoSkin>
    </VideoPlayer>
  );
}
