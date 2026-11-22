import { CircularProgress } from '@/components/ui/progress-bar';

/** CircularProgress rendered in `sm` (14px), `md` (20px), and `lg` (60px) named sizes. */
export function CircularProgressSizes() {
  return (
    <div className="flex items-end justify-center gap-8">
      <div className="flex flex-col items-center gap-2">
        <CircularProgress progress={50} size="sm" />
        <p className="text-body-mini-regular text-text-secondary">Small</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress progress={50} />
        <p className="text-body-mini-regular text-text-secondary">Medium</p>
      </div>
      <div className="flex flex-col items-center gap-2">
        <CircularProgress progress={50} size="lg" />
        <p className="text-body-mini-regular text-text-secondary">Large</p>
      </div>
    </div>
  );
}
