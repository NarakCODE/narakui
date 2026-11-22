'use client';

import {
  isValidElement,
  useEffect,
  useRef,
  useState,
  type ComponentProps,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type Ref,
} from 'react';
import {
  ArrowUp,
  Check,
  Paperclip,
  Plus,
  Search,
  Send,
  Sparkles,
  Square,
  type LucideIcon,
} from 'lucide-react';
import type { ButtonIconDescriptor, ButtonIconName, ButtonIconValue } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export type ComposerActivityState = 'idle' | 'working' | 'success' | 'disabled';
export type ComposerSendState = 'idle' | 'typing' | 'streaming';
export type ComposerLayout = 'default' | 'compact';
export type ComposerAccentPreset = 'blue' | 'red' | 'orange' | 'green' | 'purple' | 'gray';

const COMPOSER_ACCENTS: Record<ComposerAccentPreset, string> = {
  blue: 'var(--color-fill-blue)',
  red: 'var(--color-fill-red)',
  orange: 'var(--color-fill-orange)',
  green: 'var(--color-fill-green)',
  purple: 'var(--color-purple-base)',
  gray: 'var(--color-fill-secondary)',
};

const COMPOSER_ICONS = {
  'arrow-up': ArrowUp,
  check: Check,
  paperclip: Paperclip,
  plus: Plus,
  search: Search,
  send: Send,
  sparkles: Sparkles,
} as const satisfies Record<string, LucideIcon>;

type ComposerIconName = keyof typeof COMPOSER_ICONS;

/** Type guard distinguishing icon descriptor objects from React nodes. */
function isIconDescriptor(value: ButtonIconValue): value is ButtonIconDescriptor {
  return (
    typeof value === 'object' &&
    value !== null &&
    !isValidElement(value) &&
    'name' in value &&
    typeof (value as { name?: unknown }).name === 'string'
  );
}

/** Resolves an icon name, descriptor, or custom node for send pill leading icons. */
function renderComposerIcon(value: ButtonIconValue | undefined, className = 'size-3.5 shrink-0'): ReactNode {
  if (value === undefined || value === null || typeof value === 'boolean') {
    return null;
  }

  if (typeof value === 'string') {
    if (value in COMPOSER_ICONS) {
      const IconComponent = COMPOSER_ICONS[value as ComposerIconName];
      return <IconComponent aria-hidden="true" className={className} />;
    }
    return null;
  }

  if (isIconDescriptor(value)) {
    if (value.name in COMPOSER_ICONS) {
      const IconComponent = COMPOSER_ICONS[value.name as ComposerIconName];
      return <IconComponent aria-hidden="true" className={cn(className, value.className)} />;
    }
    return null;
  }

  return value;
}

export interface ComposerSendButtonProps {
  /** Visual role of the control: idle is dimmed, typing is enabled, streaming shows stop. */
  state: ComposerSendState;
  /** Disables send. Ignored while streaming. */
  disabled?: boolean;
  /** Send or stop action callback. */
  onClick?: () => void;
  /** Accessible name. Defaults to "Send message" or "Stop response" from state. */
  ariaLabel?: string;
  /** Visible send text. Turns the circle into a labeled pill. Stop stays circular. */
  text?: string;
  /** Leading icon beside text. Ignored without text or while streaming. */
  textIcon?: ButtonIconValue;
  /** Shows a spinner and disables send. Ignored while streaming. */
  loading?: boolean;
  /** Extra classes applied to the button. */
  className?: string;
}

