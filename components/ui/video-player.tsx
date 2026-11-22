'use client';

import * as React from 'react';
import {
  AlertCircle,
  Captions,
  Check,
  Maximize,
  Minimize,
  Pause,
  PictureInPicture2,
  Play,
  RotateCcw,
  RotateCw,
  Settings,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const VIDEO_PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type VideoPlaybackRate = (typeof VIDEO_PLAYBACK_RATES)[number];

export interface VideoChapter {
  startTime: number;
  title: string;
}

const RTL_LANGS = new Set(['ar', 'dv', 'fa', 'he', 'ku', 'ps', 'sd', 'ug', 'ur', 'yi']);

interface VideoTranslations {
  play: string;
  pause: string;
  skipBack: string;
  skipForward: string;
  mute: string;
  unmute: string;
  timeline: string;
  volume: string;
  speed: string;
  captions: string;
  captionsOn: string;
  captionsOff: string;
  settings: string;
  quality: string;
  qualityAuto: string;
  pip: string;
  fullscreen: string;
  exitFullscreen: string;
  buffering: string;
  error: string;
  upNext: string;
  dismiss: string;
}

const VIDEO_TRANSLATIONS: Record<string, VideoTranslations> = {
  en: {
    play: 'Play',
    pause: 'Pause',
    skipBack: 'Seek back 10 seconds',
    skipForward: 'Seek forward 10 seconds',
    mute: 'Mute',
    unmute: 'Unmute',
    timeline: 'Seek timeline',
    volume: 'Volume',
    speed: 'Speed',
    captions: 'Captions',
    captionsOn: 'On',
    captionsOff: 'Off',
    settings: 'Settings',
    quality: 'Quality',
    qualityAuto: 'Auto',
    pip: 'Picture-in-Picture',
    fullscreen: 'Fullscreen',
    exitFullscreen: 'Exit fullscreen',
    buffering: 'Buffering video',
    error: 'This video can’t be played.',
    upNext: 'Up next',
    dismiss: 'Dismiss',
  },
  es: {
    play: 'Reproducir',
    pause: 'Pausar',
    skipBack: 'Retroceder 10 segundos',
    skipForward: 'Adelantar 10 segundos',
    mute: 'Silenciar',
    unmute: 'Activar sonido',
    timeline: 'Línea de tiempo',
    volume: 'Volumen',
    speed: 'Velocidad',
    captions: 'Subtítulos',
    captionsOn: 'Activados',
    captionsOff: 'Desactivados',
    settings: 'Ajustes',
    quality: 'Calidad',
    qualityAuto: 'Automática',
    pip: 'Imagen en imagen',
    fullscreen: 'Pantalla completa',
    exitFullscreen: 'Salir de pantalla completa',
    buffering: 'Cargando video',
    error: 'No se puede reproducir este video.',
    upNext: 'A continuación',
    dismiss: 'Cerrar',
  },
  pt: {
    play: 'Reproduzir',
    pause: 'Pausar',
    skipBack: 'Voltar 10 segundos',
    skipForward: 'Avançar 10 segundos',
    mute: 'Silenciar',
    unmute: 'Ativar som',
    timeline: 'Linha do tempo',
    volume: 'Volume',
    speed: 'Velocidade',
    captions: 'Legendas',
    captionsOn: 'Ativadas',
    captionsOff: 'Desativadas',
    settings: 'Configurações',
    quality: 'Qualidade',
    qualityAuto: 'Automática',
    pip: 'Picture-in-Picture',
    fullscreen: 'Tela cheia',
    exitFullscreen: 'Sair da tela cheia',
    buffering: 'Carregando vídeo',
    error: 'Não foi possível reproduzir este vídeo.',
    upNext: 'A seguir',
    dismiss: 'Dispensar',
  },
  fr: {
    play: 'Lire',
    pause: 'Pause',
    skipBack: 'Reculer de 10 secondes',
    skipForward: 'Avancer de 10 secondes',
    mute: 'Couper le son',
    unmute: 'Réactiver le son',
    timeline: 'Barre de progression',
    volume: 'Volume',
    speed: 'Vitesse',
    captions: 'Sous-titres',
    captionsOn: 'Activés',
    captionsOff: 'Désactivés',
    settings: 'Réglages',
    quality: 'Qualité',
    qualityAuto: 'Automatique',
    pip: 'Image dans l’image',
    fullscreen: 'Plein écran',
    exitFullscreen: 'Quitter le plein écran',
    buffering: 'Mise en mémoire tampon',
    error: 'Impossible de lire cette vidéo.',
    upNext: 'À suivre',
    dismiss: 'Ignorer',
  },
  de: {
    play: 'Abspielen',
    pause: 'Pause',
    skipBack: '10 Sekunden zurück',
    skipForward: '10 Sekunden vor',
    mute: 'Stummschalten',
    unmute: 'Ton einschalten',
    timeline: 'Zeitleiste',
    volume: 'Lautstärke',
    speed: 'Geschwindigkeit',
    captions: 'Untertitel',
    captionsOn: 'Ein',
    captionsOff: 'Aus',
    settings: 'Einstellungen',
    quality: 'Qualität',
    qualityAuto: 'Automatisch',
    pip: 'Bild-in-Bild',
    fullscreen: 'Vollbild',
    exitFullscreen: 'Vollbild beenden',
    buffering: 'Video wird gepuffert',
    error: 'Dieses Video kann nicht abgespielt werden.',
    upNext: 'Als Nächstes',
    dismiss: 'Schließen',
  },
  ja: {
    play: '再生',
    pause: '一時停止',
    skipBack: '10秒戻る',
    skipForward: '10秒進む',
    mute: 'ミュート',
    unmute: 'ミュート解除',
    timeline: 'タイムライン',
    volume: '音量',
    speed: '再生速度',
    captions: '字幕',
    captionsOn: 'オン',
    captionsOff: 'オフ',
    settings: '設定',
    quality: '画質',
    qualityAuto: '自動',
    pip: 'ピクチャーインピクチャー',
    fullscreen: '全画面',
    exitFullscreen: '全画面を終了',
    buffering: '読み込み中',
    error: 'この動画は再生できません。',
    upNext: '次の動画',
    dismiss: '閉じる',
  },
  ar: {
    play: 'تشغيل',
    pause: 'إيقاف مؤقت',
    skipBack: 'الرجوع 10 ثوانٍ',
    skipForward: 'التقديم 10 ثوانٍ',
    mute: 'كتم الصوت',
    unmute: 'إلغاء كتم الصوت',
    timeline: 'شريط التقدم',
    volume: 'مستوى الصوت',
    speed: 'السرعة',
    captions: 'الترجمة',
    captionsOn: 'مفعّلة',
    captionsOff: 'متوقفة',
    settings: 'الإعدادات',
    quality: 'الجودة',
    qualityAuto: 'تلقائي',
    pip: 'صورة داخل صورة',
    fullscreen: 'ملء الشاشة',
    exitFullscreen: 'إنهاء ملء الشاشة',
    buffering: 'جارٍ التحميل',
    error: 'تعذّر تشغيل هذا الفيديو.',
    upNext: 'التالي',
    dismiss: 'تجاهل',
  },
};

function getVideoTranslations(locale?: string): VideoTranslations {
  if (!locale) return VIDEO_TRANSLATIONS.en;
  const base = locale.toLowerCase().split('-')[0];
  return VIDEO_TRANSLATIONS[base] ?? VIDEO_TRANSLATIONS.en;
}

function isRtlLocale(locale?: string): boolean {
  if (!locale) return false;
  const base = locale.toLowerCase().split('-')[0];
  return RTL_LANGS.has(base);
}

export function formatVideoTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  const totalSeconds = Math.floor(seconds);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// ---------------------------------------------------------------------------
// Persisted Viewer Preferences Store (`player:preferences`)
// ---------------------------------------------------------------------------

const PREFS_STORAGE_KEY = 'player:preferences';

export interface VideoUserPreferencesData {
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
  captions?: string;
  captionsLocale?: string;
  captionsOff?: boolean;
  audio?: string;
  audioLocale?: string;
}

export interface VideoUserPreferencesState extends VideoUserPreferencesData {
  save: (preferences: Partial<VideoUserPreferencesData>) => void;
  reset: () => void;
}

let prefsData: VideoUserPreferencesData = {};
let prefsHydrated = false;
const prefsListeners = new Set<() => void>();

function readPrefsFromStorage(): VideoUserPreferencesData {
  if (typeof window === 'undefined') return {};
  try {
    const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as VideoUserPreferencesData;
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function writePrefsToStorage(next: VideoUserPreferencesData) {
  if (typeof window === 'undefined') return;
  try {
    if (Object.keys(next).length === 0) {
      window.localStorage.removeItem(PREFS_STORAGE_KEY);
    } else {
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(next));
    }
  } catch {
    // Ignore storage quota or private-mode errors.
  }
}

function hydratePrefs() {
  if (prefsHydrated || typeof window === 'undefined') return;
  prefsHydrated = true;
  prefsData = readPrefsFromStorage();
}

function emitPrefs() {
  for (const listener of prefsListeners) {
    listener();
  }
}

function savePrefs(patch: Partial<VideoUserPreferencesData>) {
  hydratePrefs();
  const next: VideoUserPreferencesData = { ...prefsData };
  let changed = false;
  for (const [key, value] of Object.entries(patch)) {
    const k = key as keyof VideoUserPreferencesData;
    if (value !== undefined && next[k] !== value) {
      (next as Record<string, unknown>)[k] = value;
      changed = true;
    }
  }
  if (!changed) return;
  prefsData = next;
  writePrefsToStorage(prefsData);
  emitPrefs();
}

function resetPrefs() {
  prefsHydrated = true;
  prefsData = {};
  writePrefsToStorage({});
  emitPrefs();
}

let cachedPrefsState: VideoUserPreferencesState | null = null;
let cachedPrefsSource: VideoUserPreferencesData | null = null;

function getPrefsState(): VideoUserPreferencesState {
  hydratePrefs();
  if (!cachedPrefsState || cachedPrefsSource !== prefsData) {
    cachedPrefsSource = prefsData;
    cachedPrefsState = {
      ...prefsData,
      save: savePrefs,
      reset: resetPrefs,
    };
  }
  return cachedPrefsState;
}

const SERVER_PREFS_STATE: VideoUserPreferencesState = {
  save: savePrefs,
  reset: resetPrefs,
};

function subscribePrefs(listener: () => void) {
  prefsListeners.add(listener);
  return () => {
    prefsListeners.delete(listener);
  };
}

function useUserPreferencesImpl(): VideoUserPreferencesState;
function useUserPreferencesImpl<T>(selector: (state: VideoUserPreferencesState) => T): T;
function useUserPreferencesImpl<T>(
  selector?: (state: VideoUserPreferencesState) => T,
): VideoUserPreferencesState | T {
  const snapshot = React.useSyncExternalStore(
    subscribePrefs,
    getPrefsState,
    () => SERVER_PREFS_STATE,
  );
  return selector ? selector(snapshot) : snapshot;
}

export const useUserPreferences = Object.assign(useUserPreferencesImpl, {
  getState: getPrefsState,
});

// ---------------------------------------------------------------------------
// VideoPlayer Context & State
// ---------------------------------------------------------------------------

export interface VideoPlayerFeedback {
  id: number;
  kind: 'seek' | 'volume' | 'status';
  direction?: 'forward' | 'backward';
  label: string;
}

export interface VideoExternalBridge {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
}

export interface VideoExternalStatePatch {
  playing?: boolean;
  started?: boolean;
  ended?: boolean;
  waiting?: boolean;
  error?: string | null;
  currentTime?: number;
  duration?: number;
  bufferedEnd?: number;
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
}

interface VideoYTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  setPlaybackRate: (suggestedRate: number) => void;
  getPlaybackRate: () => number;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoLoadedFraction: () => number;
  getPlayerState: () => number;
  getIframe: () => HTMLIFrameElement | null;
  destroy: () => void;
}

interface VideoYTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      width?: number | string;
      height?: number | string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: { target: VideoYTPlayerInstance }) => void;
        onStateChange?: (event: { data: number; target: VideoYTPlayerInstance }) => void;
        onPlaybackRateChange?: (event: { data: number; target: VideoYTPlayerInstance }) => void;
        onError?: (event: { data: number; target: VideoYTPlayerInstance }) => void;
      };
    },
  ) => VideoYTPlayerInstance;
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

