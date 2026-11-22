'use client';

import { useId } from 'react';
import { FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { List, ListItem } from '@/components/ui/list';

const RECENT_PROJECTS = [
  { id: 'q4', title: 'Q4 visibility push', summary: '3 suggested tasks', updated: '2h ago' },
  { id: 'launch', title: 'Spring product launch', summary: '1 suggested task', updated: 'Yesterday' },
  {
    id: 'citations',
    title: 'Citation gap analysis for ChatGPT',
    summary: 'No suggestions',
    updated: 'Mon',
  },
];

export function ListBasicExample() {
  const titleId = useId();

  return (
    <section aria-labelledby={titleId} className="w-full max-w-md">
      <List.Root keyboardNavigation>
        <List.Header titleId={titleId} title="Recent projects" />
        <List.Divider />
        <List.Body>
          <List.Items>
            {RECENT_PROJECTS.map((project) => (
              <ListItem.Root key={project.id}>
                <ListItem.PrimaryAction asChild>
                  <a href={`#${project.id}`} onClick={(event) => event.preventDefault()}>
                    <ListItem.Content
                      leading={<FolderKanban className="size-4" aria-hidden="true" />}
                      leadingAlign="center"
                      title={project.title}
                      description={project.summary}
                      trailing={project.updated}
                    />
                  </a>
                </ListItem.PrimaryAction>
              </ListItem.Root>
            ))}
          </List.Items>
        </List.Body>
        <List.Divider />
        <List.Footer>
          <Button
            allowScaleOnClick={false}
            className="min-h-9 w-full justify-start px-2.5 text-text-secondary hover:bg-control-hover"
            contentClassName="w-full justify-start"
            mode="ghost"
            size="small"
          >
            See all projects
          </Button>
        </List.Footer>
      </List.Root>
    </section>
  );
}
