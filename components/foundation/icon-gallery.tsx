'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Check, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group';
import { NarakUILogo, NarakUIMark } from '@/components/narak-logo';
import { cn } from '@/lib/utils';

const NUCLEO_ICONS = [
  'abstract-intersection',
  'analytics',
  'app-stack',
  'arrow-bold-down',
  'arrow-bold-left',
  'arrow-bold-right',
  'arrow-bold-up',
  'arrows-bold-opposite-direction',
  'arrows-converge',
  'arrows-infinity',
  'astronaut',
  'atomic-orbits',
  'award-certificate',
  'award',
  'badge-sparkle',
  'ball-crystal',
  'ban',
  'bell',
  'beverage',
  'bolt',
  'book-open',
  'bookmark',
  'bookmarks',
  'bot-2',
  'bot-3',
  'bot',
  'box-archive',
  'box-caret-down',
  'box-caret-left',
  'box-caret-right',
  'box-caret-up',
  'box',
  'brightness-increase',
  'bug',
  'bullet-list',
  'button',
  'calendar',
  'camera',
  'car-front',
  'card-favorites',
  'caret-maximize-diagonal',
  'caret-minimize-diagonal',
  'carrot',
  'cart',
  'chair',
  'chart-bar',
  'cheeseburger',
  'chocolate-mousse',
  'circle-arrow-down',
  'circle-arrow-left',
  'circle-arrow-right',
  'circle-arrow-up',
  'circle-chart-line',
  'circle-check',
  'circle-coin',
  'circle-copy-plus',
  'circle-dots-vertical',
  'circle-dots',
  'circle-info',
  'circle-power-off',
  'circle-question',
  'circle-square',
  'circle-wrench',
  'circles',
  'clipboard-check',
  'clipboard-lock',
  'clipboard',
  'cloud-bolt',
  'cloud-download',
  'cloud-moon',
  'cloud-sun',
  'cloud-upload',
  'code-editor',
  'coffee',
  'color-palette',
  'computer-download',
  'computer-upload',
  'connect',
  'connections',
  'copies',
  'credit-cards',
  'crosshairs',
  'crown',
  'cube',
  'delete-key',
  'delete-x',
  'dial',
  'doc-folder',
  'dots-vertical',
  'dots',
  'duplicate-plus',
  'duplicate',
  'earbuds',
  'earth',
  'envelope-content',
  'envelope',
  'expand-window',
  'eye-closed',
  'eye',
  'face-grin',
  'face-mustache',
  'face-worried',
  'feather-sparkle',
  'feather',
  'file-download',
  'file-upload',
  'file',
  'files',
  'flag',
  'flame',
  'floating-sphere',
  'flower-2',
  'flower',
  'folder-content',
  'folder-search',
  'folder',
  'folders',
  'gauge',
  'gear-keyhole',
  'gear',
  'ghost',
  'greek-temple',
  'grid-2',
  'grid-circle',
  'grid',
  'hammer',
  'headphones',
  'heart',
  'hearts',
  'help-chat',
  'house',
  'ice-cream-2',
  'ice-cream',
  'image-depth',
  'image',
  'inbox',
  'input-password',
  'jelly',
  'joystick-cross',
  'key',
  'keyboard',
  'knife-spoon',
  'laptop-mobile',
  'laptop',
  'layers',
  'leaves',
  'link',
  'loader-2',
  'loader',
  'location',
  'lock',
  'magic-wand-sparkle',
  'magnifier',
  'medal',
  'medicine',
  'money-bill',
  'monitor-setting',
  'monitor',
  'moon-cloud-showers',
  'move-down-right-2',
  'move-down-right',
  'move-up-left',
  'msgs',
  'note-sparkle',
  'note',
  'nut',
  'open-in-browser',
  'paper-plane',
  'pen',
  'pharmacy',
  'phone',
  'picnic-basket',
  'pin',
  'popsicle',
  'press',
  'printer',
  'progress-bar',
  'progress-circle',
  'progress-complete',
  'rect-layout-grid',
  'refresh',
  'roadmap',
  'rocket',
  'ruler-pen',
  'salad',
  'sausage',
  'saved-items',
  'scissors-sparkle',
  'scissors',
  'settings-wrench',
  'shapes',
  'shopping',
  'sidebar-left-hide',
  'sidebar-left-show',
  'signal',
  'sitemap',
  'slider',
  'sliders-vertical',
  'sparkle-2',
  'sparkle-3',
  'sparkle-4',
  'sparkle',
  'sphere-half',
  'sphere',
  'square-chart-line',
  'square-feather',
  'square-grid-2',
  'square-grid',
  'square-kanban',
  'square-pointer',
  'ssd',
  'stack-music',
  'stack-perspective',
  'stack-play',
  'star-sparkle',
  'star',
  'steps-indicator',
  'storage',
  'strawberry',
  'suitcase',
  'sun-cloud-showers',
  'swap',
  'tab-close',
  'tab-open',
  'tabs',
  'tasks',
  'team',
  'telescope-tripod',
  'thinking-head',
  'thumbs-up',
  'tile-to-bottom',
  'timeline-vertical',
  'timeline',
  'toggle',
  'tree-2',
  'tree',
  'triangle-warning',
  'trophy',
  'ufo',
  'user-msg',
  'user',
  'users',
  'video',
  'vr-controller',
  'wallet-content',
  'webcam',
  'window-2',
  'window',
  'wrench-screwdriver',
] as const;