let videoYtApiPromise: Promise<VideoYTNamespace> | null = null;

function extractVideoYouTubeId(src?: string | null): string | null {
  if (typeof src !== 'string' || !src) return null;
  const trimmed = src.trim();
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

function extractVideoStartTime(src?: string | null): number {
  if (typeof src !== 'string' || !src) return 0;
  const match = src.match(/[?&#](?:t|start)=(\d+)s?/i);
  return match ? Number(match[1]) || 0 : 0;
}

function loadYouTubeVideoIframeApi(): Promise<VideoYTNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube IFrame API requires a browser environment.'));
  }
  const win = window as unknown as {
    YT?: VideoYTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  };
  if (win.YT && win.YT.Player) {
    return Promise.resolve(win.YT);
  }
  if (videoYtApiPromise) {
    return videoYtApiPromise;
  }

  videoYtApiPromise = new Promise<VideoYTNamespace>((resolve, reject) => {
    const previousReady = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (win.YT && win.YT.Player) {
        resolve(win.YT);
      } else {
        videoYtApiPromise = null;
        reject(new Error('YouTube IFrame API failed to initialize.'));
      }
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://www.youtube.com/iframe_api"]',
    );
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      script.onerror = () => {
        videoYtApiPromise = null;
        reject(new Error('Failed to load YouTube IFrame API script.'));
      };
      document.head.appendChild(script);
    }
  });

  return videoYtApiPromise;
}

