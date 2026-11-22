import { CircleCheck, CircleX, Info, TriangleAlert, type LucideIcon } from 'lucide-react';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  type AlertVariant,
} from '@/components/ui/alert';
import { Card } from '@/components/ui/card';

const ALERTS: { variant: AlertVariant; icon: LucideIcon; title: string; description: string }[] = [
  {
    variant: 'default',
    icon: Info,
    title: 'How this visibility score works',
    description: 'It reflects tracked prompts in your category over the selected range.',
  },
  {
    variant: 'warning',
    icon: TriangleAlert,
    title: 'Prompt refresh budget is almost used',
    description: 'You are near this month’s refresh limit for this category.',
  },
  {
    variant: 'success',
    icon: CircleCheck,
    title: 'Citation export is ready',
    description: 'Your CSV finished generating and is ready to download.',
  },
  {
    variant: 'destructive',
    icon: CircleX,
    title: 'Answer engine data did not load',
    description: 'We could not load responses for this run. Retry shortly.',
  },
];

/** Showcases all four Alert variants on a primary card surface. */
export function AlertVariants() {
  return (
    <Card padding="sm" className="flex w-full max-w-xl flex-col gap-3">
      {ALERTS.map(({ variant, icon: Icon, title, description }) => (
        <Alert key={variant} variant={variant}>
          <AlertIcon>
            <Icon />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>{title}</AlertTitle>
            <AlertDescription>{description}</AlertDescription>
          </AlertContent>
        </Alert>
      ))}
    </Card>
  );
}
