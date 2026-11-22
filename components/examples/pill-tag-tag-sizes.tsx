import { Tag } from '@/components/ui/pill-tag';

/** Demonstrates customizing Tag scale via typography and padding utility classes. */
export function TagSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tag className="bg-bg-blue text-body-mini-regular text-text-blue">Mini</Tag>
      <Tag className="bg-bg-blue px-2.5 py-1 text-body-small-regular text-text-blue">Small</Tag>
    </div>
  );
}
