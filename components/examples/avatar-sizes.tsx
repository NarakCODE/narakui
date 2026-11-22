import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

/** Demonstrates pixel-based Avatar sizes from 64px down to 24px. */
export function AvatarSizes() {
  return (
    <Card
      padding="md"
      className="flex w-fit max-w-full flex-row flex-wrap items-center justify-center gap-3"
    >
      <Avatar size={64} fallbackText="Maya Chen" />
      <Avatar size={48} fallbackText="Maya Chen" />
      <Avatar fallbackText="Maya Chen" />
      <Avatar size={32} fallbackText="Maya Chen" />
      <Avatar size={24} fallbackText="Maya Chen" />
    </Card>
  );
}
