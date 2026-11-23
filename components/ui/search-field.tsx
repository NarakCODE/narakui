'use client';

import type { ReactNode } from 'react';
import type { ChangeDetails } from '@ui-sdk/core';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  useFieldControl,
} from '@ui-sdk/react/field';
import {
  createInputController,
  Input,
  InputClear,
  InputGroup,
  type InputController,
  type InputGroupOptions,
  type InputGroupState,
  type InputOptions,
  type InputState,
  type InputValueChangeReason,
} from '@ui-sdk/react/input';
import type { PartProps } from '@ui-sdk/react/primitive';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

export type SearchFieldSize = 'mini' | 'micro' | 'small' | 'regular' | 'large';
export type SearchFieldVariant = 'control' | 'chromeless';

const SEARCH_FIELD_SIZE_CLASSES: Record<SearchFieldSize, string> = {
  mini: 'min-h-6 px-1.5 py-0.5 text-body-mini-regular',
  micro: 'min-h-6 px-1.5 py-0.5 text-body-mini-regular',
  small: 'min-h-7 px-1.5 py-0.5 text-body-small-regular',
  regular: 'min-h-9.5 px-1.5 py-1 text-body-small-regular',
  large: 'min-h-10 px-2 py-1 text-body-regular',
};

const CLEAR_BUTTON_SIZE_CLASSES: Record<SearchFieldSize, string> = {
  mini: 'size-4 rounded-[4px] [&_svg]:size-3',
  micro: 'size-4 rounded-[4px] [&_svg]:size-3',
  small: 'size-5 rounded-sm [&_svg]:size-3.5',
  regular: 'size-5 rounded-sm [&_svg]:size-3.5',
  large: 'size-6 rounded-sm [&_svg]:size-4',
};

function mergePartClassName<State>(
  baseClasses: string,
  className?: string | ((state: State) => string | undefined),
): string | ((state: State) => string) {
  if (typeof className === 'function') {
    return (state: State) => cn(baseClasses, className(state));
  }
  return cn(baseClasses, className);
}

export interface SearchFieldGroupProps
  extends InputGroupOptions,
    PartProps<'div', InputGroupState> {
  size?: SearchFieldSize;
  variant?: SearchFieldVariant;
  error?: boolean;
}

function SearchFieldGroup({
  size = 'regular',
  variant = 'control',
  error = false,
  className,
  ...props
}: SearchFieldGroupProps) {
  const resolvedSize: SearchFieldSize =
    size in SEARCH_FIELD_SIZE_CLASSES ? size : 'regular';

  const surfaceClasses =
    variant === 'chromeless'
      ? cn(
          'relative flex w-full min-w-0 items-center gap-1 border-0 bg-transparent p-0 outline-none',
          resolvedSize === 'mini' || resolvedSize === 'micro'
            ? 'text-body-mini-regular'
            : resolvedSize === 'large'
              ? 'text-body-regular'
              : 'text-body-small-regular',
          'data-disabled:cursor-not-allowed data-disabled:text-text-quaternary data-readonly:not-data-disabled:cursor-default',
        )
      : cn(
          'relative flex w-full min-w-0 items-center gap-1 rounded-md border-[1.5px] border-transparent bg-bg-primary text-text-primary shadow-low outline-none transition-[background-color,border-color] duration-150 ease-out motion-reduce:transition-none dark:bg-bg-secondary',
          SEARCH_FIELD_SIZE_CLASSES[resolvedSize],
          'has-[input:focus-visible]:shadow-low-focus not-data-disabled:not-data-readonly:not-has-[input:focus-visible]:hover:bg-control-hover dark:not-data-disabled:not-data-readonly:not-has-[input:focus-visible]:hover:bg-control-bg',
          'data-readonly:not-data-disabled:cursor-default',
          'data-disabled:cursor-not-allowed data-disabled:bg-bg-tertiary data-disabled:text-text-quaternary data-disabled:shadow-none dark:data-disabled:bg-bg-secondary',
          'not-data-disabled:in-data-invalid:border-fill-red not-data-disabled:has-[[aria-invalid=true]]:border-fill-red',
          error && 'not-data-disabled:border-fill-red',
        );

  return (
    <InputGroup
      data-size={resolvedSize}
      data-variant={variant}
      className={mergePartClassName(surfaceClasses, className)}
      {...props}
    />
  );
}

