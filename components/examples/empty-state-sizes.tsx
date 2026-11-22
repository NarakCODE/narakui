import { EmptyState, type EmptyStateSize } from '@/components/ui/empty-state';

const SIZES: EmptyStateSize[] = ['page', 'section', 'inline'];

export const EmptyStateSizesExample = () => (
  <div className="grid w-full grid-cols-1 items-start gap-4 sm:grid-cols-3">
    {SIZES.map((size) => (
      <div
        key={size}
        className="relative overflow-hidden rounded-xl bg-bg-base shadow-medium"
      >
        <EmptyState
          size={size}
          icon={{ name: 'chat-bubbles', className: 'size-6 text-fill-secondary' }}
          title="No prompts tracked yet"
          description={`size="${size}"`}
        />
      </div>
    ))}
  </div>
);
