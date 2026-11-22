import { CodeBlock } from '@/components/ui/code-block';

const TOOL_OUTPUT = JSON.stringify(
  {
    prompt: 'What is the best CRM for a startup?',
    engines: [
      { name: 'ChatGPT', mentioned: true, position: 2, citations: ['hubspot.com', 'g2.com'] },
      {
        name: 'Perplexity',
        mentioned: true,
        position: 1,
        citations: ['techcrunch.com', 'acme.com'],
      },
      { name: 'Gemini', mentioned: false, position: null, citations: ['forbes.com'] },
      { name: 'Copilot', mentioned: true, position: 4, citations: ['capterra.com'] },
    ],
    visibilityScore: 0.62,
  },
  null,
  2,
);

/** Caps code panel height with preClassName while scrolling both horizontally and vertically. */
export function CodeBlockMaxHeight() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock language="json" preClassName="max-h-60">
        {TOOL_OUTPUT}
      </CodeBlock>
    </div>
  );
}
