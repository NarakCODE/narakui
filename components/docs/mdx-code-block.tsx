import {
  Children,
  isValidElement,
  type ComponentProps,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { CodeBlockCommand } from '@/components/docs/code-block-command';
import { DocsCopyButton } from '@/components/docs/copy-button';
import { getIconForLanguageExtension } from '@/components/docs/mdx-icons';
import { parseNpmCommands } from '@/lib/parse-npm-commands';

/** Recursively extracts plain text from Shiki/React code AST children. */
function extractText(node: ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractText).join('');
  }
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return extractText(node.props.children);
  }
  return '';
}

function inferLanguage(
  props: Record<string, unknown>,
  children: ReactNode,
  title?: string,
): string | undefined {
  const direct =
    typeof props['data-language'] === 'string' ? props['data-language'] : undefined;
  if (direct) return direct;

  const childArray = Children.toArray(children);
  const firstChild = childArray[0];
  if (isValidElement<{ className?: string; 'data-language'?: string }>(firstChild)) {
    if (typeof firstChild.props['data-language'] === 'string') {
      return firstChild.props['data-language'];
    }
    const langMatch = firstChild.props.className?.match(/language-([a-z0-9_-]+)/i);
    if (langMatch) return langMatch[1];
  }

  if (title) {
    const ext = title.split('.').pop();
    if (ext && ext !== title) return ext;
  }

  return undefined;
}

/** Code block caption header displaying the language/file icon and title. */
export function CodeBlockCaption({
  children,
  className,
  ...props
}: ComponentProps<'figcaption'> & { 'data-language'?: string }) {
  const iconExtension =
    typeof props['data-language'] === 'string'
      ? getIconForLanguageExtension(props['data-language'])
      : null;

  return (
    <figcaption
      data-docs-code-title=""
      className={cn(
        'flex items-center gap-2.5 py-2.5 pr-9 pl-3 font-mono text-body-mini-medium text-text-secondary [&_svg]:size-3.5 [&_svg]:shrink-0 [&_svg]:text-text-secondary',
        className,
      )}
      {...props}
    >
      {iconExtension}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </figcaption>
  );
}

/** Nested recessed frame around a `<pre>` block with hover-revealed or title-bar copy button. */
export function CodeBlockFrame({
  code,
  hasTitle = false,
  className,
  children,
}: {
  code?: string;
  hasTitle?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      data-slot="code-block-frame"
      className={cn(
        'group/pre relative rounded-[9px] border border-border bg-bg-primary',
        code && !hasTitle && '[--code-padding-right:4rem]',
        className,
      )}
    >
      {children}

      {code ? (
        <>
          <DocsCopyButton
            className={cn(
              'absolute z-10 size-7',
              hasTitle
                ? '-top-8.5 right-1 rounded-md'
                : 'top-2 right-2 rounded-[6px] bg-bg-primary/90 opacity-0 backdrop-blur-xs focus-visible:opacity-100 group-hover/pre:opacity-100 [@media(hover:none)]:opacity-100',
            )}
            text={code}
          />

          {!hasTitle ? (
            <div
              aria-hidden="true"
              data-fade-overlay=""
              className="top-1 right-1 opacity-0 transition-opacity duration-150 ease-out group-hover/pre:opacity-100 motion-reduce:transition-none"
              style={{ '--fade-color': 'var(--bg-primary)' } as CSSProperties}
            />
          ) : null}
        </>
      ) : null}
    </div>
  );
}

export interface MdxPreProps extends ComponentProps<'pre'> {
  title?: string;
  icon?: ReactNode;
  allowCopy?: boolean | 'true' | 'false';
  keepBackground?: boolean;
  'data-language'?: string;
}

/** Redesigned Fumadocs `pre` replacement cloned from chanhdai.com's code-block architecture. */
export function MdxPre({
  title,
  icon: _icon,
  allowCopy = true,
  keepBackground: _keepBackground,
  className,
  style: _style,
  children,
  ...props
}: MdxPreProps) {
  const rawCode = extractText(children).replace(/\n$/, '');
  const language = inferLanguage(props as Record<string, unknown>, children, title);
  const canCopy = allowCopy !== false && allowCopy !== 'false';

  const isShellLike =
    !title &&
    (language === undefined ||
      ['bash', 'sh', 'shell', 'zsh', 'shellscript', 'console', 'text'].includes(
        language.toLowerCase(),
      ));
  const npmCommands = isShellLike ? parseNpmCommands(rawCode) : null;

  if (npmCommands) {
    return (
      <figure data-docs-code-figure="" className="not-prose">
        <CodeBlockCommand
          pnpm={npmCommands.pnpm}
          yarn={npmCommands.yarn}
          npm={npmCommands.npm}
          bun={npmCommands.bun}
        />
      </figure>
    );
  }

  return (
    <figure data-docs-code-figure="" dir="ltr" className="not-prose">
      {title ? (
        <CodeBlockCaption data-language={language}>{title}</CodeBlockCaption>
      ) : null}

      <CodeBlockFrame code={canCopy ? rawCode : undefined} hasTitle={Boolean(title)}>
        <pre
          tabIndex={0}
          className={cn(
            'scrollbar-custom max-h-[600px] overflow-auto overscroll-x-contain py-3.5 text-[13px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
            className,
          )}
          {...props}
        >
          {children}
        </pre>
      </CodeBlockFrame>
    </figure>
  );
}