export interface VideoPlayerState {
  title: string | null;
  poster: string | null;
  playing: boolean;
  paused: boolean;
  started: boolean;
  ended: boolean;
  waiting: boolean;
  bufferingVisible: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  bufferedEnd: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  captionsEnabled: boolean;
  captionsLanguage: string;
  quality: string;
  isFullscreen: boolean;
  isPiP: boolean;
  controlsVisible: boolean;
  chapters: VideoChapter[];
  locale?: string;
  t: VideoTranslations;
  feedback: VideoPlayerFeedback | null;
  videoElement: HTMLVideoElement | null;
  containerElement: HTMLDivElement | null;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  skip: (deltaSeconds: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  cyclePlaybackRate: (direction?: 1 | -1) => void;
  toggleCaptions: () => void;
  setCaptionsEnabled: (enabled: boolean) => void;
  setCaptionsLanguage: (lang: string) => void;
  setQuality: (quality: string) => void;
  toggleFullscreen: () => Promise<void>;
  togglePiP: () => Promise<void>;
  setLocale: (locale?: string) => void;
  setControlsVisible: (visible: boolean) => void;
  setChapters: (chapters: VideoChapter[]) => void;
  setMediaPoster: (poster: string | null) => void;
  bindVideoElement: (el: HTMLVideoElement | null) => void;
  bindExternalBridge: (bridge: VideoExternalBridge | null) => void;
  updateExternalState: (patch: VideoExternalStatePatch) => void;
  bindContainerElement: (el: HTMLDivElement | null) => void;
  showFeedback: (feedback: Omit<VideoPlayerFeedback, 'id'>) => void;
  notifyError: () => void;
}

/** Selector helper compatible with `usePlayer((state) => selectTime(state)?.currentTime)`. */
export function selectTime(state: VideoPlayerState) {
  return {
    currentTime: state.currentTime,
    duration: state.duration,
    bufferedEnd: state.bufferedEnd,
  };
}

/** Feature set descriptor for the VideoPlayer preset. */
export const videoFeatures = Object.freeze({
  preset: 'video',
  controls: ['play', 'volume', 'timeline', 'captions', 'settings', 'fullscreen'] as const,
  shortcuts: true,
  gestures: true,
});

export interface VideoPlaybackTimeState {
  currentTime: number;
  duration: number;
  bufferedEnd: number;
}

const VideoPlayerContext = React.createContext<VideoPlayerState | null>(null);
const PlaybackTimeContext = React.createContext<VideoPlaybackTimeState | null>(null);

function usePlayerControls(): VideoPlayerState {
  const ctx = React.useContext(VideoPlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a <VideoPlayer>.');
  }
  return ctx;
}

/** Reads high-frequency playback time and buffer progress without subscribing static controls. */
export function usePlaybackTime(): VideoPlaybackTimeState {
  const timeCtx = React.useContext(PlaybackTimeContext);
  const playerCtx = React.useContext(VideoPlayerContext);
  if (timeCtx) return timeCtx;
  if (playerCtx) {
    return {
      currentTime: playerCtx.currentTime,
      duration: playerCtx.duration,
      bufferedEnd: playerCtx.bufferedEnd,
    };
  }
  throw new Error('usePlaybackTime must be used within a <VideoPlayer>.');
}

/** Reads playback state or a selected slice from any component inside `<VideoPlayer>`. */
export function usePlayer(): VideoPlayerState;
export function usePlayer<T>(selector: (state: VideoPlayerState) => T): T;
export function usePlayer<T>(selector?: (state: VideoPlayerState) => T): VideoPlayerState | T {
  const ctx = React.useContext(VideoPlayerContext);
  const timeCtx = React.useContext(PlaybackTimeContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within a <VideoPlayer>.');
  }
  const merged = React.useMemo<VideoPlayerState>(
    () =>
      timeCtx
        ? {
            ...ctx,
            currentTime: timeCtx.currentTime,
            duration: timeCtx.duration,
            bufferedEnd: timeCtx.bufferedEnd,
          }
        : ctx,
    [ctx, timeCtx],
  );
  return selector ? selector(merged) : merged;
}

export interface VideoPlayerProps {
  /** The title of the video. Displayed by `<Title />` inside `<VideoSkin>`. */
  title?: string | null;
  /** The image shown before playback. Replaces any poster the media generates. */
  poster?: string | null;
  children?: React.ReactNode;
}

/** Owns playback state for everything inside it. Renders no UI. */
export function VideoPlayer({
  title = null,
  poster = null,
  children,
}: VideoPlayerProps) {
  const [videoEl, setVideoEl] = React.useState<HTMLVideoElement | null>(null);
  const [containerEl, setContainerEl] = React.useState<HTMLDivElement | null>(null);
  const [mediaPoster, setMediaPoster] = React.useState<string | null>(null);

  const [playing, setPlaying] = React.useState(false);
  const [started, setStarted] = React.useState(false);
  const [ended, setEnded] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [bufferingVisible, setBufferingVisible] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [bufferedEnd, setBufferedEnd] = React.useState(0);
  const [volume, setVolumeState] = React.useState(1);
  const [muted, setMutedState] = React.useState(false);
  const [playbackRate, setPlaybackRateState] = React.useState<number>(1);
  const [captionsEnabled, setCaptionsEnabled] = React.useState(false);
  const [captionsLanguage, setCaptionsLanguage] = React.useState('en');
  const [quality, setQuality] = React.useState('auto');
  const [isFullscreen, setIsFullscreen] = React.useState(false);
  const [isPiP, setIsPiP] = React.useState(false);
  const [controlsVisible, setControlsVisible] = React.useState(true);
  const [chapters, setChapters] = React.useState<VideoChapter[]>([]);
  const [locale, setLocale] = React.useState<string | undefined>(undefined);
  const [feedback, setFeedback] = React.useState<VideoPlayerFeedback | null>(null);

  const currentTimeRef = React.useRef(currentTime);
  currentTimeRef.current = currentTime;
  const bufferedEndRef = React.useRef(bufferedEnd);
  bufferedEndRef.current = bufferedEnd;
  const externalBridgeRef = React.useRef<VideoExternalBridge | null>(null);

  const bindExternalBridge = React.useCallback((bridge: VideoExternalBridge | null) => {
    externalBridgeRef.current = bridge;
  }, []);

  const updateExternalState = React.useCallback((patch: VideoExternalStatePatch) => {
    if (patch.playing !== undefined) setPlaying(patch.playing);
    if (patch.started !== undefined) setStarted(patch.started);
    if (patch.ended !== undefined) setEnded(patch.ended);
    if (patch.waiting !== undefined) setWaiting(patch.waiting);
    if (patch.error !== undefined) setError(patch.error);
    if (patch.currentTime !== undefined) setCurrentTime(patch.currentTime);
    if (patch.duration !== undefined) setDuration(patch.duration);
    if (patch.bufferedEnd !== undefined) setBufferedEnd(patch.bufferedEnd);
    if (patch.volume !== undefined) setVolumeState(patch.volume);
    if (patch.muted !== undefined) setMutedState(patch.muted);
    if (patch.playbackRate !== undefined) setPlaybackRateState(patch.playbackRate);
  }, []);

  const feedbackTimerRef = React.useRef<number | null>(null);
  const feedbackIdRef = React.useRef(0);

  const t = React.useMemo(() => getVideoTranslations(locale), [locale]);
  const resolvedPoster = poster ?? mediaPoster;

  const showFeedback = React.useCallback((next: Omit<VideoPlayerFeedback, 'id'>) => {
    feedbackIdRef.current += 1;
    setFeedback({ ...next, id: feedbackIdRef.current });
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback(null);
      feedbackTimerRef.current = null;
    }, 850);
  }, []);

  React.useEffect(() => {
    return () => {
      if (feedbackTimerRef.current !== null) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  // Delay buffering indicator by 500ms so brief stalls never flash a loader.
  React.useEffect(() => {
    if (!waiting) {
      setBufferingVisible(false);
      return;
    }
    const timer = window.setTimeout(() => setBufferingVisible(true), 500);
    return () => window.clearTimeout(timer);
  }, [waiting]);

  // Track fullscreen changes.
  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement && document.fullscreenElement === containerEl));
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [containerEl]);

  // Sync native HTMLVideoElement events.
  React.useEffect(() => {
    if (!videoEl) return;

    const syncTime = () => {
      setCurrentTime(videoEl.currentTime || 0);
      if (Number.isFinite(videoEl.duration) && videoEl.duration > 0) {
        setDuration(videoEl.duration);
      }
      if (videoEl.buffered.length > 0) {
        setBufferedEnd(videoEl.buffered.end(videoEl.buffered.length - 1));
      }
    };

    const handlePlay = () => {
      setPlaying(true);
      setStarted(true);
      setEnded(false);
      setError(null);
    };
    const handlePlaying = () => {
      setPlaying(true);
      setStarted(true);
      setWaiting(false);
      setError(null);
    };
    const handlePause = () => {
      setPlaying(false);
      setWaiting(false);
    };
    const handleEnded = () => {
      setPlaying(false);
      setWaiting(false);
      setEnded(true);
    };
    const handleWaiting = () => setWaiting(true);
    const handleCanPlay = () => {
      setWaiting(false);
      syncTime();
    };
    const handleLoadedMetadata = () => {
      setError(null);
      setWaiting(false);
      syncTime();
    };
    const handleVolumeChange = () => {
      setVolumeState(videoEl.volume);
      setMutedState(videoEl.muted);
    };
    const handleRateChange = () => setPlaybackRateState(videoEl.playbackRate);
    const handleError = () => {
      setPlaying(false);
      setWaiting(false);
      setError(t.error);
    };
    const handleEmptied = () => {
      setError(null);
      setEnded(false);
      setCurrentTime(0);
      setDuration(0);
      setBufferedEnd(0);
    };
    const handleEnterPiP = () => setIsPiP(true);
    const handleLeavePiP = () => setIsPiP(false);

    if (videoEl.error) {
      setError(t.error);
    } else if (videoEl.readyState >= 1) {
      syncTime();
    }

    videoEl.addEventListener('timeupdate', syncTime);
    videoEl.addEventListener('durationchange', syncTime);
    videoEl.addEventListener('progress', syncTime);
    videoEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    videoEl.addEventListener('canplay', handleCanPlay);
    videoEl.addEventListener('play', handlePlay);
    videoEl.addEventListener('playing', handlePlaying);
    videoEl.addEventListener('pause', handlePause);
    videoEl.addEventListener('ended', handleEnded);
    videoEl.addEventListener('waiting', handleWaiting);
    videoEl.addEventListener('volumechange', handleVolumeChange);
    videoEl.addEventListener('ratechange', handleRateChange);
    videoEl.addEventListener('error', handleError);
    videoEl.addEventListener('emptied', handleEmptied);
    videoEl.addEventListener('enterpictureinpicture', handleEnterPiP);
    videoEl.addEventListener('leavepictureinpicture', handleLeavePiP);

    return () => {
      videoEl.removeEventListener('timeupdate', syncTime);
      videoEl.removeEventListener('durationchange', syncTime);
      videoEl.removeEventListener('progress', syncTime);
      videoEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      videoEl.removeEventListener('canplay', handleCanPlay);
      videoEl.removeEventListener('play', handlePlay);
      videoEl.removeEventListener('playing', handlePlaying);
      videoEl.removeEventListener('pause', handlePause);
      videoEl.removeEventListener('ended', handleEnded);
      videoEl.removeEventListener('waiting', handleWaiting);
      videoEl.removeEventListener('volumechange', handleVolumeChange);
      videoEl.removeEventListener('ratechange', handleRateChange);
      videoEl.removeEventListener('error', handleError);
      videoEl.removeEventListener('emptied', handleEmptied);
      videoEl.removeEventListener('enterpictureinpicture', handleEnterPiP);
      videoEl.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, [videoEl, t.error]);

  const play = React.useCallback(async () => {
    if (error) return;
    if (externalBridgeRef.current) {
      externalBridgeRef.current.play();
      return;
    }
    if (!videoEl) return;
    try {
      await videoEl.play();
    } catch {
      setError(t.error);
    }
  }, [videoEl, error, t.error]);

  const pause = React.useCallback(() => {
    if (externalBridgeRef.current) {
      externalBridgeRef.current.pause();
      return;
    }
    videoEl?.pause();
  }, [videoEl]);

  const togglePlay = React.useCallback(() => {
    if (error) return;
    if (externalBridgeRef.current) {
      if (playing) {
        externalBridgeRef.current.pause();
      } else {
        externalBridgeRef.current.play();
      }
      return;
    }
    if (!videoEl) return;
    if (videoEl.paused) {
      void play();
    } else {
      pause();
    }
  }, [videoEl, error, play, pause, playing]);

  const seek = React.useCallback(
    (time: number) => {
      if (externalBridgeRef.current) {
        const clamped = Math.max(0, duration > 0 ? Math.min(time, duration) : time);
        externalBridgeRef.current.seek(clamped);
        setCurrentTime(clamped);
        setEnded(false);
        return;
      }
      if (!videoEl) return;
      const max = Number.isFinite(videoEl.duration) ? videoEl.duration : duration;
      const clamped = Math.max(0, max > 0 ? Math.min(time, max) : time);
      videoEl.currentTime = clamped;
      setCurrentTime(clamped);
      setEnded(false);
    },
    [videoEl, duration],
  );

  const skip = React.useCallback(
    (deltaSeconds: number) => {
      if (externalBridgeRef.current) {
        seek(currentTimeRef.current + deltaSeconds);
        showFeedback({
          kind: 'seek',
          direction: deltaSeconds >= 0 ? 'forward' : 'backward',
          label: `${Math.abs(deltaSeconds)}s`,
        });
        return;
      }
      if (!videoEl) return;
      seek((videoEl.currentTime || 0) + deltaSeconds);
      showFeedback({
        kind: 'seek',
        direction: deltaSeconds >= 0 ? 'forward' : 'backward',
        label: `${Math.abs(deltaSeconds)}s`,
      });
    },
    [videoEl, seek, showFeedback],
  );

  const setVolume = React.useCallback(
    (nextVolume: number) => {
      const clamped = Math.max(0, Math.min(1, nextVolume));
      setVolumeState(clamped);
      if (externalBridgeRef.current) {
        externalBridgeRef.current.setVolume(clamped);
        if (clamped > 0 && muted) {
          externalBridgeRef.current.setMuted(false);
          setMutedState(false);
        }
        return;
      }
      if (videoEl) {
        videoEl.volume = clamped;
        if (clamped > 0 && videoEl.muted) {
          videoEl.muted = false;
          setMutedState(false);
        }
      }
    },
    [videoEl, muted],
  );

  const setMuted = React.useCallback(
    (nextMuted: boolean) => {
      setMutedState(nextMuted);
      if (externalBridgeRef.current) {
        externalBridgeRef.current.setMuted(nextMuted);
        return;
      }
      if (videoEl) {
        videoEl.muted = nextMuted;
      }
    },
    [videoEl],
  );

  const toggleMute = React.useCallback(() => {
    if (externalBridgeRef.current) {
      const nextMuted = !muted;
      externalBridgeRef.current.setMuted(nextMuted);
      setMutedState(nextMuted);
      showFeedback({
        kind: 'volume',
        label: nextMuted ? '0%' : `${Math.round(volume * 100)}%`,
      });
      return;
    }
    if (!videoEl) {
      setMutedState((prev) => !prev);
      return;
    }
    videoEl.muted = !videoEl.muted;
    setMutedState(videoEl.muted);
    showFeedback({
      kind: 'volume',
      label: videoEl.muted ? '0%' : `${Math.round(videoEl.volume * 100)}%`,
    });
  }, [videoEl, muted, volume, showFeedback]);

  const setPlaybackRate = React.useCallback(
    (rate: number) => {
      setPlaybackRateState(rate);
      if (externalBridgeRef.current) {
        externalBridgeRef.current.setPlaybackRate(rate);
        return;
      }
      if (videoEl) {
        videoEl.playbackRate = rate;
      }
    },
    [videoEl],
  );

  const cyclePlaybackRate = React.useCallback(
    (direction: 1 | -1 = 1) => {
      const idx = VIDEO_PLAYBACK_RATES.findIndex((r) => r === playbackRate);
      const base = idx === -1 ? 2 : idx;
      const next = Math.max(0, Math.min(VIDEO_PLAYBACK_RATES.length - 1, base + direction));
      setPlaybackRate(VIDEO_PLAYBACK_RATES[next]);
      showFeedback({ kind: 'status', label: `${VIDEO_PLAYBACK_RATES[next]}×` });
    },
    [playbackRate, setPlaybackRate, showFeedback],
  );

  const toggleCaptions = React.useCallback(() => {
    setCaptionsEnabled((prev) => {
      const next = !prev;
      showFeedback({
        kind: 'status',
        label: next ? `${t.captions}: ${t.captionsOn}` : `${t.captions}: ${t.captionsOff}`,
      });
      return next;
    });
  }, [showFeedback, t.captions, t.captionsOff, t.captionsOn]);

  const toggleFullscreen = React.useCallback(async () => {
    if (!containerEl) return;
    try {
      if (document.fullscreenElement === containerEl) {
        await document.exitFullscreen();
      } else {
        await containerEl.requestFullscreen();
      }
    } catch {
      // Ignore fullscreen denial errors in restricted frames.
    }
  }, [containerEl]);

  const togglePiP = React.useCallback(async () => {
    if (!videoEl || typeof document === 'undefined' || !('pictureInPictureEnabled' in document)) {
      return;
    }
    try {
      if (document.pictureInPictureElement === videoEl) {
        await document.exitPictureInPicture();
      } else {
        await videoEl.requestPictureInPicture();
      }
    } catch {
      // Ignore PiP denial errors.
    }
  }, [videoEl]);

  const notifyError = React.useCallback(() => {
    setPlaying(false);
    setWaiting(false);
    setError(t.error);
  }, [t.error]);

  const value = React.useMemo<VideoPlayerState>(
    () => ({
      title,
      poster: resolvedPoster,
      playing,
      paused: !playing,
      started,
      ended,
      waiting,
      bufferingVisible,
      error,
      get currentTime() {
        return currentTimeRef.current;
      },
      duration,
      get bufferedEnd() {
        return bufferedEndRef.current;
      },
      volume,
      muted,
      playbackRate,
      captionsEnabled,
      captionsLanguage,
      quality,
      isFullscreen,
      isPiP,
      controlsVisible,
      chapters,
      locale,
      t,
      feedback,
      videoElement: videoEl,
      containerElement: containerEl,
      play,
      pause,
      togglePlay,
      seek,
      skip,
      setVolume,
      setMuted,
      toggleMute,
      setPlaybackRate,
      cyclePlaybackRate,
      toggleCaptions,
      setCaptionsEnabled,
      setCaptionsLanguage,
      setQuality,
      toggleFullscreen,
      togglePiP,
      setLocale,
      setControlsVisible,
      setChapters,
      setMediaPoster,
      bindVideoElement: setVideoEl,
      bindExternalBridge,
      updateExternalState,
      bindContainerElement: setContainerEl,
      showFeedback,
      notifyError,
    }),
    [
      title,
      resolvedPoster,
      playing,
      started,
      ended,
      waiting,
      bufferingVisible,
      error,
      duration,
      volume,
      muted,
      playbackRate,
      captionsEnabled,
      captionsLanguage,
      quality,
      isFullscreen,
      isPiP,
      controlsVisible,
      chapters,
      locale,
      t,
      feedback,
      videoEl,
      containerEl,
      play,
      pause,
      togglePlay,
      seek,
      skip,
      setVolume,
      setMuted,
      toggleMute,
      setPlaybackRate,
      cyclePlaybackRate,
      toggleCaptions,
      toggleFullscreen,
      togglePiP,
      bindExternalBridge,
      updateExternalState,
      showFeedback,
      notifyError,
    ],
  );

  const timeValue = React.useMemo<VideoPlaybackTimeState>(
    () => ({
      currentTime,
      duration,
      bufferedEnd,
    }),
    [currentTime, duration, bufferedEnd],
  );

  return (
    <VideoPlayerContext.Provider value={value}>
      <PlaybackTimeContext.Provider value={timeValue}>
        {children}
      </PlaybackTimeContext.Provider>
    </VideoPlayerContext.Provider>
  );
}

// ---------------------------------------------------------------------------
// Media & Tracks
// ---------------------------------------------------------------------------

export interface VideoProps extends React.ComponentProps<'video'> {
  /** Optional media element ref alias. */
  mediaRef?: React.Ref<HTMLVideoElement>;
}

/** Renders the native `<video>` media source (or YouTube IFrame bridge for YouTube URLs) and binds it to `<VideoPlayer>`. */
export function Video({
  ref,
  mediaRef,
  className,
  src,
  preload = 'metadata',
  playsInline = true,
  onError,
  children,
  ...props
}: VideoProps) {
  const ctx = React.useContext(VideoPlayerContext);
  const bindVideoElement = ctx?.bindVideoElement;
  const youtubeId = typeof src === 'string' ? extractVideoYouTubeId(src) : null;

  const setRefs = React.useCallback(
    (node: HTMLVideoElement | null) => {
      bindVideoElement?.(node);
      for (const target of [ref, mediaRef]) {
        if (typeof target === 'function') {
          target(node);
        } else if (target && 'current' in target) {
          (target as React.MutableRefObject<HTMLVideoElement | null>).current = node;
        }
      }
    },
    [bindVideoElement, ref, mediaRef],
  );

  if (youtubeId && typeof src === 'string') {
    return (
      <YouTubeVideo src={src} className={className}>
        {children}
      </YouTubeVideo>
    );
  }

  return (
    <video
      data-slot="video-media"
      ref={setRefs}
      src={src}
      preload={preload}
      playsInline={playsInline}
      onError={(event) => {
        ctx?.notifyError();
        onError?.(event);
      }}
      className={cn('size-full object-contain', className)}
      {...props}
    >
      {children}
    </video>
  );
}

export interface YouTubeVideoProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  /** YouTube URL (`youtu.be/...` or `youtube.com/watch?v=...`) or 11-character video ID. */
  src?: string;
  /** Direct 11-character YouTube video ID (alternative to `src`). */
  videoId?: string;
  /** Optional start time in seconds (also parsed from `?t=` / `&start=` in `src`). */
  startTime?: number;
  /** Optional child tracks such as `<ChaptersTrack />`. */
  children?: React.ReactNode;
}

