'use client';

import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Title,
  VideoPlayer,
  VideoSkin,
  YouTubeVideo,
} from '@/components/ui/video-player';

const DEMO_YOUTUBE_URL = 'https://youtu.be/hX9S94XsySk?si=Zv6Tdz3OiAAhGlnd';

const LOCALES = [
  {
    value: 'en',
    label: 'English',
    title: 'Demo video',
    description: 'Pick a language, then hover a button or open the settings menu.',
  },
  {
    value: 'es',
    label: 'Español',
    title: 'Video de demostración',
    description: 'Elige un idioma y pasa el cursor sobre un botón o abre el menú de ajustes.',
  },
  {
    value: 'pt-BR',
    label: 'Português',
    title: 'Vídeo de demonstração',
    description: 'Escolha um idioma e passe o cursor sobre um botão ou abra o menu de configurações.',
  },
  {
    value: 'fr',
    label: 'Français',
    title: 'Vidéo de démonstration',
    description: 'Choisissez une langue, puis survolez un bouton ou ouvrez le menu des réglages.',
  },
  {
    value: 'de',
    label: 'Deutsch',
    title: 'Demovideo',
    description: 'Wähle eine Sprache und bewege den Mauszeiger über eine Taste oder öffne die Einstellungen.',
  },
  {
    value: 'ja',
    label: '日本語',
    title: 'デモ動画',
    description: '言語を選び、ボタンにカーソルを合わせるか設定メニューを開いてください。',
  },
  {
    value: 'ar',
    label: 'العربية',
    title: 'فيديو تجريبي',
    description: 'اختر لغة، ثم مرّر المؤشر فوق أحد الأزرار أو افتح قائمة الإعدادات.',
  },
];

export function VideoPlayerLocaleExample() {
  const [locale, setLocale] = useState('ar');
  const active = LOCALES.find((item) => item.value === locale) ?? LOCALES[0];

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="w-160 max-w-full">
        <VideoPlayer title={active.title}>
          <VideoSkin className="aspect-video w-full" locale={locale}>
            <YouTubeVideo src={DEMO_YOUTUBE_URL} />
            <Title description={active.description} />
          </VideoSkin>
        </VideoPlayer>
      </div>

      <div className="max-w-full overflow-x-auto p-1">
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          spacing={0}
          aria-label="Player language"
          value={locale}
          onValueChange={(value) => {
            if (value) setLocale(value);
          }}
        >
          {LOCALES.map((item) => (
            <ToggleGroupItem key={item.value} value={item.value}>
              {item.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
