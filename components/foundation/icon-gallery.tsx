'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Activity,
  Archive,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowUpDown,
  ArrowUpRight,
  BarChart3,
  Bell,
  BookOpen,
  Bookmark,
  Bot,
  Building2,
  Calendar,
  CalendarDays,
  ChartLine,
  ChartPie,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  CircleAlert,
  CircleCheck,
  CircleX,
  Clock,
  Code,
  Columns3,
  Copy,
  CopyPlus,
  Download,
  Ellipsis,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  Files,
  Filter,
  Folder,
  Globe,
  GripVertical,
  Home,
  Info,
  Layers,
  LayoutGrid,
  Library,
  Link2,
  List,
  Megaphone,
  Mic,
  Paperclip,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  Settings,
  Share2,
  SlidersHorizontal,
  Sparkles,
  Square,
  Star,
  Tag,
  Target,
  ThumbsDown,
  ThumbsUp,
  Trash2,
  TriangleAlert,
  UserPlus,
  Users,
  X,
  type LucideIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RakfoundLogo, RakfoundMark } from '@/components/rakfound-logo';
import { cn } from '@/lib/utils';

interface IconEntry {
  name: string;
  componentName: string;
  icon: LucideIcon;
  keywords?: string[];
}

const SYSTEM_ICONS: IconEntry[] = [
  { name: 'activity', componentName: 'Activity', icon: Activity, keywords: ['analytics', 'pulse'] },
  { name: 'archive', componentName: 'Archive', icon: Archive },
  { name: 'arrow-down', componentName: 'ArrowDown', icon: ArrowDown },
  { name: 'arrow-left', componentName: 'ArrowLeft', icon: ArrowLeft },
  { name: 'arrow-right', componentName: 'ArrowRight', icon: ArrowRight },
  { name: 'arrow-up', componentName: 'ArrowUp', icon: ArrowUp },
  { name: 'arrow-up-down', componentName: 'ArrowUpDown', icon: ArrowUpDown, keywords: ['sort'] },
  { name: 'arrow-up-right', componentName: 'ArrowUpRight', icon: ArrowUpRight, keywords: ['open'] },
  { name: 'bell', componentName: 'Bell', icon: Bell, keywords: ['notification'] },
  { name: 'book-open', componentName: 'BookOpen', icon: BookOpen, keywords: ['references', 'docs'] },
  { name: 'bookmark', componentName: 'Bookmark', icon: Bookmark, keywords: ['saved'] },
  { name: 'bot', componentName: 'Bot', icon: Bot, keywords: ['agent', 'ai'] },
  { name: 'buildings', componentName: 'Building2', icon: Building2, keywords: ['brand', 'company'] },
  { name: 'calendar', componentName: 'Calendar', icon: Calendar, keywords: ['date'] },
  { name: 'calendar-days', componentName: 'CalendarDays', icon: CalendarDays, keywords: ['range'] },
  { name: 'chart-line', componentName: 'ChartLine', icon: ChartLine, keywords: ['trend'] },
  { name: 'chart-pie', componentName: 'ChartPie', icon: ChartPie, keywords: ['share'] },
  { name: 'check', componentName: 'Check', icon: Check },
  { name: 'check-circle', componentName: 'CircleCheck', icon: CircleCheck, keywords: ['success'] },
  { name: 'chevron-down', componentName: 'ChevronDown', icon: ChevronDown },
  { name: 'chevron-left', componentName: 'ChevronLeft', icon: ChevronLeft },
  { name: 'chevron-right', componentName: 'ChevronRight', icon: ChevronRight },
  { name: 'chevron-up', componentName: 'ChevronUp', icon: ChevronUp },
  { name: 'circle-alert', componentName: 'CircleAlert', icon: CircleAlert, keywords: ['error'] },
  { name: 'clock', componentName: 'Clock', icon: Clock, keywords: ['time', 'history'] },
  { name: 'close-circle', componentName: 'CircleX', icon: CircleX },
  { name: 'code', componentName: 'Code', icon: Code },
  { name: 'columns', componentName: 'Columns3', icon: Columns3, keywords: ['table'] },
  { name: 'copy', componentName: 'Copy', icon: Copy },
  { name: 'document-table', componentName: 'FileSpreadsheet', icon: FileSpreadsheet, keywords: ['report', 'csv'] },
  { name: 'documents', componentName: 'Files', icon: Files, keywords: ['reports'] },
  { name: 'download', componentName: 'Download', icon: Download, keywords: ['export'] },
  { name: 'duplicate', componentName: 'CopyPlus', icon: CopyPlus },
  { name: 'edit', componentName: 'Pencil', icon: Pencil, keywords: ['rename', 'pencil'] },
  { name: 'ellipsis', componentName: 'Ellipsis', icon: Ellipsis, keywords: ['more', 'menu'] },
  { name: 'external-link', componentName: 'ExternalLink', icon: ExternalLink },
  { name: 'eye', componentName: 'Eye', icon: Eye, keywords: ['visibility'] },
  { name: 'file-text', componentName: 'FileText', icon: FileText },
  { name: 'filter', componentName: 'Filter', icon: Filter },
  { name: 'folder', componentName: 'Folder', icon: Folder },
  { name: 'globe', componentName: 'Globe', icon: Globe, keywords: ['domain', 'web'] },
  { name: 'grip', componentName: 'GripVertical', icon: GripVertical, keywords: ['drag'] },
  { name: 'home', componentName: 'Home', icon: Home },
  { name: 'info', componentName: 'Info', icon: Info },
  { name: 'layers', componentName: 'Layers', icon: Layers },
  { name: 'layout-grid', componentName: 'LayoutGrid', icon: LayoutGrid, keywords: ['grid'] },
  { name: 'leaderboard', componentName: 'BarChart3', icon: BarChart3, keywords: ['ranking', 'chart-bar'] },
  { name: 'library', componentName: 'Library', icon: Library },
  { name: 'link', componentName: 'Link2', icon: Link2, keywords: ['citation', 'url'] },
  { name: 'list', componentName: 'List', icon: List },
  { name: 'megaphone', componentName: 'Megaphone', icon: Megaphone, keywords: ['mentions', 'announce'] },
  { name: 'microphone', componentName: 'Mic', icon: Mic, keywords: ['voice', 'audio'] },
  { name: 'paperclip', componentName: 'Paperclip', icon: Paperclip, keywords: ['attachment'] },
  { name: 'plus', componentName: 'Plus', icon: Plus, keywords: ['add', 'create'] },
  { name: 'refresh', componentName: 'RefreshCw', icon: RefreshCw, keywords: ['sync', 'reload'] },
  { name: 'reset', componentName: 'RotateCcw', icon: RotateCcw, keywords: ['undo'] },
  { name: 'search', componentName: 'Search', icon: Search },
  { name: 'send', componentName: 'Send', icon: Send },
  { name: 'settings', componentName: 'Settings', icon: Settings },
  { name: 'share', componentName: 'Share2', icon: Share2 },
  { name: 'sliders', componentName: 'SlidersHorizontal', icon: SlidersHorizontal, keywords: ['display', 'controls'] },
  { name: 'sparkles', componentName: 'Sparkles', icon: Sparkles, keywords: ['ai', 'insights'] },
  { name: 'stop', componentName: 'Square', icon: Square },
  { name: 'star', componentName: 'Star', icon: Star, keywords: ['favorite'] },
  { name: 'tag', componentName: 'Tag', icon: Tag, keywords: ['topic'] },
  { name: 'target', componentName: 'Target', icon: Target, keywords: ['competitor'] },
  { name: 'thumbs-down', componentName: 'ThumbsDown', icon: ThumbsDown, keywords: ['negative'] },
  { name: 'thumbs-up', componentName: 'ThumbsUp', icon: ThumbsUp, keywords: ['positive', 'sentiment'] },
  { name: 'trash', componentName: 'Trash2', icon: Trash2, keywords: ['delete', 'remove'] },
  { name: 'user-plus', componentName: 'UserPlus', icon: UserPlus, keywords: ['invite'] },
  { name: 'users', componentName: 'Users', icon: Users, keywords: ['team'] },
  { name: 'warning', componentName: 'TriangleAlert', icon: TriangleAlert, keywords: ['alert', 'danger'] },
  { name: 'x', componentName: 'X', icon: X, keywords: ['close', 'dismiss'] },
];

