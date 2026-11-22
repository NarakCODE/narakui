import { BotOff, FilePenLine } from 'lucide-react';
import { Banner } from '@/components/ui/banner';

export function BannerAccentExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Banner
        color="blue"
        icon={<FilePenLine />}
        coloredTitle
        title="It's your turn to review"
        description="Comment or suggest changes in the document, then approve or request changes."
      />
      <Banner
        color="grey"
        icon={<BotOff />}
        iconColor="red"
        title="Agent runs disabled"
        description="Runs are blocked by your organization's billing limits. Contact your billing admin."
      />
      <Banner
        color="green"
        icon="success"
        coloredTitle
        title="This review is done"
        description="Approvers can now only view the copy."
      />
    </div>
  );
}
