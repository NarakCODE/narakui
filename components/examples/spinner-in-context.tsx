import { BlueSpinner, GraySpinner, GraySpinner2 } from '@/components/ui/spinner';

/** Spinners paired with short inline status text describing ongoing work. */
export function SpinnerInContext() {
  return (
    <div className="flex flex-col items-start gap-4">
      <div className="flex items-center gap-2">
        <GraySpinner2 />
        <span className="text-body-small-regular text-text-secondary">Running 128 prompts…</span>
      </div>
      <div className="flex items-center gap-2">
        <GraySpinner />
        <span className="text-body-small-regular text-text-secondary">
          Uploading brand-guidelines.pdf…
        </span>
      </div>
      <div className="flex items-center gap-2">
        <BlueSpinner />
        <span className="text-body-small-regular text-text-secondary">Generating report…</span>
      </div>
    </div>
  );
}
