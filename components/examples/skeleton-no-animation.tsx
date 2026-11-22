import { Skeleton } from '@/components/ui/skeleton';

/** Comparison between default pulsing Skeleton and static `animate={false}` placeholder. */
export function SkeletonNoAnimation() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-body-mini-regular text-text-secondary">Animated (default)</p>
        <Skeleton />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-body-mini-regular text-text-secondary">Static</p>
        <Skeleton animate={false} />
      </div>
    </div>
  );
}
