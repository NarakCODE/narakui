import { Building2 } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

/** Demonstrates Avatar image, initials, gradient-only, custom fallback, loading, and small text modes. */
export function AvatarTypes() {
  return (
    <Card
      padding="md"
      className="flex w-fit max-w-full flex-row flex-wrap items-center justify-center gap-3"
    >
      <Avatar src="https://github.com/shadcn.png" fallbackText="Maya Chen" imageAlt="Maya Chen" />
      <Avatar fallbackText="Maya Chen" />
      <Avatar fallbackText="Maya Chen" showInitials={false} />
      <Avatar
        fallbackText="Rakfound"
        fallback={<Building2 aria-hidden="true" className="size-4" />}
      />
      <Avatar fallbackText="Maya Chen" isLoading />
      <Avatar fallbackText="Maya Chen" textSize="small" />
    </Card>
  );
}