/** Embeds a YouTube video driven by Rakfound's custom `<VideoSkin>` controls via the YouTube IFrame API. */
export function YouTubeVideo({
  src,
  videoId,
  startTime,
  className,
  children,
  ...props
}: YouTubeVideoProps) {
  const ctx = React.useContext(VideoPlayerContext);
  const bindVideoElement = ctx?.bindVideoElement;
  const bindExternalBridge = ctx?.bindExternalBridge;
  const updateExternalState = ctx?.updateExternalState;
  const setMediaPoster = ctx?.setMediaPoster;
  const notifyError = ctx?.notifyError;

  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const resolvedId = extractVideoYouTubeId(videoId ?? src);
  const initialStartSeconds = startTime ?? extractVideoStartTime(src);
  const resolvedPoster = resolvedId
    ? `https://i.ytimg.com/vi/${resolvedId}/maxresdefault.jpg`
    : null;

  React.useEffect(() => {
    setMediaPoster?.(resolvedPoster);
    return () => setMediaPoster?.(null);
  }, [setMediaPoster, resolvedPoster]);

  React.useEffect(() => {
    if (!resolvedId || !bindVideoElement || !bindExternalBridge || !updateExternalState) {
      return;
    }

    bindVideoElement(null);
    updateExternalState({
      currentTime: initialStartSeconds,
      playing: false,
      started: false,
      ended: false,
      waiting: false,
      error: null,
    });

    let cancelled = false;
    let player: VideoYTPlayerInstance | null = null;
    let ready = false;
    let pendingPlay = false;
    let hasPlayedOrSeeked = false;
    let pollTimer: number | null = null;

    const desiredState = {
      volume: 1,
      muted: false,
      playbackRate: 1,
    };

    const stopPolling = () => {
      if (pollTimer !== null) {
        window.clearInterval(pollTimer);
        pollTimer = null;
      }
    };

    const syncMetrics = (target: VideoYTPlayerInstance) => {
      try {
        const rawCur = target.getCurrentTime?.() ?? 0;
        const cur =
          !hasPlayedOrSeeked && initialStartSeconds > 0 && rawCur < initialStartSeconds
            ? initialStartSeconds
            : rawCur;
        const dur = target.getDuration?.() ?? 0;
        const frac = target.getVideoLoadedFraction?.() ?? 0;
        updateExternalState({
          currentTime: cur,
          ...(dur > 0 ? { duration: dur, bufferedEnd: frac * dur } : {}),
        });
      } catch {
        // Ignore transient YouTube IFrame postMessage errors
      }
    };

    const startPolling = (target: VideoYTPlayerInstance) => {
      stopPolling();
      syncMetrics(target);
      pollTimer = window.setInterval(() => syncMetrics(target), 200);
    };

    const bridge: VideoExternalBridge = {
      play: () => {
        if (ready && player) {
          updateExternalState({ waiting: true, error: null, started: true, ended: false });
          if (!hasPlayedOrSeeked && initialStartSeconds > 0) {
            player.seekTo(initialStartSeconds, true);
          }
          hasPlayedOrSeeked = true;
          player.playVideo();
        } else {
          pendingPlay = true;
          updateExternalState({ waiting: true, error: null, started: true, ended: false });
        }
      },
      pause: () => {
        pendingPlay = false;
        if (ready && player) {
          player.pauseVideo();
        }
        updateExternalState({ playing: false, waiting: false });
      },
      seek: (time: number) => {
        hasPlayedOrSeeked = true;
        if (ready && player) {
          player.seekTo(time, true);
          syncMetrics(player);
        }
      },
      setVolume: (vol: number) => {
        desiredState.volume = vol;
        if (ready && player) {
          player.setVolume(Math.round(vol * 100));
        }
      },
      setMuted: (nextMuted: boolean) => {
        desiredState.muted = nextMuted;
        if (ready && player) {
          if (nextMuted) {
            player.mute();
          } else {
            player.unMute();
          }
        }
      },
      setPlaybackRate: (rate: number) => {
        desiredState.playbackRate = rate;
        if (ready && player) {
          player.setPlaybackRate(rate);
        }
      },
    };

    bindExternalBridge(bridge);

    loadYouTubeVideoIframeApi()
      .then((YT) => {
        if (cancelled || !containerRef.current) return;
        const mountTarget = document.createElement('div');
        containerRef.current.replaceChildren(mountTarget);

        player = new YT.Player(mountTarget, {
          videoId: resolvedId,
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            playsinline: 1,
            rel: 0,
            ...(initialStartSeconds > 0 ? { start: Math.floor(initialStartSeconds) } : {}),
          },
          events: {
            onReady: (event) => {
              if (cancelled) return;
              ready = true;
              const iframe = event.target.getIframe?.();
              if (iframe) {
                iframe.setAttribute('tabindex', '-1');
                iframe.style.width = '100%';
                iframe.style.height = '100%';
                iframe.style.pointerEvents = 'none';
                iframe.style.border = '0';
              }
              event.target.setVolume(Math.round(desiredState.volume * 100));
              if (desiredState.muted) {
                event.target.mute();
              } else {
                event.target.unMute();
              }
              if (desiredState.playbackRate !== 1) {
                event.target.setPlaybackRate(desiredState.playbackRate);
              }
              syncMetrics(event.target);
              if (pendingPlay) {
                pendingPlay = false;
                if (!hasPlayedOrSeeked && initialStartSeconds > 0) {
                  event.target.seekTo(initialStartSeconds, true);
                }
                hasPlayedOrSeeked = true;
                event.target.playVideo();
              }
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const state = event.data;
              if (state === YT.PlayerState.PLAYING) {
                hasPlayedOrSeeked = true;
                updateExternalState({
                  playing: true,
                  started: true,
                  ended: false,
                  waiting: false,
                  error: null,
                });
                startPolling(event.target);
              } else if (state === YT.PlayerState.BUFFERING) {
                updateExternalState({ waiting: true });
                syncMetrics(event.target);
              } else if (state === YT.PlayerState.PAUSED) {
                stopPolling();
                updateExternalState({ playing: false, waiting: false });
                syncMetrics(event.target);
              } else if (state === YT.PlayerState.ENDED) {
                stopPolling();
                syncMetrics(event.target);
                updateExternalState({ playing: false, waiting: false, ended: true });
              } else if (state === YT.PlayerState.CUED) {
                syncMetrics(event.target);
              }
            },
            onPlaybackRateChange: (event) => {
              if (cancelled) return;
              updateExternalState({ playbackRate: event.data });
            },
            onError: () => {
              if (cancelled) return;
              stopPolling();
              notifyError?.();
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          notifyError?.();
        }
      });

    return () => {
      cancelled = true;
      stopPolling();
      bindExternalBridge(null);
      try {
        player?.destroy();
      } catch {
        // Ignore teardown errors
      }
    };
  }, [
    resolvedId,
    initialStartSeconds,
    bindVideoElement,
    bindExternalBridge,
    updateExternalState,
    notifyError,
  ]);

  return (
    <div
      data-slot="video-media"
      data-source="youtube"
      className={cn('relative size-full overflow-hidden bg-black', className)}
      {...props}
    >
      <div
        ref={containerRef}
        className="pointer-events-none size-full [&_iframe]:size-full"
      />
      {children}
    </div>
  );
}

export interface MuxVideoProps extends Omit<VideoProps, 'src'> {
  /** Mux playback ID or `{ playbackId }` source object. */
  playbackId?: string;
  source?: { playbackId: string };
  src?: string;
}

/** Plays a Mux asset by playback ID, resolving its MP4 stream and poster automatically. */
export function MuxVideo({
  playbackId,
  source,
  src,
  crossOrigin = 'anonymous',
  ...props
}: MuxVideoProps) {
  const ctx = React.useContext(VideoPlayerContext);
  const setMediaPoster = ctx?.setMediaPoster;
  const resolvedId = playbackId ?? source?.playbackId;
  const resolvedSrc =
    src ?? (resolvedId ? `https://stream.mux.com/${resolvedId}/highest.mp4` : undefined);
  const resolvedPoster = resolvedId
    ? `https://image.mux.com/${resolvedId}/thumbnail.webp?time=8&width=1280`
    : null;

  React.useEffect(() => {
    setMediaPoster?.(resolvedPoster);
    return () => setMediaPoster?.(null);
  }, [setMediaPoster, resolvedPoster]);

  return <Video src={resolvedSrc} crossOrigin={crossOrigin} {...props} />;
}

/** Plays an HLS manifest URL (uses native HLS when supported, with Mux MP4 fallback for Mux URLs). */
export function HlsJsVideo({ src, ...props }: VideoProps) {
  const [supportsNativeHls, setSupportsNativeHls] = React.useState(false);

  React.useEffect(() => {
    const probe = document.createElement('video');
    if (probe.canPlayType('application/vnd.apple.mpegurl')) {
      setSupportsNativeHls(true);
    }
  }, []);

  const resolvedSrc = React.useMemo(() => {
    if (typeof src !== 'string' || !src) return src;
    if (supportsNativeHls) return src;
    const muxMatch = src.match(/^https:\/\/stream\.mux\.com\/([^/.]+)\.m3u8/);
    if (muxMatch) {
      return `https://stream.mux.com/${muxMatch[1]}/highest.mp4`;
    }
    return src;
  }, [src, supportsNativeHls]);

  return <Video src={resolvedSrc} {...props} />;
}

/** Decorative muted, looped, autoplaying background video with no player chrome. */
export function BackgroundVideo({
  className,
  ...props
}: React.ComponentProps<'video'>) {
  return (
    <video
      data-slot="background-video"
      autoPlay
      loop
      muted
      playsInline
      aria-hidden="true"
      className={cn('size-full object-cover', className)}
      {...props}
    />
  );
}

export interface ChaptersTrackProps {
  /** Required list of chapter start times (in seconds) and titles. */
  chapters: VideoChapter[];
}

/** Registers chapter segments on the video timeline. Render as a child of the media component. */
export function ChaptersTrack({ chapters }: ChaptersTrackProps) {
  const ctx = React.useContext(VideoPlayerContext);
  const setChapters = ctx?.setChapters;

  React.useEffect(() => {
    if (!setChapters) return;
    const sorted = [...chapters].sort((a, b) => a.startTime - b.startTime);
    setChapters(sorted);
    return () => setChapters([]);
  }, [setChapters, chapters]);

  return null;
}

// ---------------------------------------------------------------------------
// Extensions: UserPreferences, Title, TimedSlot, UpNext
// ---------------------------------------------------------------------------

export interface UserPreferencesProps {
  /** Caption language to show until the viewer chooses one. `"off"` starts without captions. */
  defaultCaptions?: string;
  /** Audio language to select until the viewer chooses one. */
  defaultAudio?: string;
}

/** Persists viewer volume, mute, playback speed, and captions across sessions (`localStorage`). */
export function UserPreferences({
  defaultCaptions,
  defaultAudio,
}: UserPreferencesProps) {
  const ctx = usePlayerControls();
  const hydratedRef = React.useRef(false);
  const saveTimerRef = React.useRef<number | null>(null);

  // Restore saved preferences on mount.
  React.useEffect(() => {
    const saved = useUserPreferences.getState();
    if (saved.volume !== undefined) {
      ctx.setVolume(saved.volume);
    }
    if (saved.muted !== undefined) {
      ctx.setMuted(saved.muted);
    }
    if (saved.playbackRate !== undefined) {
      ctx.setPlaybackRate(saved.playbackRate);
    }
    if (saved.captionsOff) {
      ctx.setCaptionsEnabled(false);
    } else if (saved.captions) {
      ctx.setCaptionsLanguage(saved.captions);
      ctx.setCaptionsEnabled(true);
    } else if (defaultCaptions && defaultCaptions !== 'off') {
      ctx.setCaptionsLanguage(defaultCaptions);
      ctx.setCaptionsEnabled(true);
    }
    hydratedRef.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx.videoElement, defaultCaptions, defaultAudio]);

  // Debounce saving changes by 400ms.
  const prevValuesRef = React.useRef({
    volume: ctx.volume,
    muted: ctx.muted,
    playbackRate: ctx.playbackRate,
    captionsEnabled: ctx.captionsEnabled,
    captionsLanguage: ctx.captionsLanguage,
  });

  React.useEffect(() => {
    if (!hydratedRef.current) return;
    const prev = prevValuesRef.current;
    const patch: Partial<VideoUserPreferencesData> = {};
    let changed = false;

    if (prev.volume !== ctx.volume) {
      patch.volume = Number(ctx.volume.toFixed(2));
      changed = true;
    }
    if (prev.muted !== ctx.muted) {
      patch.muted = ctx.muted;
      changed = true;
    }
    if (prev.playbackRate !== ctx.playbackRate) {
      patch.playbackRate = ctx.playbackRate;
      changed = true;
    }
    if (prev.captionsEnabled !== ctx.captionsEnabled) {
      patch.captionsOff = !ctx.captionsEnabled;
      if (ctx.captionsEnabled) {
        patch.captions = ctx.captionsLanguage;
        if (defaultCaptions) patch.captionsLocale = defaultCaptions;
      }
      changed = true;
    }

    prevValuesRef.current = {
      volume: ctx.volume,
      muted: ctx.muted,
      playbackRate: ctx.playbackRate,
      captionsEnabled: ctx.captionsEnabled,
      captionsLanguage: ctx.captionsLanguage,
    };

    if (!changed) return;

    if (saveTimerRef.current !== null) {
      window.clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = window.setTimeout(() => {
      useUserPreferences.getState().save(patch);
      saveTimerRef.current = null;
    }, 400);

    return () => {
      if (saveTimerRef.current !== null) {
        window.clearTimeout(saveTimerRef.current);
      }
    };
  }, [
    ctx.volume,
    ctx.muted,
    ctx.playbackRate,
    ctx.captionsEnabled,
    ctx.captionsLanguage,
    defaultCaptions,
  ]);

  return null;
}

export interface TitleProps {
  /** A second line under the title. Hides on players narrower than 448px. */
  description?: React.ReactNode;
  /** Shows the title exclusively inline or exclusively in fullscreen. */
  visibility?: 'inline' | 'fullscreen';
  className?: string;
}

/** Shows the player title and optional description while the controls are visible. */
export function Title({ description, visibility, className }: TitleProps) {
  const { title, controlsVisible, isFullscreen, error } = usePlayerControls();

  if (!title || error) return null;
  if (visibility === 'fullscreen' && !isFullscreen) return null;
  if (visibility === 'inline' && isFullscreen) return null;

  return (
    <div
      data-slot="video-title"
      data-visible={controlsVisible ? '' : undefined}
      className={cn(
        'pointer-events-none absolute inset-x-0 top-0 z-20 bg-linear-to-b from-black/75 via-black/35 to-transparent px-4 pt-3.5 pb-10 text-white transition-opacity duration-250 ease-out not-data-visible:opacity-0 motion-reduce:transition-none',
        className,
      )}
    >
      <p className="truncate text-body-regular-semibold text-white">{title}</p>
      {description ? (
        <p className="mt-0.5 truncate text-body-small-regular text-white/75 @max-[28rem]/player:hidden">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export type TimedSlotPlacement =
  | 'bottom-end'
  | 'bottom-start'
  | 'top-end'
  | 'top-start';
export type TimedSlotTransition = 'slide' | 'fade' | 'scale' | 'none';

export interface TimedSlotProps extends React.ComponentProps<'div'> {
  /** Start time in seconds. Negative values count back from the end. */
  start?: number;
  /** End time in seconds. Negative values count back from the end. */
  end?: number;
  /** Set `false` to hide the slot inside its range. */
  open?: boolean;
  placement?: TimedSlotPlacement;
  transitionIn?: TimedSlotTransition;
  transitionOut?: TimedSlotTransition;
}

const TIMED_SLOT_PLACEMENTS: Record<TimedSlotPlacement, string> = {
  'bottom-end': 'right-4 bottom-4 data-controls-visible:-translate-y-12',
  'bottom-start': 'left-4 bottom-4 data-controls-visible:-translate-y-12',
  'top-end': 'right-4 top-4',
  'top-start': 'left-4 top-4',
};

/** Renders arbitrary overlay content over the video during a `[start, end]` time range. */
export function TimedSlot({
  start = 0,
  end,
  open = true,
  placement = 'bottom-end',
  transitionIn = 'slide',
  transitionOut = transitionIn,
  className,
  children,
  ...props
}: TimedSlotProps) {
  const { currentTime, duration } = usePlaybackTime();
  const { error, controlsVisible } = usePlayerControls();

  const resolvedStart =
    start < 0 ? (duration > 0 ? Math.max(0, duration + start) : Infinity) : start;
  const resolvedEnd =
    end === undefined
      ? duration > 0
        ? duration
        : Infinity
      : end < 0
        ? duration > 0
          ? Math.max(0, duration + end)
          : 0
        : end;

  const isInRange =
    !error &&
    open &&
    currentTime >= resolvedStart &&
    currentTime <= resolvedEnd &&
    resolvedStart <= resolvedEnd;

  const transition = isInRange ? transitionIn : transitionOut;

  return (
    <div
      data-slot="video-timed-slot"
      data-visible={isInRange ? '' : undefined}
      data-controls-visible={controlsVisible ? '' : undefined}
      aria-hidden={!isInRange}
      className={cn(
        'absolute z-25 transition-[opacity,transform] duration-250 ease-out motion-reduce:transition-opacity motion-reduce:translate-y-0 motion-reduce:scale-100',
        TIMED_SLOT_PLACEMENTS[placement],
        !isInRange && 'pointer-events-none opacity-0',
        !isInRange && transition === 'slide' && 'translate-y-2 data-controls-visible:-translate-y-10',
        !isInRange && transition === 'scale' && 'scale-95',
        transition === 'none' && 'transition-none',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export interface UpNextProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  label?: React.ReactNode;
  thumbnailSrc?: string;
  href?: string;
  /** Seconds before the end when the card appears. */
  seconds?: number;
  onSelect?: () => void;
  onComplete?: () => void;
  placement?: TimedSlotPlacement;
  transitionIn?: TimedSlotTransition;
  transitionOut?: TimedSlotTransition;
  className?: string;
}

/** Card for the next video, shown near the end of playback and auto-advancing on completion. */
export function UpNext({
  title,
  description,
  label,
  thumbnailSrc,
  href,
  seconds = 10,
  onSelect,
  onComplete,
  placement = 'bottom-end',
  transitionIn = 'slide',
  transitionOut = 'fade',
  className,
}: UpNextProps) {
  const { ended, t } = usePlayerControls();
  const [dismissed, setDismissed] = React.useState(false);
  const completedRef = React.useRef(false);

  React.useEffect(() => {
    if (ended && !dismissed && !completedRef.current) {
      completedRef.current = true;
      onComplete?.();
    }
    if (!ended) {
      completedRef.current = false;
    }
  }, [ended, dismissed, onComplete]);

  const cardInner = (
    <div className="flex items-center gap-3">
      {thumbnailSrc ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={thumbnailSrc}
          alt=""
          className="h-12 w-20 shrink-0 rounded-sm object-cover @max-[28rem]/player:hidden"
        />
      ) : null}
      <div className="min-w-0 flex-1 text-left">
        <p className="text-body-micro-medium tracking-wide text-white/65 uppercase">
          {label ?? t.upNext}
        </p>
        {title ? (
          <p className="truncate text-body-small-semibold text-white">{title}</p>
        ) : null}
        {description ? (
          <p className="mt-0.5 line-clamp-2 text-body-mini-regular text-white/75 @max-[32rem]/player:hidden">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );

  return (
    <TimedSlot
      start={-seconds}
      open={!dismissed}
      placement={placement}
      transitionIn={transitionIn}
      transitionOut={transitionOut}
      className={cn('max-w-xs', className)}
    >
      <div className="relative flex items-start gap-2 rounded-lg bg-bg-tooltip p-2.5 pr-8 text-white shadow-high backdrop-blur-md">
        {href ? (
          <a
            href={href}
            onClick={onSelect}
            className="min-w-0 flex-1 outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {cardInner}
          </a>
        ) : (
          <button
            type="button"
            onClick={onSelect}
            className="min-w-0 flex-1 cursor-pointer text-left outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            {cardInner}
          </button>
        )}
        <button
          type="button"
          aria-label={t.dismiss}
          onClick={() => setDismissed(true)}
          className="absolute top-2 right-2 flex size-5 cursor-pointer items-center justify-center rounded-xs text-white/70 transition-colors duration-150 ease-out hover:bg-white/15 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
        >
          <X aria-hidden="true" className="size-3.5" />
        </button>
      </div>
    </TimedSlot>
  );
}

// ---------------------------------------------------------------------------
// Display Overlays: Poster, BufferingIndicator, ErrorMessage
// ---------------------------------------------------------------------------

export interface PosterRenderState {
  src: string | null;
  visible: boolean;
}

export interface PosterProps {
  renderImage?: (
    props: { className: string; alt: string },
    state: PosterRenderState,
  ) => React.ReactNode;
  className?: string;
}

/** Shows the poster image before playback begins. */
export function Poster({ renderImage, className }: PosterProps) {
  const { poster, started, error } = usePlayerControls();
  const visible = Boolean(poster) && !started && !error;

  if (!poster) return null;

  const imgClassName = cn(
    'pointer-events-none absolute inset-0 z-10 size-full object-cover transition-opacity duration-250 ease-out',
    !visible && 'opacity-0',
    className,
  );

  if (renderImage) {
    return <>{renderImage({ className: imgClassName, alt: '' }, { src: poster, visible })}</>;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      data-slot="video-poster"
      src={poster}
      alt=""
      aria-hidden={!visible}
      onError={(event) => {
        const img = event.currentTarget;
        if (img.src.endsWith('/maxresdefault.jpg')) {
          img.src = img.src.replace('/maxresdefault.jpg', '/hqdefault.jpg');
        }
      }}
      className={imgClassName}
    />
  );
}

/** Centered brand mark loader shown when buffering lasts longer than 500ms. */
export function BufferingIndicator({ className }: { className?: string }) {
  const { bufferingVisible, error, t } = usePlayerControls();
  const forcedVisible = Boolean(className && /\bgrid\b|\bflex\b/.test(className));

  if (error || (!bufferingVisible && !forcedVisible)) return null;

  return (
    <div
      data-slot="video-buffering"
      role="status"
      aria-label={t.buffering}
      className={cn(
        'pointer-events-none absolute inset-0 z-25 grid place-items-center bg-black/25',
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-black/60 text-white backdrop-blur-xs">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-6 animate-spin motion-reduce:animate-pulse"
          fill="none"
        >
          <circle
            cx="12"
            cy="12"
            r="9"
            stroke="currentColor"
            strokeOpacity="0.25"
            strokeWidth="2.5"
          />
          <path
            d="M21 12a9 9 0 0 0-9-9"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
    </div>
  );
}

/** Centered playback error message that replaces controls when media cannot play. */
export function ErrorMessage({ className }: { className?: string }) {
  const { error } = usePlayerControls();
  if (!error) return null;

  return (
    <div
      data-slot="video-error"
      role="alert"
      className={cn(
        'absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 bg-bg-secondary/95 px-6 text-center text-text-primary',
        className,
      )}
    >
      <AlertCircle aria-hidden="true" className="size-5 text-text-secondary" />
      <p className="text-body-small-medium text-text-primary">{error}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composable Styled Controls
// ---------------------------------------------------------------------------

const VIDEO_BUTTON_BASE =
  'inline-flex size-8 @7xl/player:size-9 shrink-0 cursor-pointer items-center justify-center rounded-sm text-white/90 outline-none transition-[transform,background-color,color] duration-150 ease-out hover:bg-white/15 hover:text-white active:scale-[0.95] focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none [&_svg]:size-4.5 @7xl/player:[&_svg]:size-5';

/** Play / Pause button for video control bars. */
export function PlayButton({ className, ...props }: React.ComponentProps<'button'>) {
  const { playing, togglePlay, t } = usePlayerControls();

  return (
    <button
      type="button"
      data-slot="video-play-button"
      aria-label={playing ? t.pause : t.play}
      title={playing ? `${t.pause} (K)` : `${t.play} (K)`}
      onClick={togglePlay}
      className={cn(VIDEO_BUTTON_BASE, className)}
      {...props}
    >
      {playing ? (
        <Pause aria-hidden="true" className="fill-current" />
      ) : (
        <Play aria-hidden="true" className="translate-x-[1px] fill-current" />
      )}
    </button>
  );
}

export interface SeekButtonProps extends React.ComponentProps<'button'> {
  seconds?: number;
}

/** Seeks forward or backward by `seconds` (default 10). */
export function SeekButton({ seconds = 10, className, ...props }: SeekButtonProps) {
  const { skip, t } = usePlayerControls();
  const isBack = seconds < 0;

  return (
    <button
      type="button"
      data-slot="video-seek-button"
      aria-label={isBack ? t.skipBack : t.skipForward}
      onClick={() => skip(seconds)}
      className={cn(VIDEO_BUTTON_BASE, className)}
      {...props}
    >
      {isBack ? <RotateCcw aria-hidden="true" /> : <RotateCw aria-hidden="true" />}
    </button>
  );
}

/** Mute / Unmute button with volume-level icon. */
export function MuteButton({ className, ...props }: React.ComponentProps<'button'>) {
  const { muted, volume, toggleMute, t } = usePlayerControls();
  const isSilent = muted || volume === 0;

  return (
    <button
      type="button"
      data-slot="video-mute-button"
      aria-label={isSilent ? t.unmute : t.mute}
      title={isSilent ? `${t.unmute} (M)` : `${t.mute} (M)`}
      onClick={toggleMute}
      className={cn(VIDEO_BUTTON_BASE, className)}
      {...props}
    >
      {isSilent ? (
        <VolumeX aria-hidden="true" />
      ) : volume < 0.5 ? (
        <Volume1 aria-hidden="true" />
      ) : (
        <Volume2 aria-hidden="true" />
      )}
    </button>
  );
}

/** Mute button paired with a hover/focus-revealed volume slider. */
export function VolumePopover({ className }: { className?: string }) {
  const { volume, muted, setVolume, t } = usePlayerControls();
  const effectiveVolume = muted ? 0 : volume;

  return (
    <div
      data-slot="video-volume-popover"
      className={cn(
        'group/vol flex items-center gap-1 rounded-sm transition-colors',
        className,
      )}
    >
      <MuteButton />
      <div className="pointer-events-none flex w-16 origin-left scale-x-0 items-center overflow-hidden opacity-0 transition-[transform,opacity] duration-200 ease-out group-focus-within/vol:pointer-events-auto group-focus-within/vol:scale-x-100 group-focus-within/vol:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/vol:pointer-events-auto [@media(hover:hover)_and_(pointer:fine)]:group-hover/vol:scale-x-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/vol:opacity-100 motion-reduce:transition-opacity @max-[26rem]/player:hidden">
        <input
          type="range"
          min={0}
          max={1}
          step={0.02}
          value={effectiveVolume}
          aria-label={t.volume}
          onChange={(e) => setVolume(Number(e.currentTarget.value))}
          className="h-1 w-14 cursor-pointer accent-white"
        />
      </div>
    </div>
  );
}

/** Captions toggle button. */
export function CaptionsButton({ className, ...props }: React.ComponentProps<'button'>) {
  const { captionsEnabled, toggleCaptions, t } = usePlayerControls();

  return (
    <button
      type="button"
      data-slot="video-captions-button"
      aria-label={t.captions}
      aria-pressed={captionsEnabled}
      title={`${t.captions} (C)`}
      onClick={toggleCaptions}
      className={cn(
        VIDEO_BUTTON_BASE,
        captionsEnabled && 'bg-white/20 text-white',
        className,
      )}
      {...props}
    >
      <Captions aria-hidden="true" />
    </button>
  );
}

/** Picture-in-Picture toggle button. */
export function PiPButton({ className, ...props }: React.ComponentProps<'button'>) {
  const { isPiP, togglePiP, t } = usePlayerControls();

  return (
    <button
      type="button"
      data-slot="video-pip-button"
      aria-label={t.pip}
      aria-pressed={isPiP}
      title={`${t.pip} (I)`}
      onClick={() => void togglePiP()}
      className={cn(VIDEO_BUTTON_BASE, className)}
      {...props}
    >
      <PictureInPicture2 aria-hidden="true" />
    </button>
  );
}

/** Fullscreen toggle button. */
export function FullscreenButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { isFullscreen, toggleFullscreen, t } = usePlayerControls();

  return (
    <button
      type="button"
      data-slot="video-fullscreen-button"
      aria-label={isFullscreen ? t.exitFullscreen : t.fullscreen}
      title={isFullscreen ? `${t.exitFullscreen} (F)` : `${t.fullscreen} (F)`}
      onClick={() => void toggleFullscreen()}
      className={cn(VIDEO_BUTTON_BASE, className)}
      {...props}
    >
      {isFullscreen ? (
        <Minimize aria-hidden="true" />
      ) : (
        <Maximize aria-hidden="true" />
      )}
    </button>
  );
}

/** Cycles playback speed (`0.5×` – `2×`). */
export function PlaybackRateButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { playbackRate, cyclePlaybackRate, t } = usePlayerControls();

  return (
    <button
      type="button"
      data-slot="video-rate-button"
      aria-label={t.speed}
      onClick={() => cyclePlaybackRate(1)}
      className={cn(
        VIDEO_BUTTON_BASE,
        'w-auto px-2 text-body-mini-medium tabular-nums',
        className,
      )}
      {...props}
    >
      {playbackRate}×
    </button>
  );
}

export interface TimeSliderProps {
  className?: string;
  renderThumbnail?: (
    props: { className: string },
    state: { time: number; percent: number },
  ) => React.ReactNode;
}

/** Interactive timeline scrubber with buffered bar, chapter segments, and hover timestamp/chapter preview. */
export function TimeSlider({ className, renderThumbnail }: TimeSliderProps) {
  const { currentTime, duration, bufferedEnd } = usePlaybackTime();
  const { chapters, seek, t } = usePlayerControls();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const trackRectRef = React.useRef<DOMRect | null>(null);
  const fillRef = React.useRef<HTMLDivElement>(null);
  const thumbTrackRef = React.useRef<HTMLSpanElement>(null);
  const previewTrackRef = React.useRef<HTMLDivElement>(null);
  const previewTimeRef = React.useRef<HTMLSpanElement>(null);
  const previewChapterRef = React.useRef<HTMLSpanElement>(null);

  const hoverPercentRef = React.useRef<number>(0);
  const dragRatioRef = React.useRef<number | null>(null);
  const draggingRef = React.useRef(false);
  const seekRafRef = React.useRef<number | null>(null);
  const pendingSeekRef = React.useRef<number | null>(null);

  const [isHovering, setIsHovering] = React.useState(false);
  const [dragging, setDragging] = React.useState(false);
  const [thumbnailPercent, setThumbnailPercent] = React.useState<number | null>(null);

  const safeDuration = duration > 0 ? duration : 0;
  const activeRatio =
    dragging && dragRatioRef.current !== null
      ? dragRatioRef.current
      : safeDuration > 0
        ? Math.max(0, Math.min(1, currentTime / safeDuration))
        : 0;
  const progressPercent = activeRatio * 100;
  const bufferedRatio =
    safeDuration > 0 ? Math.max(0, Math.min(1, bufferedEnd / safeDuration)) : 0;

  React.useEffect(() => {
    return () => {
      if (seekRafRef.current !== null) {
        window.cancelAnimationFrame(seekRafRef.current);
      }
    };
  }, []);

  const cacheTrackRect = () => {
    if (trackRef.current) {
      trackRectRef.current = trackRef.current.getBoundingClientRect();
    }
    return trackRectRef.current;
  };

  const getPercentFromClientX = (clientX: number) => {
    const rect = trackRectRef.current ?? cacheTrackRect();
    if (!rect || rect.width <= 0) return 0;
    return Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  };

  const getChapterTitleAt = (time: number): string => {
    if (chapters.length === 0) return '';
    let active = chapters[0];
    for (const ch of chapters) {
      if (time >= ch.startTime) active = ch;
    }
    return active?.title ?? '';
  };

  const updatePreviewDom = (pct: number) => {
    hoverPercentRef.current = pct;
    const clampedPct = Math.max(8, Math.min(92, pct * 100));
    if (previewTrackRef.current) {
      previewTrackRef.current.style.transform = `translate3d(${clampedPct}%, 0, 0)`;
    }
    const hoverTime = pct * safeDuration;
    if (previewTimeRef.current) {
      previewTimeRef.current.textContent = formatVideoTime(hoverTime);
    }
    if (previewChapterRef.current) {
      previewChapterRef.current.textContent = getChapterTitleAt(hoverTime);
    }
    if (renderThumbnail) {
      setThumbnailPercent(pct);
    }
  };

  const updateScrubDom = (pct: number) => {
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${pct})`;
    }
    if (thumbTrackRef.current) {
      thumbTrackRef.current.style.transform = `translate3d(${pct * 100}%, 0, 0)`;
    }
  };

  const scheduleSeek = (nextTime: number) => {
    pendingSeekRef.current = nextTime;
    if (seekRafRef.current === null) {
      seekRafRef.current = window.requestAnimationFrame(() => {
        seekRafRef.current = null;
        if (pendingSeekRef.current !== null) {
          seek(pendingSeekRef.current);
          pendingSeekRef.current = null;
        }
      });
    }
  };

  const handlePointerEnter = (event: React.PointerEvent<HTMLDivElement>) => {
    cacheTrackRect();
    const pct = getPercentFromClientX(event.clientX);
    hoverPercentRef.current = pct;
    if (!isHovering) setIsHovering(true);
    updatePreviewDom(pct);
  };

  const handlePointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || safeDuration <= 0) return;
    event.preventDefault();
    cacheTrackRect();
    event.currentTarget.setPointerCapture(event.pointerId);
    const pct = getPercentFromClientX(event.clientX);
    draggingRef.current = true;
    dragRatioRef.current = pct;
    setDragging(true);
    if (!isHovering) setIsHovering(true);
    updatePreviewDom(pct);
    updateScrubDom(pct);
    seek(pct * safeDuration);
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    const pct = getPercentFromClientX(event.clientX);
    if (!isHovering) setIsHovering(true);
    updatePreviewDom(pct);
    if (draggingRef.current && safeDuration > 0) {
      dragRatioRef.current = pct;
      updateScrubDom(pct);
      scheduleSeek(pct * safeDuration);
    }
  };

  const handlePointerUp = (event: React.PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    if (seekRafRef.current !== null) {
      window.cancelAnimationFrame(seekRafRef.current);
      seekRafRef.current = null;
    }
    const finalPct = dragRatioRef.current;
    pendingSeekRef.current = null;
    dragRatioRef.current = null;
    draggingRef.current = false;
    setDragging(false);
    if (finalPct !== null && safeDuration > 0) {
      seek(finalPct * safeDuration);
    }
  };

  const showPreview = (isHovering || dragging) && safeDuration > 0;
  const initialHoverPct = thumbnailPercent ?? hoverPercentRef.current;
  const initialHoverTime = initialHoverPct * safeDuration;
  const initialClampedPct = Math.max(8, Math.min(92, initialHoverPct * 100));

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={0}
      aria-label={t.timeline}
      aria-valuemin={0}
      aria-valuemax={Math.round(safeDuration)}
      aria-valuenow={Math.round(currentTime)}
      aria-valuetext={`${formatVideoTime(currentTime)} of ${formatVideoTime(safeDuration)}`}
      data-slot="video-time-slider"
      onPointerEnter={handlePointerEnter}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={() => {
        trackRectRef.current = null;
        if (!draggingRef.current) {
          setIsHovering(false);
          setThumbnailPercent(null);
        }
      }}
      onKeyDown={(event) => {
        if (safeDuration <= 0) return;
        if (event.key === 'ArrowRight') {
          event.preventDefault();
          seek(currentTime + 5);
        } else if (event.key === 'ArrowLeft') {
          event.preventDefault();
          seek(currentTime - 5);
        } else if (event.key === 'Home') {
          event.preventDefault();
          seek(0);
        } else if (event.key === 'End') {
          event.preventDefault();
          seek(safeDuration);
        }
      }}
      className={cn(
        'group/slider relative flex h-8 min-w-0 flex-1 cursor-pointer touch-none items-center outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:rounded-xs',
        className,
      )}
    >
      {/* Hover preview pill (timestamp + optional chapter title / thumbnail) */}
      {showPreview ? (
        <div
          ref={previewTrackRef}
          className="pointer-events-none absolute inset-x-0 bottom-full mb-2"
          style={{
            transform: `translate3d(${initialClampedPct}%, 0, 0)`,
          }}
        >
          <div className="flex w-max -translate-x-1/2 flex-col items-center gap-1 rounded-md bg-bg-tooltip px-2 py-1 text-center text-white shadow-medium backdrop-blur-xs">
            {renderThumbnail
              ? renderThumbnail(
                  { className: 'h-16 w-28 rounded-xs object-cover' },
                  { time: initialHoverTime, percent: initialHoverPct * 100 },
                )
              : null}
            {chapters.length > 0 ? (
              <span
                ref={previewChapterRef}
                className="max-w-44 truncate text-body-mini-medium text-white"
              >
                {getChapterTitleAt(initialHoverTime)}
              </span>
            ) : null}
            <span
              ref={previewTimeRef}
              className="text-body-micro-medium text-white/80 tabular-nums"
            >
              {formatVideoTime(initialHoverTime)}
            </span>
          </div>
        </div>
      ) : null}

      {/* Track */}
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-white/25 scale-y-[0.667] transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/slider:scale-y-100 motion-reduce:transition-none">
        <div
          className="absolute inset-0 origin-left rounded-full bg-white/35"
          style={{ transform: `scaleX(${bufferedRatio})` }}
        />
        <div
          ref={fillRef}
          className="absolute inset-0 origin-left rounded-full bg-white"
          style={{ transform: `scaleX(${activeRatio})` }}
        />
        {/* Chapter markers */}
        {safeDuration > 0 &&
          chapters.slice(1).map((ch) => {
            const pct = (ch.startTime / safeDuration) * 100;
            if (pct <= 0 || pct >= 100) return null;
            return (
              <span
                key={`${ch.startTime}-${ch.title}`}
                aria-hidden="true"
                className="absolute inset-y-0 w-0.5 bg-black/75"
                style={{ left: `${pct}%` }}
              />
            );
          })}
      </div>

      {/* Scrub thumb */}
      <span
        ref={thumbTrackRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2"
        style={{ transform: `translate3d(${progressPercent}%, 0, 0)` }}
      >
        <span
          className={cn(
            'pointer-events-none block size-3 -translate-x-1/2 rounded-full bg-white shadow-low scale-90 opacity-0 transition-[transform,opacity] duration-150 ease-out group-focus-visible/slider:scale-100 group-focus-visible/slider:opacity-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/slider:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/slider:opacity-100 motion-reduce:transition-none',
            dragging && 'scale-100 opacity-100',
          )}
        />
      </span>
    </div>
  );
}

/** Settings popover menu for playback speed, quality, captions, and PiP. */
export function SettingsMenu({ className }: { className?: string }) {
  const {
    playbackRate,
    setPlaybackRate,
    quality,
    setQuality,
    captionsEnabled,
    toggleCaptions,
    togglePiP,
    t,
  } = usePlayerControls();

  const [open, setOpen] = React.useState(false);
  const [section, setSection] = React.useState<'main' | 'speed' | 'quality'>('main');
  const menuRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) {
      setSection('main');
      return;
    }
    const handlePointerDown = (event: globalThis.PointerEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const qualities = [
    { value: 'auto', label: t.qualityAuto },
    { value: '1080p', label: '1080p' },
    { value: '720p', label: '720p' },
    { value: '480p', label: '480p' },
  ];

  return (
    <div ref={menuRef} data-slot="video-settings-menu" className={cn('relative', className)}>
      <button
        type="button"
        aria-label={t.settings}
        aria-expanded={open}
        aria-haspopup="menu"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(VIDEO_BUTTON_BASE, 'group/settings')}
      >
        <Settings
          aria-hidden="true"
          className="transition-transform duration-200 ease-out group-aria-expanded/settings:rotate-45 motion-reduce:transition-none"
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 bottom-full z-40 mb-2 min-w-48 rounded-lg bg-bg-tooltip p-1 text-white shadow-high backdrop-blur-md"
        >
          {section === 'main' ? (
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                role="menuitem"
                onClick={() => setSection('speed')}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-md px-2.5 py-1.5 text-body-small-regular text-white/90 transition-colors hover:bg-white/10"
              >
                <span>{t.speed}</span>
                <span className="text-body-mini-medium text-white/65 tabular-nums">
                  {playbackRate}×
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => setSection('quality')}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-md px-2.5 py-1.5 text-body-small-regular text-white/90 transition-colors hover:bg-white/10"
              >
                <span>{t.quality}</span>
                <span className="text-body-mini-medium text-white/65">
                  {quality === 'auto' ? t.qualityAuto : quality}
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  toggleCaptions();
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-md px-2.5 py-1.5 text-body-small-regular text-white/90 transition-colors hover:bg-white/10"
              >
                <span>{t.captions}</span>
                <span className="text-body-mini-medium text-white/65">
                  {captionsEnabled ? t.captionsOn : t.captionsOff}
                </span>
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  void togglePiP();
                  setOpen(false);
                }}
                className="flex w-full cursor-pointer items-center justify-between gap-4 rounded-md px-2.5 py-1.5 text-body-small-regular text-white/90 transition-colors hover:bg-white/10"
              >
                <span>{t.pip}</span>
                <PictureInPicture2 aria-hidden="true" className="size-3.5 text-white/65" />
              </button>
            </div>
          ) : null}

          {section === 'speed' ? (
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setSection('main')}
                className="mb-0.5 flex w-full cursor-pointer items-center gap-2 border-b border-white/10 px-2.5 py-1.5 text-body-mini-medium text-white/70 hover:text-white"
              >
                ← {t.speed}
              </button>
              {VIDEO_PLAYBACK_RATES.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  role="menuitemradio"
                  aria-checked={playbackRate === rate}
                  onClick={() => {
                    setPlaybackRate(rate);
                    setOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-body-small-regular text-white/90 tabular-nums transition-colors hover:bg-white/10"
                >
                  <span>{rate}×</span>
                  {playbackRate === rate ? (
                    <Check aria-hidden="true" className="size-3.5 text-white" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}

          {section === 'quality' ? (
            <div className="flex flex-col gap-0.5">
              <button
                type="button"
                onClick={() => setSection('main')}
                className="mb-0.5 flex w-full cursor-pointer items-center gap-2 border-b border-white/10 px-2.5 py-1.5 text-body-mini-medium text-white/70 hover:text-white"
              >
                ← {t.quality}
              </button>
              {qualities.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  role="menuitemradio"
                  aria-checked={quality === item.value}
                  onClick={() => {
                    setQuality(item.value);
                    setOpen(false);
                  }}
                  className="flex w-full cursor-pointer items-center justify-between gap-3 rounded-md px-2.5 py-1.5 text-body-small-regular text-white/90 transition-colors hover:bg-white/10"
                >
                  <span>{item.label}</span>
                  {quality === item.value ? (
                    <Check aria-hidden="true" className="size-3.5 text-white" />
                  ) : null}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export interface DefaultVideoControlsProps {
  /** Custom renderer for the hover thumbnail inside the timeline preview. */
  renderThumbnail?: TimeSliderProps['renderThumbnail'];
}

function VideoElapsedTime() {
  const { currentTime } = usePlaybackTime();
  return (
    <span className="shrink-0 text-body-small-medium text-white/90 tabular-nums @max-[16rem]/time:hidden @7xl/player:text-body-regular-medium">
      {formatVideoTime(currentTime)}
    </span>
  );
}

function VideoDurationToggle() {
  const { currentTime, duration } = usePlaybackTime();
  const [showRemaining, setShowRemaining] = React.useState(true);
  const remaining = Math.max(0, duration - currentTime);

  return (
    <button
      type="button"
      onClick={() => setShowRemaining((prev) => !prev)}
      className="shrink-0 cursor-pointer rounded-xs text-body-small-medium text-white/85 tabular-nums outline-none hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 @max-[16rem]/time:hidden @7xl/player:text-body-regular-medium"
    >
      {showRemaining && duration > 0
        ? `-${formatVideoTime(remaining)}`
        : formatVideoTime(duration)}
    </button>
  );
}

/** Default responsive video control bar with gradient scrim, play/volume, chapter timeline, captions, settings, and fullscreen. */
export function DefaultVideoControls({
  renderThumbnail,
}: DefaultVideoControlsProps) {
  const { controlsVisible, error } = usePlayerControls();

  if (error) return null;

  return (
    <>
      {/* Smooth multi-stop bottom scrim */}
      <div
        aria-hidden="true"
        data-visible={controlsVisible ? '' : undefined}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-15 h-32 max-h-[55%] bg-linear-to-t from-black/85 via-black/40 to-transparent transition-opacity duration-250 ease-out not-data-visible:opacity-0 motion-reduce:transition-opacity motion-reduce:translate-y-0"
      />
      {/* Control bar */}
      <div
        data-slot="video-controls"
        data-visible={controlsVisible ? '' : undefined}
        className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-3 pb-2.5 text-white transition-[opacity,transform] duration-250 ease-out select-none not-data-visible:translate-y-1 not-data-visible:opacity-0 motion-reduce:transition-opacity motion-reduce:translate-y-0"
      >
        <div
          dir="ltr"
          className="pointer-events-auto flex items-center gap-1.5 not-data-visible:pointer-events-none"
        >
          <div className="flex shrink-0 items-center gap-0.5">
            <PlayButton />
            <VolumePopover />
          </div>

          <div className="@container/time flex min-w-0 flex-1 items-center gap-2.5 px-1.5">
            <VideoElapsedTime />
            <TimeSlider renderThumbnail={renderThumbnail} />
            <VideoDurationToggle />
          </div>

          <div className="flex shrink-0 items-center gap-0.5">
            <CaptionsButton className="@max-lg/player:hidden" />
            <SettingsMenu />
            <FullscreenButton />
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// VideoSkin
// ---------------------------------------------------------------------------

export interface VideoSkinProps extends Omit<React.ComponentProps<'div'>, 'children'> {
  children?: React.ReactNode;
  /** Replaces the default control bar. Pass `null` to remove the bar. */
  controls?: React.ReactNode | null;
  /** Language of labels, tooltips, and RTL direction. */
  locale?: string;
  /** Custom renderer for the poster image, for example with `next/image`. */
  renderPoster?: PosterProps['renderImage'];
}

/**
 * The complete Rakfound video player interface: responsive container, poster,
 * buffering and error states, keyboard shortcuts, click/double-click gestures, and control bar.
 */
export function VideoSkin({
  children,
  className,
  controls,
  locale,
  renderPoster,
  ...props
}: VideoSkinProps) {
  const ctx = usePlayerControls();
  const { playing, setLocale, setControlsVisible } = ctx;
  const hideTimerRef = React.useRef<number | null>(null);
  const clickTimerRef = React.useRef<number | null>(null);
  const lastTapRef = React.useRef<number>(0);

  React.useEffect(() => {
    setLocale(locale);
  }, [setLocale, locale]);

  const scheduleHideControls = React.useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
    if (playing) {
      hideTimerRef.current = window.setTimeout(() => {
        setControlsVisible(false);
      }, 2400);
    }
  }, [playing, setControlsVisible]);

  const revealControls = React.useCallback(() => {
    setControlsVisible(true);
    scheduleHideControls();
  }, [setControlsVisible, scheduleHideControls]);

  React.useEffect(() => {
    if (!playing) {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current);
        hideTimerRef.current = null;
      }
      setControlsVisible(true);
    } else {
      scheduleHideControls();
    }
  }, [playing, setControlsVisible, scheduleHideControls]);

  React.useEffect(() => {
    return () => {
      if (hideTimerRef.current !== null) window.clearTimeout(hideTimerRef.current);
      if (clickTimerRef.current !== null) window.clearTimeout(clickTimerRef.current);
    };
  }, []);

  const handleSurfaceClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement | null;
    if (target?.closest('button, a, input, [role="slider"], [role="menu"], [data-slot="video-timed-slot"]')) {
      return;
    }
    if (ctx.error) return;

    const now = Date.now();
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0.5;

    if (now - lastTapRef.current < 240) {
      lastTapRef.current = 0;
      if (clickTimerRef.current !== null) {
        window.clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
      if (ratio < 0.33) {
        ctx.skip(-10);
      } else if (ratio > 0.67) {
        ctx.skip(10);
      } else {
        void ctx.toggleFullscreen();
      }
      revealControls();
      return;
    }

    lastTapRef.current = now;
    clickTimerRef.current = window.setTimeout(() => {
      clickTimerRef.current = null;
      ctx.togglePlay();
      revealControls();
    }, 180);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (ctx.error) return;
    const target = event.target as HTMLElement | null;
    if (target?.tagName === 'INPUT' || target?.tagName === 'TEXTAREA') return;

    const key = event.key.toLowerCase();
    let handled = true;

    if (event.key === ' ' || key === 'k') {
      ctx.togglePlay();
    } else if (event.key === 'ArrowLeft' || key === 'j') {
      ctx.skip(-10);
    } else if (event.key === 'ArrowRight' || key === 'l') {
      ctx.skip(10);
    } else if (event.key === 'ArrowUp') {
      const next = Math.min(1, ctx.volume + 0.1);
      ctx.setVolume(next);
      ctx.showFeedback({ kind: 'volume', label: `${Math.round(next * 100)}%` });
    } else if (event.key === 'ArrowDown') {
      const next = Math.max(0, ctx.volume - 0.1);
      ctx.setVolume(next);
      ctx.showFeedback({ kind: 'volume', label: `${Math.round(next * 100)}%` });
    } else if (key === 'm') {
      ctx.toggleMute();
    } else if (key === 'f') {
      void ctx.toggleFullscreen();
    } else if (key === 'c') {
      ctx.toggleCaptions();
    } else if (key === 'i') {
      void ctx.togglePiP();
    } else if (event.key === 'Home') {
      ctx.seek(0);
    } else if (event.key === 'End' && ctx.duration > 0) {
      ctx.seek(ctx.duration);
    } else if (event.key === '<') {
      ctx.cyclePlaybackRate(-1);
    } else if (event.key === '>') {
      ctx.cyclePlaybackRate(1);
    } else if (event.key >= '0' && event.key <= '9' && ctx.duration > 0) {
      ctx.seek((Number(event.key) / 10) * ctx.duration);
    } else {
      handled = false;
    }

    if (handled) {
      event.preventDefault();
      revealControls();
    }
  };

  const dir = locale ? (isRtlLocale(locale) ? 'rtl' : 'ltr') : undefined;
  const resolvedControls = controls === undefined ? <DefaultVideoControls /> : controls;

  return (
    <div
      ref={ctx.bindContainerElement}
      data-slot="video-skin"
      data-playing={ctx.playing ? '' : undefined}
      data-controls-visible={ctx.controlsVisible ? '' : undefined}
      dir={dir}
      tabIndex={0}
      onMouseMove={revealControls}
      onMouseLeave={() => {
        if (ctx.playing) ctx.setControlsVisible(false);
      }}
      onFocus={() => ctx.setControlsVisible(true)}
      onClick={handleSurfaceClick}
      onKeyDown={handleKeyDown}
      className={cn(
        '@container/player relative isolate flex h-full w-full items-center justify-center overflow-hidden rounded-xl bg-black text-white shadow-low outline-none select-none focus-visible:ring-2 focus-visible:ring-ring',
        !ctx.controlsVisible && ctx.playing && 'cursor-none',
        className,
      )}
      {...props}
    >
      {children}
      <Poster renderImage={renderPoster} />
      <BufferingIndicator />
      <ErrorMessage />

      {/* Center play button before playback starts */}
      {!ctx.started && !ctx.error ? (
        <button
          type="button"
          aria-label={ctx.t.play}
          onClick={(e) => {
            e.stopPropagation();
            void ctx.play();
          }}
          className="absolute z-25 flex size-13 cursor-pointer items-center justify-center rounded-full bg-black/65 text-white shadow-high backdrop-blur-xs transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:hover:scale-105 hover:bg-black/80 active:scale-95 focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:outline-none motion-reduce:transition-none"
        >
          <Play aria-hidden="true" className="size-5 translate-x-[1px] fill-current" />
        </button>
      ) : null}

      {/* On-screen shortcut / seek / volume feedback */}
      {ctx.feedback ? (
        <div
          key={ctx.feedback.id}
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute z-25 flex items-center gap-1.5 rounded-full bg-bg-tooltip px-3 py-1.5 text-body-small-medium text-white shadow-medium backdrop-blur-xs tabular-nums',
            ctx.feedback.kind === 'seek' && ctx.feedback.direction === 'backward'
              ? 'left-6'
              : ctx.feedback.kind === 'seek' && ctx.feedback.direction === 'forward'
                ? 'right-6'
                : 'left-1/2 -translate-x-1/2',
          )}
        >
          {ctx.feedback.label}
        </div>
      ) : null}

      {resolvedControls}
    </div>
  );
}
