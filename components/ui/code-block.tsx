'use client';

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { Check, Copy, Search, TriangleAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useHighlightedCode } from '@/hooks/use-highlighted-code';
import { highlightCodeToHtml } from '@/lib/highlighter';
import { cn } from '@/lib/utils';

export interface CodeBlockLanguage {
  /** Canonical language identifier passed to the highlighter. */
  value: string;
  /** Human-readable language label displayed in the picker. */
  label: string;
  /** Alternative names and file extensions recognized for this language. */
  aliases?: readonly string[];
}

export const DEFAULT_CODE_BLOCK_LANGUAGES: readonly CodeBlockLanguage[] = [
  { value: 'plaintext', label: 'Plain text', aliases: ['text', 'txt', 'plain'] },
  { value: 'typescript', label: 'TypeScript', aliases: ['ts'] },
  { value: 'tsx', label: 'TSX' },
  { value: 'javascript', label: 'JavaScript', aliases: ['js', 'mjs', 'cjs'] },
  { value: 'jsx', label: 'JSX' },
  { value: 'python', label: 'Python', aliases: ['py'] },
  { value: 'bash', label: 'Bash', aliases: ['sh', 'shell', 'zsh'] },
  { value: 'json', label: 'JSON', aliases: ['jsonc'] },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'markdown', label: 'Markdown', aliases: ['md', 'mdx'] },
  { value: 'yaml', label: 'YAML', aliases: ['yml'] },
  { value: 'go', label: 'Go', aliases: ['golang'] },
  { value: 'rust', label: 'Rust', aliases: ['rs'] },
  { value: 'java', label: 'Java' },
  { value: 'c', label: 'C' },
  { value: 'cpp', label: 'C++', aliases: ['c++'] },
];

const LANGUAGE_ALIAS_MAP = new Map<string, string>();
for (const entry of DEFAULT_CODE_BLOCK_LANGUAGES) {
  LANGUAGE_ALIAS_MAP.set(entry.value.toLowerCase(), entry.value);
  for (const alias of entry.aliases ?? []) {
    LANGUAGE_ALIAS_MAP.set(alias.toLowerCase(), entry.value);
  }
}

/** Normalizes a language name or alias to its canonical identifier. */
function normalizeLanguage(language?: string): string | undefined {
  if (!language) return undefined;
  const trimmed = language.trim().toLowerCase();
  if (!trimmed) return undefined;
  return LANGUAGE_ALIAS_MAP.get(trimmed) ?? trimmed;
}

/** Extracts source code text from ReactNode children, joining strings and numbers. */
function extractSourceText(children: ReactNode): string {
  if (typeof children === 'string' || typeof children === 'number') {
    return String(children);
  }
  if (Array.isArray(children)) {
    return children.map(extractSourceText).join('');
  }
  return '';
}

