'use client';

import { ContextMenu } from '@/components/ui/context-menu';

const PROMPTS = [
  {
    id: 'espresso',
    text: 'Best espresso machines for home baristas',
    topic: 'Coffee gear',
  },
  {
    id: 'decaf',
    text: 'Which decaf coffee tastes the most like regular coffee?',
    topic: 'Coffee beans',
  },
  {
    id: 'subscription',
    text: 'Is a coffee subscription worth it?',
    topic: 'Subscriptions',
  },
];

const TOPICS = ['Coffee gear', 'Coffee beans', 'Subscriptions', 'Brewing guides'];

/** Row-scoped context menus with section label, keyboard shortcuts, nested submenu, and disabledReason tooltip. */
export const ContextMenuSubmenu = () => (
  <div className="flex w-full max-w-md flex-col divide-y divide-fill-quaternary overflow-hidden rounded-[12px] border border-fill-quaternary bg-bg-primary">
    {PROMPTS.map((prompt) => (
      <ContextMenu.Root key={prompt.id}>
        <ContextMenu.Trigger asChild>
          <div className="flex flex-col gap-0.5 px-4 py-3 data-[state=open]:bg-bg-secondary">
            <span className="truncate text-body-regular text-text-primary">{prompt.text}</span>
            <span className="text-body-small-regular text-text-secondary">{prompt.topic}</span>
          </div>
        </ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Label>Prompt</ContextMenu.Label>
          <ContextMenu.Item start="copy">
            Copy text
            <ContextMenu.Shortcut>⌘C</ContextMenu.Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Item start="duplicate">
            Duplicate
            <ContextMenu.Shortcut>⌘D</ContextMenu.Shortcut>
          </ContextMenu.Item>
          <ContextMenu.Sub>
            <ContextMenu.SubTrigger startIcon="folder">Move to topic</ContextMenu.SubTrigger>
            <ContextMenu.SubContent size={200}>
              {TOPICS.map((topic) => (
                <ContextMenu.Item
                  key={topic}
                  end={
                    topic === prompt.topic
                      ? { name: 'check', className: 'text-text-secondary' }
                      : undefined
                  }
                >
                  {topic}
                </ContextMenu.Item>
              ))}
            </ContextMenu.SubContent>
          </ContextMenu.Sub>
          <ContextMenu.Item
            start="archive"
            disabled
            disabledReason="Only admins can archive prompts"
          >
            Archive
          </ContextMenu.Item>
          <ContextMenu.Separator />
          <ContextMenu.Item start="trash" destructive>
            Delete
            <ContextMenu.Shortcut>⌫</ContextMenu.Shortcut>
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu.Root>
    ))}
  </div>
);
