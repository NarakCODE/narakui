import { GraySpinner2 } from '@/components/ui/spinner';

/** GraySpinner2 across 16px (default), 24px, 32px, and 48px pixel sizes. */
export function SpinnerGray2() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <div className="flex items-center gap-2">
        <GraySpinner2 />
        <span className="text-body-small-regular text-text-secondary">16px (default)</span>
      </div>
      <div className="flex items-center gap-2">
        <GraySpinner2 size={24} />
        <span className="text-body-small-regular text-text-secondary">24px</span>
      </div>
      <div className="flex items-center gap-2">
        <GraySpinner2 size={32} />
        <span className="text-body-small-regular text-text-secondary">32px</span>
      </div>
      <div className="flex items-center gap-2">
        <GraySpinner2 size={48} />
        <span className="text-body-small-regular text-text-secondary">48px</span>
      </div>
    </div>
  );
}
