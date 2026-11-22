'use client';

import {
  MuxVideo,
  Title,
  VideoPlayer,
  VideoSkin,
} from '@/components/ui/video-player';

const DEMO_PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';

export function VideoPlayerTitleExample() {
  return (
    <VideoPlayer title="Demo video">
      <VideoSkin className="aspect-video w-120 max-w-full">
        <MuxVideo playbackId={DEMO_PLAYBACK_ID} playsInline />
        <Title description="A second line under the title." />
      </VideoSkin>
    </VideoPlayer>
  );
}

export function VideoPlayerFullscreenTitleExample() {
  return (
    <VideoPlayer title="Demo video">
      <VideoSkin className="aspect-video w-120 max-w-full">
        <MuxVideo playbackId={DEMO_PLAYBACK_ID} playsInline />
        <Title
          description="This title shows only in fullscreen."
          visibility="fullscreen"
        />
      </VideoSkin>
    </VideoPlayer>
  );
}
