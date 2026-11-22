'use client';

import { Button } from '@/components/ui/button';
import { useDrawerStore } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/** Wide 800px multi-column form drawer filling the viewport on small screens. */
export const DrawerWide = () => {
  return (
    <Button
      iconStart="plus"
      onClick={() =>
        useDrawerStore.getState().openDrawer({
          id: 'add-brand-kit',
          width: 800,
          header: { title: 'Add brand kit' },
          content: (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Input label="Brand name" placeholder="Ramp" />
                <Input label="Website" placeholder="ramp.com" />
                <Input label="Industry" placeholder="Corporate cards" />
                <Input label="Primary competitor" placeholder="Brex" />
              </div>
              <Textarea
                label="Voice and tone"
                placeholder="Confident and plain-spoken. Lead with savings and speed, avoid jargon."
              />
            </div>
          ),
          footer: {
            customRenderer: ({ closeDrawer }) => (
              <div className="flex justify-between gap-2 border-t border-fill-quaternary p-4">
                <Button mode="ghost" onClick={closeDrawer}>
                  Reset
                </Button>
                <div className="flex gap-2">
                  <Button mode="ghost" onClick={closeDrawer}>
                    Cancel
                  </Button>
                  <Button mode="primary" onClick={closeDrawer}>
                    Add brand kit
                  </Button>
                </div>
              </div>
            ),
          },
        })
      }
    >
      Add brand kit
    </Button>
  );
};
