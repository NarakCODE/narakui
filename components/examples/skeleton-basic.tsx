import { Skeleton } from '@/components/ui/skeleton';

/** Basic Skeleton blocks using default 24px height and custom height prop. */
export function SkeletonBasic() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-4">
      <div className="flex flex-col gap-2">
        <p className="text-body-mini-regular text-text-secondary">Default</p>
        <Skeleton />
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-body-mini-regular text-text-secondary">Custom height</p>
        <Skeleton height="40px" />
      </div>
    </div>
  );
}
