import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { highlight, type HighlightOptions } from 'fumadocs-core/highlight';
import { CodeCollapsibleWrapper } from '@/components/docs/code-collapsible-wrapper';
import {
  CodeBlockCaption,
  CodeBlockFrame,
} from '@/components/docs/mdx-code-block';
import { cn } from '@/lib/utils';

export interface ComponentSourceProps {
  /** Component slug resolved to `components/ui/<name>.tsx` when `src` is omitted. */
  name?: string;
  /** Workspace-relative path to the source file (e.g. `"lib/utils.ts"`). */
  src?: string;
  /** Optional caption header displayed above the code frame. */
  title?: string;
  /** Collapses tall source files behind an Expand overlay (`"auto"` collapses files over 30 lines). @default "auto" */
  collapsible?: 'true' | 'false' | 'auto' | boolean;
  className?: string;
}

const AUTO_COLLAPSE_LINE_THRESHOLD = 30;

/** Server component rendering a workspace source file in the redesigned docs code frame. */
export async function ComponentSource({
  name,
  src,
  title,
  collapsible = 'auto',
  className,
}: ComponentSourceProps) {
  const relativeTarget = src ?? (name ? `components/ui/${name}.tsx` : undefined);
  if (!relativeTarget) return null;

  const rootDir = path.resolve(/*turbopackIgnore: true*/ process.cwd());
  const resolvedPath = path.resolve(/*turbopackIgnore: true*/ rootDir, relativeTarget);
  const relativePath = path.relative(rootDir, resolvedPath);

  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    return null;
  }

  let code: string;
  try {
    code = (await readFile(resolvedPath, 'utf8')).trimEnd();
  } catch {
    return null;
  }

  const ext = path.extname(relativeTarget).slice(1) || 'tsx';
  const lang = ext as HighlightOptions['lang'];
  const rendered = await highlight(code, {
    lang,
    components: {
      pre: ({ className: preClassName, style: _style, ...preProps }) => (
        <pre
          tabIndex={0}
          className={cn(
            'scrollbar-custom max-h-[600px] overflow-auto overscroll-x-contain py-3.5 text-[13px] leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
            preClassName,
          )}
          {...preProps}
        />
      ),
    },
  });

  const content = (
    <figure data-docs-code-figure="" dir="ltr" className="not-prose">
      {title ? (
        <CodeBlockCaption data-language={ext}>{title}</CodeBlockCaption>
      ) : null}

      <CodeBlockFrame code={code} hasTitle={Boolean(title)}>
        {rendered}
      </CodeBlockFrame>
    </figure>
  );

  const isCollapsible =
    collapsible === 'auto'
      ? code.split('\n').length > AUTO_COLLAPSE_LINE_THRESHOLD
      : collapsible !== false && collapsible !== 'false';
  if (!isCollapsible) {
    return <div className={className}>{content}</div>;
  }

  return (
    <CodeCollapsibleWrapper className={className}>{content}</CodeCollapsibleWrapper>
  );
}
