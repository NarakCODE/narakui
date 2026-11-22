'use client';

import { useState } from 'react';
import {
  MuxVideo,
  Title,
  VideoPlayer,
  VideoSkin,
} from '@/components/ui/video-player';

const DEMO_PLAYBACK_ID = 'BV3YZtogl89mg9VcNBhhnHm02Y34zI1nlMuMQfAbl3dM';

export function VideoPlayerResizableExample() {
  const [width, setWidth] = useState(640);

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="flex w-full items-start justify-center sm:h-108">
        <div className="max-w-full" style={{ width }}>
          <VideoPlayer title="Demo video">
            <VideoSkin className="aspect-video w-full">
              <MuxVideo playbackId={DEMO_PLAYBACK_ID} playsInline />
              <Title description="Drag the slider to resize the player." />
            </VideoSkin>
          </VideoPlayer>
        </div>
      </div>

      <label className="flex max-w-full items-center gap-3 text-body-small-medium text-text-secondary">
        Preview width
        <input
          type="range"
          min={240}
          max={768}
          value={width}
          onChange={(event) => setWidth(Number(event.currentTarget.value))}
          className="w-56 min-w-0 accent-fill-primary"
        />
        <span className="w-12 text-text-primary tabular-nums">{width}px</span>
      </label>
    </div>
  );
}
