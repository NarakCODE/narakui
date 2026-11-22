import { Button } from '@/components/ui/button';
import { Collapsible } from '@/components/ui/collapsible';
import { Input } from '@/components/ui/input';

/** Collapsible advanced form settings triggered by a ghost Button via asChild. */
export function FormCollapsible() {
  return (
    <div className="flex w-full max-w-80 flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="collapsible-website" className="text-body-small-medium text-text-primary">
          Website
        </label>
        <Input id="collapsible-website" placeholder="ramp.com" />
      </div>
      <Collapsible.Root className="flex flex-col gap-2">
        <Collapsible.Trigger asChild>
          <Button
            mode="ghost"
            className="group self-start"
            iconStart="settings"
            iconEnd={{
              name: 'chevron-down',
              className:
                'transition-transform duration-200 ease-out group-data-[state=open]:rotate-180 motion-reduce:transition-none',
            }}
          >
            Advanced settings
          </Button>
        </Collapsible.Trigger>
        <Collapsible.Content>
          <div className="flex flex-col gap-3 p-1">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="collapsible-max-pages"
                className="text-body-small-medium text-text-primary"
              >
                Max pages to crawl
              </label>
              <Input id="collapsible-max-pages" type="number" placeholder="500" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="collapsible-excluded-paths"
                className="text-body-small-medium text-text-primary"
              >
                Excluded paths
              </label>
              <Input id="collapsible-excluded-paths" placeholder="/careers, /legal" />
              <p className="text-body-mini-regular text-text-secondary">
                Separate paths with commas.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button mode="ghost">Reset</Button>
              <Button mode="primary">Save</Button>
            </div>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </div>
  );
}
