'use client';

import {
  Video,
  VideoPlayer,
  VideoSkin,
} from '@/components/ui/video-player';

const DEMO_MP4 =
  'https://stream.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/highest.mp4';
const DEMO_POSTER =
  'https://image.mux.com/BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM/thumbnail.webp?time=8&width=1280';

export function VideoPlayerPosterExample() {
  return (
    <VideoPlayer poster={DEMO_POSTER}>
      <VideoSkin className="aspect-video w-160 max-w-full">
        <Video src={DEMO_MP4} playsInline />
      </VideoSkin>
    </VideoPlayer>
  );
}
