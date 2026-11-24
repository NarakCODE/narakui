'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Check, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { registryNamespace, registryUrlTemplate, siteUrl } from '@/lib/shared';
import { cn } from '@/lib/utils';

type CopyState = 'idle' | 'done' | 'error';

export type FrameworkId = 'nextjs' | 'vite' | 'react-router' | 'astro';

interface FrameworkOption {
  id: FrameworkId;
  label: string;
  prompt: string;
}

const GEIST_ROUNDED_WOFF2_URL =
  'https://mishanaer.com/ui/geist-rounded/fonts/GeistRounded.woff2';

const DEFAULT_FONT_STEP = [
  '4. Use Geist Rounded as the main interface font in this project. Download and self-host the variable WOFF2 file:',
  `   ${GEIST_ROUNDED_WOFF2_URL}`,
  '   Load it with @font-face: font-family "Geist Rounded", font-weight 100 900, font-style normal and font-display swap, then set --font-geist-rounded: "Geist Rounded" in your global CSS.',
].join('\n');

const NEXTJS_FONT_STEP = [
  '4. Use Geist Rounded as the main interface font in this project. Download and self-host the variable WOFF2 file:',
  `   ${GEIST_ROUNDED_WOFF2_URL}`,
  '   Load it with next/font/local (weight "100 900", style "normal", display "swap", variable "--font-geist-rounded") alongside Geist_Mono from next/font/google (variable "--font-geist-mono"), and apply both variables on <html>.',
].join('\n');

const DEFAULT_AGENTS_NOTE =
  `5. Add a note to AGENTS.md, creating it if needed: always import \`cn\` from \`@/lib/utils\` (never \`"cn"\` directly), use NarakUI design tokens from the theme, and read ${siteUrl}/llms.txt before adding or customizing components.`;

const FONT_SETUP_PROMPT = [
  'Use Geist Rounded as the main interface font in this project. Download and self-host the variable WOFF2 file:',
  GEIST_ROUNDED_WOFF2_URL,
  '',
  'Load it with @font-face: font-family "Geist Rounded", font-weight 100 900, font-style normal and font-display swap. For Next.js, use next/font/local instead.',
].join('\n');

function buildSetupPrompt({
  intro,
  step1,
  step4 = DEFAULT_FONT_STEP,
  step5 = DEFAULT_AGENTS_NOTE,
}: {
  intro: string;
  step1: string;
  step4?: string;
  step5?: string;
}): string {
  return [
    intro,
    '',
    `1. ${step1}`,
    `2. Add "${registryNamespace}": "${registryUrlTemplate}" under "registries" in components.json.`,
    `3. Install the base theme and utilities with the project's package manager:`,
    `   shadcn@latest add ${registryNamespace}/theme ${registryNamespace}/utils`,
    step4,
    step5,
  ].join('\n');
}

const FRAMEWORKS: readonly FrameworkOption[] = [
  {
    id: 'nextjs',
    label: 'Next.js',
    prompt: buildSetupPrompt({
      intro:
        'Set up NarakUI in this Next.js project. It requires React 19 and Tailwind CSS v4.',
      step1:
        'Confirm components.json exists at the project root with "rsc": true and Tailwind CSS v4 configured. If it doesn\'t, stop and ask me before running `shadcn init`.',
      step4: NEXTJS_FONT_STEP,
    }),
  },
  {
    id: 'vite',
    label: 'Vite',
    prompt: buildSetupPrompt({
      intro:
        'Set up NarakUI in this Vite React project. It requires React 19 and Tailwind CSS v4 (@tailwindcss/vite).',
      step1:
        'Confirm @/ path aliases are configured in tsconfig.json and vite.config.ts, and components.json exists at the project root with Tailwind CSS v4. If it doesn\'t, stop and ask me before running `shadcn init`.',
    }),
  },
  {
    id: 'react-router',
    label: 'React Router',
    prompt: buildSetupPrompt({
      intro:
        'Set up NarakUI in this React Router project. It requires React 19 and Tailwind CSS v4.',
      step1:
        'Confirm @/ path aliases and Tailwind CSS v4 are configured, and components.json exists at the project root. If it doesn\'t, stop and ask me before running `shadcn init`.',
    }),
  },
  {
    id: 'astro',
    label: 'Astro',
    prompt: buildSetupPrompt({
      intro:
        'Set up NarakUI in this Astro project. It requires @astrojs/react (React 19) and Tailwind CSS v4.',
      step1:
        'Confirm @astrojs/react, Tailwind CSS v4, and components.json are configured at the project root. If components.json is missing, stop and ask me before running `shadcn init`.',
      step5: `5. Add a note to AGENTS.md, creating it if needed: always import \`cn\` from \`@/lib/utils\` (never \`"cn"\` directly), hydrate interactive NarakUI islands with client:load, and read ${siteUrl}/llms.txt before adding components.`,
    }),
  },
];

