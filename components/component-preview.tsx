import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { ReactNode } from 'react';
import type { HighlightOptions } from 'fumadocs-core/highlight';
import { ServerCodeBlock } from 'fumadocs-ui/components/codeblock.rsc';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { DotGridSpotlight } from '@/components/dot-grid-spotlight';
import { cn } from '@/lib/utils';

export interface ComponentPreviewProps {
  /** Rendered component example displayed in the Preview stage. */
  children: ReactNode;
  /** Optional inline source code shown in the Code tab. */
  code?: string;
  /** Optional workspace-relative file path read on the server for the Code tab. */
  file?: string;
  /** Shiki language identifier used to highlight the Code tab. */
  lang?: HighlightOptions['lang'];
  /** Optional title passed to the highlighted code block header. */
  title?: string;
  /** Additional classes applied to the preview stage container. */
  className?: string;
}

async function loadExampleSource(file: string): Promise<{ source?: string; error?: string }> {
  const rootDir = path.resolve(/*turbopackIgnore: true*/ process.cwd());
  const resolvedPath = path.resolve(/*turbopackIgnore: true*/ rootDir, file);
  const relativePath = path.relative(rootDir, resolvedPath);

  // Reject path traversal outside the workspace root.
  if (relativePath.startsWith('..') || path.isAbsolute(relativePath)) {
    throw new Error(`ComponentPreview file path "${file}" must stay inside the workspace root.`);
  }

  try {
    const source = await readFile(resolvedPath, 'utf8');
    return { source: source.trimEnd() };
  } catch {
    return { error: `Unable to read source file "${file}".` };
  }
}

/** Displays a live component preview on an interactive dot-grid stage with an optional Code tab. */
export async function ComponentPreview({
  children,
  code,
  file,
  lang = 'tsx',
  title,
  className,
}: ComponentPreviewProps) {
  const fileResult = code === undefined && file ? await loadExampleSource(file) : undefined;
  const sourceCode = code !== undefined ? code.trimEnd() : fileResult?.source;
  const fileError = fileResult?.error;

  const hasCodeTab = sourceCode !== undefined || Boolean(fileError);

  const previewStage = (
    <div
      data-slot="component-preview-stage"
      className={cn(
        'not-prose relative isolate flex min-h-[240px] w-full items-center justify-center overflow-hidden bg-bg-primary p-8',
        !hasCodeTab && 'rounded-xl border border-border',
        className,
      )}
    >
      <DotGridSpotlight />
      {children}
    </div>
  );

  if (!hasCodeTab) {
    return previewStage;
  }

  return (
    <Tabs items={['Preview', 'Code']}>
      <Tab value="Preview" className="overflow-hidden p-0">
        {previewStage}
      </Tab>
      <Tab value="Code">
        {fileError ? (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
            {fileError}
          </div>
        ) : (
          <ServerCodeBlock
            code={sourceCode ?? ''}
            lang={lang}
            codeblock={title ? { title } : undefined}
          />
        )}
      </Tab>
    </Tabs>
  );
}
