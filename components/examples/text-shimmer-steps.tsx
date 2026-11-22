import { CircleCheck, CircleDashed } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';

/** Multi-step progress card using TextShimmer with `py-0` and `truncate` on the active row. */
export function TextShimmerSteps() {
  return (
    <div className="flex w-full max-w-72 flex-col gap-2 rounded-xl bg-bg-primary p-4 shadow-low">
      <div className="flex items-center gap-2 text-body-small-regular text-text-secondary">
        <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
        Read 12 citations
      </div>
      <div className="flex items-center gap-2 text-body-small-regular text-text-secondary">
        <CircleCheck aria-hidden="true" className="size-4 shrink-0" />
        Compared Acme with 4 competitors
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <CircleDashed aria-hidden="true" className="size-4 shrink-0 text-text-secondary" />
        <TextShimmer className="min-w-0 max-w-full truncate py-0 text-body-small-regular">
          Drafting the visibility summary for the weekly report
        </TextShimmer>
      </div>
    </div>
  );
}
