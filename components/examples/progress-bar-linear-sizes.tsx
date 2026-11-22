import { LinearProgress } from '@/components/ui/progress-bar';

/** LinearProgress rendered across `sm`, `md` (default), and `lg` track heights. */
export function LinearProgressSizes() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <p className="text-body-mini-regular text-text-secondary">Small</p>
        <LinearProgress value={25} size="sm" label="Small progress" />
      </div>
      <div className="space-y-2">
        <p className="text-body-mini-regular text-text-secondary">Medium</p>
        <LinearProgress value={50} label="Medium progress" />
      </div>
      <div className="space-y-2">
        <p className="text-body-mini-regular text-text-secondary">Large</p>
        <LinearProgress value={75} size="lg" label="Large progress" />
      </div>
    </div>
  );
}