/** Primary submit / stop action control for the composer footer. */
function ComposerSendButton({
  state,
  disabled = false,
  onClick,
  ariaLabel,
  text,
  textIcon,
  loading = false,
  className,
}: ComposerSendButtonProps) {
  const isStreaming = state === 'streaming';
  const isActionDisabled = !isStreaming && (disabled || loading);
  const isDimmed = !isStreaming && (state === 'idle' || disabled || loading);
  const isLabeledPill = !isStreaming && Boolean(text);
  const resolvedLabel = ariaLabel ?? (isStreaming ? 'Stop response' : 'Send message');

  const buttonNode = (
    <button
      type="button"
      data-slot="composer-send-button"
      data-state={state}
      disabled={isActionDisabled}
      aria-busy={!isStreaming && loading ? true : undefined}
      aria-label={isLabeledPill ? (ariaLabel ?? text) : resolvedLabel}
      onClick={onClick}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full select-none outline-none transition-[background-color,color,transform,opacity] duration-150 ease-out motion-reduce:active:scale-100 focus-visible:ring-2 focus-visible:ring-ring',
        isLabeledPill ? 'h-7 gap-1.5 px-3 text-body-small-medium' : 'size-7',
        isDimmed
          ? 'bg-bg-quaternary text-text-tertiary'
          : 'bg-fill-primary text-text-inverse shadow-none hover:bg-fill-primary-hover active:scale-[0.97]',
        isActionDisabled && 'cursor-default',
        className,
      )}
    >
      {isStreaming ? (
        <Square aria-hidden="true" className="size-2.5 fill-current" />
      ) : isLabeledPill ? (
        <>
          {loading ? (
            <Spinner aria-hidden="true" className="size-3.5 shrink-0" />
          ) : (
            renderComposerIcon(textIcon)
          )}
          <span>{text}</span>
        </>
      ) : loading ? (
        <Spinner aria-hidden="true" className="size-4 shrink-0" />
      ) : (
        <ArrowUp aria-hidden="true" className="size-4 shrink-0" />
      )}
    </button>
  );

  if (isActionDisabled || isLabeledPill) {
    return buttonNode;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{buttonNode}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={6}>
        {resolvedLabel}
      </TooltipContent>
    </Tooltip>
  );
}

export type ComposerAttachedWashProps = ComponentProps<'div'>;

/** Continuous background backdrop painted behind stacked strips inside `topElement`. */
function ComposerAttachedWash({ className, ...props }: ComposerAttachedWashProps) {
  return (
    <div
      aria-hidden="true"
      data-composer-wash="true"
      data-slot="composer-attached-wash"
      className={cn(
        'pointer-events-none absolute -inset-1 z-0 rounded-[28px] bg-bg-secondary',
        className,
      )}
      {...props}
    />
  );
}

export interface ComposerProps {
  /** Visual chrome on the card. Disabled also disables send and design-system Buttons in footer slots. */
  activityState?: ComposerActivityState;
  /** Built-in preset name or CSS color for the working spectrum ring and success pulse halo. Defaults to fill-blue. */
  activityAccent?: ComposerAccentPreset | (string & {});
  /** Increments so the one-shot success halo remounts and replays. */
  pulseKey?: number;
  /** Explicit send/stop visual role. Derived from activityState and sendDisabled when omitted. */
  sendState?: ComposerSendState;
  /** Blocks submitting a new message while leaving stop available during streaming. */
  sendDisabled?: boolean;
  /** Called when the user submits from the send button. */
  onSubmit?: () => void;
  /** Called when the user clicks stop during streaming. */
  onStop?: () => void;
  /** Tooltip and aria-label for send. */
  sendLabel?: string;
  /** Tooltip and aria-label for stop. */
  stopLabel?: string;
  /** Visible send text, turning send into a pill while not streaming. */
  sendText?: string;
  /** Leading icon beside `sendText`. */
  sendTextIcon?: ButtonIconName | ButtonIconDescriptor | ReactNode;
  /** Shows a spinner on send while submission is pending. */
  sendLoading?: boolean;
  /** Compact puts footer slots, editor, and send on one row and hides attachments. */
  layout?: ComposerLayout;
  /** Called once per compact session when the editor grows past one line. */
  onCompactOverflow?: () => void;
  /** Slot on the leading edge of the composer footer. */
  footerStart?: ReactNode;
  /** Slot on the trailing edge of the footer, before send/stop. */
  footerEnd?: ReactNode;
  /** Helper text rendered below the visible composer card with no background. */
  disclaimer?: ReactNode;
  /** Floating slot rendered above the card. */
  topSlot?: ReactNode;
  /** Interactive clarification rendered above the editor card, such as a compact question tool. */
  promptSlot?: ReactNode;
  /** Identity used to remount the prompt slot content when it changes. */
  promptSlotKey?: string;
  /** Surface rendered immediately above and behind the composer card. */
  topElement?: ReactNode;
  /** Surface tucked under the floating card. */
  bottomElement?: ReactNode;
  /** Replaces the editor and footer when a product flow takes over the card. */
  activeSlot?: ReactNode;
  /** Keeps outgoing activeSlot content mounted out of flow while the editor returns. */
  isSlotExiting?: boolean;
  /** Keeps an interactive slot's footer rail in place while the card animates. */
  hasInteractiveSlot?: boolean;
  /** Leading control in an interactive slot's footer rail. */
  slotFooterStart?: ReactNode;
  /** Attachment strip rendered above the editor. Stays interactive when the card is disabled. */
  attachments?: ReactNode;
  /** Validation copy rendered beneath the card. */
  validationMessage?: ReactNode;
  /** Viewport control above every composer surface. Pass null when the host owns spacing. */
  scrollControl?: ReactNode;
  /** Editor surface supplied by the consumer. */
  children?: ReactNode;
  /** Extra classes on the outer frame. */
  className?: string;
  /** Attributes spread onto the visible card. */
  cardProps?: HTMLAttributes<HTMLDivElement>;
  /** Ref to the outer frame. */
  wrapperRef?: Ref<HTMLDivElement>;
  /** Ref to the visible card. */
  cardRef?: Ref<HTMLDivElement>;
  /** Marks the whole frame as non-interactive. */
  inert?: boolean;
}

