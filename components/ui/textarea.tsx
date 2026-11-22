'use client';

import {
  useId,
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ReactNode,
  type Ref,
} from 'react';
import { cn } from '@/lib/utils';

export type TextareaSize = 'small' | 'regular';
export type TextareaVariant = 'control' | 'chromeless';

export interface TextareaProps extends ComponentProps<'textarea'> {
  /** Label text for the textarea field. */
  label?: ReactNode;
  /** Size of the textarea typography. */
  size?: TextareaSize;
  /** Whether the field renders its own surface (`control`) or sits transparently in place (`chromeless`). */
  variant?: TextareaVariant;
  /** Helper text displayed below the textarea. */
  hint?: ReactNode;
  /** Whether to display the textarea in an error state. */
  error?: boolean;
  /** Error message shown below the textarea while `error` is true. */
  errorMessage?: string;
  /** End label displayed below the textarea opposite the hint or error message. */
  endLabel?: ReactNode;
  /** Whether to use content-based automatic field sizing (`field-sizing-content`). */
  fieldSizing?: boolean;
  /** Additional CSS classes applied to the textarea container. */
  className?: string;
  /** Additional CSS classes applied to the native textarea element. */
  contentClassName?: string;
  /** Alias for outer container classes preserved for backward compatibility. */
  wrapperClassName?: string;
  /** Extra props spread onto the native textarea element. */
  inputRest?: ComponentPropsWithoutRef<'textarea'>;
  /** Ref to the outer container element. */
  containerRef?: Ref<HTMLDivElement>;
}

/** Multi-line text input with sizes, error/read-only/disabled states, auto-sizing, and chromeless in-place editing. */
function Textarea({
  label,
  placeholder,
  disabled = false,
  readOnly = false,
  required = false,
  size = 'regular',
  variant = 'control',
  id,
  hint,
  value,
  defaultValue,
  error = false,
  errorMessage,
  onChange,
  endLabel,
  fieldSizing = true,
  className,
  contentClassName,
  wrapperClassName,
  inputRest,
  containerRef,
  ...restProps
}: TextareaProps) {
  const generatedId = useId();
  const isInputGroupControl =
    (restProps as Record<string, unknown>)['data-slot'] === 'input-group-control';
  const resolvedId = inputRest?.id ?? id ?? generatedId;

  const hasErrorText = Boolean(error && errorMessage);
  const hasHintText = Boolean(hint && !hasErrorText);
  const errorId = `${resolvedId}-error`;
  const hintId = `${resolvedId}-hint`;

  const describedBy =
    [
      inputRest?.['aria-describedby'] ?? restProps['aria-describedby'],
      hasErrorText ? errorId : undefined,
      hasHintText ? hintId : undefined,
    ]
      .filter(Boolean)
      .join(' ') || undefined;

  const textareaProps: ComponentProps<'textarea'> = {
    placeholder,
    disabled,
    readOnly,
    required,
    value,
    defaultValue,
    onChange,
    'aria-invalid': error ? true : restProps['aria-invalid'],
    'aria-errormessage': hasErrorText ? errorId : restProps['aria-errormessage'],
    'aria-describedby': describedBy,
    ...restProps,
    ...inputRest,
    id: resolvedId,
  };

  if (isInputGroupControl) {
    return (
      <textarea
        data-size={size}
        data-variant={variant}
        className={cn(
          'w-full resize-none bg-transparent text-body-small-regular text-text-primary outline-none placeholder:select-none placeholder:font-normal placeholder:text-text-tertiary disabled:cursor-not-allowed disabled:text-text-quaternary',
          fieldSizing && 'field-sizing-content',
          className,
          contentClassName,
        )}
        {...textareaProps}
      />
    );
  }

  const sizeClass =
    size === 'small' ? 'text-body-small-regular' : 'text-body-regular';

  const textareaClasses =
    variant === 'chromeless'
      ? cn(
          'block min-h-0 w-full resize-none border-0 bg-transparent p-0 text-text-primary outline-none placeholder:select-none placeholder:font-normal placeholder:text-text-tertiary',
          sizeClass,
          disabled && 'cursor-not-allowed text-text-quaternary placeholder:text-text-quaternary',
          readOnly && !disabled && 'cursor-default',
          fieldSizing && 'field-sizing-content',
          contentClassName,
        )
      : cn(
          'h-full min-h-20.5 w-full resize-none rounded-md border-[1.5px] border-transparent p-2 outline-none transition-[background-color,border-color] duration-150 ease-out placeholder:select-none placeholder:font-normal motion-reduce:transition-none',
          sizeClass,
          disabled
            ? 'cursor-not-allowed bg-bg-tertiary text-text-quaternary placeholder:text-text-quaternary dark:bg-bg-secondary'
            : readOnly
              ? 'cursor-default bg-control-bg text-text-primary shadow-low placeholder:text-text-tertiary focus-visible:shadow-low-focus dark:bg-bg-secondary'
              : 'bg-control-bg text-text-primary shadow-low placeholder:text-text-tertiary focus-visible:shadow-low-focus not-focus-visible:hover:bg-control-hover dark:bg-bg-secondary',
          error && !disabled && 'border-fill-red',
          fieldSizing && 'field-sizing-content',
          contentClassName,
        );

  const footerMessage = hasErrorText ? (
    <span id={errorId} className="select-none text-body-small-medium text-text-red">
      {errorMessage}
    </span>
  ) : hasHintText ? (
    <span id={hintId} className="select-none text-body-mini-regular text-text-tertiary">
      {hint}
    </span>
  ) : null;

  return (
    <div
      ref={containerRef}
      data-slot="textarea-wrapper"
      className={cn('flex flex-col gap-2', className, wrapperClassName)}
    >
      {label ? (
        <div className="flex justify-between gap-2">
          <label
            className="w-max select-none text-body-small-medium text-text-primary"
            htmlFor={resolvedId}
          >
            {label}
          </label>
        </div>
      ) : null}

      <div className="relative h-full w-full">
        <textarea
          data-slot="textarea"
          data-size={size}
          data-variant={variant}
          className={textareaClasses}
          {...textareaProps}
        />
      </div>

      {footerMessage || endLabel ? (
        endLabel ? (
          <div className="flex items-center justify-between gap-2">
            <div>{footerMessage}</div>
            <div className="shrink-0 text-body-mini-regular text-text-tertiary">
              {endLabel}
            </div>
          </div>
        ) : (
          footerMessage
        )
      ) : null}
    </div>
  );
}

export { Textarea };