type CopyFormat = 'name' | 'import' | 'jsx';

function toPascalCase(name: string) {
  return name
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

function getCopySnippet(name: string, format: CopyFormat) {
  switch (format) {
    case 'name':
      return name;
    case 'import':
      return `import ${toPascalCase(name)}Icon from '@/public/nucleo/${name}.svg';`;
    case 'jsx':
      return `<img src="/nucleo/${name}.svg" alt="" width={24} height={24} className="size-6" />`;
  }
}

const svgMarkupCache = new Map<string, string>();
const svgRequestCache = new Map<string, Promise<string>>();

function loadNucleoSvg(name: string): Promise<string> {
  const cached = svgMarkupCache.get(name);
  if (cached) return Promise.resolve(cached);

  const pending = svgRequestCache.get(name);
  if (pending) return pending;

  const request = fetch(`/nucleo/${name}.svg?v=system-2`, { cache: 'no-cache' })
    .then((response) => (response.ok ? response.text() : ''))
    .then((text) => {
      const normalized = text.trim();
      if (normalized.startsWith('<svg')) {
        svgMarkupCache.set(name, normalized);
        return normalized;
      }
      return '';
    })
    .catch(() => '')
    .finally(() => {
      svgRequestCache.delete(name);
    });

  svgRequestCache.set(name, request);
  return request;
}

function NucleoIcon({ name }: { name: string }) {
  const hostRef = useRef<HTMLSpanElement | null>(null);
  const [markup, setMarkup] = useState<string>(() => svgMarkupCache.get(name) ?? '');

  useEffect(() => {
    const existing = svgMarkupCache.get(name);
    if (existing) {
      setMarkup(existing);
      return;
    }

    let cancelled = false;
    const load = () => {
      loadNucleoSvg(name).then((svg) => {
        if (!cancelled && svg) setMarkup(svg);
      });
    };

    const node = hostRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      load();
      return () => {
        cancelled = true;
      };
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          load();
        }
      },
      { rootMargin: '250px' },
    );

    observer.observe(node);
    return () => {
      cancelled = true;
      observer.disconnect();
    };
  }, [name]);

  if (!markup) {
    return (
      <span
        ref={hostRef}
        aria-hidden="true"
        className="inline-block size-6 select-none"
      />
    );
  }

  return (
    <span
      ref={hostRef}
      aria-hidden="true"
      className="inline-flex size-6 select-none items-center justify-center text-text-primary [&>svg]:size-6"
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  );
}

