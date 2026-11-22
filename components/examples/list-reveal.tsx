'use client';

import { FileText } from 'lucide-react';
import { List, ListItem } from '@/components/ui/list';

const DOCUMENTS = [
  { id: 'brief', title: 'Answer engine content brief', owner: 'Maya', edited: '10 min ago' },
  { id: 'faq', title: 'Pricing page FAQ draft', owner: 'Jason', edited: '1h ago' },
];

export function ListRevealExample() {
  return (
    <div className="w-full max-w-md">
      <List.Root>
        <List.Body>
          <List.Items>
            {DOCUMENTS.map((file) => (
              <ListItem.Root key={file.id}>
                <ListItem.PrimaryAction asChild>
                  <a href={`#${file.id}`} onClick={(event) => event.preventDefault()}>
                    <ListItem.Content
                      leading={<FileText className="size-4" aria-hidden="true" />}
                      leadingAlign="center"
                      title={file.title}
                      description={`Edited by ${file.owner}`}
                      trailing={
                        <ListItem.Reveal
                          resting={file.edited}
                          active={<ListItem.ActionHint>Open document</ListItem.ActionHint>}
                        />
                      }
                    />
                  </a>
                </ListItem.PrimaryAction>
              </ListItem.Root>
            ))}
          </List.Items>
        </List.Body>
      </List.Root>
    </div>
  );
}
