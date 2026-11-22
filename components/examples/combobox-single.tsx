'use client';

import { useId, useState, type ReactElement } from 'react';
import { Combobox } from '@/components/ui/combobox';

interface EngineIconProps {
  src: string;
}

/** Compact 18x18 app icon thumbnail for answer-engine options. */
function EngineIcon({ src }: EngineIconProps) {
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={18}
      height={18}
      loading="lazy"
      decoding="async"
      className="size-[18px] shrink-0 rounded-[4px] object-cover ring-1 ring-inset ring-black/8 dark:ring-white/12"
    />
  );
}

const ANSWER_ENGINES: { id: string; name: string; icon: ReactElement }[] = [
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    icon: (
      <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e7/f6/e3/e7f6e3fb-8e24-ba31-03ff-aba23d60841f/AppIcon-0-0-1x_U007epad-0-0-0-1-0-P3-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    icon: (
      <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/43/79/4e/43794ee1-9f87-0e0e-04ed-65a83d651633/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-85-220-0.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'gemini',
    name: 'Gemini',
    icon: (
      <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a9/c6/a3/a9c6a3d3-da87-9c4a-5264-9ca6e9a57e63/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-sRGB-0-0-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'claude',
    name: 'Claude',
    icon: (
      <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/2e/3a/d1/2e3ad179-9b94-5349-c0ac-a7cb14d60082/AppIcon-0-0-1x_U007epad-0-1-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'copilot',
    name: 'Copilot',
    icon: (
      <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/52/e5/b0/52e5b06a-e386-c80e-153d-942cfbf1ff23/AppIcon_Production-0-0-1x_U007epad-0-4-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'grok',
    name: 'Grok',
    icon: (
      <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/e5/a4/66/e5a466ce-0fcf-a0ed-9534-e7ac186fbe59/AppIcon-0-0-1x_U007epad-0-0-0-1-0-0-P3-0-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    icon: (
      <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple221/v4/36/15/d6/3615d606-7353-b06f-0071-d1f099d2266f/AppIcon-0-0-1x_U007epad-0-1-0-sRGB-0-85-220.png/1024x1024bb.jpg" />
    ),
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    icon: (
      <EngineIcon src="https://is1-ssl.mzstatic.com/image/thumb/Purple211/v4/a5/c7/f7/a5c7f72f-ef99-7a2e-5489-f9ce977a11b1/AppIcon-0-0-1x_U007epad-0-1-0-sRGB-85-220.png/1024x1024bb.jpg" />
    ),
  },
];

/** Single-select Combobox styled as a full-width form control matching its trigger width. */
export const ComboboxSingle = () => {
  const labelId = useId();
  const triggerId = useId();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('chatgpt');
  const selected = ANSWER_ENGINES.find((engine) => engine.id === value);

  return (
    <div className="flex w-full max-w-72 flex-col gap-1.5">
      <span id={labelId} className="text-body-small-medium text-text-primary">
        Answer engine
      </span>
      <Combobox.Root open={open} onOpenChange={setOpen}>
        <Combobox.Trigger
          id={triggerId}
          aria-labelledby={`${labelId} ${triggerId}`}
          fullSizeAndButtonWithChevronToTheRight
          className="w-full"
          iconStart={selected?.icon}
        >
          {selected?.name}
        </Combobox.Trigger>
        <Combobox.Content align="start" fullWidth>
          <Combobox.Command>
            <Combobox.Input placeholder="Search answer engines" autoFocus />
            <Combobox.List height={240}>
              <Combobox.Empty>No answer engines found</Combobox.Empty>
              <Combobox.Group>
                {ANSWER_ENGINES.map((engine) => (
                  <Combobox.Item
                    key={engine.id}
                    value={engine.id}
                    keywords={[engine.name]}
                    start={engine.icon}
                    end={
                      engine.id === value
                        ? { name: 'check', className: 'text-text-secondary' }
                        : undefined
                    }
                    onSelect={() => {
                      setValue(engine.id);
                      setOpen(false);
                    }}
                  >
                    {engine.name}
                  </Combobox.Item>
                ))}
              </Combobox.Group>
            </Combobox.List>
          </Combobox.Command>
        </Combobox.Content>
      </Combobox.Root>
    </div>
  );
};
