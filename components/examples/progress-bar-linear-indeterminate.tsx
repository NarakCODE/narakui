import { LinearProgress } from '@/components/ui/progress-bar';

/** Indeterminate LinearProgress sliding segment for tasks with unknown completion. */
export function LinearProgressIndeterminate() {
  return (
    <div className="w-full max-w-sm space-y-2">
      <p className="text-body-small-regular text-text-secondary">Generating visibility report…</p>
      <LinearProgress indeterminate size="sm" label="Generating visibility report" />
    </div>
  );
}
