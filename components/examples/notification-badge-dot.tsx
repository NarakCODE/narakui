'use client';

import { Bell, Inbox, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBadge } from '@/components/ui/notification-badge';

/** Displays small, medium, and large dot indicators over ghost icon buttons. */
export function NotificationBadgeDot() {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-bg-primary p-1 shadow-low">
      <NotificationBadge size="sm">
        <Button mode="ghost" size="small" iconStart={<Bell />} aria-label="Notifications, unread" />
      </NotificationBadge>
      <NotificationBadge>
        <Button mode="ghost" size="small" iconStart={<Inbox />} aria-label="Inbox, unread" />
      </NotificationBadge>
      <NotificationBadge size="lg">
        <Button
          mode="ghost"
          size="small"
          iconStart={<MessageSquare />}
          aria-label="Chats, unread"
        />
      </NotificationBadge>
    </div>
  );
}
