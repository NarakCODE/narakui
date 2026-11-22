import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const ENGINE_SHARES = [
  { engine: 'ChatGPT', share: '48%' },
  { engine: 'Perplexity', share: '31%' },
  { engine: 'Google AI Overviews', share: '21%' },
];

/** Separators placed between compact list rows using tabular-nums share values. */
export function SeparatorInList() {
  return (
    <Card className="w-full max-w-xs px-4 py-1.5">
      <div className="flex flex-col">
        {ENGINE_SHARES.map((row, index) => (
          <div key={row.engine}>
            {index > 0 ? <Separator /> : null}
            <div className="flex items-center justify-between gap-4 py-2.5">
              <span className="text-body-small-regular text-text-primary">
                {row.engine}
              </span>
              <span className="text-body-small-regular text-text-secondary tabular-nums">
                {row.share}
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
