import { TextShimmer } from '@/components/ui/text-shimmer';

/** Comparison of default sweep timing, slower `duration={2}`, and wider `spread={5}`. */
export function TextShimmerTiming() {
  return (
    <div className="grid grid-cols-[max-content_max-content] items-center gap-x-6 gap-y-2">
      <span className="text-body-small-regular text-text-secondary">Default</span>
      <TextShimmer className="text-body-regular">Generating prompts</TextShimmer>
      <span className="text-body-small-regular text-text-secondary">Slower sweep</span>
      <TextShimmer duration={2} className="text-body-regular">
        Generating prompts
      </TextShimmer>
      <span className="text-body-small-regular text-text-secondary">Wider highlight</span>
      <TextShimmer spread={5} className="text-body-regular">
        Generating prompts
      </TextShimmer>
    </div>
  );
}
