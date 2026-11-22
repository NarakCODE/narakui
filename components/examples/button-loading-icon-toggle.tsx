'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** Interactive demo where the spinner replaces the start icon while keeping the label visible. */
export function ButtonLoadingIconToggle() {
  const [isAdding, setIsAdding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleAdd = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsAdding(true);
    timerRef.current = setTimeout(() => {
      setIsAdding(false);
      timerRef.current = null;
    }, 2000);
  };

  return (
    <Card padding="md" className="flex flex-row flex-wrap items-center justify-center gap-2">
      <Button loading={{ isLoading: isAdding }} iconStart="plus" onClick={handleAdd}>
        Add prompt
      </Button>
    </Card>
  );
}
