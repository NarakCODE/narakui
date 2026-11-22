import { CircularProgress } from '@/components/ui/progress-bar';

const COLORS = [
  { name: 'Blue', track: 'var(--color-bg-blue)', progress: 'var(--color-fill-blue)' },
  { name: 'Amber', track: 'var(--color-bg-amber)', progress: 'var(--color-fill-amber)' },
  { name: 'Green', track: 'var(--color-bg-green)', progress: 'var(--color-fill-green)' },
];

/** CircularProgress themed with semantic CSS custom property track and arc colors. */
export function CircularProgressCustom() {
  return (
    <div className="flex items-end justify-center gap-8">
      {COLORS.map((color) => (
        <div key={color.name} className="flex flex-col items-center gap-2">
          <CircularProgress
            progress={50}
            size="lg"
            trackColor={color.track}
            progressColor={color.progress}
          />
          <p className="text-body-mini-regular text-text-secondary">{color.name}</p>
        </div>
      ))}
    </div>
  );
}
