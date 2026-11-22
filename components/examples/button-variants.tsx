import { Button } from '@/components/ui/button';

/** Showcases all seven Button visual modes. */
export function ButtonVariants() {
  return (
    <div className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button mode="primary">Primary</Button>
      <Button>Secondary</Button>
      <Button mode="tertiary">Tertiary</Button>
      <Button mode="ghost">Ghost</Button>
      <Button mode="subtle">Subtle</Button>
      <Button mode="destructive">Destructive</Button>
      <Button mode="dashed">Dashed</Button>
    </div>
  );
}
