import { SkeletonGroup, SkeletonText } from '@/components/ui/skeleton';

/** Metric cards wrapped in SkeletonGroup so known labels render while values show placeholders. */
export function SkeletonComplex() {
  return (
    <SkeletonGroup
      label="Loading metrics"
      className="grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-3"
    >
      {['Visibility', 'Share of voice', 'Position'].map((metric) => (
        <div key={metric} className="flex flex-col gap-1 rounded-xl bg-bg-primary p-4 shadow-low">
          <p className="text-body-small-regular text-text-secondary">{metric}</p>
          <SkeletonText variant="text-title-small-semibold" width="4rem" />
          <SkeletonText variant="text-body-mini-regular" width="80%" />
        </div>
      ))}
    </SkeletonGroup>
  );
}
