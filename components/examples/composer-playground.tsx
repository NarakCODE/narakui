'use client';

import { useState } from 'react';
import { ChevronDown, GripVertical, Paperclip, Sparkles, TriangleAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Composer,
  ComposerAttachedWash,
  type ComposerAccentPreset,
  type ComposerActivityState,
} from '@/components/ui/composer';
import { QuestionTool } from '@/components/ui/question-tool';
import { cn } from '@/lib/utils';

const DEFAULT_DRAFT = 'Write a research agent that tracks competitor mentions.';

const ACTIVITY_OPTIONS: { value: ComposerActivityState; label: string }[] = [
  { value: 'idle', label: 'Idle' },
  { value: 'working', label: 'Working' },
  { value: 'success', label: 'Success' },
  { value: 'disabled', label: 'Disabled' },
];

const ACCENT_OPTIONS: {
  value: ComposerAccentPreset;
  label: string;
  swatchClass: string;
}[] = [
  { value: 'blue', label: 'Blue', swatchClass: 'bg-fill-blue' },
  { value: 'red', label: 'Red', swatchClass: 'bg-fill-red' },
  { value: 'orange', label: 'Orange', swatchClass: 'bg-fill-orange' },
  { value: 'green', label: 'Green', swatchClass: 'bg-fill-green' },
  { value: 'purple', label: 'Purple', swatchClass: 'bg-purple-base' },
  { value: 'gray', label: 'Gray', swatchClass: 'bg-fill-secondary' },
];

type SlotKey =
  | 'footerStart'
  | 'footerEnd'
  | 'attachments'
  | 'disclaimer'
  | 'bottomSurface'
  | 'topSurface'
  | 'topSlot'
  | 'queuedActions'
  | 'takeover'
  | 'questionTool'
  | 'typedDraft'
  | 'validation'
  | 'compactLayout';

const INITIAL_ATTACHMENTS = ['q4-visibility-audit.csv', 'brand-guidelines.pdf'];

const INITIAL_QUEUED_MESSAGES = [
  { id: 'q1', text: 'Compare visibility for Ramp vs Brex' },
  { id: 'q2', text: 'Draft a follow-up prompt for citations' },
];

const BOTTOM_SUGGESTIONS = ['Write a research agent', 'Monitor brand mentions'];

