'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

/** Structured Dialog with region padding, header/footer dividers, scrollable form body, and CloseButton. */
export const DialogBasic = () => {
  const [name, setName] = useState('Q3 answer engine report');
  const [schedule, setSchedule] = useState('weekly');

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button iconStart="plus">New report</Button>
      </Dialog.Trigger>
      <Dialog.Content
        variant="structured"
        contentPadding="regions"
        hasAccessibleTitle
        hasAccessibleDescription
      >
        <Dialog.Header divider>
          <div className="flex items-start justify-between gap-2">
            <Dialog.Title>Create report</Dialog.Title>
            <Dialog.CloseButton />
          </div>
          <Dialog.Description>
            Share visibility trends for your brand with your team.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-4">
          <Input
            size="small"
            label="Report name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <RadioGroup
            aria-label="Delivery schedule"
            value={schedule}
            onValueChange={setSchedule}
          >
            <RadioGroupItem
              value="weekly"
              className="h-auto w-full min-w-0 items-start py-2"
              childrenWrapperClassName="min-w-0 flex-col items-start gap-1"
            >
              <span className="text-body-small-medium text-text-primary">Weekly</span>
              <span className="text-body-small-regular text-text-secondary">
                Sent every Monday morning.
              </span>
            </RadioGroupItem>
            <RadioGroupItem
              value="monthly"
              className="h-auto w-full min-w-0 items-start py-2"
              childrenWrapperClassName="min-w-0 flex-col items-start gap-1"
            >
              <span className="text-body-small-medium text-text-primary">Monthly</span>
              <span className="text-body-small-regular text-text-secondary">
                Sent on the first day of the month.
              </span>
            </RadioGroupItem>
          </RadioGroup>
        </Dialog.Body>
        <Dialog.Footer divider>
          <Dialog.Close asChild>
            <Button mode="ghost">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button mode="primary" disabled={name.trim().length === 0}>
              Create
            </Button>
          </Dialog.Close>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Root>
  );
};
