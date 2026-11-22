import { Tag } from '@/components/ui/pill-tag';

/** Neutral filled and outlined Tag treatments. */
export function TagBasic() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <Tag className="bg-bg-quaternary text-body-mini-regular text-text-primary">Competitor</Tag>
      <Tag className="border border-fill-quaternary text-body-mini-regular text-text-primary">
        Product page
      </Tag>
    </div>
  );
}
