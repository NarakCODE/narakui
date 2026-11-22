import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** Fixed-width buttons preserving layout width across idle and loading states. */
export function ButtonLoadingFixedWidth() {
  return (
    <Card padding="md" className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button className="w-40">Save changes</Button>
      <Button className="w-40" loading={{ isLoading: true }}>
        Save changes
      </Button>
    </Card>
  );
}
