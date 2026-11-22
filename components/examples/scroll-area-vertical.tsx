import { Card } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

const PROMPTS = [
  'Best project management software for startups',
  'Asana vs Monday for marketing teams',
  'Which CRM integrates with Slack?',
  'Top tools for remote team collaboration',
  'Is Notion good for product roadmaps?',
  'Cheapest Jira alternative for small teams',
  'How do agencies track client approvals?',
  'Best Gantt chart software in 2026',
  'Project tracking tools with time tracking',
  'Kanban apps that work offline',
  'What do engineering managers use for sprint planning?',
  'Free task manager with recurring tasks',
];

export function ScrollAreaVertical() {
  return (
    <Card className="w-full max-w-sm overflow-hidden">
      <ScrollArea viewportLabel="Tracked prompts" className="h-[200px]">
        <ul className="divide-y divide-fill-quaternary">
          {PROMPTS.map((prompt) => (
            <li
              key={prompt}
              className="px-4 py-2.5 text-body-small-regular text-text-primary"
            >
              {prompt}
            </li>
          ))}
        </ul>
      </ScrollArea>
    </Card>
  );
}