export interface SearchFieldInputProps
  extends InputOptions,
    Omit<
      PartProps<'input', InputState>,
      'value' | 'defaultValue' | 'onSelect' | 'size'
    > {
  size?: SearchFieldSize | number;
}

function SearchFieldInput({
  type = 'search',
  size = 'regular',
  autoComplete = 'off',
  autoCorrect = 'off',
  spellCheck = false,
  className,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...props
}: SearchFieldInputProps) {
  const field = useFieldControl();
  const isPresetSize =
    typeof size === 'string' && size in SEARCH_FIELD_SIZE_CLASSES;
  const resolvedSize: SearchFieldSize = isPresetSize
    ? (size as SearchFieldSize)
    : 'regular';
  const resolvedAriaLabel =
    ariaLabel ?? (!field && !ariaLabelledBy ? 'Search' : undefined);

  // Hide WebKit's native search cancel decoration so InputClear is the only clear control.
  const inputClasses =
    'min-w-0 flex-1 bg-transparent px-0.5 text-text-primary outline-none placeholder:select-none placeholder:font-normal placeholder:text-text-tertiary data-disabled:cursor-not-allowed data-disabled:text-text-quaternary data-disabled:placeholder:text-text-quaternary disabled:cursor-not-allowed disabled:text-text-quaternary disabled:placeholder:text-text-quaternary data-readonly:not-data-disabled:cursor-default [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none';

  return (
    <Input
      type={type}
      size={typeof size === 'number' ? size : undefined}
      data-size={resolvedSize}
      autoComplete={autoComplete}
      autoCorrect={autoCorrect}
      spellCheck={spellCheck}
      aria-label={resolvedAriaLabel}
      aria-labelledby={ariaLabelledBy}
      className={mergePartClassName(inputClasses, className)}
      {...props}
    />
  );
}

export interface SearchFieldClearProps
  extends PartProps<'button', InputGroupState> {
  size?: SearchFieldSize;
}

function SearchFieldClear({
  size = 'regular',
  className,
  children,
  'aria-label': ariaLabel = 'Clear search',
  ...props
}: SearchFieldClearProps) {
  const resolvedSize: SearchFieldSize =
    size in CLEAR_BUTTON_SIZE_CLASSES ? size : 'regular';

  const clearClasses = cn(
    'flex shrink-0 cursor-pointer select-none items-center justify-center text-text-secondary outline-none transition-[transform,background-color,color] duration-150 ease-out hover:bg-control-hover hover:text-text-primary focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.97] data-disabled:pointer-events-none data-disabled:opacity-50 disabled:pointer-events-none disabled:opacity-50 motion-reduce:transition-none [&_svg]:pointer-events-none [&_svg]:shrink-0',
    CLEAR_BUTTON_SIZE_CLASSES[resolvedSize],
  );

  return (
    <InputClear
      data-size={resolvedSize}
      aria-label={ariaLabel}
      className={mergePartClassName(clearClasses, className)}
      {...props}
    >
      {children ?? <X aria-hidden="true" />}
    </InputClear>
  );
}

export interface SearchFieldProps
  extends Omit<SearchFieldInputProps, 'size' | 'className'> {
  label?: ReactNode;
  endLabel?: ReactNode;
  size?: SearchFieldSize;
  variant?: SearchFieldVariant;
  error?: boolean;
  errorMessage?: ReactNode;
  hint?: ReactNode;
  iconStart?: ReactNode | boolean;
  clearLabel?: string;
  clearChildren?: SearchFieldClearProps['children'];
  className?: string;
  inputClassName?: SearchFieldInputProps['className'];
  inputWrapperClassName?: SearchFieldGroupProps['className'];
  clearClassName?: SearchFieldClearProps['className'];
}

