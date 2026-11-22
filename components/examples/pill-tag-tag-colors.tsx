import { Tag } from '@/components/ui/pill-tag';

/** Pairs muted semantic background fills with matching foreground text tokens. */
export function TagColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tag className="bg-bg-green text-body-mini-regular text-text-green">Enabled</Tag>
      <Tag className="bg-bg-red text-body-mini-regular text-text-red">Failed</Tag>
      <Tag className="bg-bg-orange text-body-mini-regular text-text-orange">Disabled</Tag>
      <Tag className="bg-bg-blue text-body-mini-regular text-text-blue">New</Tag>
      <Tag className="bg-bg-purple text-body-mini-regular text-text-purple">Beta</Tag>
      <Tag className="bg-bg-quaternary text-body-mini-regular text-text-secondary">Archived</Tag>
    </div>
  );
}