/** Interactive Composer playground for testing activity states, accents, and layout slots. */
export const ComposerPlayground = () => {
  const [activityState, setActivityState] = useState<ComposerActivityState>('working');
  const [pulseKey, setPulseKey] = useState(0);
  const [activityAccent, setActivityAccent] = useState<ComposerAccentPreset>('blue');
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [files, setFiles] = useState(INITIAL_ATTACHMENTS);
  const [queuedMessages, setQueuedMessages] = useState(INITIAL_QUEUED_MESSAGES);
  const [queueExpanded, setQueueExpanded] = useState(true);

  const [slots, setSlots] = useState({
    footerStart: true,
    footerEnd: false,
    attachments: false,
    disclaimer: false,
    bottomSurface: false,
    topSurface: false,
    topSlot: false,
    queuedActions: false,
    takeover: false,
    questionTool: false,
    validation: false,
    compactLayout: false,
  });

  const selectState = (next: ComposerActivityState) => {
    setActivityState(next);
    if (next === 'success') {
      setPulseKey((k) => k + 1);
    }
  };

  const toggleSlot = (key: SlotKey) => {
    if (key === 'typedDraft') {
      setDraft((current) => (current.trim().length > 0 ? '' : DEFAULT_DRAFT));
      return;
    }

    setSlots((prev) => {
      const nextValue = !prev[key];
      if (key === 'takeover' && nextValue && !prev.compactLayout) {
        return { ...prev, takeover: true, questionTool: false };
      }
      if (key === 'questionTool' && nextValue && !prev.compactLayout) {
        return { ...prev, questionTool: true, takeover: false };
      }
      return { ...prev, [key]: nextValue };
    });
  };

  const hasTypedDraft = draft.trim().length > 0;
  const isCompact = slots.compactLayout;

  const slotButtons: { key: SlotKey; label: string; active: boolean }[] = [
    { key: 'footerStart', label: 'Footer start', active: slots.footerStart },
    { key: 'footerEnd', label: 'Footer end', active: slots.footerEnd },
    { key: 'attachments', label: 'Attachments', active: slots.attachments },
    { key: 'disclaimer', label: 'Disclaimer', active: slots.disclaimer },
    { key: 'bottomSurface', label: 'Bottom surface', active: slots.bottomSurface },
    { key: 'topSurface', label: 'Top surface', active: slots.topSurface },
    { key: 'topSlot', label: 'Top slot', active: slots.topSlot },
    { key: 'queuedActions', label: 'Queued actions', active: slots.queuedActions },
    { key: 'takeover', label: 'Takeover', active: slots.takeover },
    { key: 'questionTool', label: 'Question tool', active: slots.questionTool },
    { key: 'typedDraft', label: 'Typed draft', active: hasTypedDraft },
    { key: 'validation', label: 'Validation', active: slots.validation },
    { key: 'compactLayout', label: 'Compact layout', active: isCompact },
  ];

  const topElementNode =
    slots.topSurface || slots.queuedActions ? (
      <>
        <ComposerAttachedWash />
        {slots.topSurface ? (
          <div className="relative z-[1] -mb-3 flex min-w-0 items-center gap-2 px-3.5 pt-3 pb-6">
            <TriangleAlert aria-hidden="true" className="size-3.5 shrink-0 text-text-red" />
            <div className="min-w-0 flex-1">
              <div className="truncate text-body-mini-medium text-text-primary">
                You have reached your usage limit
              </div>
            </div>
            <Button size="micro" mode="secondary">
              View usage
            </Button>
          </div>
        ) : null}
        {slots.queuedActions ? (
          <div className="relative z-[1] mx-2 -mb-3 flex flex-col gap-1 pt-1.5 pb-5">
            <button
              type="button"
              onClick={() => setQueueExpanded((v) => !v)}
              className="flex w-full min-w-0 cursor-pointer items-center gap-1.5 px-3 py-1 text-text-secondary outline-none"
            >
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'size-3.5 shrink-0 transition-transform duration-150 ease-out',
                  !queueExpanded && '-rotate-90',
                )}
              />
              <span className="truncate text-body-small-regular">
                {queuedMessages.length} Queued
              </span>
            </button>
            {queueExpanded ? (
              queuedMessages.length > 0 ? (
                <ul className="flex min-w-0 flex-col gap-1">
                  {queuedMessages.map((item) => (
                    <li
                      key={item.id}
                      className="mx-1.5 flex min-w-0 items-center gap-1 rounded-[6px] px-1.5"
                    >
                      <GripVertical
                        aria-hidden="true"
                        className="size-4 shrink-0 text-text-tertiary"
                      />
                      <div className="min-w-0 flex-1 truncate text-left text-body-small-regular text-text-primary">
                        {item.text}
                      </div>
                      <div className="flex shrink-0 items-center gap-0.5">
                        <Button
                          size="micro"
                          mode="ghost"
                          iconStart="edit"
                          aria-label="Edit queued message"
                          onClick={() => {
                            setDraft(item.text);
                            setQueuedMessages((prev) =>
                              prev.filter((msg) => msg.id !== item.id),
                            );
                          }}
                        />
                        <Button
                          size="micro"
                          mode="ghost"
                          iconStart="arrow-up"
                          aria-label="Send queued message now"
                          onClick={() => {
                            selectState('working');
                            setQueuedMessages((prev) =>
                              prev.filter((msg) => msg.id !== item.id),
                            );
                          }}
                        />
                        <Button
                          size="micro"
                          mode="ghost"
                          iconStart="trash"
                          aria-label="Delete queued message"
                          onClick={() =>
                            setQueuedMessages((prev) =>
                              prev.filter((msg) => msg.id !== item.id),
                            )
                          }
                        />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="px-3 py-1">
                  <Button
                    size="micro"
                    mode="subtle"
                    onClick={() => setQueuedMessages(INITIAL_QUEUED_MESSAGES)}
                  >
                    Restore queued messages
                  </Button>
                </div>
              )
            ) : null}
          </div>
        ) : null}
      </>
    ) : undefined;

  const attachmentsNode = slots.attachments ? (
    <div className="flex flex-wrap items-center gap-1.5">
      {files.length > 0 ? (
        files.map((file) => (
          <span
            key={file}
            className="inline-flex h-7 items-center gap-1.5 rounded-full border border-border-gray bg-bg-secondary pr-1.5 pl-2.5 text-body-mini-medium text-text-primary"
          >
            <Paperclip aria-hidden="true" className="size-3 text-text-secondary" />
            <span>{file}</span>
            <button
              type="button"
              aria-label={`Remove ${file}`}
              onClick={() => setFiles((prev) => prev.filter((item) => item !== file))}
              className="inline-flex size-4 cursor-pointer items-center justify-center rounded-full text-text-tertiary transition-colors duration-150 hover:bg-control-hover hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X aria-hidden="true" className="size-3" />
            </button>
          </span>
        ))
      ) : (
        <Button size="micro" mode="subtle" onClick={() => setFiles(INITIAL_ATTACHMENTS)}>
          Restore sample files
        </Button>
      )}
    </div>
  ) : undefined;

  const questionToolQuestions = [
    {
      kind: 'single' as const,
      title: 'Which brand should this agent use?',
      options: [
        { id: 'ramp', label: 'Ramp', description: 'Primary monitored brand' },
        { id: 'brex', label: 'Brex' },
        { id: 'mercury', label: 'Mercury' },
      ],
    },
  ];

  const takeoverNode = slots.takeover ? (
    <div className="flex items-start justify-between gap-4 px-4 py-3.5">
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-body-small-medium text-text-primary">
          <Sparkles aria-hidden="true" className="size-4 text-text-secondary" />
          <span>Review scheduled run</span>
        </div>
        <p className="mt-1 text-body-mini-regular text-text-secondary">
          Every Monday at 09:00 UTC · 5 answer engines
        </p>
      </div>
      <Button
        size="small"
        mode="primary"
        onClick={() => {
          setSlots((prev) => ({ ...prev, takeover: false }));
          selectState('working');
        }}
      >
        Schedule run
      </Button>
    </div>
  ) : undefined;

  const activeSlotNode = slots.takeover
    ? takeoverNode
    : !isCompact && slots.questionTool
      ? (
        <QuestionTool
          variant="composer"
          toolCallId="playground-question"
          questions={questionToolQuestions}
          onSubmitAnswer={() => setSlots((prev) => ({ ...prev, questionTool: false }))}
        />
      )
      : undefined;

  const promptSlotNode =
    isCompact && slots.questionTool ? (
      <QuestionTool
        variant="compact"
        toolCallId="playground-question-compact"
        questions={questionToolQuestions}
        onSubmitAnswer={() => setSlots((prev) => ({ ...prev, questionTool: false }))}
      />
    ) : undefined;

  return (
    <div className="flex w-full max-w-2xl flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-xl border border-border-gray bg-bg-secondary/60 p-3.5">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="w-14 shrink-0 text-body-mini-medium text-text-secondary">
            Activity
          </span>
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Activity">
            {ACTIVITY_OPTIONS.map((option) => {
              const active = activityState === option.value;
              return (
                <Button
                  key={option.value}
                  size="small"
                  mode={active ? 'tertiary' : 'subtle'}
                  aria-pressed={active}
                  onClick={() => selectState(option.value)}
                >
                  {option.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border-gray pt-3">
          <span className="w-14 shrink-0 text-body-mini-medium text-text-secondary">Accent</span>
          <div className="flex flex-wrap items-center gap-1" role="group" aria-label="Accent">
            {ACCENT_OPTIONS.map((accent) => {
              const active = activityAccent === accent.value;
              return (
                <Button
                  key={accent.value}
                  size="small"
                  mode={active ? 'tertiary' : 'subtle'}
                  aria-pressed={active}
                  iconStart={
                    <span
                      aria-hidden="true"
                      className={cn('size-2.5 rounded-full', accent.swatchClass)}
                    />
                  }
                  onClick={() => setActivityAccent(accent.value)}
                >
                  {accent.label}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-x-4 gap-y-2 border-t border-border-gray pt-3">
          <span className="w-14 shrink-0 pt-1 text-body-mini-medium text-text-secondary">
            Slots
          </span>
          <div
            className="flex min-w-0 flex-1 flex-wrap items-center gap-1"
            role="group"
            aria-label="Slots"
          >
            {slotButtons.map((slot) => (
              <Button
                key={slot.key}
                size="small"
                mode={slot.active ? 'tertiary' : 'subtle'}
                aria-pressed={slot.active}
                onClick={() => toggleSlot(slot.key)}
              >
                {slot.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full min-w-0 max-w-xl pt-2">
        <Composer
          activityState={activityState}
          activityAccent={activityAccent}
          pulseKey={pulseKey}
          layout={isCompact ? 'compact' : 'default'}
          onCompactOverflow={() => setSlots((prev) => ({ ...prev, compactLayout: false }))}
          sendDisabled={!hasTypedDraft}
          onSubmit={() => selectState('working')}
          onStop={() => selectState('idle')}
          scrollControl={null}
          footerStart={
            slots.footerStart ? (
              <Button
                size="small"
                aria-label="Add files"
                className="rounded-full"
                iconStart="plus"
              />
            ) : undefined
          }
          footerEnd={
            slots.footerEnd ? (
              <Button
                size="small"
                aria-label="Voice input"
                className="rounded-full"
                iconStart="microphone"
              />
            ) : undefined
          }
          attachments={attachmentsNode}
          topSlot={
            slots.topSlot ? (
              <div className="mb-3 rounded-[16px] bg-bg-primary px-4 py-3 shadow-medium">
                <p className="text-body-small-medium text-text-primary">
                  Which brand should this agent use?
                </p>
                <p className="mt-1 text-body-mini-regular text-text-secondary">
                  The first turn is scoped to this brand.
                </p>
              </div>
            ) : undefined
          }
          topElement={topElementNode}
          bottomElement={
            slots.bottomSurface ? (
              <div className="-mt-6 rounded-b-[24px] bg-bg-secondary px-3 pt-9 pb-3">
                <div className="flex min-w-0 flex-wrap gap-2">
                  {BOTTOM_SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setDraft(suggestion)}
                      className="min-w-0 cursor-pointer rounded-[12px] bg-bg-primary px-3 py-1.5 text-body-mini-regular text-text-secondary transition-colors duration-150 hover:text-text-primary"
                    >
                      <span className="block truncate">{suggestion}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : undefined
          }
          promptSlot={promptSlotNode}
          activeSlot={activeSlotNode}
          hasInteractiveSlot={slots.takeover}
          slotFooterStart={
            slots.takeover ? (
              <Button
                size="small"
                mode="ghost"
                className="rounded-full"
                onClick={() => toggleSlot('takeover')}
              >
                Back to editor
              </Button>
            ) : undefined
          }
          validationMessage={
            slots.validation ? 'Add more detail before sending.' : undefined
          }
          disclaimer={
            slots.disclaimer ? 'AI can make mistakes. Check important info.' : undefined
          }
        >
          <textarea
            aria-label="Prompt editor"
            rows={isCompact ? 1 : 2}
            value={draft}
            disabled={activityState === 'disabled'}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask a question…"
            className="scrollbar-custom w-full resize-none bg-transparent text-body-regular text-text-primary placeholder:text-text-tertiary outline-none disabled:cursor-not-allowed"
          />
        </Composer>
      </div>
    </div>
  );
};