/** Guesses a highlight language from raw code when `language` is omitted. */
function detectLanguage(code: string): string {
  const trimmed = code.trim();
  if (!trimmed) return 'plaintext';

  if (
    (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
    (trimmed.startsWith('[') && trimmed.endsWith(']'))
  ) {
    try {
      JSON.parse(trimmed);
      return 'json';
    } catch {
      // Not valid JSON; continue checking other patterns.
    }
  }

  if (/^<!doctype\s+html|^<(html|head|body|div|section|main)\b/i.test(trimmed)) {
    return 'html';
  }

  if (/^(#!\/.*sh\b|curl\s|wget\s|npm\s|pnpm\s|yarn\s|bun\s|npx\s|git\s|export\s+\w+=)/m.test(trimmed)) {
    return 'bash';
  }

  if (/^[.#@a-zA-Z][\w\s,.:#>*+-]*\{\s*[\w-]+\s*:/m.test(trimmed)) {
    return 'css';
  }

  if (/<[A-Z][A-Za-z0-9]*[\s/>]/.test(trimmed)) {
    return /:\s*[A-Z]\w*|\binterface\s+|\btype\s+\w+\s*=/.test(trimmed) ? 'tsx' : 'jsx';
  }

  if (/\b(interface|type)\s+\w+|:\s*(string|number|boolean|unknown|Record<|Readonly)/.test(trimmed)) {
    return 'typescript';
  }

  if (/\b(const|let|await|async|import|export|function)\b/.test(trimmed)) {
    return 'javascript';
  }

  return 'plaintext';
}

/** Escapes HTML special characters for plain-text clipboard fallback markup. */
function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export interface CodeBlockFrameProps {
  /** Code content rendered inside the pre panel. */
  children: ReactNode;
  /** Controls shown in the top-right corner on hover and focus. */
  actions: ReactNode;
  /** Additional classes for the outer wrapper. */
  className?: string;
  /** Additional classes for the pre panel. */
  preClassName?: string;
  /** Props for the element around the actions. */
  actionsProps?: HTMLAttributes<HTMLDivElement>;
  /** Props for the pre panel. */
  preProps?: HTMLAttributes<HTMLPreElement>;
  /** Renders a custom wrapper element instead of the default div, for editor integrations. */
  renderWrapper?: (props: { className: string; children: ReactNode }) => ReactNode;
}

/** Reusable framed code-block shell with scrolling pre panel and hover/focus action overlay. */
function CodeBlockFrame({
  children,
  actions,
  className,
  preClassName,
  actionsProps,
  preProps,
  renderWrapper,
}: CodeBlockFrameProps) {
  const wrapperClassName = cn(
    'group/code-block relative w-full min-w-0 overflow-hidden rounded-md border border-border-gray bg-bg-secondary text-text-primary',
    className,
  );

  const { className: actionsClassName, ...restActionsProps } = actionsProps ?? {};
  const { className: prePropsClassName, tabIndex: preTabIndex, ...restPreProps } = preProps ?? {};

  const content = (
    <>
      <div
        data-slot="code-block-actions"
        className={cn(
          'absolute top-2 right-2 z-10 flex items-center gap-1 opacity-0 transition-opacity duration-150 ease-out motion-reduce:transition-none group-hover/code-block:opacity-100 group-focus-within/code-block:opacity-100 has-[[data-state=open]]:opacity-100 [@media(hover:none)]:opacity-100',
          actionsClassName,
        )}
        {...restActionsProps}
      >
        {actions}
      </div>
      <pre
        data-slot="code-block-pre"
        dir="ltr"
        tabIndex={preTabIndex ?? 0}
        className={cn(
          'scrollbar-custom overflow-auto overscroll-x-contain px-4 py-3 font-mono text-body-small-regular leading-relaxed text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-ring',
          preClassName,
          prePropsClassName,
        )}
        {...restPreProps}
      >
        {children}
      </pre>
    </>
  );

  if (renderWrapper) {
    return renderWrapper({ className: wrapperClassName, children: content });
  }

  return (
    <div data-slot="code-block" className={wrapperClassName}>
      {content}
    </div>
  );
}

export interface CodeBlockCopyButtonProps {
  /** Text to copy, or a function that returns it when clicked. */
  text: string | (() => string);
  /** Language used to highlight the HTML copy. */
  language?: string;
  /** Accessible label and tooltip before copying. */
  copyLabel?: string;
  /** Accessible label and tooltip after a successful copy. */
  copiedLabel?: string;
  /** Toast message shown when the clipboard rejects the copy. */
  failureMessage?: string;
  /** Additional classes for the button. */
  className?: string;
}

/** Copy button copying both plain text and Shiki-highlighted HTML, with a failure warning toast. */
function CodeBlockCopyButton({
  text,
  language,
  copyLabel = 'Copy code',
  copiedLabel = 'Copied',
  failureMessage = 'Failed to copy code. Please try again.',
  className,
}: CodeBlockCopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const [failureToastVisible, setFailureToastVisible] = useState(false);
  const [failureToastClosing, setFailureToastClosing] = useState(false);
  const copiedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failureTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const failureUnmountTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      if (failureTimerRef.current) clearTimeout(failureTimerRef.current);
      if (failureUnmountTimerRef.current) clearTimeout(failureUnmountTimerRef.current);
    };
  }, []);

  const handleCopy = async () => {
    const plainText = typeof text === 'function' ? text() : text;
    const normalizedLang = normalizeLanguage(language) ?? detectLanguage(plainText);

    try {
      let html = `<pre><code>${escapeHtml(plainText)}</code></pre>`;
      if (normalizedLang !== 'plaintext') {
        try {
          const isDark =
            typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
          const theme = isDark ? 'github-dark' : 'github-light';
          const highlightedHtml = await highlightCodeToHtml(plainText, normalizedLang, theme);
          if (highlightedHtml) {
            html = highlightedHtml;
          }
        } catch {
          // Fall back to escaped HTML if grammar loading fails.
        }
      }

      if (typeof ClipboardItem !== 'undefined' && typeof navigator.clipboard?.write === 'function') {
        await navigator.clipboard.write([
          new ClipboardItem({
            'text/plain': new Blob([plainText], { type: 'text/plain' }),
            'text/html': new Blob([html], { type: 'text/html' }),
          }),
        ]);
      } else if (typeof navigator.clipboard?.writeText === 'function') {
        await navigator.clipboard.writeText(plainText);
      } else {
        throw new Error('Clipboard API unavailable');
      }

      setCopied(true);
      if (copiedTimerRef.current) clearTimeout(copiedTimerRef.current);
      copiedTimerRef.current = setTimeout(() => {
        setCopied(false);
        copiedTimerRef.current = null;
      }, 2000);
    } catch {
      setFailureToastClosing(false);
      setFailureToastVisible(true);
      if (failureTimerRef.current) clearTimeout(failureTimerRef.current);
      if (failureUnmountTimerRef.current) clearTimeout(failureUnmountTimerRef.current);
      failureTimerRef.current = setTimeout(() => {
        setFailureToastClosing(true);
        failureTimerRef.current = null;
        failureUnmountTimerRef.current = setTimeout(() => {
          setFailureToastVisible(false);
          setFailureToastClosing(false);
          failureUnmountTimerRef.current = null;
        }, 150);
      }, 3850);
    }
  };

  const label = copied ? copiedLabel : copyLabel;

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            data-slot="code-block-copy-button"
            data-copied={copied || undefined}
            mode="secondary"
            size="small"
            allowScaleOnClick={false}
            iconStart={
              copied ? (
                <Check
                  key="check"
                  aria-hidden="true"
                  className="animate-in fade-in-0 zoom-in-75 duration-150 ease-out motion-reduce:zoom-in-100"
                />
              ) : (
                <Copy key="copy" aria-hidden="true" />
              )
            }
            aria-label={label}
            className={cn('size-7 px-0', className)}
            onClick={handleCopy}
          />
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>{label}</TooltipContent>
      </Tooltip>
      <span aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ''}
      </span>
      {failureToastVisible && typeof document !== 'undefined'
        ? createPortal(
            <div
              role="alert"
              data-state={failureToastClosing ? 'closed' : 'open'}
              className={cn(
                'fixed right-4 bottom-4 z-50 flex max-w-sm items-center gap-2 rounded-md border border-orange-border bg-bg-orange px-3 py-2 text-body-small-regular text-text-primary shadow-medium starting:opacity-0 starting:translate-y-2 transition-[opacity,transform] duration-200 ease-out motion-reduce:starting:translate-y-0 motion-reduce:transition-opacity',
                failureToastClosing
                  ? 'translate-y-2 opacity-0 duration-150 motion-reduce:translate-y-0'
                  : 'translate-y-0 opacity-100',
              )}
            >
              <TriangleAlert aria-hidden="true" className="size-4 shrink-0 text-text-orange" />
              <span>{failureMessage}</span>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

export interface CodeBlockLanguagePickerProps {
  /** Currently active language value. */
  language?: string;
  /** Called with the selected language. */
  onLanguageChange: (language: string) => void;
  /** Called when the menu opens or closes. */
  onOpenChange?: (open: boolean) => void;
  /** Languages offered in the searchable picker. */
  languages?: readonly CodeBlockLanguage[];
  /** Accessible label of the menu button. */
  ariaLabel?: string;
  /** Placeholder of the search field. */
  searchPlaceholder?: string;
  /** Message shown when no language matches the search. */
  noResultsLabel?: string;
  /** Additional classes for the menu button. */
  className?: string;
}

/** Searchable language selector menu for CodeBlock toolbars. */
function CodeBlockLanguagePicker({
  language,
  onLanguageChange,
  onOpenChange,
  languages = DEFAULT_CODE_BLOCK_LANGUAGES,
  ariaLabel = 'Code language',
  searchPlaceholder = 'Search languages',
  noResultsLabel = 'No languages found',
  className,
}: CodeBlockLanguagePickerProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normalizedCurrent = normalizeLanguage(language) ?? 'plaintext';
  const currentEntry =
    languages.find((entry) => entry.value === normalizedCurrent) ??
    DEFAULT_CODE_BLOCK_LANGUAGES.find((entry) => entry.value === normalizedCurrent);
  const currentLabel = currentEntry?.label ?? normalizedCurrent;

  const filteredLanguages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return languages;
    return languages.filter(
      (entry) =>
        entry.label.toLowerCase().includes(q) ||
        entry.value.toLowerCase().includes(q) ||
        entry.aliases?.some((alias) => alias.toLowerCase().includes(q)),
    );
  }, [languages, query]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) setQuery('');
    onOpenChange?.(nextOpen);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          mode="secondary"
          size="small"
          allowScaleOnClick={false}
          iconEnd="chevron-down"
          aria-label={ariaLabel}
          className={cn('h-7 max-w-40 px-2 text-body-mini-medium', className)}
        >
          <span className="truncate">{currentLabel}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={6} className="w-56 gap-0 p-1">
        <div className="flex items-center gap-1.5 border-b border-border-gray px-2 py-1.5">
          <Search aria-hidden="true" className="size-3.5 shrink-0 text-text-tertiary" />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="w-full bg-transparent text-body-small-regular text-text-primary outline-none placeholder:text-text-tertiary"
          />
        </div>
        <div
          role="listbox"
          aria-label={ariaLabel}
          className="scrollbar-custom mt-1 max-h-56 overflow-y-auto overscroll-contain"
        >
          {filteredLanguages.length === 0 ? (
            <div className="px-2 py-3 text-center text-body-small-regular text-text-secondary">
              {noResultsLabel}
            </div>
          ) : (
            filteredLanguages.map((entry) => {
              const isSelected = entry.value === normalizedCurrent;
              return (
                <button
                  key={entry.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => {
                    onLanguageChange(entry.value);
                    handleOpenChange(false);
                  }}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-left text-body-small-regular transition-colors duration-150 ease-out hover:bg-control-hover',
                    isSelected ? 'bg-control-selected text-text-primary' : 'text-text-secondary',
                  )}
                >
                  <span className="truncate">{entry.label}</span>
                  {isSelected ? (
                    <Check aria-hidden="true" className="size-3.5 shrink-0 text-text-primary" />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export interface CodeBlockProps {
  /** Source code. Strings and numbers are joined; other nodes are ignored. */
  children: ReactNode;
  /** Language name or alias, such as typescript, ts, python or py. Detected when omitted. */
  language?: string;
  /** Shows a searchable language menu next to the copy button. */
  languagePicker?: Omit<CodeBlockLanguagePickerProps, 'language'>;
  /** Accessible label and tooltip of the copy button before copying. */
  copyLabel?: string;
  /** Accessible label and tooltip after a successful copy. */
  copiedLabel?: string;
  /** Toast message shown when the clipboard rejects the copy. */
  copyFailureMessage?: string;
  /** Additional classes for the outer wrapper. */
  className?: string;
  /** Additional classes for the scrolling pre panel, such as `max-h-60`. */
  preClassName?: string;
  /** Additional classes for the code element. */
  codeClassName?: string;
}

/** Syntax-highlighted code block with on-demand Shiki grammars, copy button, and optional language picker. */
function CodeBlock({
  children,
  language,
  languagePicker,
  copyLabel,
  copiedLabel,
  copyFailureMessage,
  className,
  preClassName,
  codeClassName,
}: CodeBlockProps) {
  const source = useMemo(() => extractSourceText(children), [children]);
  const resolvedLanguage = useMemo(
    () => normalizeLanguage(language) ?? detectLanguage(source),
    [language, source],
  );
  const highlightedLines = useHighlightedCode(source, resolvedLanguage);

  return (
    <CodeBlockFrame
      className={className}
      preClassName={preClassName}
      actions={
        <>
          {languagePicker ? (
            <CodeBlockLanguagePicker {...languagePicker} language={resolvedLanguage} />
          ) : null}
          <CodeBlockCopyButton
            text={source}
            language={resolvedLanguage}
            copyLabel={copyLabel}
            copiedLabel={copiedLabel}
            failureMessage={copyFailureMessage}
          />
        </>
      }
    >
      <code data-slot="code-block-code" className={cn('block min-w-max', codeClassName)}>
        {source
          ? highlightedLines.map((line, lineIndex) => {
              const isEmpty = line === '' || (Array.isArray(line) && line.length === 0);
              return (
                <span key={lineIndex} className="block min-h-[1lh]">
                  {isEmpty ? '\n' : line}
                </span>
              );
            })
          : null}
      </code>
    </CodeBlockFrame>
  );
}

export {
  CodeBlock,
  CodeBlockCopyButton,
  CodeBlockFrame,
  CodeBlockLanguagePicker,
};
