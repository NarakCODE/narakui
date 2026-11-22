'use client';

import { Bell, Ellipsis, Inbox, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NotificationBadge } from '@/components/ui/notification-badge';

/** Displays numeric counts and short labels inside NotificationBadge. */
export function NotificationBadgeContent() {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-bg-primary p-1 shadow-low">
      <NotificationBadge content="3">
        <Button
          mode="ghost"
          size="small"
          iconStart={<Bell />}
          aria-label="Notifications, 3 unread"
        />
      </NotificationBadge>
      <NotificationBadge content="12" color="blue">
        <Button mode="ghost" size="small" iconStart={<Inbox />} aria-label="Inbox, 12 unread" />
      </NotificationBadge>
      <NotificationBadge content="99+" size="lg">
        <Button
          mode="ghost"
          size="small"
          iconStart={<MessageSquare />}
          aria-label="Chats, more than 99 unread"
        />
      </NotificationBadge>
      <NotificationBadge content="Dev" size="sm">
        <Button mode="ghost" size="small" iconStart={<Ellipsis />} aria-label="More actions" />
      </NotificationBadge>
    </div>
  );
}
