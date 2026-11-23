'use client';

import { useMemo } from 'react';
import {
  usePackageManager,
  type PackageManager,
} from '@/hooks/use-docs-preferences';
import {
  DocsTabs,
  DocsTabsContent,
  DocsTabsIndicator,
  DocsTabsList,
  DocsTabsTrigger,
} from '@/components/docs/docs-tabs';
import { DocsCopyButton } from '@/components/docs/copy-button';
import { getIconForPackageManager } from '@/components/docs/mdx-icons';
import {
  parseNpmCommands,
  type NpmCommandSet,
} from '@/lib/parse-npm-commands';

export interface CodeBlockCommandProps {
  /** Single command string to auto-expand into pnpm/yarn/npm/bun. */
  command?: string;
  pnpm?: string;
  yarn?: string;
  npm?: string;
  bun?: string;
}

/** Multi-package-manager command block cloned from chanhdai.com, styled with Rakfound tokens. */
export function CodeBlockCommand({
  command,
  pnpm,
  yarn,
  npm,
  bun,
}: CodeBlockCommandProps) {
  const [packageManager, setPackageManager] = usePackageManager();

  const tabs = useMemo<NpmCommandSet>(() => {
    const parsed = command ? parseNpmCommands(command) : null;
    return {
      pnpm: pnpm ?? parsed?.pnpm ?? command ?? '',
      yarn: yarn ?? parsed?.yarn ?? command ?? '',
      npm: npm ?? parsed?.npm ?? command ?? '',
      bun: bun ?? parsed?.bun ?? command ?? '',
    };
  }, [command, pnpm, yarn, npm, bun]);

  return (
    <div data-slot="code-block-command" className="relative">
      <DocsTabs
        className="gap-0"
        value={packageManager}
        onValueChange={(value) => {
          setPackageManager(value as PackageManager);
        }}
      >
        <div className="px-3">
          <DocsTabsList className="h-10 rounded-none bg-transparent p-0 ring-0 dark:bg-transparent [&_svg]:size-4 [&_svg]:text-text-secondary">
            <span
              key={packageManager}
              className="mr-2 inline-flex size-4 shrink-0 items-center justify-center text-text-secondary animate-in fade-in-0 zoom-in-95 duration-150 ease-out motion-reduce:animate-none"
            >
              {getIconForPackageManager(packageManager)}
            </span>

            {(Object.keys(tabs) as PackageManager[]).map((key) => (
              <DocsTabsTrigger
                key={key}
                value={key}
                className="h-7 rounded-lg px-2 py-0 font-mono text-body-mini-medium"
              >
                {key}
              </DocsTabsTrigger>
            ))}

            <DocsTabsIndicator className="h-0.5 translate-y-px rounded-none bg-text-primary shadow-none dark:bg-text-primary" />
          </DocsTabsList>
        </div>

        {(Object.entries(tabs) as [PackageManager, string][]).map(([key, value]) => (
          <DocsTabsContent key={key} value={key}>
            <div className="rounded-[9px] border border-border bg-bg-primary">
              <pre className="scrollbar-custom overflow-x-auto overscroll-x-contain py-3.5 leading-5 outline-none">
                <code
                  data-slot="code-block"
                  data-language="bash"
                  data-line=""
                  className="block px-4 font-mono text-[13px] leading-5 text-text-secondary"
                >
                  {value}
                </code>
              </pre>
            </div>
          </DocsTabsContent>
        ))}
      </DocsTabs>

      <DocsCopyButton
        className="absolute top-1.5 right-0.5 z-10 size-7 rounded-md"
        text={tabs[packageManager] || ''}
      />
    </div>
  );
}
