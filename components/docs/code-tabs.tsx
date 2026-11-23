'use client';

import type { ComponentProps } from 'react';
import {
  useConfig,
  type InstallationType,
} from '@/hooks/use-docs-preferences';
import {
  DocsTabs,
  DocsTabsIndicator,
  DocsTabsList,
  DocsTabsTrigger,
} from '@/components/docs/docs-tabs';
import { cn } from '@/lib/utils';

/** Synced installation method tabs (`cli` | `prompt` | `manual`) cloned from chanhdai.com. */
export function CodeTabs({
  className,
  ...props
}: ComponentProps<typeof DocsTabs>) {
  const [config, setConfig] = useConfig();
  const installationType = config.installationType || 'cli';

  return (
    <DocsTabs
      className={cn(
        'not-prose my-5 gap-0 **:data-[docs-code-figure]:last:mb-0',
        className,
      )}
      value={installationType}
      onValueChange={(value) => {
        setConfig((prev) => ({
          ...prev,
          installationType: value as InstallationType,
        }));
      }}
      {...props}
    />
  );
}

/** Standard `Command` / `Prompt` / `Manual` trigger bar for `<CodeTabs>`. */
export function TabsListInstallType({
  className,
  ...props
}: ComponentProps<typeof DocsTabsList>) {
  return (
    <DocsTabsList className={cn('mb-3', className)} {...props}>
      <DocsTabsTrigger value="cli">Command</DocsTabsTrigger>
      <DocsTabsTrigger value="prompt">Prompt</DocsTabsTrigger>
      <DocsTabsTrigger value="manual">Manual</DocsTabsTrigger>
      <DocsTabsIndicator />
    </DocsTabsList>
  );
}
