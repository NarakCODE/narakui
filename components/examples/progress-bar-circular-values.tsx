import { CircularProgress } from '@/components/ui/progress-bar';

/** CircularProgress indicators showing 25%, 65%, and 100% completion with accessible labels. */
export function CircularProgressValues() {
  return (
    <div className="flex items-end justify-center gap-8">
      {[25, 65, 100].map((progress) => (
        <div key={progress} className="flex flex-col items-center gap-2">
          <CircularProgress progress={progress} size="lg" label={`${progress}% complete`} />
          <p className="text-body-mini-regular text-text-secondary tabular-nums">{progress}%</p>
        </div>
      ))}
    </div>
  );
}
