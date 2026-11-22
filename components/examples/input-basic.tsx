'use client';

import { Input } from '@/components/ui/input';

/** Basic labeled inputs demonstrating optional and required fields. */
export function InputBasic() {
  return (
    <div className="w-full max-w-sm space-y-4">
      <Input label="Brand name" placeholder="Acme" />
      <Input label="Website" placeholder="acme.com" required />
    </div>
  );
}
