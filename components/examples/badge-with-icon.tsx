import { Badge } from '@/components/ui/badge';

/** Showcases Badges with semantic leading icons and a hover tooltip. */
export function BadgeWithIcon() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge title="Ready" type="green" iconStart="check-circle" />
      <Badge title="Needs review" type="amber" iconStart="warning" />
      <Badge title="Failed" type="red" iconStart="close-circle" />
      <Badge
        title="Tracked"
        type="blue"
        iconStart="check-circle"
        tooltip="Tracked across every answer engine"
      />
    </div>
  );
}
