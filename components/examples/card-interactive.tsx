'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const PROFILES = [
  {
    id: 'balanced',
    title: 'Standard visibility crawl',
    subtitle: 'Runs daily across 5 answer engines',
    badge: 'Recommended',
    stat: '140 prompts',
    meta: 'Last synced 12m ago',
  },
  {
    id: 'realtime',
    title: 'High-frequency pulse',
    subtitle: 'Checks hourly for competitive shifts',
    badge: 'Live',
    stat: '480 prompts',
    meta: 'Low latency queue',
  },
] as const;

/** Interactive liquid glass cards with cursor-lit specular rims and tactile press feedback. */
export function CardInteractiveExample() {
  const [selectedId, setSelectedId] = useState<string>('balanced');

  return (
    <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
      {PROFILES.map((profile) => {
        const isSelected = selectedId === profile.id;

        return (
          <Card
            key={profile.id}
            interactive
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onClick={() => setSelectedId(profile.id)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                setSelectedId(profile.id);
              }
            }}
            className={isSelected ? 'ring-1 ring-blue-base/45' : undefined}
          >
            <CardHeader>
              <CardTitle>{profile.title}</CardTitle>
              <CardDescription>{profile.subtitle}</CardDescription>
              <CardAction>
                <Badge
                  title={profile.badge}
                  type={isSelected ? 'blue' : 'gray'}
                  size="small"
                  iconStart={isSelected ? <Sparkles /> : undefined}
                />
              </CardAction>
            </CardHeader>
            <CardContent>
              <p className="text-title-mini-semibold text-text-primary tabular-nums">
                {profile.stat}
              </p>
            </CardContent>
            <CardFooter className="justify-between border-t border-border-gray/60 text-body-mini-regular text-text-secondary">
              <span>{profile.meta}</span>
              <span>{isSelected ? 'Selected' : 'Select'}</span>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
