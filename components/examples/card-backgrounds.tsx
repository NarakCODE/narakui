import { Card } from '@/components/ui/card';

/** Showcases all four Card surface background tiers. */
export function CardBackgroundsExample() {
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
      <Card padding="sm">
        <h3 className="text-center text-body-small-medium text-text-primary">Primary</h3>
      </Card>
      <Card background="secondary" padding="sm">
        <h3 className="text-center text-body-small-medium text-text-primary">Secondary</h3>
      </Card>
      <Card background="tertiary" padding="sm">
        <h3 className="text-center text-body-small-medium text-text-primary">Tertiary</h3>
      </Card>
      <Card background="quaternary" padding="sm">
        <h3 className="text-center text-body-small-medium text-text-primary">Quaternary</h3>
      </Card>
    </div>
  );
}
