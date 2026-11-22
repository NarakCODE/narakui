'use client';

import { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BufferingIndicator,
  MuxVideo,
  Video,
  VideoPlayer,
  VideoSkin,
} from '@/components/ui/video-player';

const DEMO_PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';

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
          <MuxVideo playbackId={DEMO_PLAYBACK_ID} playsInline />
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
