import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const REPORT_SECTIONS = [
  {
    title: 'Visibility',
    description: 'Your brand appeared in 42% of answers, up 6 points from last month.',
  },
  {
    title: 'Citations',
    description: 'nike.com and runnersworld.com were the most cited sources.',
  },
  {
    title: 'Sentiment',
    description: 'Answers describe your products as durable and good value.',
  },
];

/** Separators dividing multi-section report blocks without trailing dividers. */
export function SeparatorInContent() {
  return (
    <Card padding="sm" className="w-full max-w-sm">
      <div className="flex flex-col gap-4">
        {REPORT_SECTIONS.map((section, index) => (
          <div key={section.title} className="flex flex-col gap-4">
            {index > 0 ? <Separator /> : null}
            <div className="flex flex-col gap-1">
              <h4 className="text-body-small-medium text-text-primary">
                {section.title}
              </h4>
              <p className="text-body-small-regular text-text-secondary">
                {section.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
