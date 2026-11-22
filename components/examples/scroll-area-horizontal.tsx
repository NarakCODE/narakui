import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const ENGINES = [
  { name: 'ChatGPT', visibility: '48%' },
  { name: 'Perplexity', visibility: '41%' },
  { name: 'Gemini', visibility: '36%' },
  { name: 'Copilot', visibility: '29%' },
  { name: 'Claude', visibility: '33%' },
  { name: 'AI Overviews', visibility: '24%' },
  { name: 'Grok', visibility: '18%' },
  { name: 'Meta AI', visibility: '15%' },
];

export function ScrollAreaHorizontal() {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <ScrollArea
        orientation="horizontal"
        viewportLabel="Visibility by answer engine"
      >
        <div className="flex w-max gap-3 p-4">
          {ENGINES.map((engine) => (
            <div
              key={engine.name}
              className="flex w-28 shrink-0 flex-col gap-1 rounded-md bg-bg-secondary p-3"
            >
              <p className="text-body-mini-regular text-text-secondary">
                {engine.name}
              </p>
              <p className="text-title-mini-semibold text-text-primary tabular-nums">
                {engine.visibility}
              </p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
