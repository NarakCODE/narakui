import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

/** Showcases borderless squared Agent Builder badges across color treatments. */
export function BadgeAgentBuilder() {
  return (
    <Card
      padding="md"
      className="flex w-fit max-w-full flex-wrap items-center justify-center gap-3"
    >
      <Badge title="default" variant="agent-builder" />
      <Badge title="red" type="red" variant="agent-builder" />
      <Badge title="blue" type="blue" variant="agent-builder" />
      <Badge title="green" type="green" variant="agent-builder" />
      <Badge title="amber" type="amber" variant="agent-builder" />
      <Badge title="purple" type="purple" variant="agent-builder" />
      <Badge title="orange" type="orange" variant="agent-builder" />
      <Badge title="gray" type="gray" variant="agent-builder" />
      <Badge title="cyan" type="cyan" variant="agent-builder" />
    </Card>
  );
}
