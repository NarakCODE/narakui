import { Banner } from '@/components/ui/banner';

export function BannerWithDescriptionExample() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <Banner
        color="grey"
        icon="info"
        title="Migrated from Projects v1"
        description="Tasks became suggestions, chats were moved over read-only, and the report was added as context."
      />
      <Banner
        color="orange"
        icon="warning"
        title="Shopify is not enabled for this organization"
        description="Switch to an organization with Shopify enabled, or contact your administrator."
      />
    </div>
  );
}
