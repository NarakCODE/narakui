import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/** Vertical Separator dividing inline metadata inside a fixed-height row. */
export function SeparatorVertical() {
  return (
    <Card className="px-4 py-2.5">
      <div className="flex h-5 items-center gap-3 text-body-small-regular text-text-secondary">
        <span>Last 30 days</span>
        <Separator orientation="vertical" />
        <span>ChatGPT</span>
        <Separator orientation="vertical" />
        <span>128 prompts</span>
      </div>
    </Card>
  );
}
