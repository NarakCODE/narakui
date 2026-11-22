import { LinearProgress } from '@/components/ui/progress-bar';

const RUNS = [
  { label: 'Prompts analyzed', completed: 128, total: 500 },
  { label: 'Pages crawled', completed: 1820, total: 2800 },
  { label: 'Citations classified', completed: 640, total: 640 },
];

/** Determinate LinearProgress bars paired with tabular-nums progress counters. */
export function LinearProgressValues() {
  return (
    <div className="w-full max-w-sm space-y-4">
      {RUNS.map((run) => (
        <div key={run.label} className="space-y-2">
          <div className="flex items-center justify-between gap-4">
            <p className="text-body-small-regular text-text-primary">{run.label}</p>
            <p className="text-body-small-regular text-text-secondary tabular-nums">
              {run.completed.toLocaleString()} of {run.total.toLocaleString()}
            </p>
          </div>
          <LinearProgress value={(run.completed / run.total) * 100} size="sm" label={run.label} />
        </div>
      ))}
    </div>
  );
}
