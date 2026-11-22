'use client';

import { useState } from 'react';
import { CodeBlock } from '@/components/ui/code-block';

const SQL_QUERY = `select engine, count(*) as citations
from citations
where domain = 'acme.com'
group by engine
order by citations desc;`;

/** Interactive CodeBlock pairing a searchable language picker with controlled language state. */
export function CodeBlockLanguagePicker() {
  const [language, setLanguage] = useState('sql');

  return (
    <div className="w-full max-w-xl">
      <CodeBlock language={language} languagePicker={{ onLanguageChange: setLanguage }}>
        {SQL_QUERY}
      </CodeBlock>
    </div>
  );
}
