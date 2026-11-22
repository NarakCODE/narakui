'use client';

import { Button } from '@/components/ui/button';
import { useDrawerStore } from '@/components/ui/drawer';

const SAVED_VIEWS = [
  'Weekly visibility',
  'Competitor share of voice',
  'Top cited pages',
  'Sentiment by engine',
];

/** Left-side navigation drawer adjusting content padding with `contentClassName`. */
export const DrawerLeft = () => {
  return (
    <Button
      iconStart="bookmark"
      onClick={() =>
        useDrawerStore.getState().openDrawer({
          id: 'saved-views',
          placement: 'left',
          width: 360,
          header: { title: 'Saved views' },
          contentClassName: 'gap-1 px-4',
          content: SAVED_VIEWS.map((view) => (
            <Button
              key={view}
              mode="ghost"
              iconStart="chart-line"
              className="w-full justify-start"
              onClick={() => useDrawerStore.getState().closeDrawer('saved-views')}
            >
              {view}
            </Button>
          )),
        })
      }
    >
      Saved views
    </Button>
  );
};
