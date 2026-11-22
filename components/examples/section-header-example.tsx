'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Section, SectionHeader } from '@/components/ui/section-header';

const OPPORTUNITIES = [
  { domain: 'g2.com', competitors: 4 },
  { domain: 'capterra.com', competitors: 3 },
  { domain: 'zapier.com/blog', competitors: 2 },
];

/** Section wrapping a SectionHeader (with badge, info tooltip, and action button) and a Card list. */
export function SectionHeaderExample() {
  return (
    <Section className="w-full">
      <SectionHeader
        title="Citation opportunities"
        subtitle="Sites that cite your competitors but not your brand."
        tooltipContent="Updated daily from your tracked prompts"
        badge={<Badge title="Beta" type="blue" size="small" />}
        className="gap-4 max-sm:flex-col"
        childrenClassName="max-sm:mt-0"
      >
        <Button size="small" iconStart="download">
          Export
        </Button>
      </SectionHeader>
      <Card>
        <ul className="divide-y divide-fill-quaternary">
          {OPPORTUNITIES.map((opportunity) => (
            <li
              key={opportunity.domain}
              className="flex items-center justify-between gap-4 px-4 py-3"
            >
              <span className="text-body-small-medium text-text-primary">{opportunity.domain}</span>
              <span className="text-body-small-regular text-text-secondary">
                Cites {opportunity.competitors} competitors
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </Section>
  );
}
