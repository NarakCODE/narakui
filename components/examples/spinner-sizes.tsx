import { BlueSpinner, GraySpinner, GraySpinner2 } from '@/components/ui/spinner';

/** Side-by-side overview of the three spinner variants at 20px. */
export function SpinnerSizes() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <BlueSpinner size={20} />
        <span className="text-body-small-regular text-text-secondary">BlueSpinner</span>
      </div>
      <div className="flex items-center gap-2">
        <GraySpinner size={20} />
        <span className="text-body-small-regular text-text-secondary">GraySpinner</span>
      </div>
      <div className="flex items-center gap-2">
        <GraySpinner2 size={20} />
        <span className="text-body-small-regular text-text-secondary">GraySpinner2</span>
      </div>
    </div>
  );
}
