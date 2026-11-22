import { GraySpinner2 } from '@/components/ui/spinner';

/** Standalone GraySpinner2 with an accessible `label` exposing `role="status"`. */
export function SpinnerLabeled() {
  return <GraySpinner2 size={24} label="Loading results" />;
}
