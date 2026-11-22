import { Banner } from '@/components/ui/banner';

export function BannerColorsExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Banner icon="success" title="Your Shopify store is connected" />
      <Banner color="blue" icon="info" title="Syncing project context from Notion" />
      <Banner
        color="orange"
        icon="warning"
        title="Some prompts could not be refreshed this week"
      />
      <Banner
        color="red"
        icon="error"
        role="alert"
        title="We couldn't save your settings. Please try again."
      />
      <Banner
        color="grey"
        icon="info"
        title="This workspace is shared with your agency"
      />
      <Banner
        color="white"
        icon="info"
        title="Profound is missing context to personalize your chats"
      />
    </div>
  );
}
