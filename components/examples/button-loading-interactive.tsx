'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** Interactive loading toggle showing centered spinner overlay without layout reflow. */
export function ButtonLoadingInteractive() {
  const [isSaving, setIsSaving] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleSave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsSaving(true);
    timerRef.current = setTimeout(() => {
      setIsSaving(false);
      timerRef.current = null;
    }, 2000);
  };

  return (
    <Card padding="md" className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button loading={{ isLoading: isSaving }} onClick={handleSave}>
        Save changes
      </Button>
    </Card>
  );
}
