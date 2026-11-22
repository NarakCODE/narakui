import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

/** Showcases all ten Badge color treatments on a primary card surface. */
export function BadgeColors() {
  return (
    <Card
      padding="md"
      className="flex w-fit max-w-full flex-wrap items-center justify-center gap-3"
    >
      <Badge title="default" />
      <Badge title="red" type="red" />
      <Badge title="blue" type="blue" />
      <Badge title="green" type="green" />
      <Badge title="amber" type="amber" />
      <Badge title="yellow" type="yellow" />
      <Badge title="purple" type="purple" />
      <Badge title="orange" type="orange" />
      <Badge title="gray" type="gray" />
      <Badge title="cyan" type="cyan" />
    </Card>
  );
}
