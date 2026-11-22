import { CodeBlockCopyButton } from '@/components/ui/code-block';

const IMPORT_PROMPT =
  'List everything you know about my role, my company, the products we sell and the competitors we track. Write it as short bullet points I can paste into Profound.';

/** Standalone CodeBlockCopyButton placed in the corner of a plain-text prompt card. */
export function CodeBlockCopyButtonStandalone() {
  return (
    <div className="relative w-full max-w-md rounded-md border border-fill-quaternary bg-bg-primary">
      <p className="px-4 py-3 pr-10 text-paragraph-small text-text-secondary">{IMPORT_PROMPT}</p>
      <div className="absolute top-2 right-2">
        <CodeBlockCopyButton text={IMPORT_PROMPT} copyLabel="Copy prompt" />
      </div>
    </div>
  );
}
