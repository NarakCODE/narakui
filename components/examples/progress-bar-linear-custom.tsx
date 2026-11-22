import { LinearProgress } from '@/components/ui/progress-bar';

/** LinearProgress customized with semantic fill background utility classes. */
export function LinearProgressCustom() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="space-y-2">
        <p className="text-body-mini-regular text-text-secondary">Credits used</p>
        <LinearProgress value={62} fill="bg-fill-green" label="Credits used" />
      </div>
      <div className="space-y-2">
        <p className="text-body-mini-regular text-text-secondary">Page test progress</p>
        <LinearProgress value={40} fill="bg-fill-blue" label="Page test progress" />
      </div>
    </div>
  );
}