const EXAMPLE_PROMPT = `Add ${registryNamespace}/search-field and ${registryNamespace}/button from the ${registryNamespace} registry and build a toolbar with a search input (showing a Clear button only when there's text) and a primary action button using NarakUI tokens.`;

function CopyPromptButton({ text }: { text: string }) {
  const [state, setState] = useState<CopyState>('idle');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState('done');
    } catch {
      setState('error');
    }

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setState('idle');
      timerRef.current = null;
    }, 1500);
  };

  const label =
    state === 'done'
      ? 'Copied'
      : state === 'error'
        ? 'Copy Failed'
        : 'Copy Prompt';

  return (
    <Button
      type="button"
      mode="secondary"
      size="small"
      aria-live="polite"
      iconStart={
        state === 'done' ? (
          <Check aria-hidden="true" className="size-3.5" />
        ) : (
          <Copy aria-hidden="true" className="size-3.5 text-text-secondary" />
        )
      }
      onClick={() => {
        void handleCopy();
      }}
      className="min-w-[104px] cursor-pointer"
    >
      {label}
    </Button>
  );
}

export interface QuickStartPromptCardProps {
  /** Content displayed on the left side of the prompt header bar. */
  header: ReactNode;
  /** Prompt text displayed in the card body and copied to the clipboard. */
  prompt: string;
  /** Optional class names merged onto the outer card element. */
  className?: string;
}

/** Framed prompt card with a header bar, copy action, and monospaced prompt body. */
export function QuickStartPromptCard({
  header,
  prompt,
  className,
}: QuickStartPromptCardProps) {
  return (
    <div
      className={cn(
        'not-prose my-4 overflow-hidden rounded-lg border border-border-gray bg-bg-primary',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-border-gray bg-bg-secondary/40 px-3 py-2">
        <div className="flex min-w-0 items-center">{header}</div>
        <CopyPromptButton text={prompt} />
      </div>

      <pre className="scrollbar-custom m-0 overflow-x-auto bg-transparent px-4 py-4 font-mono text-[13px] leading-relaxed wrap-break-word whitespace-pre-wrap text-text-primary outline-none">
        <code>{prompt}</code>
      </pre>
    </div>
  );
}

/** Interactive setup prompt card with a React framework selector for NarakUI. */
export function QuickStartSetupPrompt() {
  const [framework, setFramework] = useState<FrameworkId>('nextjs');
  const selected =
    FRAMEWORKS.find((item) => item.id === framework) ?? FRAMEWORKS[0];

  return (
    <QuickStartPromptCard
      header={
        <DropdownMenu>
          <DropdownMenuTrigger
            buttonWithChevron
            mode="secondary"
            size="small"
            aria-label="Select framework"
            className="cursor-pointer"
          >
            {selected.label}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" sideOffset={6} size={168}>
            <DropdownMenuRadioGroup
              value={framework}
              onValueChange={(value) => setFramework(value as FrameworkId)}
            >
              {FRAMEWORKS.map((item) => (
                <DropdownMenuRadioItem key={item.id} value={item.id}>
                  {item.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      }
      prompt={selected.prompt}
    />
  );
}

/** Follow-up prompt card demonstrating how to ask an agent to add and compose NarakUI components. */
export function QuickStartExamplePrompt() {
  return (
    <QuickStartPromptCard
      header={
        <span className="px-1 text-body-small-regular text-text-secondary">
          Prompt
        </span>
      }
      prompt={EXAMPLE_PROMPT}
    />
  );
}

/** Standalone prompt card for self-hosting and wiring Geist Rounded. */
export function QuickStartFontPrompt() {
  return (
    <QuickStartPromptCard
      header={
        <span className="px-1 text-body-small-regular text-text-secondary">
          Font Prompt
        </span>
      }
      prompt={FONT_SETUP_PROMPT}
    />
  );
}
