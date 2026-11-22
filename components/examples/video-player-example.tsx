'use client';

import {
  ChaptersTrack,
  MuxVideo,
  Title,
  VideoPlayer,
  VideoSkin,
} from '@/components/ui/video-player';

const DEMO_PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';

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
        <MuxVideo playbackId={DEMO_PLAYBACK_ID} playsInline>
          <ChaptersTrack chapters={CHAPTERS} />
        </MuxVideo>
        <Title description="Hover the timeline to inspect chapters or open settings." />
      </VideoSkin>
    </VideoPlayer>
  );
}