type CopyFormat = 'name' | 'jsx';

/** Searchable system icon browser with outline/filled preview and click-to-copy name or JSX. */
export function IconGallery() {
  const [query, setQuery] = useState('');
  const [filled, setFilled] = useState(false);
  const [copyFormat, setCopyFormat] = useState<CopyFormat>('name');
  const [copiedName, setCopiedName] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return SYSTEM_ICONS;
    return SYSTEM_ICONS.filter(
      (entry) =>
        entry.name.includes(q) ||
        entry.componentName.toLowerCase().includes(q) ||
        entry.keywords?.some((kw) => kw.includes(q)),
    );
  }, [query]);

  const handleCopy = (entry: IconEntry) => {
    const text =
      copyFormat === 'name'
        ? entry.name
        : `<${entry.componentName} className="size-4" />`;
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedName(entry.name);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopiedName(null), 1600);
  };

  return (
    <div className="not-prose my-4 flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative min-w-52 flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-text-tertiary"
          />
          <Input
            size="small"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={`Search ${SYSTEM_ICONS.length} icons...`}
            aria-label="Search icons"
            className="pl-8"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-bg-secondary p-1" role="group" aria-label="Icon style">
            <Button
              size="small"
              mode={!filled ? 'tertiary' : 'subtle'}
              onClick={() => setFilled(false)}
            >
              Outline
            </Button>
            <Button
              size="small"
              mode={filled ? 'tertiary' : 'subtle'}
              onClick={() => setFilled(true)}
            >
              Filled
            </Button>
          </div>

          <div className="flex items-center gap-1 rounded-lg bg-bg-secondary p-1" role="group" aria-label="Copy format">
            <Button
              size="small"
              mode={copyFormat === 'name' ? 'tertiary' : 'subtle'}
              onClick={() => setCopyFormat('name')}
            >
              Copy name
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
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-border-gray bg-bg-secondary py-10 text-center text-body-small-regular text-text-tertiary">
          No icons matching &ldquo;{query}&rdquo;.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {filtered.map((entry) => {
            const IconComponent = entry.icon;
            const isCopied = copiedName === entry.name;

            return (
              <button
                key={entry.name}
                type="button"
                onClick={() => handleCopy(entry)}
                className="group flex cursor-pointer flex-col items-center justify-center gap-2.5 rounded-xl border border-border-gray bg-bg-primary px-3 py-4 text-center shadow-low transition-[background-color,box-shadow,transform] duration-150 ease-out hover:bg-bg-secondary hover:shadow-low-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <IconComponent
                  aria-hidden="true"
                  className={cn(
                    'size-5 text-text-primary transition-transform duration-150 group-hover:scale-105',
                    filled && 'fill-current',
                  )}
                />
                <span className="flex max-w-full items-center gap-1 font-mono text-[11px] text-text-secondary">
                  {isCopied ? (
                    <>
                      <Check aria-hidden="true" className="size-3 shrink-0 text-text-green" />
                      <span className="text-text-green">Copied</span>
                    </>
                  ) : (
                    <span className="truncate">{entry.name}</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

/** Displays Rakfound brand marks on light and dark preview surfaces. */
export function BrandMarksShowcase() {
  return (
    <div className="not-prose my-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-3 rounded-xl border border-border-gray bg-white p-6 text-[#18181a] shadow-low">
        <span className="text-body-mini-medium text-[#787878]">Light surface</span>
        <div className="flex items-center justify-between gap-4 py-2">
          <RakfoundLogo className="h-7 w-auto" />
          <RakfoundMark className="size-8" />
        </div>
      </div>
      <div className="flex flex-col gap-3 rounded-xl border border-[#2e2d2b] bg-[#171615] p-6 text-[#ecebe9] shadow-low">
        <span className="text-body-mini-medium text-[#aaa8a5]">Dark surface</span>
        <div className="flex items-center justify-between gap-4 py-2">
          <RakfoundLogo className="h-7 w-auto" />
          <RakfoundMark className="size-8" />
        </div>
      </div>
    </div>
  );
}
