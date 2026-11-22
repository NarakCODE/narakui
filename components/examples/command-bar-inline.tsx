'use client';

import { Building2, Target } from 'lucide-react';
import { Command } from '@/components/ui/command-bar';

/** Inline searchable picker built directly with `Command.Root`. */
export const CommandBarInline = () => (
  <div className="w-full max-w-md overflow-hidden rounded-[12px] shadow-medium">
    <Command.Root label="Switch brand">
      <Command.Input aria-label="Search brands" placeholder="Search brands" />
      <Command.List>
        <Command.Empty>No brands found.</Command.Empty>
        <Command.Group heading="Your brands">
          <Command.Item>
            <Building2 aria-hidden="true" />
            Ramp
          </Command.Item>
          <Command.Item>
            <Building2 aria-hidden="true" />
            Ramp Bill Pay
          </Command.Item>
        </Command.Group>
        <Command.Separator />
        <Command.Group heading="Competitors">
          <Command.Item>
            <Target aria-hidden="true" />
            Brex
          </Command.Item>
          <Command.Item>
            <Target aria-hidden="true" />
            Mercury
          </Command.Item>
          <Command.Item>
            <Target aria-hidden="true" />
            Navan
          </Command.Item>
        </Command.Group>
      </Command.List>
    </Command.Root>
  </div>
);