/** Floating assistant composer card with activity chrome, layout slots, and send/stop states. */
function Composer({
  activityState = 'idle',
  activityAccent = 'var(--color-fill-blue)',
  pulseKey = 0,
  sendState,
  sendDisabled = false,
  onSubmit,
  onStop,
  sendLabel = 'Send message',
  stopLabel = 'Stop response',
  sendText,
  sendTextIcon,
  sendLoading = false,
  layout = 'default',
  onCompactOverflow,
  footerStart,
  footerEnd,
  disclaimer,
  topSlot,
  promptSlot,
  promptSlotKey,
  topElement,
  bottomElement,
  activeSlot,
  isSlotExiting = false,
  hasInteractiveSlot = false,
  slotFooterStart,
  attachments,
  validationMessage,
  scrollControl,
  children,
  className,
  cardProps,
  wrapperRef,
  cardRef,
  inert,
}: ComposerProps) {
  const isCardDisabled = activityState === 'disabled';
  const resolvedAccent =
    activityAccent in COMPOSER_ACCENTS
      ? COMPOSER_ACCENTS[activityAccent as ComposerAccentPreset]
      : activityAccent;
  const resolvedSendState: ComposerSendState =
    sendState ??
    (activityState === 'working'
      ? 'streaming'
      : sendDisabled || isCardDisabled
        ? 'idle'
        : 'typing');

  const compactEditorRef = useRef<HTMLDivElement | null>(null);
  const compactOverflowFiredRef = useRef(false);
  const [exitingDismissed, setExitingDismissed] = useState(false);

  useEffect(() => {
    if (!isSlotExiting) {
      setExitingDismissed(false);
    }
  }, [isSlotExiting]);

  useEffect(() => {
    compactOverflowFiredRef.current = false;

    if (layout !== 'compact') return;
    const el = compactEditorRef.current;
    if (!el || !onCompactOverflow) return;

    const checkOverflow = () => {
      if (compactOverflowFiredRef.current) return;
      if (el.scrollHeight > 36 || el.clientHeight > 36) {
        compactOverflowFiredRef.current = true;
        onCompactOverflow();
      }
    };

    checkOverflow();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(checkOverflow);
    observer.observe(el);
    return () => observer.disconnect();
  }, [layout, onCompactOverflow]);

  const sendButton = (
    <ComposerSendButton
      state={resolvedSendState}
      disabled={sendDisabled || isCardDisabled}
      onClick={resolvedSendState === 'streaming' ? onStop : onSubmit}
      ariaLabel={resolvedSendState === 'streaming' ? stopLabel : sendLabel}
      text={sendText}
      textIcon={sendTextIcon}
      loading={sendLoading}
    />
  );

  const renderFooterSlot = (slot: ReactNode) => {
    if (!slot) return null;
    return (
      <div
        inert={isCardDisabled ? true : undefined}
        className={cn(
          'inline-flex items-center gap-0.5',
          isCardDisabled &&
            'pointer-events-none opacity-50 [&_[data-slot=button]]:pointer-events-none [&_[data-slot=button]]:opacity-50',
        )}
      >
        {slot}
      </div>
    );
  };

  const showingTakeover = Boolean(activeSlot) && !isSlotExiting;

  return (
    <div
      ref={wrapperRef}
      data-slot="composer"
      inert={inert || undefined}
      className={cn('relative flex w-full min-w-0 flex-col', className)}
    >
      {scrollControl !== null ? (
        <div
          data-slot="composer-scroll-control"
          className="mb-2 flex min-h-8 items-center justify-center"
        >
          {scrollControl}
        </div>
      ) : null}

      <div data-slot="composer-top-slot" className="relative z-[9] w-full empty:hidden">
        {topSlot}
      </div>

      {promptSlot ? (
        <div
          key={promptSlotKey}
          data-slot="composer-prompt-slot"
          className="relative z-[9] mb-3 w-full empty:hidden"
        >
          {promptSlot}
        </div>
      ) : null}

      <div className="relative z-[9] w-full">
        <div
          data-slot="composer-top-element"
          className="relative z-0 w-full empty:hidden has-[>[data-composer-wash]]:static"
        >
          {topElement}
        </div>

        <div className="relative z-10 w-full overflow-visible">
          <div
            className="relative z-10 w-full"
            data-composer-state={activityState}
            style={{ '--composer-accent': resolvedAccent } as CSSProperties}
          >
            {activityState === 'working' ? (
              <>
                <div
                  aria-hidden="true"
                  className="composer-working-glow pointer-events-none absolute -inset-2 rounded-[30px] opacity-25"
                />
                <div
                  aria-hidden="true"
                  className="composer-working-ring pointer-events-none absolute -inset-[1.5px] rounded-[25.5px]"
                />
              </>
            ) : null}

            {activityState === 'success' ? (
              <div
                key={pulseKey}
                aria-hidden="true"
                className="composer-success-halo pointer-events-none absolute -inset-[2px] rounded-[26px]"
              />
            ) : null}

            <div
              ref={cardRef}
              data-slot="composer-card"
              data-activity={activityState}
              data-composer-layout={layout}
              {...cardProps}
              className={cn(
                'relative z-10 flex w-full min-w-0 flex-col overflow-hidden rounded-[24px] bg-bg-primary shadow-medium transition-[background-color,opacity] duration-200 ease-out',
                isCardDisabled && 'bg-bg-secondary',
                cardProps?.className,
              )}
            >
              {showingTakeover ? (
                <div data-slot="composer-active-slot" className="relative z-0 rounded-[inherit]">
                  {activeSlot}
                  {hasInteractiveSlot || slotFooterStart ? (
                    <div className="flex items-center justify-between gap-2 rounded-b-[inherit] bg-bg-primary px-2.5 pb-2.5">
                      <div className="flex items-center gap-1.5">{slotFooterStart}</div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="relative">
                  {activeSlot && isSlotExiting && !exitingDismissed ? (
                    <div
                      aria-hidden="true"
                      onTransitionEnd={() => setExitingDismissed(true)}
                      className="pointer-events-none absolute inset-x-0 top-0 opacity-0 transition-opacity duration-150 ease-out starting:opacity-100"
                    >
                      {activeSlot}
                    </div>
                  ) : null}

                  {layout !== 'compact' && attachments ? (
                    <div
                      data-slot="composer-attachments"
                      className="border-b border-border-gray p-2.5"
                    >
                      {attachments}
                    </div>
                  ) : null}

                  {layout === 'compact' ? (
                    <div className="flex items-center gap-2 p-2.5">
                      {renderFooterSlot(footerStart)}
                      <div
                        ref={compactEditorRef}
                        data-slot="composer-editor"
                        className={cn(
                          'min-w-0 flex-1',
                          isCardDisabled && 'pointer-events-none opacity-55',
                        )}
                      >
                        {children}
                      </div>
                      {renderFooterSlot(footerEnd)}
                      {sendButton}
                    </div>
                  ) : (
                    <>
                      <div
                        data-slot="composer-editor"
                        className={cn(
                          'px-4 pt-3.5 pb-1.5',
                          isCardDisabled && 'pointer-events-none opacity-55',
                        )}
                      >
                        {children}
                      </div>
                      <div
                        data-slot="composer-footer"
                        className="flex w-full items-center justify-between gap-2 px-2.5 pt-1 pb-2.5"
                      >
                        <div className="flex min-w-0 flex-1 items-center gap-0.5">
                          {renderFooterSlot(footerStart)}
                        </div>
                        <div className="flex shrink-0 items-center gap-0.5">
                          {renderFooterSlot(footerEnd)}
                          <span className="ml-0.5 inline-flex">{sendButton}</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {validationMessage ? (
          <div
            role="alert"
            data-slot="composer-validation"
            className="relative z-0 -mt-6 rounded-b-[24px] bg-bg-secondary px-3 pt-8 pb-2 text-center text-body-mini-regular text-text-red"
          >
            {validationMessage}
          </div>
        ) : null}

        {bottomElement ? (
          <div data-slot="composer-bottom-element" className="relative z-0">
            {bottomElement}
          </div>
        ) : null}
      </div>

      {disclaimer ? (
        <p
          data-slot="composer-disclaimer"
          className="relative z-[5] select-none px-3 py-2 text-center text-body-mini-regular text-text-quaternary"
        >
          {disclaimer}
        </p>
      ) : null}
    </div>
  );
}

export { Composer, COMPOSER_ACCENTS, ComposerAttachedWash, ComposerSendButton };
