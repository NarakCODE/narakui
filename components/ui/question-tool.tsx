'use client';

import {
  useEffect,
  useMemo,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { Check, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export interface QuestionOption {
  /** Stable identifier for the choice. */
  id: string;
  /** Primary option label. */
  label: string;
  /** Optional helper copy rendered below the label. */
  description?: string;
}

export interface QuestionConfig {
  /** Question interaction style. */
  kind: 'single' | 'multi' | 'text';
  /** Prompt headline. */
  title: string;
  /** Stable identifier for the question. */
  id?: string;
  /** Optional supporting explanation. */
  description?: string;
  /** Choices for `single` and `multi` questions. */
  options?: QuestionOption[];
  /** Grid fills two columns top-to-bottom for short, label-only options; described options always render as a list. */
  layout?: 'list' | 'grid';
  /** Shows the custom "Other..." input field. */
  allowCustomAnswer?: boolean;
  /** Placeholder for the Other field when `customPlaceholder` is not set. */
  customLabel?: string;
  /** Placeholder for the Other field. */
  customPlaceholder?: string;
  /** Fewest picks needed to submit a multi-choice question. */
  minSelections?: number;
  /** Most picks allowed on a multi-choice question. */
  maxSelections?: number;
  /** Multi only: picks are ranked in order and each badge displays its rank. */
  ranked?: boolean;
  /** Ids selected when the question opens. Defaults to the first option; compact questions open empty. */
  initialSelectedIds?: readonly string[];
  /** Placeholder for a free-text question. */
  placeholder?: string;
}

/** Backward-compatible alias for `QuestionConfig`. */
export type QuestionSpec = QuestionConfig;

export type QuestionAnswer =
  | {
      kind: 'single';
      selectedIds: string[];
      customAnswer?: string;
      skipped?: boolean;
    }
  | {
      kind: 'multi';
      selectedIds: string[];
      customAnswer?: string;
      skipped?: boolean;
    }
  | {
      kind: 'text';
      text: string;
      skipped?: boolean;
    };

export type QuestionAnswerMap = Record<number, QuestionAnswer>;

export interface QuestionToolProps {
  /** Prompt list. Each item is `single`, `multi`, or `text`. */
  questions: QuestionConfig[];
  /** 1-based index when the host owns navigation. Omit to let the card step locally. */
  questionIndex?: number;
  /** Progress denominator. Defaults to `questions.length`. */
  totalQuestions?: number;
  /** Resets local drafts when the host starts a new tool call. */
  toolCallId?: string;
  /** Completed answer from the host. Marks a single-question card done with a one-line summary. */
  answer?: QuestionAnswer;
  /** Presentation variant. `'compact'` is accepted as a legacy alias for `variant="composer" compact`. */
  variant?: 'card' | 'composer' | 'compact';
  /** Composer only: replaces the footer with a header pager and trailing Skip/Next, and starts choices unselected. */
  compact?: boolean;
  /** Disables the prompt while host-owned work is pending. */
  disabled?: boolean;
  /** Host stream status. Disables the card variant while streaming; ignored for composer. */
  chatStatus?: string;
  /** Shows the skip action. */
  allowSkip?: boolean;
  /** Primary action label on the last question. */
  submitLabel?: string;
  /** Primary action label on earlier questions in a multi-step prompt. */
  nextLabel?: string;
  /** Skip action label. */
  skipLabel?: string;
  /** Summary text for a skipped question on a completed card. */
  skippedLabel?: string;
  /** Called with the last answer (or the only answer on a single prompt). May return a promise. */
  onSubmitAnswer?: (answer: QuestionAnswer) => void | Promise<void>;
  /** Called with every answer, keyed by 1-based index, when the last question in a multi-step prompt is submitted. */
  onSubmitAnswers?: (answers: QuestionAnswerMap) => void | Promise<void>;
  /** Called when advancing to the next question. */
  onNextQuestion?: () => void;
  /** Called when returning to the previous question. */
  onPreviousQuestion?: () => void;
  /** Replaces the composer header's step counter on multi-step prompts. */
  renderComposerCounter?: (step: number, total: number) => ReactNode;
  /** Extra classes on the card frame. */
  className?: string;
  /** Extra classes on the scrollable choices list. */
  choicesClassName?: string;
  /** Where the composer variant renders the active question's title. */
  titlePlacement?: 'header' | 'step';
}

interface QuestionDraft {
  selectedIds: string[];
  customAnswer: string;
  text: string;
  skipped?: boolean;
}

function buildInitialDrafts(
  questions: QuestionConfig[],
  isCompact: boolean,
): Record<number, QuestionDraft> {
  const drafts: Record<number, QuestionDraft> = {};
  questions.forEach((question, index) => {
    let selectedIds: string[] = [];
    if (question.initialSelectedIds !== undefined) {
      selectedIds = [...question.initialSelectedIds];
    } else if (
      !isCompact &&
      (question.kind === 'single' || question.kind === 'multi') &&
      question.options?.[0]
    ) {
      selectedIds = [question.options[0].id];
    }

    drafts[index] = {
      selectedIds,
      customAnswer: '',
      text: '',
    };
  });
  return drafts;
}

function draftToAnswer(question: QuestionConfig, draft: QuestionDraft): QuestionAnswer {
  if (question.kind === 'text') {
    return {
      kind: 'text',
      text: draft.skipped ? '' : draft.text.trim(),
      ...(draft.skipped ? { skipped: true } : {}),
    };
  }

  const trimmedCustom = draft.customAnswer.trim();
  if (question.kind === 'single') {
    return {
      kind: 'single',
      selectedIds: draft.skipped || trimmedCustom ? [] : draft.selectedIds,
      ...(trimmedCustom && !draft.skipped ? { customAnswer: trimmedCustom } : {}),
      ...(draft.skipped ? { skipped: true } : {}),
    };
  }

  return {
    kind: 'multi',
    selectedIds: draft.skipped ? [] : draft.selectedIds,
    ...(trimmedCustom && !draft.skipped ? { customAnswer: trimmedCustom } : {}),
    ...(draft.skipped ? { skipped: true } : {}),
  };
}

function formatCompletedSummary(
  question: QuestionConfig | undefined,
  answer: QuestionAnswer,
  skippedLabel: string,
): string {
  if (answer.skipped) return skippedLabel;

  if (answer.kind === 'text') {
    return answer.text.trim() || skippedLabel;
  }

  const optionMap = new Map(
    (question?.options ?? []).map((opt) => [opt.id, opt.label]),
  );
  const parts = answer.selectedIds.map((id) => optionMap.get(id) ?? id);
  if (answer.customAnswer?.trim()) {
    parts.push(answer.customAnswer.trim());
  }
  return parts.length > 0 ? parts.join(', ') : skippedLabel;
}

function isDraftValid(question: QuestionConfig, draft: QuestionDraft): boolean {
  if (question.kind === 'text') {
    return draft.text.trim().length > 0;
  }

  const hasCustom = draft.customAnswer.trim().length > 0;
  if (question.kind === 'single') {
    return draft.selectedIds.length > 0 || hasCustom;
  }

  const minSelections = question.minSelections ?? 1;
  const count = draft.selectedIds.length + (hasCustom ? 1 : 0);
  const withinMax =
    question.maxSelections === undefined || count <= question.maxSelections;
  return count >= minSelections && withinMax;
}

/** Ask-user prompt supporting single choice, multi choice (including ranked & grid), free text, multi-step, compact, and transcript cards. */
function QuestionTool({
  questions,
  questionIndex,
  totalQuestions,
  toolCallId,
  answer,
  variant = 'card',
  compact = false,
  disabled = false,
  chatStatus,
  allowSkip = true,
  submitLabel = 'Submit',
  nextLabel = 'Next',
  skipLabel = 'Skip',
  skippedLabel = 'Skipped',
  onSubmitAnswer,
  onSubmitAnswers,
  onNextQuestion,
  onPreviousQuestion,
  renderComposerCounter,
  className,
  choicesClassName,
  titlePlacement = 'header',
}: QuestionToolProps) {
  const effectiveVariant: 'card' | 'composer' =
    variant === 'compact' ? 'composer' : variant;
  const isCompact =
    effectiveVariant === 'composer' && (compact || variant === 'compact');

  const isHostControlledStep = questionIndex !== undefined;
  const [localStepIndex, setLocalStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [drafts, setDrafts] = useState<Record<number, QuestionDraft>>(() =>
    buildInitialDrafts(questions, isCompact),
  );
  const [localCompletedAnswer, setLocalCompletedAnswer] =
    useState<QuestionAnswer | null>(null);
  const [composerSubmitted, setComposerSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Reset local drafts whenever the host starts a new tool call.
  useEffect(() => {
    setLocalStepIndex(0);
    setDirection(1);
    setDrafts(buildInitialDrafts(questions, isCompact));
    setLocalCompletedAnswer(null);
    setComposerSubmitted(false);
    setSubmitError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toolCallId]);

  const totalCount = totalQuestions ?? questions.length;
  const activeStepZeroBased = isHostControlledStep
    ? Math.min(Math.max(0, questionIndex - 1), Math.max(0, questions.length - 1))
    : Math.min(localStepIndex, Math.max(0, questions.length - 1));
  const activeQuestion = questions[activeStepZeroBased];

  const isStreamingDisabled =
    effectiveVariant === 'card' &&
    (chatStatus === 'streaming' || chatStatus === 'submitted');
  const isPromptDisabled =
    disabled ||
    isStreamingDisabled ||
    isSubmitting ||
    (effectiveVariant === 'composer' && composerSubmitted);

  const completedAnswer = answer ?? (effectiveVariant === 'card' ? localCompletedAnswer : null);

  const currentDraft: QuestionDraft = useMemo(
    () =>
      drafts[activeStepZeroBased] ?? {
        selectedIds: [],
        customAnswer: '',
        text: '',
      },
    [drafts, activeStepZeroBased],
  );

  if (!activeQuestion) return null;

  // Completed inline card renders a concise one-line summary.
  if (effectiveVariant === 'card' && completedAnswer) {
    const summary = formatCompletedSummary(
      questions[0],
      completedAnswer,
      skippedLabel,
    );
    return (
      <div
        data-slot="question-tool"
        data-variant="card"
        data-completed="true"
        className={cn(
          'wrap-anywhere w-full max-w-[420px] overflow-hidden rounded-lg border border-fill-quaternary bg-bg-base',
          className,
        )}
      >
        <div className="px-3.5 py-3 text-body-small-regular text-text-tertiary">
          {summary}
        </div>
      </div>
    );
  }

  const isMultiStep = totalCount > 1;
  const isLastStep = activeStepZeroBased >= totalCount - 1;
  const isFirstStep = activeStepZeroBased <= 0;
  const hasValidAnswer = isDraftValid(activeQuestion, currentDraft);

  const updateDraft = (
    stepIdx: number,
    updater: (prev: QuestionDraft) => QuestionDraft,
  ) => {
    setSubmitError(null);
    setDrafts((prev) => {
      const existing = prev[stepIdx] ?? {
        selectedIds: [],
        customAnswer: '',
        text: '',
      };
      return {
        ...prev,
        [stepIdx]: updater(existing),
      };
    });
  };

  const handleSelectSingle = (stepIdx: number, optionId: string) => {
    if (isPromptDisabled) return;
    updateDraft(stepIdx, () => ({
      selectedIds: [optionId],
      customAnswer: '',
      text: '',
      skipped: false,
    }));
  };

  const handleToggleMulti = (
    stepIdx: number,
    optionId: string,
    question: QuestionConfig,
  ) => {
    if (isPromptDisabled) return;
    updateDraft(stepIdx, (prev) => {
      const exists = prev.selectedIds.includes(optionId);
      if (exists) {
        return {
          ...prev,
          selectedIds: prev.selectedIds.filter((id) => id !== optionId),
          skipped: false,
        };
      }
      const customCount = prev.customAnswer.trim().length > 0 ? 1 : 0;
      if (
        question.maxSelections !== undefined &&
        prev.selectedIds.length + customCount >= question.maxSelections
      ) {
        return prev;
      }
      return {
        ...prev,
        selectedIds: [...prev.selectedIds, optionId],
        skipped: false,
      };
    });
  };

  const handleCustomChange = (
    stepIdx: number,
    nextValue: string,
    question: QuestionConfig,
  ) => {
    if (isPromptDisabled) return;
    updateDraft(stepIdx, (prev) => ({
      ...prev,
      customAnswer: nextValue,
      selectedIds:
        question.kind === 'single' && nextValue.trim().length > 0
          ? []
          : prev.selectedIds,
      skipped: false,
    }));
  };

  const handleTextChange = (stepIdx: number, nextValue: string) => {
    if (isPromptDisabled) return;
    updateDraft(stepIdx, (prev) => ({
      ...prev,
      text: nextValue,
      skipped: false,
    }));
  };

  const buildAnswerMap = (overrideDraft?: { stepIdx: number; draft: QuestionDraft }) => {
    const map: QuestionAnswerMap = {};
    questions.forEach((q, idx) => {
      const d =
        overrideDraft && overrideDraft.stepIdx === idx
          ? overrideDraft.draft
          : drafts[idx] ?? { selectedIds: [], customAnswer: '', text: '' };
      map[idx + 1] = draftToAnswer(q, d);
    });
    return map;
  };

  const submitFinal = async (overrideDraft?: { stepIdx: number; draft: QuestionDraft }) => {
    const answerMap = buildAnswerMap(overrideDraft);
    const lastAnswer = answerMap[activeStepZeroBased + 1];

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      if (isMultiStep && onSubmitAnswers) {
        await onSubmitAnswers(answerMap);
      }
      if (onSubmitAnswer && lastAnswer) {
        await onSubmitAnswer(lastAnswer);
      }
      if (effectiveVariant === 'card') {
        setLocalCompletedAnswer(lastAnswer ?? null);
      } else {
        setComposerSubmitted(true);
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Could not submit your answer. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdvance = async (skipped = false) => {
    if (isPromptDisabled) return;
    if (!skipped && !hasValidAnswer) return;

    let overrideDraft: { stepIdx: number; draft: QuestionDraft } | undefined;
    if (skipped) {
      const skippedDraft: QuestionDraft = {
        ...currentDraft,
        skipped: true,
      };
      overrideDraft = { stepIdx: activeStepZeroBased, draft: skippedDraft };
      setDrafts((prev) => ({
        ...prev,
        [activeStepZeroBased]: skippedDraft,
      }));
    }

    if (isLastStep) {
      await submitFinal(overrideDraft);
      return;
    }

    setDirection(1);
    onNextQuestion?.();
    if (!isHostControlledStep) {
      setLocalStepIndex((prev) => Math.min(questions.length - 1, prev + 1));
    }
  };

  const handleBack = () => {
    if (isPromptDisabled || isFirstStep) return;
    setDirection(-1);
    onPreviousQuestion?.();
    if (!isHostControlledStep) {
      setLocalStepIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (isPromptDisabled) return;
    const target = event.target as HTMLElement | null;
    const isInput = target?.tagName === 'INPUT';
    const isTextarea = target?.tagName === 'TEXTAREA';

    if (!isInput && !isTextarea && activeQuestion.options) {
      if (activeQuestion.kind === 'single' && /^[1-9]$/.test(event.key)) {
        const option = activeQuestion.options[Number(event.key) - 1];
        if (option) {
          event.preventDefault();
          handleSelectSingle(activeStepZeroBased, option.id);
          return;
        }
      }
      if (
        activeQuestion.kind === 'multi' &&
        /^[a-z]$/i.test(event.key) &&
        !event.metaKey &&
        !event.ctrlKey &&
        !event.altKey
      ) {
        const idx = event.key.toLowerCase().charCodeAt(0) - 97;
        const option = activeQuestion.options[idx];
        if (option) {
          event.preventDefault();
          handleToggleMulti(activeStepZeroBased, option.id, activeQuestion);
          return;
        }
      }
    }

    if (event.key === 'Enter' && hasValidAnswer) {
      if (isTextarea && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        void handleAdvance(false);
      } else if (!isTextarea && !event.shiftKey) {
        event.preventDefault();
        void handleAdvance(false);
      }
    }
  };

  const renderQuestionBody = (question: QuestionConfig, stepIdx: number) => {
    const draft = drafts[stepIdx] ?? {
      selectedIds: [],
      customAnswer: '',
      text: '',
    };
    const showCustom = question.allowCustomAnswer !== false;
    const customActive = draft.customAnswer.trim().length > 0;
    const options = question.options ?? [];
    const hasDescribedOption = options.some((opt) => Boolean(opt.description));
    const useGridLayout = question.layout === 'grid' && !hasDescribedOption;
    const gridStyle: CSSProperties | undefined = useGridLayout
      ? {
          gridTemplateRows: `repeat(${Math.max(1, Math.ceil(options.length / 2))}, max-content)`,
        }
      : undefined;

    const multiSelectedCount = draft.selectedIds.length + (customActive ? 1 : 0);
    const maxReached =
      question.kind === 'multi' &&
      question.maxSelections !== undefined &&
      multiSelectedCount >= question.maxSelections;

    const compactTrailingAction = isCompact ? (
      hasValidAnswer ? (
        <Button
          type="button"
          size="small"
          mode="primary"
          disabled={isPromptDisabled}
          onClick={() => void handleAdvance(false)}
          className="shrink-0 rounded-full bg-fill-primary px-3 text-text-inverse hover:bg-fill-primary-hover"
        >
          {isLastStep ? submitLabel : nextLabel}
        </Button>
      ) : allowSkip ? (
        <Button
          type="button"
          size="small"
          mode="ghost"
          disabled={isPromptDisabled}
          onClick={() => void handleAdvance(true)}
          className="shrink-0 rounded-full px-3 text-text-secondary"
        >
          {skipLabel}
        </Button>
      ) : null
    ) : null;

    const otherField = showCustom ? (
      <label
        className={cn(
          'group flex min-w-0 cursor-pointer items-center gap-2.5 rounded-md p-2 text-left transition-colors duration-150 ease-out has-focus-visible:outline-1 has-focus-visible:-outline-offset-1 has-focus-visible:outline-blue-base motion-reduce:transition-none',
          isPromptDisabled
            ? 'cursor-not-allowed opacity-60'
            : 'hover:bg-bg-tertiary hover:text-text-primary',
          customActive ? 'bg-bg-tertiary text-text-primary' : 'text-text-secondary',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-5 shrink-0 items-center justify-center rounded-sm border text-body-micro-medium transition-colors duration-150 motion-reduce:transition-none',
            customActive
              ? 'border-fill-primary bg-fill-primary text-text-inverse'
              : 'border-fill-quaternary bg-bg-base text-text-secondary group-hover:text-text-primary',
          )}
        >
          <Pencil aria-hidden="true" className="size-3 shrink-0" />
        </span>
        <input
          type="text"
          disabled={isPromptDisabled}
          value={draft.customAnswer}
          onChange={(event) =>
            handleCustomChange(stepIdx, event.target.value, question)
          }
          placeholder={question.customPlaceholder ?? question.customLabel ?? 'Other...'}
          className="min-w-0 flex-1 bg-transparent text-body-small-medium text-text-primary outline-none placeholder:text-text-secondary disabled:cursor-not-allowed"
        />
      </label>
    ) : null;

    return (
      <div data-question-body="true" className="flex flex-col gap-1">
        {effectiveVariant === 'composer' && titlePlacement === 'step' ? (
          <div className="px-2 pb-1">
            <div className="wrap-break-word whitespace-normal text-body-small-medium text-text-primary">
              {question.title}
            </div>
            {question.description ? (
              <p className="mt-0.5 text-body-mini-regular text-text-secondary">
                {question.description}
              </p>
            ) : null}
          </div>
        ) : null}

        {question.kind === 'text' ? (
          <div className="flex flex-col gap-2">
            <Textarea
              size="small"
              disabled={isPromptDisabled}
              value={draft.text}
              onChange={(event) => handleTextChange(stepIdx, event.target.value)}
              placeholder={question.placeholder ?? 'Type your answer...'}
              contentClassName="min-h-9 max-h-27"
            />
            {compactTrailingAction ? (
              <div className="flex justify-end">{compactTrailingAction}</div>
            ) : null}
          </div>
        ) : (
          <div
            data-question-choices="true"
            data-question-hotkeys={question.kind === 'single' ? 'numbers' : 'letters'}
            role={question.kind === 'single' ? 'radiogroup' : 'group'}
            aria-label={question.title}
            style={gridStyle}
            className={cn(
              'grid max-h-[min(18rem,40dvh)] auto-rows-max gap-1 overflow-y-auto overscroll-none',
              useGridLayout &&
                'grid-flow-col grid-cols-2 gap-x-4 [&>label]:col-span-full [&>label]:row-start-[-1]',
              choicesClassName,
            )}
          >
            {options.map((option, optionIdx) => {
              const rankIndex = draft.selectedIds.indexOf(option.id);
              const isSelected =
                question.kind === 'single'
                  ? !customActive && draft.selectedIds.includes(option.id)
                  : rankIndex !== -1;
              const isLockedByMax =
                question.kind === 'multi' && !isSelected && maxReached;
              const isOptionDisabled = isPromptDisabled || isLockedByMax;

              let badgeContent: ReactNode = null;
              if (question.kind === 'single') {
                badgeContent = optionIdx + 1;
              } else if (question.ranked) {
                badgeContent = isSelected ? rankIndex + 1 : null;
              } else if (isSelected) {
                badgeContent = <Check aria-hidden="true" className="size-3.5 shrink-0" />;
              }

              return (
                <button
                  key={option.id}
                  data-question-choice="advance"
                  type="button"
                  role={question.kind === 'single' ? 'radio' : 'checkbox'}
                  aria-checked={isSelected}
                  disabled={isOptionDisabled}
                  onClick={() =>
                    question.kind === 'single'
                      ? handleSelectSingle(stepIdx, option.id)
                      : handleToggleMulti(stepIdx, option.id, question)
                  }
                  className={cn(
                    'group flex min-w-0 cursor-pointer items-center gap-2.5 rounded-md p-2 text-left outline-none transition-colors duration-150 ease-out focus-visible:shadow-focus disabled:cursor-not-allowed disabled:opacity-60 motion-reduce:transition-none',
                    isSelected
                      ? 'bg-bg-tertiary text-text-primary'
                      : 'text-text-secondary hover:bg-bg-tertiary hover:text-text-primary',
                  )}
                >
                  <span
                    className={cn(
                      'flex w-5 shrink-0 items-center',
                      option.description && 'self-start pt-0.5',
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        'inline-flex size-5 shrink-0 items-center justify-center rounded-sm border text-body-micro-medium transition-colors duration-150 motion-reduce:transition-none',
                        isSelected
                          ? 'border-fill-primary bg-fill-primary text-text-inverse group-hover:text-text-inverse'
                          : 'border-fill-quaternary bg-bg-base text-text-secondary group-hover:text-text-primary',
                      )}
                    >
                      {badgeContent}
                    </span>
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-body-small-medium text-text-primary">
                      {option.label}
                    </span>
                    {option.description ? (
                      <span className="text-body-mini-regular text-text-secondary">
                        {option.description}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}

            {isCompact && (otherField || compactTrailingAction) ? (
              <div
                className={cn(
                  'flex min-w-0 items-center gap-2 [&>label]:flex-1',
                  useGridLayout && 'col-span-full row-start-[-1]',
                )}
              >
                {otherField ?? <span className="flex-1" />}
                {compactTrailingAction}
              </div>
            ) : (
              otherField
            )}
          </div>
        )}

        {submitError ? (
          <p role="alert" className="px-2 pt-1 text-body-mini-medium text-text-red">
            {submitError}
          </p>
        ) : null}
      </div>
    );
  };

  const primaryButton = (
    <Button
      type="button"
      size="small"
      mode="primary"
      data-slot-primary-action="true"
      disabled={isPromptDisabled || !hasValidAnswer}
      loading={{ isLoading: isSubmitting }}
      onClick={() => void handleAdvance(false)}
      className={cn(
        'rounded-full px-3',
        !isPromptDisabled && hasValidAnswer
          ? 'bg-fill-primary text-text-inverse shadow-low hover:bg-fill-primary-hover'
          : 'bg-bg-secondary text-text-quaternary shadow-none',
      )}
    >
      <span className="inline-flex items-center">
        <span>{isLastStep ? submitLabel : nextLabel}</span>
        <kbd
          aria-hidden="true"
          className={cn(
            'ml-1 inline-flex w-min items-center whitespace-nowrap rounded-[4px] px-1 font-sans text-body-small-medium shadow-none',
            !isPromptDisabled && hasValidAnswer
              ? 'bg-fill-primary-hover text-text-inverse'
              : 'bg-bg-secondary text-text-quaternary',
          )}
        >
          ⏎
        </kbd>
      </span>
    </Button>
  );

  // Inline transcript card variant
  if (effectiveVariant === 'card') {
    return (
      <div
        data-slot="question-tool"
        data-variant="card"
        onKeyDown={handleKeyDown}
        className={cn(
          'wrap-anywhere w-full max-w-[420px] overflow-hidden rounded-lg border border-fill-quaternary bg-bg-base',
          className,
        )}
      >
        <div className="bg-bg-base" data-keyboard-card="true">
          <div className="flex flex-col gap-1 px-3 py-2.5">
            <div className="flex flex-col gap-1 px-2 pt-1">
              <div className="flex items-center justify-between gap-4">
                <p className="text-body-small-regular text-text-secondary">
                  {isMultiStep ? 'Questions' : 'Question'}
                </p>
                {isMultiStep ? (
                  <span className="text-body-mini-regular text-text-quaternary tabular-nums">
                    {activeStepZeroBased + 1} of {totalCount}
                  </span>
                ) : null}
              </div>
              <p className="wrap-break-word whitespace-normal text-body-small-medium text-text-primary">
                {activeQuestion.title}
              </p>
              {activeQuestion.description ? (
                <p className="text-body-mini-regular text-text-secondary">
                  {activeQuestion.description}
                </p>
              ) : null}
            </div>
            {renderQuestionBody(activeQuestion, activeStepZeroBased)}
          </div>
          <div className="flex items-center justify-between px-2 pb-2">
            <span />
            <div className="mx-2 flex items-center gap-2">
              {!isFirstStep ? (
                <Button
                  type="button"
                  size="small"
                  mode="ghost"
                  disabled={isPromptDisabled}
                  onClick={handleBack}
                  className="rounded-full px-3 text-text-secondary"
                >
                  Back
                </Button>
              ) : null}
              {allowSkip ? (
                <Button
                  type="button"
                  size="small"
                  mode="ghost"
                  disabled={isPromptDisabled}
                  onClick={() => void handleAdvance(true)}
                  className="rounded-full px-3 text-text-secondary"
                >
                  {skipLabel}
                </Button>
              ) : null}
              {primaryButton}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Composer takeover or compact promptSlot variant
  const headerCounter = isMultiStep ? (
    isCompact ? (
      <div className="flex items-center text-text-secondary">
        <button
          type="button"
          aria-label="Previous question"
          disabled={isPromptDisabled || isFirstStep}
          onClick={handleBack}
          className="flex min-h-6 -my-0.5 cursor-pointer items-center justify-center rounded-md px-1 text-text-secondary outline-none transition-[transform,color] duration-150 ease-out hover:text-text-primary focus-visible:shadow-focus active:scale-[0.95] disabled:cursor-not-allowed disabled:text-text-quaternary motion-reduce:transition-none"
        >
          <ChevronLeft aria-hidden="true" className="size-4 shrink-0" />
        </button>
        <span className="px-0.5 tabular-nums">
          {renderComposerCounter
            ? renderComposerCounter(activeStepZeroBased + 1, totalCount)
            : `${activeStepZeroBased + 1} of ${totalCount}`}
        </span>
        <button
          type="button"
          aria-label="Next question"
          disabled={isPromptDisabled || isLastStep || !hasValidAnswer}
          onClick={() => void handleAdvance(false)}
          className="flex min-h-6 -my-0.5 cursor-pointer items-center justify-center rounded-md px-1 text-text-secondary outline-none transition-[transform,color] duration-150 ease-out hover:text-text-primary focus-visible:shadow-focus active:scale-[0.95] disabled:cursor-not-allowed disabled:text-text-quaternary motion-reduce:transition-none"
        >
          <ChevronRight aria-hidden="true" className="size-4 shrink-0" />
        </button>
      </div>
    ) : renderComposerCounter ? (
      renderComposerCounter(activeStepZeroBased + 1, totalCount)
    ) : (
      <span className="tabular-nums">
        {activeStepZeroBased + 1} of {totalCount}
      </span>
    )
  ) : null;

  return (
    <div
      data-slot="interactive-slot-root"
      data-variant={isCompact ? 'compact' : 'composer'}
      data-keyboard-card="true"
      onKeyDown={handleKeyDown}
      className={cn(
        'flex max-h-[400px] min-h-0 w-full flex-col overflow-hidden rounded-[inherit] bg-bg-primary text-text-primary wrap-anywhere',
        className,
      )}
    >
      <div
        data-slot="interactive-slot-header"
        className={cn(
          'shrink-0',
          isCompact ? 'px-4 pt-3.5 pr-3 pb-2' : 'px-4 pt-3 pb-1.5',
        )}
      >
        <div className="flex items-start gap-2">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            {!isCompact ? (
              <div className="text-body-mini-regular text-text-secondary">
                {isMultiStep ? 'Questions' : 'Question'}
              </div>
            ) : null}
            {titlePlacement === 'header' ? (
              <>
                <div className="wrap-break-word whitespace-normal text-body-small-medium text-text-primary">
                  {activeQuestion.title}
                </div>
                {activeQuestion.description ? (
                  <p className="text-body-mini-regular text-text-secondary">
                    {activeQuestion.description}
                  </p>
                ) : null}
              </>
            ) : null}
          </div>
          {headerCounter ? (
            <div className="ml-2 shrink-0 text-body-mini-regular text-text-quaternary">
              {headerCounter}
            </div>
          ) : null}
        </div>
      </div>

      <div
        data-slot="interactive-slot-body"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-2 py-1"
      >
        <div
          data-slot="interactive-slot-track"
          className="relative flex shrink-0 flex-col justify-end overflow-hidden transition-[height] duration-200 ease-out [contain:layout_style] motion-reduce:transition-none"
        >
          {questions.map((question, idx) => {
            const isActive = idx === activeStepZeroBased;
            return (
              <div
                key={question.id ?? `q-${idx}`}
                data-slot="interactive-slot-step-region"
                data-active={isActive ? 'true' : undefined}
                aria-hidden={!isActive || undefined}
                inert={!isActive ? true : undefined}
                className={cn(
                  'relative shrink-0 transition-[opacity,filter] ease-out motion-reduce:transition-none',
                  isActive
                    ? 'opacity-100 blur-none delay-25 duration-200'
                    : 'pointer-events-none absolute inset-x-0 bottom-0 opacity-0 blur-[1px] delay-0 duration-150',
                )}
              >
                <div
                  data-slot="interactive-slot-step-content"
                  className={cn(
                    'transition-transform ease-out motion-reduce:transition-none',
                    isActive
                      ? 'translate-x-0 delay-25 duration-200'
                      : cn(
                          'delay-0 duration-150',
                          direction >= 0 ? 'translate-x-3' : '-translate-x-3',
                        ),
                  )}
                >
                  <div className="flex min-w-0 flex-col gap-2 rounded-md p-2 empty:hidden">
                    {renderQuestionBody(question, idx)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isCompact ? (
        <div
          data-slot="interactive-slot-footer"
          className="relative z-20 shrink-0 rounded-b-[inherit] bg-bg-primary p-3"
        >
          <div className="flex items-center justify-between">
            <span />
            <div className="flex items-center gap-2">
              <span
                aria-hidden={isFirstStep || undefined}
                inert={isFirstStep ? true : undefined}
                data-hidden={isFirstStep ? 'true' : 'false'}
                className="transition-opacity ease-out data-[hidden=false]:delay-25 data-[hidden=false]:duration-175 data-[hidden=true]:delay-0 data-[hidden=true]:duration-150 data-[hidden=true]:opacity-0 motion-reduce:transition-none"
              >
                <Button
                  type="button"
                  size="small"
                  mode="ghost"
                  disabled={isPromptDisabled || isFirstStep}
                  onClick={handleBack}
                  className="rounded-full px-3 text-text-secondary"
                >
                  Back
                </Button>
              </span>
              {allowSkip ? (
                <Button
                  type="button"
                  size="small"
                  mode="ghost"
                  disabled={isPromptDisabled}
                  onClick={() => void handleAdvance(true)}
                  className="rounded-full px-3 text-text-secondary"
                >
                  {skipLabel}
                </Button>
              ) : null}
              {primaryButton}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export { QuestionTool };
