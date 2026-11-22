import { CodeBlock } from '@/components/ui/code-block';

const VISIBILITY_REQUEST = `const response = await fetch('https://api.tryprofound.com/v1/reports/visibility', {
  method: 'POST',
  headers: { Authorization: \`Bearer \${apiKey}\` },
  body: JSON.stringify({ categoryId, startDate: '2026-10-01', endDate: '2026-10-31' }),
});
const { data } = await response.json();`;

/** Basic TypeScript CodeBlock showing hover/focus copy action. */
export function CodeBlockBasic() {
  return (
    <div className="w-full max-w-xl">
      <CodeBlock language="typescript">{VISIBILITY_REQUEST}</CodeBlock>
    </div>
  );
}
