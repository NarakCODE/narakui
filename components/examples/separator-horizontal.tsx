import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

/** Default horizontal Separator dividing a report summary header from its details. */
export function SeparatorHorizontal() {
  return (
    <Card padding="sm" className="w-full max-w-sm">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <h4 className="text-body-small-medium text-text-primary">
            Weekly visibility report
          </h4>
          <p className="text-body-small-regular text-text-secondary">
            Sent every Monday to 4 teammates
          </p>
        </div>
        <Separator />
        <p className="text-body-small-regular text-text-secondary">
          Covers ChatGPT, Perplexity, and Google AI Overviews for the Running shoes
          category.
        </p>
      </div>
    </Card>
  );
}
