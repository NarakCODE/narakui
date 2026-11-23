import type { ReactNode } from 'react';
import type * as PageTree from 'fumadocs-core/page-tree';

type FooterItem = Pick<PageTree.Item, 'name' | 'description' | 'url'>;

const FOOTER_SUMMARIES: Record<string, string> = {
  '/docs': 'Design system overview and guidelines.',
  '/docs/foundation/brand': 'Logo, naming, and color rules.',
  '/docs/foundation/colors': 'Semantic light and dark tokens.',
  '/docs/foundation/icons': 'Nucleo glass icons and marks.',
  '/docs/foundation/typography': 'Geist type scale tokens.',
  '/docs/components/active-bar': 'Sliding active navigation highlight.',
  '/docs/components/alert': 'Inline status callouts.',
  '/docs/components/audio-player': 'Audio playback control bar.',
  '/docs/components/avatar': 'Profile images and initials.',
  '/docs/components/badge': 'Compact status labels.',
  '/docs/components/banner': 'Page-level state banners.',
  '/docs/components/breadcrumb': 'Hierarchical navigation trail.',
  '/docs/components/button': 'Interactive action buttons.',
  '/docs/components/card': 'Grouped content containers.',
  '/docs/components/checkbox': 'Multi-option selection boxes.',
  '/docs/components/code-block': 'Syntax-highlighted code blocks.',
  '/docs/components/collapsible': 'Expandable content sections.',
  '/docs/components/combobox': 'Searchable option picker.',
  '/docs/components/command-bar': 'Quick action command menu.',
  '/docs/components/composer': 'Assistant prompt input card.',
  '/docs/components/confirm-dialog': 'Action confirmation dialog.',
  '/docs/components/context-menu': 'Right-click action menu.',
  '/docs/components/dialog': 'Modal overlay dialogs.',
  '/docs/components/drawer': 'Slide-out edge panels.',
  '/docs/components/dropdown-menu': 'Floating action and option menus.',
  '/docs/components/empty-and-error-states': 'Empty and error placeholders.',
  '/docs/components/filter-builder': 'Structured filter conditions.',
  '/docs/components/highlights': 'Key metric summary cards.',
  '/docs/components/hover-card': 'Hover preview cards.',
  '/docs/components/input': 'Single-line text fields.',
  '/docs/components/kbd': 'Keyboard shortcut keycaps.',
  '/docs/components/list': 'Structured clickable row lists.',
  '/docs/components/multi-select-filter': 'Multi-value filter chips.',
  '/docs/components/multi-step-form': 'Paginated multi-step forms.',
  '/docs/components/notification-badge': 'Corner activity dot and count.',
  '/docs/components/pagination': 'Multi-page navigation controls.',
  '/docs/components/pill-tag': 'Compact status pills and tags.',
  '/docs/components/popover': 'On-demand floating panels.',
  '/docs/components/progress-bar': 'Task completion indicators.',
  '/docs/components/question-tool': 'Interactive ask-user prompts.',
  '/docs/components/radio-group': 'Single-choice option sets.',
  '/docs/components/resize-handle': 'Keyboard-accessible panel resizer.',
  '/docs/components/scroll-area': 'Custom styled scrollbars.',
  '/docs/components/search-field': 'Clearable search input field.',
  '/docs/components/section-header': 'Section title and actions row.',
  '/docs/components/segmented-tabs': 'Pill-style tab switches.',
  '/docs/components/separator': 'Visual section dividers.',
  '/docs/components/single-select-filter': 'Single-value filter chips.',
  '/docs/components/skeleton': 'Content loading placeholders.',
  '/docs/components/spinner': 'Ongoing activity spinners.',
  '/docs/components/split-button': 'Primary action with menu.',
  '/docs/components/statistic': 'Formatted numeric metrics.',
  '/docs/components/status-badge': 'Navigation status indicators.',
  '/docs/components/switch': 'Binary toggle controls.',
  '/docs/components/tab-strip': 'Scrollable open tab strip.',
  '/docs/components/table': 'Sortable, expandable data tables.',
  '/docs/components/tabs': 'Layered tabbed sections.',
  '/docs/components/text-shimmer': 'In-progress label shimmer.',
  '/docs/components/textarea': 'Multi-line text inputs.',
  '/docs/components/toast': 'Temporary status notifications.',
  '/docs/components/toggle-group': 'Two-state button groups.',
  '/docs/components/toolbar': 'Keyboard-navigable control row.',
  '/docs/components/tooltip': 'Hover context labels.',
  '/docs/components/tree': 'Expandable hierarchical trees.',
  '/docs/components/truncated-text': 'Ellipsis text with tooltip.',
  '/docs/components/video-player': 'Styled video playback player.',
};

function shortenFallbackDescription(description: ReactNode): ReactNode {
  if (typeof description !== 'string') return description;
  const firstSentence = description.split(/\.\s+/)[0]?.trim() ?? description;
  const trimmed =
    firstSentence.length <= 48
      ? firstSentence
      : `${firstSentence.slice(0, 45).trimEnd()}...`;
  return trimmed.endsWith('.') || trimmed.endsWith('...')
    ? trimmed
    : `${trimmed}.`;
}

/** Returns a footer navigation item with a concise one-line summary description. */
export function summarizeFooterItem(
  item: PageTree.Item | undefined,
): FooterItem | undefined {
  if (!item) return undefined;
  return {
    name: item.name,
    url: item.url,
    description:
      FOOTER_SUMMARIES[item.url] ?? shortenFallbackDescription(item.description),
  };
}
