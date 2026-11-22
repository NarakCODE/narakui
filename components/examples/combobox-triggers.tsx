'use client';

import { useState } from 'react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Combobox } from '@/components/ui/combobox';

const WORKSPACES = ['Northwind Coffee', 'Northwind Coffee EU', 'Lumen Outdoor'];

const PEOPLE = [
  { id: 'maya', name: 'Maya Chen', email: 'maya@northwind.com' },
  { id: 'jordan', name: 'Jordan Ellis', email: 'jordan@northwind.com' },
  { id: 'priya', name: 'Priya Raman', email: 'priya@northwind.com' },
  { id: 'samuel', name: 'Samuel Ortiz', email: 'samuel@northwind.com' },
];

/** Trigger patterns comparing a compact ghost workspace switcher against an `asChild` action button. */
export const ComboboxTriggers = () => {
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [workspace, setWorkspace] = useState('Northwind Coffee');
  const [approverOpen, setApproverOpen] = useState(false);
  const [approvers, setApprovers] = useState<string[]>([]);

  const candidates = PEOPLE.filter((person) => !approvers.includes(person.id));
  const added = PEOPLE.filter((person) => approvers.includes(person.id));

  return (
    <div className="flex flex-wrap items-center justify-center gap-6">
      <Combobox.Root open={workspaceOpen} onOpenChange={setWorkspaceOpen}>
        <Combobox.Trigger
          buttonWithChevron
          mode="ghost"
          size="regular"
          className="pr-1 text-text-secondary"
        >
          {workspace}
        </Combobox.Trigger>
        <Combobox.Content align="start" size={224}>
          <Combobox.Command shouldFilter={false}>
            <Combobox.List>
              <Combobox.Group heading="Workspace">
                {WORKSPACES.map((name) => (
                  <Combobox.Item
                    key={name}
                    value={name}
                    end={
                      name === workspace
                        ? { name: 'check', className: 'text-text-secondary' }
                        : undefined
                    }
                    onSelect={() => {
                      setWorkspace(name);
                      setWorkspaceOpen(false);
                    }}
                  >
                    {name}
                  </Combobox.Item>
                ))}
              </Combobox.Group>
            </Combobox.List>
          </Combobox.Command>
        </Combobox.Content>
      </Combobox.Root>

      <div className="flex items-center gap-2">
        {added.map((person) => (
          <Avatar
            key={person.id}
            fallbackText={person.name}
            size={24}
            textSize="small"
            className="rounded-full"
          />
        ))}
        <Combobox.Root open={approverOpen} onOpenChange={setApproverOpen}>
          <Combobox.Trigger asChild>
            <Button iconStart="user-plus" disabled={candidates.length === 0}>
              Add approver
            </Button>
          </Combobox.Trigger>
          <Combobox.Content align="start" size={280}>
            <Combobox.Command>
              <Combobox.Input placeholder="Search people" autoFocus />
              <Combobox.List height={240}>
                <Combobox.Empty>No people found</Combobox.Empty>
                <Combobox.Group>
                  {candidates.map((person) => (
                    <Combobox.Item
                      key={person.id}
                      value={person.id}
                      keywords={[person.name, person.email]}
                      start={
                        <Avatar
                          fallbackText={person.name}
                          size={20}
                          textSize="small"
                          className="rounded-full"
                        />
                      }
                      onSelect={() => {
                        setApprovers([...approvers, person.id]);
                        setApproverOpen(false);
                      }}
                    >
                      {person.name}
                    </Combobox.Item>
                  ))}
                </Combobox.Group>
              </Combobox.List>
            </Combobox.Command>
          </Combobox.Content>
        </Combobox.Root>
      </div>
    </div>
  );
};
