import registry from '@/registry.json';
import {
  CodeBlockCaption,
  CodeBlockFrame,
} from '@/components/docs/mdx-code-block';
import {
  collectInstallExpectations,
  formatFiles,
  formatTitleFromSlug,
  type RegistryItemEntry,
} from '@/lib/registry-docs';
import { registryNamespace, registryUrlTemplate, siteUrl } from '@/lib/shared';

export interface InstallPromptProps {
  /** Component slug or registry item name (e.g. `"button"`, `"active-bar"`). */
  name: string;
  /** Optional documentation page slug when different from `name`. */
  docSlug?: string;
  /** Optional human-readable title (defaults to registry `title` or title-cased `name`). */
  title?: string;
  /** Registry namespace prefix (defaults to `"@narakui"`). */
  namespace?: string;
  /** Explicit target files override. */
  files?: string[];
  /** Explicit npm packages override. */
  dependencies?: string[];
  /** Explicit registry dependencies override. */
  registryDependencies?: string[];
  /** Override whether CSS rules/variables are required. */
  hasCss?: boolean;
  /** Optional documentation URL appended to the prompt. */
  docsUrl?: string;
  /** Optional custom prompt override rendered verbatim. */
  prompt?: string;
}

/** Builds an AI-ready installation prompt backed by `registry.json`. */
export function buildInstallPrompt({
  name,
  docSlug,
  title,
  namespace = registryNamespace,
  files,
  dependencies,
  registryDependencies,
  hasCss,
  docsUrl,
}: Omit<InstallPromptProps, 'prompt'>): string {
  const items = registry.items as RegistryItemEntry[];
  const expected = collectInstallExpectations(name, namespace, items);

  const resolvedTitle =
    title ?? expected.rootItem?.title ?? formatTitleFromSlug(name);
  const resolvedFiles =
    files && files.length > 0
      ? files
      : expected.files.length > 0
        ? expected.files
        : [`components/ui/${name}.tsx`];
  const resolvedRegistryItems =
    registryDependencies ?? expected.registryItems;
  const resolvedPackages = dependencies ?? expected.packages;
  const resolvedHasCss = hasCss ?? expected.hasCss;
  const resolvedDocsUrl =
    docsUrl ?? `${siteUrl}/docs/components/${docSlug ?? name}`;
  const directItemUrl = `${siteUrl}/r/${name}.json`;

  const confirmLines = [
    'Confirm the CLI added (paths are relative to the aliases in components.json):',
    ...formatFiles(resolvedFiles).map((file) => `   - ${file}`),
    ...(expected.shadcnItems.length > 0
      ? [`   - shadcn/ui: ${expected.shadcnItems.join(', ')}`]
      : []),
    ...(resolvedRegistryItems.length > 0
      ? [`   - Registry items: ${resolvedRegistryItems.join(', ')}`]
      : []),
    ...(resolvedPackages.length > 0
      ? [`   - npm packages: ${resolvedPackages.join(', ')}`]
      : []),
    ...(resolvedHasCss
      ? ['   - CSS rules or variables in the CSS file from components.json']
      : []),
  ];

  const steps: string[][] = [
    [
      'Check the project setup:',
      "   - components.json must exist at the project root. If it doesn't, stop and ask me before running `shadcn init`.",
      '   - The project must use Tailwind CSS v4. If it uses v3, stop and tell me.',
    ],
    [
      "Run this with the project's package manager (npx, pnpm dlx, yarn dlx or bunx):",
      `   shadcn@latest add ${directItemUrl}`,
      `   (Or use \`${namespace}/${name}\` if \`"${namespace}": "${registryUrlTemplate}"\` is already configured under \`"registries"\` in components.json.)`,
      '   If the CLI asks to overwrite a file, answer no and tell me which file.',
    ],
    confirmLines,
    ['Run the project type check and fix only errors in the files above.'],
    [
      `Read ${resolvedDocsUrl} for usage and props, then tell me what was installed.`,
    ],
  ];

  return [
    `Install ${resolvedTitle} from the ${namespace} shadcn registry into this project.`,
    ...steps.map((lines, index) => `${index + 1}. ${lines.join('\n')}`),
  ].join('\n\n');
}

/** AI-ready installation prompt code block backed by `registry.json`. */
export function InstallPrompt({ prompt, ...options }: InstallPromptProps) {
  const resolvedPrompt = prompt ?? buildInstallPrompt(options);

  if (!resolvedPrompt) return null;

  return (
    <figure data-docs-code-figure="" dir="ltr" className="not-prose">
      <CodeBlockCaption data-language="md">Prompt</CodeBlockCaption>

      <CodeBlockFrame code={resolvedPrompt} hasTitle>
        <pre className="scrollbar-custom max-h-[600px] overflow-auto px-4 py-3.5 text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap text-text-secondary outline-none">
          <code className="font-mono">{resolvedPrompt}</code>
        </pre>
      </CodeBlockFrame>
    </figure>
  );
}
