import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** Compares the centered loading overlay across all four Button sizes. */
export function ButtonLoadingSizes() {
  return (
    <Card padding="md" className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button size="micro" loading={{ isLoading: true }}>
        Micro
      </Button>
      <Button size="small" loading={{ isLoading: true }}>
        Small
      </Button>
      <Button loading={{ isLoading: true }}>Regular</Button>
      <Button size="large" loading={{ isLoading: true }}>
        Large
      </Button>
    </Card>
  );
}
