'use client';

import { useRef, useState, type PointerEvent } from 'react';
import { ResizeHandle } from '@/components/ui/resize-handle';

const MIN_WIDTH = 160;
const MAX_WIDTH = 360;
const DEFAULT_WIDTH = 240;

export function ResizeHandleKeyboard() {
  const [width, setWidth] = useState(DEFAULT_WIDTH);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ x: number; width: number } | null>(null);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    dragStartRef.current = { x: event.clientX, width };
    setIsDragging(true);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    const delta = dragStartRef.current.x - event.clientX;
    const next = Math.min(
      MAX_WIDTH,
      Math.max(MIN_WIDTH, Math.round(dragStartRef.current.width + delta)),
    );
    setWidth(next);
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!dragStartRef.current) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    dragStartRef.current = null;
    setIsDragging(false);
  };

  return (
    <div className="flex h-48 w-full max-w-xl overflow-hidden rounded-md bg-bg-secondary shadow-low">
      <div className="flex-1 p-3 text-body-small-regular text-text-secondary">
        Canvas
      </div>
      <aside
        className="relative shrink-0 border-l border-fill-quaternary bg-bg-primary p-3"
        style={{ width }}
      >
        <ResizeHandle
          aria-label="Resize details panel"
          position="left"
          size={width}
          minSize={MIN_WIDTH}
          maxSize={MAX_WIDTH}
          isDragging={isDragging}
          onSizeChange={setWidth}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onDoubleClick={() => setWidth(DEFAULT_WIDTH)}
        />
        <p className="text-body-small-medium text-text-primary">Details</p>
        <p className="text-body-small-regular text-text-secondary tabular-nums">
          {width}px
        </p>
      </aside>
    </div>
  );
}
