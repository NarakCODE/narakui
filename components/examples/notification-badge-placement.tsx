'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBadge } from '@/components/ui/notification-badge';

/** Demonstrates all four corner placements around an anchor button. */
export function NotificationBadgePlacement() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <NotificationBadge placement="top-left">
        <Button iconStart={<Bell />} aria-label="Notifications, unread" />
      </NotificationBadge>
      <NotificationBadge>
        <Button iconStart={<Bell />} aria-label="Notifications, unread" />
      </NotificationBadge>
      <NotificationBadge placement="bottom-left">
        <Button iconStart={<Bell />} aria-label="Notifications, unread" />
      </NotificationBadge>
      <NotificationBadge placement="bottom-right">
        <Button iconStart={<Bell />} aria-label="Notifications, unread" />
      </NotificationBadge>
    </div>
  );
}
