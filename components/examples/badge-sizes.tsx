import { Badge } from '@/components/ui/badge';

/** Showcases the four Badge size presets from micro to large. */
export function BadgeSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge title="micro" size="micro" type="blue" />
      <Badge title="small" size="small" type="blue" />
      <Badge title="default" type="blue" />
      <Badge title="large" size="large" type="blue" />
    </div>
  );
}