/** Searchable Nucleo icon browser arranged in a flush four-column hairline matrix. */
export function IconGallery() {
  const [query, setQuery] = useState('');
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('name');
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const [openMenuName, setOpenMenuName] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [...NUCLEO_ICONS];
    return NUCLEO_ICONS.filter((name) => name.includes(q));
  }, [query]);

  const handleCopy = (name: string, format: CopyFormat = copyFormat) => {
    const text = getCopySnippet(name, format);
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedName(name);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedName(null), 1600);
  };

  const mobileFillers = (2 - (filtered.length % 2)) % 2;
  const desktopFillers = (4 - (filtered.length % 4)) % 4;

  return (
    <div className="not-prose my-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <InputGroup className="min-w-52 flex-1">
          <InputGroupAddon align="inline-start">
            <Search aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${NUCLEO_ICONS.length} icons...`}
            aria-label="Search icons"
          />
        </InputGroup>

        <div
          className="flex items-center gap-1 rounded-lg bg-bg-secondary p-1"
          role="group"
          aria-label="Copy format"
        >
          <Button
            size="small"
            mode={copyFormat === 'name' ? 'tertiary' : 'subtle'}
            onClick={() => setCopyFormat('name')}
          >
            Copy name
          </Button>
          <Button
            size="small"
            mode={copyFormat === 'import' ? 'tertiary' : 'subtle'}
            onClick={() => setCopyFormat('import')}
          >
            Copy import
          </Button>
          <Button
            size="small"
            mode={copyFormat === 'jsx' ? 'tertiary' : 'subtle'}
            onClick={() => setCopyFormat('jsx')}
          >
            Copy JSX
          </Button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border-gray bg-bg-secondary py-12 text-center text-body-small-regular text-text-tertiary">
          No icons matching &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border-gray bg-border-gray sm:grid-cols-4">
          {filtered.map((name) => {
            const isCopied = copiedName === name;
            const isMenuOpen = openMenuName === name;

            return (
              <div
                key={name}
                className={cn(
                  'group relative flex h-32 w-full flex-col items-center bg-bg-primary text-center transition-colors duration-150 ease-out hover:bg-bg-secondary',
                  isMenuOpen && 'bg-bg-secondary',
                )}
              >
                <button
                  type="button"
                  onClick={() => handleCopy(name)}
                  aria-label={`Copy ${name}`}
                  className="flex size-full cursor-pointer flex-col items-center text-center focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                >
                  <div className="flex w-full flex-[3] items-center justify-center pt-2">
                    <NucleoIcon name={name} />
                  </div>
                  <div className="flex w-full flex-1 items-center justify-center px-3 pb-2.5">
                    <span
                      className={cn(
                        'flex max-w-full items-center justify-center gap-1 font-mono text-[11px] text-text-secondary transition-opacity duration-150 ease-out',
                        !isCopied &&
                          'group-hover:opacity-0 group-focus-within:opacity-0',
                        isMenuOpen && 'opacity-0',
                      )}
                    >
                      {isCopied ? (
                        <>
                          <Check aria-hidden="true" className="size-3 shrink-0 text-text-green" />
                          <span className="text-text-green">Copied</span>
                        </>
                      ) : (
                        <span className="truncate">{name}</span>
                      )}
                    </span>
                  </div>
                </button>

                <div
                  className={cn(
                    'pointer-events-none absolute inset-x-0 bottom-0 z-10 flex h-8 items-center justify-center px-3 pb-2.5 opacity-0 transition-opacity duration-150 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100',
                    isMenuOpen && 'pointer-events-auto opacity-100',
                    isCopied && 'pointer-events-none opacity-0 group-hover:pointer-events-none group-hover:opacity-0 group-focus-within:pointer-events-none group-focus-within:opacity-0',
                  )}
                >
                  <DropdownMenu
                    open={isMenuOpen}
                    onOpenChange={(open) => setOpenMenuName(open ? name : null)}
                  >
                    <DropdownMenuTrigger
                      buttonWithChevron
                      iconStart="copy"
                      mode="secondary"
                      size="micro"
                      aria-label={`Copy options for ${name}`}
                    >
                      Copy
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="center" sideOffset={6} size={160}>
                      <DropdownMenuItem
                        start="copy"
                        onSelect={() => handleCopy(name, 'name')}
                      >
                        Copy name
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        start="copy"
                        onSelect={() => handleCopy(name, 'import')}
                      >
                        Copy import
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        start="copy"
                        onSelect={() => handleCopy(name, 'jsx')}
                      >
                        Copy JSX
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            );
          })}

          {Array.from({ length: desktopFillers }).map((_, index) => (
            <div
              key={`filler-${index}`}
              aria-hidden="true"
              className={cn(
                'h-32 bg-bg-primary',
                index >= mobileFillers && 'hidden sm:block',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/** Displays NarakUI brand marks on light and dark preview surfaces. */
export function BrandMarksShowcase() {
  return (
    <div className="not-prose my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-xl border border-border-gray bg-white p-6 text-[#18181a] shadow-low">
        <span className="text-body-mini-medium text-[#787878]">Light surface</span>
        <div className="flex items-center justify-between gap-4 py-2">
          <NarakUILogo className="h-7 w-auto" />
          <NarakUIMark className="size-8" />
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-[#2e2d2b] bg-[#171615] p-6 text-[#ecebe9] shadow-low">
        <span className="text-body-mini-medium text-[#aaa8a5]">Dark surface</span>
        <div className="flex items-center justify-between gap-4 py-2">
          <NarakUILogo className="h-7 w-auto" />
          <NarakUIMark className="size-8" />
        </div>
      </div>
    </div>
  );
}
