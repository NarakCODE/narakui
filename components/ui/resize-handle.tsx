'use client';

import type { ComponentProps, KeyboardEvent } from 'react';
import { cn } from '@/lib/utils';

export type ResizeHandlePosition = 'left' | 'right' | 'top';

const POSITION_CLASSES: Record<ResizeHandlePosition, string> = {
  left: '-left-2.5',
  right: '-right-2.5',
  top: '-top-2.5',
};

const INCREASE_KEYS: Record<ResizeHandlePosition, string> = {
  left: 'ArrowLeft',
  right: 'ArrowRight',
  top: 'ArrowUp',
};

const DECREASE_KEYS: Record<ResizeHandlePosition, string> = {
  left: 'ArrowRight',
  right: 'ArrowLeft',
  top: 'ArrowDown',
};

interface ResizeHandleBaseProps extends ComponentProps<'div'> {
  /** Edge of the parent panel where the handle sits. */
  position?: ResizeHandlePosition;
  /** Highlights the handle while a pointer drag is active. */
  isDragging?: boolean;
  /** Additional classes applied to the default indicator line. */
  barClassName?: string;
}

export type ResizeHandleProps =
  | (ResizeHandleBaseProps & {
      size?: undefined;
      minSize?: undefined;
      maxSize?: undefined;
      onSizeChange?: undefined;
    })
  | (ResizeHandleBaseProps & {
      /** Current panel size in pixels. Enables keyboard resizing as an accessible separator. */
      size: number;
      /** Minimum allowed panel size in pixels. */
      minSize: number;
      /** Maximum allowed panel size in pixels. */
      maxSize: number;
      /** Called with the clamped next size when resized via keyboard. */
      onSizeChange: (size: number) => void;
    });

/**
 * A drag handle on a panel edge.
 * Pass `size`, `minSize`, `maxSize`, and `onSizeChange` together to make it a focusable separator that resizes by keyboard.
 */
function ResizeHandle({
  barClassName,
  children,
  className,
  isDragging,
  onDoubleClick,
  onMouseDown,
  onPointerDown,
  position = 'left',
  size,
  minSize,
  maxSize,
  onSizeChange,
  onKeyDown,
  'aria-label': ariaLabel = 'Drag to resize',
  ref,
  ...props
}: ResizeHandleProps) {
  const isTop = position === 'top';
  const clamp = (value: number) =>
    Math.min(maxSize ?? value, Math.max(minSize ?? value, value));

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || size === undefined || !onSizeChange) return;

    const step = event.shiftKey ? 64 : 16;
    let next: number;

    if (event.key === INCREASE_KEYS[position]) {
      next = size + step;
    } else if (event.key === DECREASE_KEYS[position]) {
      next = size - step;
    } else if (event.key === 'Home') {
      next = minSize;
    } else if (event.key === 'End') {
      next = maxSize;
    } else {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    onSizeChange(clamp(next));
  };

  return (
    <div
      data-slot="resize-handle"
      data-position={position}
      data-dragging={isDragging ? '' : undefined}
      ref={ref}
      aria-label={ariaLabel}
      {...(size !== undefined
        ? {
            role: 'separator',
            tabIndex: 0,
            'aria-orientation': isTop ? ('horizontal' as const) : ('vertical' as const),
            'aria-valuenow': clamp(size),
            'aria-valuemin': minSize,
            'aria-valuemax': maxSize,
          }
        : null)}
      className={cn(
        isTop
          ? 'group absolute left-0 z-10 w-full cursor-row-resize touch-none py-2.5 select-none'
          : 'group absolute top-0 z-10 h-full cursor-col-resize touch-none px-2.5 select-none',
        'opacity-0 outline-none transition-opacity delay-75 duration-200 ease-out hover:opacity-100 focus-visible:opacity-100 data-dragging:opacity-100 motion-reduce:transition-none',
        POSITION_CLASSES[position],
        className,
      )}
      onDoubleClick={onDoubleClick}
      onKeyDown={handleKeyDown}
      onMouseDown={onMouseDown}
      onPointerDown={onPointerDown}
      {...props}
    >
      {children ?? (
        <span
          data-slot="resize-handle-bar"
          className={cn(
            isTop ? 'block h-0.5 w-full' : 'block h-full w-0.5',
            'rounded-full bg-fill-tertiary transition-colors duration-150 ease-out group-focus-visible:bg-fill-primary group-data-dragging:bg-fill-primary dark:bg-fill-quaternary group-focus-visible:dark:bg-fill-tertiary group-data-dragging:dark:bg-fill-tertiary',
            barClassName,
          )}
        />
      )}
    </div>
  );
}

export { ResizeHandle };
