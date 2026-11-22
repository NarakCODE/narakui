'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBadge } from '@/components/ui/notification-badge';

/** Interactive demo toggling NotificationBadge count and visibility without layout shift. */
export function NotificationBadgeToggle() {
  const [unread, setUnread] = useState(4);

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <NotificationBadge content={unread} show={unread > 0}>
        <Button
          iconStart={<Bell />}
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : 'Notifications'}
        />
      </NotificationBadge>
      <Button onClick={() => setUnread((count) => count + 1)}>New mention</Button>
      <Button disabled={unread === 0} onClick={() => setUnread(0)}>
        Mark all as read
      </Button>
    </div>
  );
}
