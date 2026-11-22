import { Skeleton, SkeletonText } from '@/components/ui/skeleton';

/** List row skeleton matching an avatar, two typography-matched text lines, and a trailing action. */
export function SkeletonCard() {
  return (
    <div className="flex w-full max-w-sm items-center gap-3">
      <Skeleton className="size-10 shrink-0 rounded-full" />
      <div className="flex min-w-0 flex-1 flex-col">
        <SkeletonText variant="text-body-small-medium" width="60%" />
        <SkeletonText variant="text-body-mini-regular" width="40%" />
      </div>
      <Skeleton className="h-7 w-16 shrink-0 rounded-md" />
    </div>
  );
}
