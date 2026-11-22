'use client';

import { Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Toolbar } from '@/components/ui/toolbar';

export function ToolbarBulkActions() {
  return (
    <Card className="p-2">
      <Toolbar.Root
        aria-label="Actions for 3 selected reports"
        className="gap-1 sm:gap-2"
      >
        <span className="px-1 text-body-small-medium whitespace-nowrap text-text-primary tabular-nums sm:px-2">
          3 selected
        </span>
        <Toolbar.Separator className="h-6" />
        <Toolbar.Item>
          <Button
            iconStart={
              <Archive aria-hidden="true" className="text-fill-secondary" />
            }
          >
            Archive
          </Button>
        </Toolbar.Item>
        <Toolbar.Item>
          <Button iconStart="edit" mode="primary">
            Edit
          </Button>
        </Toolbar.Item>
        <Toolbar.Separator className="h-6" />
        <Toolbar.Item>
          <Button mode="ghost">Clear</Button>
        </Toolbar.Item>
      </Toolbar.Root>
    </Card>
  );
}
