'use client';

import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBadge } from '@/components/ui/notification-badge';

/** Showcases all seven semantic NotificationBadge colors. */
export function NotificationBadgeColors() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      <NotificationBadge content="2">
        <Button iconStart={<Bell />} aria-label="Notifications, 2 unread" />
      </NotificationBadge>
      <NotificationBadge content="2" color="blue">
        <Button iconStart={<Bell />} aria-label="Notifications, 2 unread" />
      </NotificationBadge>
      <NotificationBadge content="2" color="green">
        <Button iconStart={<Bell />} aria-label="Notifications, 2 unread" />
      </NotificationBadge>
      <NotificationBadge content="2" color="amber">
        <Button iconStart={<Bell />} aria-label="Notifications, 2 unread" />
      </NotificationBadge>
      <NotificationBadge content="2" color="purple">
        <Button iconStart={<Bell />} aria-label="Notifications, 2 unread" />
      </NotificationBadge>
      <NotificationBadge content="2" color="pink">
        <Button iconStart={<Bell />} aria-label="Notifications, 2 unread" />
      </NotificationBadge>
      <NotificationBadge content="2" color="gray">
        <Button iconStart={<Bell />} aria-label="Notifications, 2 unread" />
      </NotificationBadge>
    </div>
  );
}
