'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';

/** Default, disabled, read-only, and live-validated error input states. */
export function InputStates() {
  const [domain, setDomain] = useState('globex');
  const isInvalid = !domain.includes('.');

  return (
    <div className="w-full max-w-sm space-y-4">
      <Input label="Report name" placeholder="Weekly visibility report" />
      <Input label="Organization ID" defaultValue="org_8f2k19" disabled />
      <Input label="Workspace URL" defaultValue="app.tryprofound.com/acme" readOnly />
      <Input
        label="Competitor domain"
        value={domain}
        onChange={(event) => setDomain(event.target.value)}
        error={isInvalid}
        errorMessage="Enter a domain such as globex.com"
      />
    </div>
  );
}
