import { CenteredSpinner } from '@/components/ui/spinner';

/** CenteredSpinner filling a surface container with its default 160px minimum height. */
export function SpinnerCentered() {
  return (
    <div className="w-full max-w-sm rounded-xl bg-bg-primary shadow-low">
      <CenteredSpinner label="Loading results" />
    </div>
  );
}
