'use client';

import { useState } from 'react';
import { Banner } from '@/components/ui/banner';
import { Button } from '@/components/ui/button';

export function BannerWithActionsExample() {
  const [dismissed, setDismissed] = useState(false);

  return (
    <div className="flex w-full max-w-xl flex-col items-center gap-3">
      {dismissed ? (
        <Button variant="outline" size="small" onClick={() => setDismissed(false)}>
          Show banner again
        </Button>
      ) : (
        <Banner
          color="grey"
          icon="warning"
          title="Your brand was not found in answer engine results"
          description="Try adding brand aliases or updating the prompts you track."
          primaryAction={
            <Button variant="outline" size="small">
              Add aliases
            </Button>
          }
          secondaryAction={
            <Button variant="ghost" size="small">
              Edit prompts
            </Button>
          }
          onDismiss={() => setDismissed(true)}
          className="w-full flex-wrap"
          contentClassName="min-w-56"
        />
      )}
      <Banner
        color="red"
        icon="error"
        role="alert"
        title="We couldn't load your boards. Your saved settings haven't changed."
        primaryAction={
          <Button variant="outline" size="small">
            Try again
          </Button>
        }
        className="w-full"
      />
    </div>
  );
}
