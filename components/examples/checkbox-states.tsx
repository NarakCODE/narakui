import { Checkbox } from '@/components/ui/checkbox';

/** Showcases unchecked, checked, indeterminate, disabled, and custom check color states. */
export function CheckboxStatesExample() {
  return (
    <div className="flex flex-col gap-2">
      <Checkbox>Email me a weekly visibility report</Checkbox>
      <Checkbox defaultChecked>Include citation sources</Checkbox>
      <Checkbox indeterminate>Some prompts selected</Checkbox>
      <Checkbox disabled>Export to Looker (not connected)</Checkbox>
      <Checkbox disabled checked>
        Track brand mentions (always on)
      </Checkbox>
      <Checkbox color="var(--color-fill-blue)" defaultChecked>
        Highlight in charts
      </Checkbox>
    </div>
  );
}
