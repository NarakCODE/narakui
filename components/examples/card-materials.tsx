import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  type CardMaterial,
  type CardVariant,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

const BACKDROP_IMAGE_URL =
  'https://pbs.twimg.com/media/HXFVDx_aIAE0VBc?format=jpg&name=4096x4096';

const MATERIALS: {
  variant: CardVariant;
  material: CardMaterial;
  refract?: boolean;
  label: string;
  summary: string;
  detail: string;
  className?: string;
}[] = [
  {
    variant: 'liquid-glass',
    material: 'frosted',
    refract: false,
    label: 'Frosted',
    summary: 'Balanced 14px blur with luminous specular bevel.',
    detail: 'Diffuses busy backgrounds while preserving AA contrast.',
  },
  {
    variant: 'liquid-glass',
    material: 'clear',
    refract: false,
    label: 'Clear',
    summary: 'High-clarity crystal glass over rich media.',
    detail: 'Minimal tint with 6px optical blur and vivid saturation.',
  },
  {
    variant: 'liquid-glass',
    material: 'tinted',
    refract: false,
    label: 'Tinted',
    summary: 'Chromatic surface wash with glass rim light.',
    detail: 'Holds brand or semantic color while keeping edge depth.',
    className: 'bg-bg-blue/90',
  },
  {
    variant: 'default',
    material: 'solid',
    label: 'Default (solid)',
    summary: 'Matte opaque NarakUI surface.',
    detail: 'Zero bleed-through for nested cards or dense data.',
  },
];

/** Compares liquid glass material presets alongside the default matte Card over a full-bleed photo backdrop. */
export function CardMaterialsExample() {
  return (
    <div className="relative isolate -m-8 flex w-[calc(100%+4rem)] items-center justify-center overflow-hidden p-6 sm:p-10">
      <img
        src={BACKDROP_IMAGE_URL}
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover select-none"
      />

      <div className="grid w-full max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {MATERIALS.map((item) => (
          <Card
            key={item.label}
            variant={item.variant}
            material={item.material}
            refract={item.refract}
            className={cn(item.className)}
          >
            <CardHeader>
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>{item.summary}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-body-mini-regular text-text-secondary">
                {item.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
