import { SkeletonText } from '@/components/ui/skeleton';

/** Multi-line SkeletonText paragraph inheriting typography from its parent container. */
export function SkeletonTextLines() {
  return (
    <div className="w-full max-w-sm text-paragraph-regular">
      <SkeletonText />
      <SkeletonText width="92%" />
      <SkeletonText width="60%" />
    </div>
  );
}
