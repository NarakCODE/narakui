import { Card } from '@/components/ui/card';

/** Compares sm (16px) and md (24px) Card padding presets. */
export function CardWithPaddingExample() {
  return (
    <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-2">
      <Card padding="sm" className="flex flex-col gap-1">
        <h3 className="text-body-regular-semibold text-text-primary">Small padding</h3>
        <p className="text-body-small-regular text-text-secondary">
          16 px. Use it for compact cards in grids and side panels.
        </p>
      </Card>
      <Card padding="md" className="flex flex-col gap-1">
        <h3 className="text-body-regular-semibold text-text-primary">Medium padding</h3>
        <p className="text-body-small-regular text-text-secondary">
          24 px. Use it for standalone cards such as report summaries.
        </p>
      </Card>
    </div>
  );
}
