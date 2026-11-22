import { Button } from '@/components/ui/button';

/** Demonstrates all four Button size presets from micro to large. */
export function ButtonSizes() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button size="micro">Micro</Button>
      <Button size="small">Small</Button>
      <Button>Regular</Button>
      <Button size="large">Large</Button>
    </div>
  );
}
