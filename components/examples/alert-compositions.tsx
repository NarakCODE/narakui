import { Info } from 'lucide-react';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

/** Demonstrates optional Alert slot compositions from description-only to icon + content. */
export function AlertCompositions() {
  return (
    <Card padding="sm" className="flex w-full max-w-xl flex-col gap-3">
      <Alert variant="warning">
        <AlertDescription>GA4 mapping is incomplete for this domain.</AlertDescription>
      </Alert>
      <Alert>
        <AlertContent>
          <AlertTitle>Select a category to compare brands</AlertTitle>
        </AlertContent>
      </Alert>
      <Alert>
        <AlertIcon>
          <Info />
        </AlertIcon>
        <AlertDescription>IndexNow pings supported engines when you publish.</AlertDescription>
      </Alert>
    </Card>
  );
}
