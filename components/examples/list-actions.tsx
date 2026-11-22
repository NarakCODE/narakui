'use client';

import { useId, useState } from 'react';
import { Archive, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { List, ListItem } from '@/components/ui/list';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const SUGGESTIONS = [
  { id: 'faq', title: 'Add an FAQ section to the pricing page', project: 'Q4 visibility push' },
  {
    id: 'reddit',
    title: 'Answer the top Reddit threads about onboarding',
    project: 'Spring product launch',
  },
  { id: 'schema', title: 'Add product schema to comparison pages', project: 'Q4 visibility push' },
];

export function ListActionsExample() {
  const titleId = useId();
  const [items, setItems] = useState(SUGGESTIONS);

  return (
    <section aria-labelledby={titleId} className="w-full max-w-md">
      <List.Root keyboardNavigation>
        <List.Header
          titleId={titleId}
          title="Suggested tasks"
          actions={
            <Button
              allowScaleOnClick={false}
              className="mr-2"
              disabled={items.length === SUGGESTIONS.length}
              mode="ghost"
              size="small"
              onClick={() => setItems(SUGGESTIONS)}
            >
              Restore
            </Button>
          }
        />
        <List.Divider />
        <List.Body>
          {items.length === 0 ? (
            <p className="px-3 py-6 text-center text-body-small-regular text-text-secondary">
              You are all caught up.
            </p>
          ) : (
            <List.Items>
              {items.map((item) => (
                <ListItem.Root key={item.id}>
                  <ListItem.PrimaryAction>
                    <ListItem.Content
                      leading={<Sparkles className="size-4" aria-hidden="true" />}
                      title={item.title}
                      titleBehavior="wrap"
                      description={item.project}
                    />
                  </ListItem.PrimaryAction>
                  <ListItem.Actions>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label={`Archive ${item.title}`}
                          iconStart={<Archive className="size-3.5 text-fill-secondary" />}
                          mode="ghost"
                          size="small"
                          onClick={() =>
                            setItems((current) => current.filter((other) => other.id !== item.id))
                          }
                        />
                      </TooltipTrigger>
                      <TooltipContent side="top" sideOffset={6}>
                        Archive
                      </TooltipContent>
                    </Tooltip>
                  </ListItem.Actions>
                </ListItem.Root>
              ))}
            </List.Items>
          )}
        </List.Body>
      </List.Root>
    </section>
  );
}
