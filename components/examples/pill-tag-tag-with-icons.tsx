import { CircleCheck, CircleX, Info, TriangleAlert } from 'lucide-react';
import { Tag } from '@/components/ui/pill-tag';

/** Places leading icons inside semantic Tag labels. */
export function TagWithIcons() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tag className="gap-1 bg-bg-green text-body-mini-regular text-text-green">
        <CircleCheck aria-hidden="true" className="size-3 shrink-0" />
        Cited
      </Tag>
      <Tag className="gap-1 bg-bg-red text-body-mini-regular text-text-red">
        <CircleX aria-hidden="true" className="size-3 shrink-0" />
        Crawl failed
      </Tag>
      <Tag className="gap-1 bg-bg-orange text-body-mini-regular text-text-orange">
        <TriangleAlert aria-hidden="true" className="size-3 shrink-0" />
        Stale data
      </Tag>
      <Tag className="gap-1 bg-bg-blue text-body-mini-regular text-text-blue">
        <Info aria-hidden="true" className="size-3 shrink-0" />
        Sampled
      </Tag>
    </div>
  );
}
