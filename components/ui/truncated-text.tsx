'use client';

import {
  useCallback,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type FocusEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type TruncatedTextTooltipSide = 'top' | 'right' | 'bottom' | 'left';

export interface TruncatedTextProps extends Omit<ComponentProps<'div'>, 'children'> {
  /** The text to show. Also the tooltip content unless `tooltip` is set. */
  children: ReactNode;
  /** Tooltip content to show instead of `children`. */
  tooltip?: ReactNode;
  /** Lines to show before the ellipsis. */
  lines?: number;
  /** Turns off the tooltip when a parent owns it. */
  disableTooltip?: boolean;
  /** Side the tooltip opens toward. */
  tooltipSide?: TruncatedTextTooltipSide;
  /** Distance in pixels between the tooltip and the text. Defaults to the tooltip's own offset. */
  tooltipSideOffset?: number;
  /** Additional CSS classes for the truncating element, such as typography and color. */
  className?: string;
  /** Ref to the truncating element. */
  ref?: Ref<HTMLDivElement>;
}

function assignRef<T>(ref: Ref<T> | undefined, value: T | null) {
  if (!ref) {
    return;
  }
  if (typeof ref === 'function') {
    ref(value);
  } else {
    ref.current = value;
  }
}

/** Text that truncates with an ellipsis when overflowing and reveals full content in a tooltip only while cut off. */
function TruncatedText({
  children,
  tooltip,
  lines = 1,
  disableTooltip = false,
  tooltipSide = 'top',
  tooltipSideOffset,
  className,
  style,
  ref,
  onPointerEnter,
  onFocus,
  ...props
}: TruncatedTextProps) {
  const innerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  const setMergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      innerRef.current = node;
      assignRef(ref, node);
    },
    [ref],
  );

  const measureOverflow = useCallback(() => {
    const el = innerRef.current;
    if (!el) {
      return false;
    }
    if (lines > 1) {
      return el.scrollHeight > el.clientHeight;
    }
    return el.scrollWidth > el.clientWidth;
  }, [lines]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setOpen(measureOverflow());
      } else {
        setOpen(false);
      }
    },
    [measureOverflow],
  );

  const handlePointerEnter = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      onPointerEnter?.(event);
    },
    [onPointerEnter],
  );

  const handleFocus = useCallback(
    (event: FocusEvent<HTMLDivElement>) => {
      onFocus?.(event);
    },
    [onFocus],
  );

  const isMultiLine = lines > 1;
  const clampStyle: CSSProperties | undefined = isMultiLine
    ? {
        display: '-webkit-box',
        WebkitBoxOrient: 'vertical',
        WebkitLineClamp: lines,
        ...style,
      }
    : style;

  const textElement = (
    <div
      ref={setMergedRef}
      data-slot="truncated-text"
      className={cn(
        'min-w-0 overflow-hidden text-ellipsis',
        isMultiLine ? 'wrap-break-word' : 'whitespace-nowrap',
        className,
      )}
      style={clampStyle}
      onPointerEnter={handlePointerEnter}
      onFocus={handleFocus}
      {...props}
    >
      {children}
    </div>
  );

  if (disableTooltip) {
    return textElement;
  }

  return (
    <Tooltip open={open} onOpenChange={handleOpenChange}>
      <TooltipTrigger asChild>{textElement}</TooltipTrigger>
      <TooltipContent side={tooltipSide} sideOffset={tooltipSideOffset}>
        {tooltip ?? children}
      </TooltipContent>
    </Tooltip>
  );
}

export { TruncatedText };
