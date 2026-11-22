'use client';

import { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { Breadcrumb, BreadcrumbItem, BreadcrumbSlot } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const AGENTS = ['Weekly visibility digest', 'Citation monitor', 'Competitor launch tracker'];

/** Demonstrates a custom switcher menu embedded in BreadcrumbSlot with matching truncation behavior. */
export function BreadcrumbCustomSlot() {
  const [agent, setAgent] = useState(AGENTS[0]);

  return (
    <Breadcrumb className="flex-initial">
      <BreadcrumbItem href="#agents" label="Agents" />
      <BreadcrumbSlot>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="small"
              className="w-full min-w-0 max-w-60 justify-between text-body-small-medium text-text-primary"
            >
              <span className="min-w-0 truncate">{agent}</span>
              <ChevronDown className="size-3.5 text-fill-secondary" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-60">
            {AGENTS.map((name) => (
              <DropdownMenuItem
                key={name}
                className="justify-between"
                onSelect={() => setAgent(name)}
              >
                <span className="truncate">{name}</span>
                {name === agent ? <Check className="size-4 text-text-primary" /> : null}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </BreadcrumbSlot>
    </Breadcrumb>
  );
}
