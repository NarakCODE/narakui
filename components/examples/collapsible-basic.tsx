import { ChevronRight, Link2 } from 'lucide-react';
import { Collapsible } from '@/components/ui/collapsible';

const CITED_SOURCES = ['nerdwallet.com', 'forbes.com/advisor', 'reddit.com/r/personalfinance'];

/** Basic Collapsible using the default ghost trigger with a rotating chevron. */
export function BasicCollapsible() {
  return (
    <Collapsible.Root defaultOpen className="w-full max-w-72">
      <Collapsible.Trigger spanClassName="flex items-center gap-1.5 text-body-small-medium text-text-primary">
        <ChevronRight
          aria-hidden="true"
          className="size-4 text-text-secondary transition-transform duration-200 ease-out group-data-[state=open]:rotate-90 motion-reduce:transition-none"
        />
        {CITED_SOURCES.length} sources cited
      </Collapsible.Trigger>
      <Collapsible.Content>
        <ul className="flex flex-col gap-1.5 pt-2 pl-7.5">
          {CITED_SOURCES.map((source) => (
            <li
              key={source}
              className="flex items-center gap-2 text-body-small-regular text-text-secondary"
            >
              <Link2 aria-hidden="true" className="size-3.5 shrink-0" />
              {source}
            </li>
          ))}
        </ul>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}