function SearchField({
  label,
  endLabel,
  size = 'regular',
  variant = 'control',
  error = false,
  errorMessage,
  hint,
  iconStart,
  clearLabel = 'Clear search',
  clearChildren,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  debug,
  className,
  inputClassName,
  inputWrapperClassName,
  clearClassName,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  ...inputProps
}: SearchFieldProps) {
  const resolvedSize: SearchFieldSize =
    size in SEARCH_FIELD_SIZE_CLASSES ? size : 'regular';
  const hasErrorText = Boolean(error && errorMessage);
  const hasHintText = Boolean(hint && !hasErrorText);
  const hasFieldWrapper = Boolean(
    label || endLabel || hasErrorText || hasHintText || error,
  );

  const showStartIcon = iconStart !== false && iconStart !== null;
  const startIconContent =
    iconStart === undefined || iconStart === true ? (
      <Search aria-hidden="true" className="size-4 shrink-0" />
    ) : (
      iconStart
    );

  const resolvedAriaLabel =
    ariaLabel ?? (!label && !ariaLabelledBy ? 'Search' : undefined);

  const groupNode = (
    <SearchFieldGroup
      size={resolvedSize}
      variant={variant}
      error={error}
      debug={debug}
      className={
        hasFieldWrapper
          ? inputWrapperClassName
          : mergePartClassName(cn(className), inputWrapperClassName)
      }
    >
      {showStartIcon ? (
        <span
          aria-hidden="true"
          className="flex size-4 shrink-0 select-none items-center justify-center text-text-secondary [&>*]:size-full"
        >
          {startIconContent}
        </span>
      ) : null}
      <SearchFieldInput
        size={resolvedSize}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        name={name}
        debug={debug}
        aria-label={resolvedAriaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-invalid={error ? true : inputProps['aria-invalid']}
        className={inputClassName}
        {...inputProps}
      />
      <SearchFieldClear
        size={resolvedSize}
        aria-label={clearLabel}
        className={clearClassName}
      >
        {clearChildren}
      </SearchFieldClear>
    </SearchFieldGroup>
  );

  if (!hasFieldWrapper) {
    return groupNode;
  }

  return (
    <Field
      name={name}
      disabled={disabled}
      invalid={error ? true : undefined}
      debug={debug}
      className={cn('flex flex-col gap-2', className)}
    >
      {label || endLabel ? (
        <div className="flex items-center justify-between gap-2">
          {label ? (
            <FieldLabel className="w-max select-none text-body-small-medium text-text-primary">
              {label}
            </FieldLabel>
          ) : (
            <span />
          )}
          {endLabel ? (
            <div className="flex shrink-0 items-center text-body-mini-regular text-text-secondary">
              {endLabel}
            </div>
          ) : null}
        </div>
      ) : null}
      {groupNode}
      {hasErrorText ? (
        <FieldError
          match
          className="select-none text-body-small-medium text-text-red"
        >
          {errorMessage}
        </FieldError>
      ) : hasHintText ? (
        <FieldDescription className="select-none text-body-mini-regular text-text-tertiary">
          {hint}
        </FieldDescription>
      ) : null}
    </Field>
  );
}

const createSearchFieldController = createInputController;

export {
  createSearchFieldController,
  SearchField,
  SearchFieldClear,
  SearchFieldGroup,
  SearchFieldInput,
  type ChangeDetails,
  type InputController as SearchFieldController,
  type InputGroupState as SearchFieldGroupState,
  type InputState as SearchFieldState,
  type InputValueChangeReason as SearchFieldValueChangeReason,
};
