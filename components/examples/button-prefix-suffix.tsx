import { Button } from '@/components/ui/button';

/** Demonstrates start icons, end icons, paired icons, and icon-only buttons. */
export function ButtonPrefixSuffix() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button iconStart="plus">Add prompt</Button>
      <Button iconEnd="arrow-up-right">Open report</Button>
      <Button iconStart="filter" iconEnd="chevron-down">
        Filters
      </Button>
      <Button iconStart="download" aria-label="Download CSV" />
    </div>
  );
}
