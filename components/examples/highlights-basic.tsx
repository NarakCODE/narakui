'use client';

import { Highlights, HighlightsGrid } from '@/components/ui/highlights';
import { Statistic } from '@/components/ui/statistic';

/** Three-column HighlightsGrid pairing formatted values, icons, and signed delta statistics. */
export function HighlightsBasic() {
  return (
    <div className="w-full overflow-x-auto p-1">
      <HighlightsGrid columns={3} className="min-w-[540px]">
        <Highlights
          title="Visibility score"
          bigValue="42.8%"
          endIcon="eye"
          statisticProps={
            <Statistic value={0.034} type="percentage" className="text-body-small-medium" />
          }
        />
        <Highlights
          title="Share of voice"
          bigValue="18.2%"
          endIcon="chart-pie"
          statisticProps={
            <Statistic value={-0.012} type="percentage" className="text-body-small-medium" />
          }
        />
        <Highlights
          title="Citations"
          bigValue={12480}
          endIcon="link"
          statisticProps={<Statistic value={1240} className="text-body-small-medium" />}
        />
      </HighlightsGrid>
    </div>
  );
}
