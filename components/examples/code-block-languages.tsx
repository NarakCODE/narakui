import { CodeBlock } from '@/components/ui/code-block';

const PYTHON_SNIPPET = `import pandas as pd

mentions = pd.read_csv("answer_engine_mentions.csv")
share = mentions.groupby("engine")["brand_mentioned"].mean()
print(share.sort_values(ascending=False).round(2))`;

/** Demonstrates explicit language grammars alongside automatic shell detection. */
export function CodeBlockLanguages() {
  return (
    <div className="flex w-full max-w-xl flex-col gap-3">
      <CodeBlock language="python">{PYTHON_SNIPPET}</CodeBlock>
      <CodeBlock>
        {'curl -H "Authorization: Bearer $PROFOUND_API_KEY" https://api.tryprofound.com/v1/prompts'}
      </CodeBlock>
    </div>
  );
}
