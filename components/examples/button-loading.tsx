import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** Basic loading state on a primary Card surface with a centered spinner overlay. */
export function ButtonLoading() {
  return (
    <Card padding="md" className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button loading={{ isLoading: true }}>Generate report</Button>
    </Card>
  );
}
