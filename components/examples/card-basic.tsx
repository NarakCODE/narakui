import { Card } from '@/components/ui/card';

/** Basic compact card grouping a title and summary text. */
export function BasicCardExample() {
  return (
    <Card padding="sm" className="flex w-full max-w-sm flex-col gap-1">
      <h3 className="text-title-mini-semibold text-text-primary">Share of voice</h3>
      <p className="text-body-small-regular text-text-secondary">
        Your brand appeared in 38% of ChatGPT answers about project management tools this week.
      </p>
    </Card>
  );
}
