import { UserAvatar } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';

/** Demonstrates UserAvatar with profile images and user-icon fallbacks at 20px and 32px. */
export function UserAvatars() {
  return (
    <Card
      padding="md"
      className="flex w-fit max-w-full flex-row flex-wrap items-center justify-center gap-3"
    >
      <UserAvatar src="https://github.com/shadcn.png" alt="Jane Cooper" />
      <UserAvatar alt="Jordan Lee" />
      <UserAvatar src="https://github.com/shadcn.png" alt="Jane Cooper" size={32} />
      <UserAvatar alt="Jordan Lee" size={32} />
    </Card>
  );
}
