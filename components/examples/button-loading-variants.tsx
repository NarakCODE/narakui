import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** Compares loading states across primary, secondary, ghost, destructive, and dashed modes. */
export function ButtonLoadingVariants() {
  return (
    <Card padding="md" className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button mode="primary" loading={{ isLoading: true }}>
        Primary
      </Button>
      <Button loading={{ isLoading: true }}>Secondary</Button>
      <Button mode="ghost" loading={{ isLoading: true }}>
        Ghost
      </Button>
      <Button mode="destructive" loading={{ isLoading: true }}>
        Destructive
      </Button>
      <Button mode="dashed" loading={{ isLoading: true }}>
        Dashed
      </Button>
    </Card>
  );
}
