'use client';

import { Button } from '@/components/ui/button';
import { useDrawerStore } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

/** Right-side form drawer with a custom footer receiving `closeDrawer`. */
export const DrawerRight = () => {
  return (
    <Button
      iconStart="edit"
      onClick={() =>
        useDrawerStore.getState().openDrawer({
          id: 'edit-audience-segment',
          width: 480,
          header: { title: 'Edit audience segment' },
          content: (
            <div className="flex flex-col gap-4">
              <Input label="Segment name" placeholder="Small business owners" />
              <Input label="Region" placeholder="United States" />
              <Textarea
                label="Description"
                placeholder="Founders and operators of companies with fewer than 50 employees."
              />
            </div>
          ),
          footer: {
            customRenderer: ({ closeDrawer }) => (
              <div className="flex justify-end gap-2 border-t border-fill-quaternary p-4">
                <Button mode="ghost" onClick={closeDrawer}>
                  Cancel
                </Button>
                <Button mode="primary" onClick={closeDrawer}>
                  Save
                </Button>
              </div>
            ),
          },
        })
      }
    >
      Edit segment
    </Button>
  );
};
