'use client';

import { Highlights, HighlightsGrid } from '@/components/ui/highlights';
import { Statistic } from '@/components/ui/statistic';

/** Loading HighlightsGrid showing skeletons sized per cell, with statistic skeletons only when `statisticProps` is set. */
export function HighlightsLoading() {
  return (
    <div className="w-full overflow-x-auto p-1">
      <HighlightsGrid columns={3} isLoading className="min-w-[540px]">
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
          title="Last report"
          bigValue="2 hours ago"
          endIcon="clock"
          bigValueSkeletonWidth="96px"
        />
      </HighlightsGrid>
    </div>
  );
}
