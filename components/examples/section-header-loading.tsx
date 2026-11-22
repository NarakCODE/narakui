import { SectionHeader } from '@/components/ui/section-header';

/** Loading state swapping both title and subtitle for skeleton placeholders. */
export function SectionHeaderLoading() {
  return (
    <div className="w-full">
      <SectionHeader
        title="Citation opportunities"
        subtitle="Sites that cite your competitors but not your brand."
        isTitleLoading
        isSubtitleLoading
      />
    </div>
  );
}
