'use client';

import { Input } from '@/components/ui/input';

/** Three input height scales: mini, small, and regular. */
export function InputSizes() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Input label="Mini" placeholder="Search prompts" size="mini" iconStart="search" />
      <Input label="Small" placeholder="Search prompts" size="small" iconStart="search" />
      <Input label="Regular" placeholder="Search prompts" iconStart="search" />
    </div>
  );
}
