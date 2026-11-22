import { BlueSpinner } from '@/components/ui/spinner';

/** BlueSpinner across 16px (default), 24px, 32px, and 48px pixel sizes. */
export function SpinnerBlue() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <BlueSpinner />
        <span className="text-body-small-regular text-text-secondary">16px (default)</span>
      </div>
      <div className="flex items-center gap-2">
        <BlueSpinner size={24} />
        <span className="text-body-small-regular text-text-secondary">24px</span>
      </div>
      <div className="flex items-center gap-2">
        <BlueSpinner size={32} />
        <span className="text-body-small-regular text-text-secondary">32px</span>
      </div>
      <div className="flex items-center gap-2">
        <BlueSpinner size={48} />
        <span className="text-body-small-regular text-text-secondary">48px</span>
      </div>
    </div>
  );
}
