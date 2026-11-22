import { Pill } from '@/components/ui/pill-tag';

/** Showcases Pill across default, semantic color, and no-padding states. */
export function PillBasic() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <Pill value="Tracked" />
      <Pill value="Cited" color="green" />
      <Pill value="Mentioned" color="blue" />
      <Pill value="Recommended" color="purple" />
      <Pill value="Pending" color="orange" />
      <Pill value="Not cited" color="red" />
      <Pill value="Archived" color="gray" />
      <Pill value="Draft" withPadding={false} />
    </div>
  );
}
