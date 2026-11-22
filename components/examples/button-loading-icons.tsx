import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** Demonstrates how the loading spinner replaces start, end, and icon-only slots across modes. */
export function ButtonLoadingIcons() {
  return (
    <Card padding="md" className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button loading={{ isLoading: true }} iconStart="plus">
        Start icon
      </Button>
      <Button loading={{ isLoading: true }} iconEnd="chevron-down">
        End icon
      </Button>
      <Button loading={{ isLoading: true }} iconStart="plus" iconEnd="chevron-down">
        Both icons
      </Button>
      <Button loading={{ isLoading: true }} iconStart="plus" aria-label="Add" />
      <Button mode="ghost" loading={{ isLoading: true }} iconStart="plus" aria-label="Add ghost" />
      <Button
        mode="destructive"
        loading={{ isLoading: true }}
        iconStart="plus"
        aria-label="Add destructive"
      />
    </Card>
  );
}
