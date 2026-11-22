'use client';

import { Highlights, HighlightsGrid } from '@/components/ui/highlights';
import { Statistic } from '@/components/ui/statistic';

/** Two-column wrapping HighlightsGrid with info tooltips and mixed value formats. */
export function HighlightsGridExample() {
  return (
    <HighlightsGrid columns={2} className="w-full max-w-xl">
      <Highlights
        title="Prompts tracked"
        bigValue={250}
        endIcon="search"
        tooltipContent="Prompts run daily across every answer engine"
      />
      <Highlights
        title="Answer engines"
        bigValue={6}
        endIcon="sparkles"
        tooltipContent="ChatGPT, Perplexity, Gemini, Copilot, Claude, and Google AI Overviews"
      />
      <Highlights
        title="Brand mentions"
        bigValue={3912}
        endIcon="megaphone"
        statisticProps={<Statistic value={318} className="text-body-small-medium" />}
      />
      <Highlights title="Last report" bigValue="2 hours ago" endIcon="clock" />
    </HighlightsGrid>
  );
}
