import { existsSync } from 'node:fs';
import path from 'node:path';
import { FastLink } from '@/components/fast-link';
import registry from '@/registry.json';
import { CodeBlockCommand } from '@/components/docs/code-block-command';
import { CodeTabs, TabsListInstallType } from '@/components/docs/code-tabs';
import { ComponentSource } from '@/components/docs/component-source';
import { DocsTabsContent } from '@/components/docs/docs-tabs';
import { InstallPrompt } from '@/components/docs/install-prompt';
import { Step, Steps } from '@/components/docs/mdx-extras';
import {
  collectInstallExpectations,
  type RegistryItemEntry,
} from '@/lib/registry-docs';
import { registryNamespace, registryUrlTemplate, siteUrl } from '@/lib/shared';

export interface ComponentInstallationProps {
  /** Registry item name (e.g. `"button"`, `"empty-state"`). */
  name: string;
  /** Optional documentation page slug when different from `name` (e.g. `"empty-and-error-states"`). */
  docSlug?: string;
  /** Registry namespace prefix (defaults to `"@narakui"`). */
  namespace?: string;
}

const DOC_SLUG_OVERRIDES: Record<string, string> = {
  'empty-state': 'empty-and-error-states',
};

const INLINE_CODE_CLASS =
  'rounded bg-bg-secondary px-1.5 py-0.5 font-mono text-[12px] text-text-primary ring-1 ring-inset ring-border';

function getDocumentedComponentSlug(depName: string): string | null {
  const candidate = DOC_SLUG_OVERRIDES[depName] ?? depName;
  const docPath = path.join(
    /*turbopackIgnore: true*/ process.cwd(),
    'content/docs/components',
    `${candidate}.mdx`,
  );
  return existsSync(docPath) ? candidate : null;
}

function getListSeparator(index: number, total: number): string {
  if (index === 0) return '';
  if (total === 2) return ' and ';
  return index === total - 1 ? ', and ' : ', ';
}

/** Dynamic installation tabs (`Command` / `Prompt` / `Manual`) driven by `registry.json`. */
export function ComponentInstallation({
  name,
  docSlug,
  namespace = registryNamespace,
}: ComponentInstallationProps) {
  const items = registry.items as RegistryItemEntry[];
  const expected = collectInstallExpectations(name, namespace, items);
  const files =
    expected.files.length > 0 ? expected.files : [`components/ui/${name}.tsx`];
  const directItemUrl = `${siteUrl}/r/${name}.json`;

  return (
    <CodeTabs>
      <TabsListInstallType />

      <DocsTabsContent value="cli">
        <figure data-docs-code-figure="" className="not-prose my-0">
          <CodeBlockCommand
            command={`npx shadcn@latest add ${directItemUrl}`}
          />
        </figure>
        <p className="mt-3 text-body-small-regular text-text-secondary">
          Optional: add{' '}
          <code className={INLINE_CODE_CLASS}>
            &quot;{namespace}&quot;: &quot;{registryUrlTemplate}&quot;
          </code>{' '}
          under <code className={INLINE_CODE_CLASS}>&quot;registries&quot;</code>{' '}
          in <code className={INLINE_CODE_CLASS}>components.json</code> to use
          the shorter{' '}
          <code className={INLINE_CODE_CLASS}>
            {namespace}/{name}
          </code>{' '}
          alias.
        </p>
      </DocsTabsContent>

      <DocsTabsContent value="prompt">
        <InstallPrompt name={name} docSlug={docSlug} namespace={namespace} />
      </DocsTabsContent>

      <DocsTabsContent value="manual">
        <Steps>
          {expected.packages.length > 0 ? (
            <>
              <Step>Install the following dependencies</Step>
              <figure data-docs-code-figure="" className="not-prose">
                <CodeBlockCommand
                  command={`npm install ${expected.packages.join(' ')}`}
                />
              </figure>
            </>
          ) : null}

          {expected.needsUtils ? (
            <>
              <Step>Add a cn helper</Step>
              <ComponentSource
                src="lib/utils.ts"
                title="lib/utils.ts"
                collapsible="false"
              />
            </>
          ) : null}

          {expected.uiDependencies.length > 0 ? (
            <>
              <Step>Install prerequisite components</Step>
              <p className="my-3 text-body-small-regular text-text-secondary">
                Install{' '}
                {expected.uiDependencies.map((dep, index) => {
                  const targetSlug = getDocumentedComponentSlug(dep.name);
                  const separator = getListSeparator(
                    index,
                    expected.uiDependencies.length,
                  );

                  return (
                    <span key={dep.name}>
                      {separator}
                      {targetSlug ? (
                        <FastLink
                          href={`/docs/components/${targetSlug}`}
                          className="font-medium text-text-primary underline decoration-border underline-offset-4 transition-colors hover:decoration-text-primary"
                        >
                          {dep.title}
                        </FastLink>
                      ) : (
                        <code className={INLINE_CODE_CLASS}>
                          components/ui/{dep.name}.tsx
                        </code>
                      )}
                    </span>
                  );
                })}{' '}
                before adding this component.
              </p>
            </>
          ) : null}

          {expected.supportingFiles.length > 0 ? (
            <>
              <Step>Add supporting files</Step>
              {expected.supportingFiles.map((file) => (
                <ComponentSource
                  key={file}
                  src={file}
                  title={file}
                  collapsible="auto"
                />
              ))}
            </>
          ) : null}

          <Step>Copy and paste the following code into your project</Step>
          {files.map((file) => (
            <ComponentSource key={file} src={file} title={file} />
          ))}

          <Step>Update the import paths to match your project setup</Step>
          {expected.hasCss ? (
            <>
              <Step>Add the NarakUI theme tokens</Step>
              <p className="my-3 text-body-small-regular text-text-secondary">
                Install the NarakUI design tokens (light/dark colors, typography
                scale, shadows, and animations) into your Tailwind CSS v4
                stylesheet, or review them in{' '}
                <FastLink
                  href="/docs#design-tokens"
                  className="font-medium text-text-primary underline decoration-border underline-offset-4 transition-colors hover:decoration-text-primary"
                >
                  Design Tokens
                </FastLink>
                .
              </p>
              <figure data-docs-code-figure="" className="not-prose">
                <CodeBlockCommand
                  command={`npx shadcn@latest add ${siteUrl}/r/theme.json`}
                />
              </figure>
            </>
          ) : null}
        </Steps>
      </DocsTabsContent>
    </CodeTabs>
  );
}
