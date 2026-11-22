'use client';

import * as React from 'react';
import {
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Volume1,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const PLAYBACK_RATES = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2] as const;
export type PlaybackRate = (typeof PLAYBACK_RATES)[number];

const RTL_LANGS = new Set(['ar', 'dv', 'fa', 'he', 'ku', 'ps', 'sd', 'ug', 'ur', 'yi']);

interface Translations {
  play: string;
  pause: string;
  skipBack: string;
  skipForward: string;
  mute: string;
  unmute: string;
  timeline: string;
  volume: string;
  speed: string;
  buffering: string;
  error: string;
}

const TRANSLATIONS: Record<string, Translations> = {
  en: {
    play: 'Play',
    pause: 'Pause',
    skipBack: 'Skip back 10 seconds',
    skipForward: 'Skip forward 10 seconds',
    mute: 'Mute',
    unmute: 'Unmute',
    timeline: 'Seek timeline',
    volume: 'Volume',
    speed: 'Playback speed',
    buffering: 'Buffering audio',
    error: 'This audio file can’t be played.',
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
    speed: 'Velocidad de reproducción',
    buffering: 'Cargando audio',
    error: 'No se puede reproducir este archivo de audio.',
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
    speed: 'Vitesse de lecture',
    buffering: 'Mise en mémoire tampon',
    error: 'Impossible de lire ce fichier audio.',
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
    speed: 'Wiedergabegeschwindigkeit',
    buffering: 'Audio wird gepuffert',
    error: 'Diese Audiodatei kann nicht abgespielt werden.',
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
    speed: 'سرعة التشغيل',
    buffering: 'جارٍ التحميل',
    error: 'تعذّر تشغيل ملف الصوت هذا.',
  },
};

function getTranslations(locale?: string): Translations {
  if (!locale) return TRANSLATIONS.en;
  const base = locale.toLowerCase().split('-')[0];
  return TRANSLATIONS[base] ?? TRANSLATIONS.en;
}

function isRtlLocale(locale?: string): boolean {
  if (!locale) return false;
  const base = locale.toLowerCase().split('-')[0];
  return RTL_LANGS.has(base);
}

export function formatAudioTime(seconds: number): string {
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

/** Extracts an 11-character YouTube video ID from youtu.be or youtube.com URLs. */
export function extractYouTubeId(src?: string | Blob | MediaSource | MediaStream): string | null {
  if (typeof src !== 'string' || !src) return null;
  const match = src.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([A-Za-z0-9_-]{11})/,
  );
  return match ? match[1] : null;
}

/** Extracts a start offset in seconds from `?t=`, `&t=`, or `&start=` in a media URL. */
export function extractStartTime(src?: string | Blob | MediaSource | MediaStream): number {
  if (typeof src !== 'string' || !src) return 0;
  const match = src.match(/[?&#](?:t|start)=(\d+)s?/i);
  return match ? Number(match[1]) || 0 : 0;
}

interface YTPlayerInstance {
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

interface YTNamespace {
  Player: new (
    element: HTMLElement,
    options: {
      videoId: string;
      width?: number | string;
      height?: number | string;
      playerVars?: Record<string, number | string>;
      events?: {
        onReady?: (event: { target: YTPlayerInstance }) => void;
        onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
        onPlaybackRateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
        onError?: (event: { data: number; target: YTPlayerInstance }) => void;
      };
    },
  ) => YTPlayerInstance;
  PlayerState: {
    UNSTARTED: -1;
    ENDED: 0;
    PLAYING: 1;
    PAUSED: 2;
    BUFFERING: 3;
    CUED: 5;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

let ytApiPromise: Promise<YTNamespace> | null = null;

function loadYouTubeIframeApi(): Promise<YTNamespace> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('YouTube IFrame API requires a browser environment.'));
  }
  if (window.YT && window.YT.Player) {
    return Promise.resolve(window.YT);
  }
  if (ytApiPromise) {
    return ytApiPromise;
  }

  ytApiPromise = new Promise<YTNamespace>((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousReady?.();
      if (window.YT && window.YT.Player) {
        resolve(window.YT);
      } else {
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
        ytApiPromise = null;
        reject(new Error('Failed to load YouTube IFrame API script.'));
      };
      document.head.appendChild(script);
    }
  });

  return ytApiPromise;
}

export interface ExternalMediaBridge {
  play: () => void;
  pause: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setPlaybackRate: (rate: number) => void;
}

export interface PlayerState {
  playing: boolean;
  paused: boolean;
  waiting: boolean;
  bufferingVisible: boolean;
  error: string | null;
  currentTime: number;
  duration: number;
  bufferedEnd: number;
  volume: number;
  muted: boolean;
  playbackRate: number;
  locale?: string;
  t: Translations;
  audioElement: HTMLAudioElement | null;
  play: () => Promise<void>;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  skip: (deltaSeconds: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  setPlaybackRate: (rate: number) => void;
  cyclePlaybackRate: (direction?: 1 | -1) => void;
  setLocale: (locale?: string) => void;
  bindAudioElement: (el: HTMLAudioElement | null) => void;
  bindExternalBridge: (bridge: ExternalMediaBridge | null) => void;
  updateExternalState: (patch: {
    playing?: boolean;
    waiting?: boolean;
    error?: string | null;
    currentTime?: number;
    duration?: number;
    bufferedEnd?: number;
    volume?: number;
    muted?: boolean;
    playbackRate?: number;
  }) => void;
  notifyError: () => void;
}

/** Selector helper compatible with `usePlayer((state) => selectTime(state)?.currentTime)`. */
export function selectTime(state: PlayerState) {
  return {
    currentTime: state.currentTime,
    duration: state.duration,
    bufferedEnd: state.bufferedEnd,
  };
}

/** Feature set descriptor for the AudioPlayer preset. */
export const audioFeatures = Object.freeze({
  preset: 'audio',
  controls: ['play', 'skip', 'timeline', 'playbackRate', 'volume'] as const,
  shortcuts: true,
});

export interface PlaybackTimeState {
  currentTime: number;
  duration: number;
  bufferedEnd: number;
}

const AudioPlayerContext = React.createContext<PlayerState | null>(null);
const PlaybackTimeContext = React.createContext<PlaybackTimeState | null>(null);

function usePlayerControls(): PlayerState {
  const ctx = React.useContext(AudioPlayerContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within an <AudioPlayer>.');
  }
  return ctx;
}

/**
 * Reads high-frequency playback time and buffer progress without subscribing static controls.
 */
export function usePlaybackTime(): PlaybackTimeState {
  const timeCtx = React.useContext(PlaybackTimeContext);
  const playerCtx = React.useContext(AudioPlayerContext);
  if (timeCtx) return timeCtx;
  if (playerCtx) {
    return {
      currentTime: playerCtx.currentTime,
      duration: playerCtx.duration,
      bufferedEnd: playerCtx.bufferedEnd,
    };
  }
  throw new Error('usePlaybackTime must be used within an <AudioPlayer>.');
}

/**
 * Reads playback state or a selected slice from any component inside `<AudioPlayer>`.
 */
export function usePlayer(): PlayerState;
export function usePlayer<T>(selector: (state: PlayerState) => T): T;
export function usePlayer<T>(selector?: (state: PlayerState) => T): PlayerState | T {
  const ctx = React.useContext(AudioPlayerContext);
  const timeCtx = React.useContext(PlaybackTimeContext);
  if (!ctx) {
    throw new Error('usePlayer must be used within an <AudioPlayer>.');
  }
  const merged = React.useMemo<PlayerState>(
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

export interface AudioPlayerProps {
  children?: React.ReactNode;
}

/**
 * Owns playback state for everything inside it. Renders no UI.
 */
export function AudioPlayer({ children }: AudioPlayerProps) {
  const [audioEl, setAudioEl] = React.useState<HTMLAudioElement | null>(null);
  const externalBridgeRef = React.useRef<ExternalMediaBridge | null>(null);
  const [hasExternalBridge, setHasExternalBridge] = React.useState(false);
  const [playing, setPlaying] = React.useState(false);
  const [waiting, setWaiting] = React.useState(false);
  const [bufferingVisible, setBufferingVisible] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [duration, setDuration] = React.useState(0);
  const [bufferedEnd, setBufferedEnd] = React.useState(0);
  const [volume, setVolumeState] = React.useState(1);
  const [muted, setMutedState] = React.useState(false);
  const [playbackRate, setPlaybackRateState] = React.useState<number>(1);
  const [locale, setLocale] = React.useState<string | undefined>(undefined);

  const currentTimeRef = React.useRef(currentTime);
  currentTimeRef.current = currentTime;
  const bufferedEndRef = React.useRef(bufferedEnd);
  bufferedEndRef.current = bufferedEnd;

  const t = React.useMemo(() => getTranslations(locale), [locale]);

  const bindExternalBridge = React.useCallback((bridge: ExternalMediaBridge | null) => {
    externalBridgeRef.current = bridge;
    setHasExternalBridge(Boolean(bridge));
  }, []);

  const updateExternalState = React.useCallback(
    (patch: {
      playing?: boolean;
      waiting?: boolean;
      error?: string | null;
      currentTime?: number;
      duration?: number;
      bufferedEnd?: number;
      volume?: number;
      muted?: boolean;
      playbackRate?: number;
    }) => {
      if (patch.playing !== undefined) setPlaying(patch.playing);
      if (patch.waiting !== undefined) setWaiting(patch.waiting);
      if (patch.error !== undefined) setError(patch.error);
      if (patch.currentTime !== undefined) setCurrentTime(patch.currentTime);
      if (patch.duration !== undefined && Number.isFinite(patch.duration) && patch.duration >= 0) {
        setDuration(patch.duration);
      }
      if (
        patch.bufferedEnd !== undefined &&
        Number.isFinite(patch.bufferedEnd) &&
        patch.bufferedEnd >= 0
      ) {
        setBufferedEnd(patch.bufferedEnd);
      }
      if (patch.volume !== undefined) setVolumeState(patch.volume);
      if (patch.muted !== undefined) setMutedState(patch.muted);
      if (patch.playbackRate !== undefined) setPlaybackRateState(patch.playbackRate);
    },
    [],
  );

  // Delay buffering indicator by 500ms so brief network stalls never flash a loader.
  React.useEffect(() => {
    if (!waiting) {
      setBufferingVisible(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setBufferingVisible(true);
    }, 500);
    return () => window.clearTimeout(timer);
  }, [waiting]);

  React.useEffect(() => {
    if (!audioEl) return;

    const syncTime = () => {
      setCurrentTime(audioEl.currentTime || 0);
      if (Number.isFinite(audioEl.duration) && audioEl.duration > 0) {
        setDuration(audioEl.duration);
      }
      if (audioEl.buffered.length > 0) {
        setBufferedEnd(audioEl.buffered.end(audioEl.buffered.length - 1));
      }
    };

    const handlePlay = () => {
      setPlaying(true);
      setError(null);
    };
    const handlePlaying = () => {
      setPlaying(true);
      setWaiting(false);
      setError(null);
    };
    const handlePause = () => {
      setPlaying(false);
      setWaiting(false);
    };
    const handleWaiting = () => {
      setWaiting(true);
    };
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
      setVolumeState(audioEl.volume);
      setMutedState(audioEl.muted);
    };
    const handleRateChange = () => {
      setPlaybackRateState(audioEl.playbackRate);
    };
    const handleError = () => {
      setPlaying(false);
      setWaiting(false);
      setError(t.error);
    };
    const handleEmptied = () => {
      setError(null);
      setCurrentTime(0);
      setDuration(0);
      setBufferedEnd(0);
    };

    if (audioEl.error) {
      setError(t.error);
    } else if (audioEl.readyState >= 1) {
      syncTime();
    }

    audioEl.addEventListener('timeupdate', syncTime);
    audioEl.addEventListener('durationchange', syncTime);
    audioEl.addEventListener('progress', syncTime);
    audioEl.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioEl.addEventListener('canplay', handleCanPlay);
    audioEl.addEventListener('play', handlePlay);
    audioEl.addEventListener('playing', handlePlaying);
    audioEl.addEventListener('pause', handlePause);
    audioEl.addEventListener('ended', handlePause);
    audioEl.addEventListener('waiting', handleWaiting);
    audioEl.addEventListener('volumechange', handleVolumeChange);
    audioEl.addEventListener('ratechange', handleRateChange);
    audioEl.addEventListener('error', handleError);
    audioEl.addEventListener('emptied', handleEmptied);

    return () => {
      audioEl.removeEventListener('timeupdate', syncTime);
      audioEl.removeEventListener('durationchange', syncTime);
      audioEl.removeEventListener('progress', syncTime);
      audioEl.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioEl.removeEventListener('canplay', handleCanPlay);
      audioEl.removeEventListener('play', handlePlay);
      audioEl.removeEventListener('playing', handlePlaying);
      audioEl.removeEventListener('pause', handlePause);
      audioEl.removeEventListener('ended', handlePause);
      audioEl.removeEventListener('waiting', handleWaiting);
      audioEl.removeEventListener('volumechange', handleVolumeChange);
      audioEl.removeEventListener('ratechange', handleRateChange);
      audioEl.removeEventListener('error', handleError);
      audioEl.removeEventListener('emptied', handleEmptied);
    };
  }, [audioEl, t.error]);

  const play = React.useCallback(async () => {
    if (error) return;
    if (externalBridgeRef.current) {
      externalBridgeRef.current.play();
      return;
    }
    if (!audioEl) return;
    try {
      await audioEl.play();
    } catch {
      setError(t.error);
    }
  }, [audioEl, error, t.error]);

  const pause = React.useCallback(() => {
    if (externalBridgeRef.current) {
      externalBridgeRef.current.pause();
      return;
    }
    audioEl?.pause();
  }, [audioEl]);

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
    if (!audioEl) return;
    if (audioEl.paused) {
      void play();
    } else {
      pause();
    }
  }, [audioEl, error, pause, play, playing]);

  const seek = React.useCallback(
    (time: number) => {
      if (externalBridgeRef.current) {
        const clamped = Math.max(0, duration > 0 ? Math.min(time, duration) : time);
        externalBridgeRef.current.seek(clamped);
        setCurrentTime(clamped);
        return;
      }
      if (!audioEl) return;
      const max = Number.isFinite(audioEl.duration) ? audioEl.duration : duration;
      const clamped = Math.max(0, max > 0 ? Math.min(time, max) : time);
      audioEl.currentTime = clamped;
      setCurrentTime(clamped);
    },
    [audioEl, duration],
  );

  const skip = React.useCallback(
    (deltaSeconds: number) => {
      if (externalBridgeRef.current) {
        seek(currentTimeRef.current + deltaSeconds);
        return;
      }
      if (!audioEl) return;
      seek((audioEl.currentTime || 0) + deltaSeconds);
    },
    [audioEl, seek],
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
      if (audioEl) {
        audioEl.volume = clamped;
        if (clamped > 0 && audioEl.muted) {
          audioEl.muted = false;
          setMutedState(false);
        }
      }
    },
    [audioEl, muted],
  );

  const toggleMute = React.useCallback(() => {
    if (externalBridgeRef.current) {
      const nextMuted = !muted;
      externalBridgeRef.current.setMuted(nextMuted);
      setMutedState(nextMuted);
      return;
    }
    if (!audioEl) {
      setMutedState((prev) => !prev);
      return;
    }
    audioEl.muted = !audioEl.muted;
    setMutedState(audioEl.muted);
  }, [audioEl, muted]);

  const setPlaybackRate = React.useCallback(
    (rate: number) => {
      setPlaybackRateState(rate);
      if (externalBridgeRef.current) {
        externalBridgeRef.current.setPlaybackRate(rate);
        return;
      }
      if (audioEl) {
        audioEl.playbackRate = rate;
      }
    },
    [audioEl],
  );

  const cyclePlaybackRate = React.useCallback(
    (direction: 1 | -1 = 1) => {
      const currentIndex = PLAYBACK_RATES.findIndex((r) => r === playbackRate);
      const baseIndex = currentIndex === -1 ? 2 : currentIndex;
      const nextIndex = (baseIndex + direction + PLAYBACK_RATES.length) % PLAYBACK_RATES.length;
      setPlaybackRate(PLAYBACK_RATES[nextIndex]);
    },
    [playbackRate, setPlaybackRate],
  );

  const notifyError = React.useCallback(() => {
    setPlaying(false);
    setWaiting(false);
    setError(t.error);
  }, [t.error]);

  const value = React.useMemo<PlayerState>(
    () => ({
      playing,
      paused: !playing,
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
      locale,
      t,
      audioElement: audioEl,
      play,
      pause,
      togglePlay,
      seek,
      skip,
      setVolume,
      toggleMute,
      setPlaybackRate,
      cyclePlaybackRate,
      setLocale,
      bindAudioElement: setAudioEl,
      bindExternalBridge,
      updateExternalState,
      notifyError,
    }),
    [
      audioEl,
      bindExternalBridge,
      bufferingVisible,
      cyclePlaybackRate,
      duration,
      error,
      hasExternalBridge,
      locale,
      muted,
      notifyError,
      pause,
      play,
      playbackRate,
      playing,
      seek,
      setPlaybackRate,
      setVolume,
      skip,
      t,
      toggleMute,
      togglePlay,
      updateExternalState,
      volume,
      waiting,
    ],
  );

  const timeValue = React.useMemo<PlaybackTimeState>(
    () => ({
      currentTime,
      duration,
      bufferedEnd,
    }),
    [currentTime, duration, bufferedEnd],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      <PlaybackTimeContext.Provider value={timeValue}>
        {children}
      </PlaybackTimeContext.Provider>
    </AudioPlayerContext.Provider>
  );
}

export interface AudioProps extends React.ComponentProps<'audio'> {
  /** Optional start time in seconds (can also be passed via `?t=` or `&t=` in `src`). */
  startTime?: number;
}

/**
 * Renders the media source: a native `<audio>` element for standard audio files,
 * or a hidden YouTube IFrame audio bridge when `src` is a YouTube link.
 */
export function Audio({
  ref,
  preload = 'metadata',
  src,
  startTime,
  onError,
  onLoadedMetadata,
  ...props
}: AudioProps) {
  const ctx = React.useContext(AudioPlayerContext);
  const internalRef = React.useRef<HTMLAudioElement | null>(null);
  const ytContainerRef = React.useRef<HTMLDivElement | null>(null);
  const youtubeId = extractYouTubeId(src);
  const initialStartSeconds = startTime ?? extractStartTime(src);

  const setRefs = React.useCallback(
    (node: HTMLAudioElement | null) => {
      internalRef.current = node;
      ctx?.bindAudioElement(node);
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    },
    [ctx, ref],
  );

  React.useEffect(() => {
    if (!youtubeId || !ctx) return;

    ctx.bindAudioElement(null);
    ctx.updateExternalState({
      currentTime: initialStartSeconds,
      playing: false,
      error: null,
    });
    let cancelled = false;
    let player: YTPlayerInstance | null = null;
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

    const syncMetrics = (target: YTPlayerInstance) => {
      try {
        const rawCur = target.getCurrentTime?.() ?? 0;
        const cur =
          !hasPlayedOrSeeked && initialStartSeconds > 0 && rawCur < initialStartSeconds
            ? initialStartSeconds
            : rawCur;
        const dur = target.getDuration?.() ?? 0;
        const frac = target.getVideoLoadedFraction?.() ?? 0;
        ctx.updateExternalState({
          currentTime: cur,
          ...(dur > 0 ? { duration: dur, bufferedEnd: frac * dur } : {}),
        });
      } catch {
        // Ignore transient YouTube IFrame postMessage errors
      }
    };

    const startPolling = (target: YTPlayerInstance) => {
      stopPolling();
      syncMetrics(target);
      pollTimer = window.setInterval(() => syncMetrics(target), 200);
    };

    const bridge: ExternalMediaBridge = {
      play: () => {
        if (ready && player) {
          ctx.updateExternalState({ waiting: true, error: null });
          if (!hasPlayedOrSeeked && initialStartSeconds > 0) {
            player.seekTo(initialStartSeconds, true);
          }
          hasPlayedOrSeeked = true;
          player.playVideo();
        } else {
          pendingPlay = true;
          ctx.updateExternalState({ waiting: true, error: null });
        }
      },
      pause: () => {
        pendingPlay = false;
        if (ready && player) {
          player.pauseVideo();
        }
        ctx.updateExternalState({ playing: false, waiting: false });
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

    ctx.bindExternalBridge(bridge);

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled || !ytContainerRef.current) return;
        const mountTarget = document.createElement('div');
        ytContainerRef.current.replaceChildren(mountTarget);

        player = new YT.Player(mountTarget, {
          videoId: youtubeId,
          width: 1,
          height: 1,
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
                iframe.setAttribute('aria-hidden', 'true');
              }
              event.target.setVolume(Math.round(desiredState.volume * 100));
              if (desiredState.muted) {
                event.target.mute();
              } else {
                event.target.unMute();
              }
              event.target.setPlaybackRate(desiredState.playbackRate);
              syncMetrics(event.target);

              if (pendingPlay) {
                pendingPlay = false;
                if (!hasPlayedOrSeeked && initialStartSeconds > 0) {
                  event.target.seekTo(initialStartSeconds, true);
                }
                hasPlayedOrSeeked = true;
                event.target.playVideo();
              } else {
                ctx.updateExternalState({ waiting: false });
              }
            },
            onStateChange: (event) => {
              if (cancelled) return;
              const state = event.data;
              if (state === YT.PlayerState.PLAYING) {
                hasPlayedOrSeeked = true;
                ctx.updateExternalState({ playing: true, waiting: false, error: null });
                startPolling(event.target);
              } else if (state === YT.PlayerState.PAUSED) {
                stopPolling();
                syncMetrics(event.target);
                ctx.updateExternalState({ playing: false, waiting: false });
              } else if (state === YT.PlayerState.ENDED) {
                stopPolling();
                syncMetrics(event.target);
                ctx.updateExternalState({ playing: false, waiting: false });
              } else if (state === YT.PlayerState.BUFFERING) {
                ctx.updateExternalState({ waiting: true });
              } else if (state === YT.PlayerState.CUED) {
                syncMetrics(event.target);
                ctx.updateExternalState({ waiting: false });
              }
            },
            onPlaybackRateChange: (event) => {
              if (cancelled) return;
              ctx.updateExternalState({ playbackRate: event.data });
            },
            onError: () => {
              if (cancelled) return;
              stopPolling();
              ctx.notifyError();
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) {
          ctx.notifyError();
        }
      });

    return () => {
      cancelled = true;
      stopPolling();
      ctx.bindExternalBridge(null);
      try {
        player?.destroy();
      } catch {
        // Ignore teardown errors
      }
    };
  }, [
    youtubeId,
    initialStartSeconds,
    ctx?.bindAudioElement,
    ctx?.bindExternalBridge,
    ctx?.updateExternalState,
    ctx?.notifyError,
  ]);

  if (youtubeId) {
    return (
      <div
        ref={ytContainerRef}
        aria-hidden="true"
        data-slot="youtube-audio-bridge"
        className="pointer-events-none absolute top-0 left-0 size-px overflow-hidden opacity-0"
      />
    );
  }

  return (
    <audio
      ref={setRefs}
      preload={preload}
      src={src}
      onLoadedMetadata={(e) => {
        if (initialStartSeconds > 0 && e.currentTarget.currentTime === 0) {
          e.currentTarget.currentTime = initialStartSeconds;
        }
        onLoadedMetadata?.(e);
      }}
      onError={(e) => {
        ctx?.notifyError();
        onError?.(e);
      }}
      {...props}
    />
  );
}

const PREFS_STORAGE_KEY = 'rakfound-player-preferences';
const PREFS_EVENT_NAME = 'rakfound-player-preferences-change';

interface StoredPreferences {
  volume?: number;
  muted?: boolean;
  playbackRate?: number;
}

/**
 * Persists and synchronizes listener volume, mute, and playback speed across players and page loads.
 */
export function UserPreferences() {
  const { volume, muted, playbackRate, setVolume, toggleMute, setPlaybackRate } =
    usePlayerControls();
  const initializedRef = React.useRef(false);
  const applyingExternalRef = React.useRef(false);

  // Restore saved preferences on mount
  React.useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;
    try {
      const raw = window.localStorage.getItem(PREFS_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredPreferences;
      applyingExternalRef.current = true;
      if (typeof parsed.volume === 'number') setVolume(parsed.volume);
      if (typeof parsed.muted === 'boolean' && parsed.muted !== muted) {
        toggleMute();
      }
      if (typeof parsed.playbackRate === 'number') setPlaybackRate(parsed.playbackRate);
      applyingExternalRef.current = false;
    } catch {
      applyingExternalRef.current = false;
    }
  }, [muted, setPlaybackRate, setVolume, toggleMute]);

  // Save when preferences change in this player
  React.useEffect(() => {
    if (!initializedRef.current || applyingExternalRef.current) return;
    const payload: StoredPreferences = { volume, muted, playbackRate };
    try {
      window.localStorage.setItem(PREFS_STORAGE_KEY, JSON.stringify(payload));
      window.dispatchEvent(new CustomEvent<StoredPreferences>(PREFS_EVENT_NAME, { detail: payload }));
    } catch {
      // Ignore storage quota errors
    }
  }, [volume, muted, playbackRate]);

  // Listen for updates from other players on the same page
  React.useEffect(() => {
    const handleSync = (event: Event) => {
      const detail = (event as CustomEvent<StoredPreferences>).detail;
      if (!detail) return;
      applyingExternalRef.current = true;
      if (typeof detail.volume === 'number' && detail.volume !== volume) {
        setVolume(detail.volume);
      }
      if (typeof detail.muted === 'boolean' && detail.muted !== muted) {
        toggleMute();
      }
      if (typeof detail.playbackRate === 'number' && detail.playbackRate !== playbackRate) {
        setPlaybackRate(detail.playbackRate);
      }
      applyingExternalRef.current = false;
    };
    window.addEventListener(PREFS_EVENT_NAME, handleSync);
    return () => window.removeEventListener(PREFS_EVENT_NAME, handleSync);
  }, [muted, playbackRate, setPlaybackRate, setVolume, toggleMute, volume]);

  return null;
}

/**
 * Animated Rakfound/Profound mark indicator shown when playback buffers for more than 500ms.
 */
export function BufferingIndicator({ className }: { className?: string }) {
  const { bufferingVisible, t } = usePlayerControls();
  if (!bufferingVisible) return null;

  return (
    <span
      role="status"
      aria-label={t.buffering}
      data-slot="buffering-indicator"
      className={cn(
        'pointer-events-none absolute inset-0 flex items-center justify-center rounded-sm bg-bg-primary',
        className,
      )}
    >
      <svg
        viewBox="0 0 66 68"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="size-4 text-text-primary"
      >
        <path
          d="M2 50.5V28C2 26.2 2.9 24.5 4.5 23.6L30.5 8.5C32 7.6 34 7.6 35.5 8.5L61.5 23.6C63.1 24.5 64 26.2 64 28V31.5C64 32.7 63.3 33.8 62.2 34.5L35.2 50.1C33.8 50.9 32.2 50.9 30.8 50.1L18.7 43.1C17.6 42.5 17 42.9 17 44.1V59.5C17 61.1 15.8 61.5 14.5 60.7L4.2 54.7C2.8 53.9 2 52.3 2 50.5Z"
          stroke="currentColor"
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={100}
          strokeDasharray="65 35"
          className="origin-center animate-[spin_1.4s_linear_infinite] motion-reduce:animate-pulse"
        />
        <path
          d="M38.2 52.3L61.8 38.6C63 37.9 64 38.5 64 39.9V51.2C64 52.5 63.3 53.7 62.1 54.4L52.1 60.2C50.9 60.9 49.4 60.9 48.2 60.2L38.2 54.4C37 53.7 37 53 38.2 52.3Z"
          fill="#376CFF"
        />
      </svg>
    </span>
  );
}

const controlButtonClass =
  'relative inline-flex size-7 shrink-0 items-center justify-center rounded-sm text-text-primary transition-[transform,background-color,color] duration-150 ease-out hover:bg-control-hover active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none';

/** Play / Pause toggle button with integrated BufferingIndicator overlay. */
export function PlayButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { playing, togglePlay, t, error } = usePlayerControls();
  const label = playing ? t.pause : t.play;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={Boolean(error)}
      onClick={togglePlay}
      data-slot="play-button"
      data-state={playing ? 'playing' : 'paused'}
      className={cn(controlButtonClass, className)}
      {...props}
    >
      {playing ? (
        <Pause className="size-4 fill-current" aria-hidden="true" />
      ) : (
        <Play className="size-4 translate-x-[0.5px] fill-current" aria-hidden="true" />
      )}
      <BufferingIndicator />
    </button>
  );
}

/** Skip backward 10 seconds button. */
export function SkipBackButton({
  className,
  seconds = 10,
  ...props
}: React.ComponentProps<'button'> & { seconds?: number }) {
  const { skip, t, error } = usePlayerControls();

  return (
    <button
      type="button"
      aria-label={t.skipBack}
      title={t.skipBack}
      disabled={Boolean(error)}
      onClick={() => skip(-seconds)}
      data-slot="skip-back-button"
      className={cn(
        controlButtonClass,
        'text-text-secondary hover:text-text-primary',
        className,
      )}
      {...props}
    >
      <RotateCcw className="size-3.5" aria-hidden="true" />
      <span className="sr-only">{seconds}s</span>
    </button>
  );
}

/** Skip forward 10 seconds button. */
export function SkipForwardButton({
  className,
  seconds = 10,
  ...props
}: React.ComponentProps<'button'> & { seconds?: number }) {
  const { skip, t, error } = usePlayerControls();

  return (
    <button
      type="button"
      aria-label={t.skipForward}
      title={t.skipForward}
      disabled={Boolean(error)}
      onClick={() => skip(seconds)}
      data-slot="skip-forward-button"
      className={cn(
        controlButtonClass,
        'text-text-secondary hover:text-text-primary',
        className,
      )}
      {...props}
    >
      <RotateCw className="size-3.5" aria-hidden="true" />
      <span className="sr-only">{seconds}s</span>
    </button>
  );
}

/** Interactive timeline scrubber with pointer-capture dragging and buffered progress track. */
export function TimeSlider({ className }: { className?: string }) {
  const { currentTime, duration, bufferedEnd } = usePlaybackTime();
  const { seek, t, error, locale } = usePlayerControls();
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const fillRef = React.useRef<HTMLDivElement | null>(null);
  const thumbRef = React.useRef<HTMLSpanElement | null>(null);
  const dragMetricsRef = React.useRef<{ rect: DOMRect; isRtl: boolean } | null>(null);
  const dragRatioRef = React.useRef<number | null>(null);
  const seekRafRef = React.useRef<number | null>(null);
  const pendingSeekRef = React.useRef<number | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);

  const effectiveDuration = duration > 0 ? duration : 0;
  const isRtl = isRtlLocale(locale);
  const activeRatio =
    isDragging && dragRatioRef.current !== null
      ? dragRatioRef.current
      : effectiveDuration > 0
        ? Math.max(0, Math.min(1, currentTime / effectiveDuration))
        : 0;
  const displayedTime = activeRatio * effectiveDuration;
  const bufferedRatio =
    effectiveDuration > 0 ? Math.max(0, Math.min(1, bufferedEnd / effectiveDuration)) : 0;

  React.useEffect(() => {
    return () => {
      if (seekRafRef.current !== null) {
        window.cancelAnimationFrame(seekRafRef.current);
      }
    };
  }, []);

  const getRatioFromClientX = (clientX: number, metrics: { rect: DOMRect; isRtl: boolean }) => {
    const { rect, isRtl: rtl } = metrics;
    if (rect.width <= 0) return 0;
    const rawRatio = rtl
      ? (rect.right - clientX) / rect.width
      : (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, rawRatio));
  };

  const writeDragDom = (ratio: number, rtl: boolean) => {
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${ratio})`;
    }
    if (thumbRef.current) {
      const signedPct = (rtl ? -ratio : ratio) * 100;
      thumbRef.current.style.transform = `translate3d(${signedPct}%, 0, 0)`;
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

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (error || effectiveDuration <= 0) return;
    const track = trackRef.current;
    if (!track) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const metrics = {
      rect: track.getBoundingClientRect(),
      isRtl: getComputedStyle(track).direction === 'rtl',
    };
    dragMetricsRef.current = metrics;
    const ratio = getRatioFromClientX(e.clientX, metrics);
    dragRatioRef.current = ratio;
    setIsDragging(true);
    writeDragDom(ratio, metrics.isRtl);
    seek(ratio * effectiveDuration);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const metrics = dragMetricsRef.current;
    if (!metrics || effectiveDuration <= 0) return;
    const ratio = getRatioFromClientX(e.clientX, metrics);
    dragRatioRef.current = ratio;
    writeDragDom(ratio, metrics.isRtl);
    scheduleSeek(ratio * effectiveDuration);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const metrics = dragMetricsRef.current;
    if (!metrics) return;
    dragMetricsRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (seekRafRef.current !== null) {
      window.cancelAnimationFrame(seekRafRef.current);
      seekRafRef.current = null;
    }
    const finalRatio = dragRatioRef.current;
    pendingSeekRef.current = null;
    dragRatioRef.current = null;
    setIsDragging(false);
    if (finalRatio !== null && effectiveDuration > 0) {
      seek(finalRatio * effectiveDuration);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (error || effectiveDuration <= 0) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      e.stopPropagation();
      seek(displayedTime + 5);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      e.stopPropagation();
      seek(displayedTime - 5);
    } else if (e.key === 'Home') {
      e.preventDefault();
      e.stopPropagation();
      seek(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      e.stopPropagation();
      seek(effectiveDuration);
    }
  };

  const signedPlayedPct = (isRtl ? -activeRatio : activeRatio) * 100;

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={error ? -1 : 0}
      aria-label={t.timeline}
      aria-valuemin={0}
      aria-valuemax={Math.round(effectiveDuration)}
      aria-valuenow={Math.round(displayedTime)}
      aria-valuetext={`${formatAudioTime(displayedTime)} / ${formatAudioTime(effectiveDuration)}`}
      data-slot="time-slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        'group/slider relative flex h-7 min-w-16 flex-1 cursor-pointer items-center select-none touch-none focus-visible:outline-none',
        className,
      )}
    >
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-fill-quaternary scale-y-[0.667] transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/slider:scale-y-100 group-focus-visible/slider:ring-2 group-focus-visible/slider:ring-ring/50 motion-reduce:transition-none">
        <div
          aria-hidden="true"
          className="absolute inset-0 origin-left rtl:origin-right bg-fill-tertiary"
          style={{ transform: `scaleX(${bufferedRatio})` }}
        />
        <div
          ref={fillRef}
          aria-hidden="true"
          className="absolute inset-0 origin-left rtl:origin-right bg-fill-primary"
          style={{ transform: `scaleX(${activeRatio})` }}
        />
      </div>
      <span
        ref={thumbRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 flex items-center"
        style={{ transform: `translate3d(${signedPlayedPct}%, 0, 0)` }}
      >
        <span
          className={cn(
            '-ms-[5px] size-2.5 rounded-full bg-fill-primary shadow-low transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none',
            isDragging
              ? 'scale-110 opacity-100'
              : 'scale-90 opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/slider:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/slider:opacity-100 group-focus-visible/slider:scale-100 group-focus-visible/slider:opacity-100',
          )}
        />
      </span>
    </div>
  );
}

/** Tabular current time and total duration label. */
export function TimeDisplay({ className }: { className?: string }) {
  const { currentTime, duration } = usePlaybackTime();

  return (
    <div
      data-slot="time-display"
      className={cn(
        'inline-flex shrink-0 items-center gap-1 font-mono text-body-mini-medium text-text-secondary tabular-nums select-none',
        className,
      )}
    >
      <span className="text-text-primary">{formatAudioTime(currentTime)}</span>
      <span className="text-text-tertiary">/</span>
      <span>{formatAudioTime(duration)}</span>
    </div>
  );
}

/** Button cycling through standard playback speeds (`0.5x` – `2x`). */
export function PlaybackRateButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { playbackRate, cyclePlaybackRate, t, error } = usePlayerControls();

  return (
    <button
      type="button"
      aria-label={`${t.speed}: ${playbackRate}x`}
      title={`${t.speed} (${playbackRate}x)`}
      disabled={Boolean(error)}
      onClick={() => cyclePlaybackRate(1)}
      data-slot="playback-rate-button"
      className={cn(
        'inline-flex h-7 min-w-9 shrink-0 items-center justify-center rounded-sm px-1.5 font-mono text-body-mini-medium text-text-secondary tabular-nums transition-[transform,background-color,color] duration-150 ease-out hover:bg-control-hover hover:text-text-primary active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none',
        className,
      )}
      {...props}
    >
      {playbackRate}x
    </button>
  );
}

/** Mute / Unmute toggle button with adaptive volume level icon. */
export function MuteButton({
  className,
  ...props
}: React.ComponentProps<'button'>) {
  const { volume, muted, toggleMute, t, error } = usePlayerControls();
  const isSilent = muted || volume === 0;
  const label = isSilent ? t.unmute : t.mute;

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={Boolean(error)}
      onClick={toggleMute}
      data-slot="mute-button"
      data-state={isSilent ? 'muted' : 'unmuted'}
      className={cn(
        controlButtonClass,
        'text-text-secondary hover:text-text-primary',
        className,
      )}
      {...props}
    >
      {isSilent ? (
        <VolumeX className="size-4" aria-hidden="true" />
      ) : volume < 0.5 ? (
        <Volume1 className="size-4" aria-hidden="true" />
      ) : (
        <Volume2 className="size-4" aria-hidden="true" />
      )}
    </button>
  );
}

/** Compact pointer-captured volume slider. */
export function VolumeSlider({ className }: { className?: string }) {
  const { volume, muted, setVolume, t, error, locale } = usePlayerControls();
  const trackRef = React.useRef<HTMLDivElement | null>(null);
  const fillRef = React.useRef<HTMLDivElement | null>(null);
  const thumbRef = React.useRef<HTMLSpanElement | null>(null);
  const dragMetricsRef = React.useRef<{ rect: DOMRect; isRtl: boolean } | null>(null);
  const dragRatioRef = React.useRef<number | null>(null);
  const volRafRef = React.useRef<number | null>(null);
  const pendingVolRef = React.useRef<number | null>(null);
  const [dragging, setDragging] = React.useState(false);

  const isRtl = isRtlLocale(locale);
  const effectiveVolume =
    dragging && dragRatioRef.current !== null ? dragRatioRef.current : muted ? 0 : volume;

  React.useEffect(() => {
    return () => {
      if (volRafRef.current !== null) {
        window.cancelAnimationFrame(volRafRef.current);
      }
    };
  }, []);

  const getRatioFromClientX = (clientX: number, metrics: { rect: DOMRect; isRtl: boolean }) => {
    const { rect, isRtl: rtl } = metrics;
    if (rect.width <= 0) return 0;
    const ratio = rtl
      ? (rect.right - clientX) / rect.width
      : (clientX - rect.left) / rect.width;
    return Math.max(0, Math.min(1, ratio));
  };

  const writeDragDom = (ratio: number, rtl: boolean) => {
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${ratio})`;
    }
    if (thumbRef.current) {
      const signedPct = (rtl ? -ratio : ratio) * 100;
      thumbRef.current.style.transform = `translate3d(${signedPct}%, 0, 0)`;
    }
  };

  const scheduleVolume = (nextVol: number) => {
    pendingVolRef.current = nextVol;
    if (volRafRef.current === null) {
      volRafRef.current = window.requestAnimationFrame(() => {
        volRafRef.current = null;
        if (pendingVolRef.current !== null) {
          setVolume(pendingVolRef.current);
          pendingVolRef.current = null;
        }
      });
    }
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (error) return;
    const track = trackRef.current;
    if (!track) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const metrics = {
      rect: track.getBoundingClientRect(),
      isRtl: getComputedStyle(track).direction === 'rtl',
    };
    dragMetricsRef.current = metrics;
    const ratio = getRatioFromClientX(e.clientX, metrics);
    dragRatioRef.current = ratio;
    setDragging(true);
    writeDragDom(ratio, metrics.isRtl);
    setVolume(ratio);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const metrics = dragMetricsRef.current;
    if (!metrics) return;
    const ratio = getRatioFromClientX(e.clientX, metrics);
    dragRatioRef.current = ratio;
    writeDragDom(ratio, metrics.isRtl);
    scheduleVolume(ratio);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const metrics = dragMetricsRef.current;
    if (!metrics) return;
    dragMetricsRef.current = null;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    if (volRafRef.current !== null) {
      window.cancelAnimationFrame(volRafRef.current);
      volRafRef.current = null;
    }
    const finalRatio = dragRatioRef.current;
    pendingVolRef.current = null;
    dragRatioRef.current = null;
    setDragging(false);
    if (finalRatio !== null) {
      setVolume(finalRatio);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (error) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setVolume(effectiveVolume + 0.05);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setVolume(effectiveVolume - 0.05);
    }
  };

  const signedVolPct = (isRtl ? -effectiveVolume : effectiveVolume) * 100;

  return (
    <div
      ref={trackRef}
      role="slider"
      tabIndex={error ? -1 : 0}
      aria-label={t.volume}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(effectiveVolume * 100)}
      data-slot="volume-slider"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onKeyDown={handleKeyDown}
      className={cn(
        'group/vol relative flex h-7 w-14 shrink-0 cursor-pointer items-center select-none touch-none focus-visible:outline-none',
        className,
      )}
    >
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-fill-quaternary scale-y-[0.667] transition-transform duration-150 ease-out [@media(hover:hover)_and_(pointer:fine)]:group-hover/vol:scale-y-100 group-focus-visible/vol:ring-2 group-focus-visible/vol:ring-ring/50 motion-reduce:transition-none">
        <div
          ref={fillRef}
          aria-hidden="true"
          className="absolute inset-0 origin-left rtl:origin-right bg-fill-primary"
          style={{ transform: `scaleX(${effectiveVolume})` }}
        />
      </div>
      <span
        ref={thumbRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 flex items-center"
        style={{ transform: `translate3d(${signedVolPct}%, 0, 0)` }}
      >
        <span
          className={cn(
            '-ms-1 size-2 rounded-full bg-fill-primary shadow-low transition-[transform,opacity] duration-150 ease-out motion-reduce:transition-none',
            dragging
              ? 'scale-110 opacity-100'
              : 'scale-90 opacity-0 [@media(hover:hover)_and_(pointer:fine)]:group-hover/vol:scale-100 [@media(hover:hover)_and_(pointer:fine)]:group-hover/vol:opacity-100 group-focus-visible/vol:scale-100 group-focus-visible/vol:opacity-100',
          )}
        />
      </span>
    </div>
  );
}

/**
 * Default audio control bar rendered by `AudioSkin`.
 * Responds to its own container width: below 512px the skip buttons drop, then the time labels.
 */
export function DefaultAudioControls() {
  return (
    <div
      data-slot="default-audio-controls"
      className="flex w-full items-center gap-2 p-1 text-text-primary"
    >
      <div className="flex items-center gap-0.5">
        <PlayButton />
        <SkipBackButton className="hidden @[512px]/audio-skin:inline-flex" />
        <SkipForwardButton className="hidden @[512px]/audio-skin:inline-flex" />
      </div>
      <TimeSlider className="mx-1" />
      <TimeDisplay className="hidden @[360px]/audio-skin:inline-flex" />
      <div className="flex items-center gap-0.5">
        <PlaybackRateButton />
        <MuteButton />
        <VolumeSlider className="mr-1.5 ml-0.5 hidden @[440px]/audio-skin:flex" />
      </div>
    </div>
  );
}

export interface AudioSkinProps extends React.ComponentProps<'div'> {
  /** Custom control bar replacing `<DefaultAudioControls />`. */
  controls?: React.ReactNode;
  /** Locale code for labels, announcements, and automatic RTL direction. */
  locale?: string;
}

/**
 * The audio player interface: control bar, error state, container queries, and scoped keyboard shortcuts.
 */
export function AudioSkin({
  className,
  controls,
  locale,
  children,
  onKeyDown,
  ...props
}: AudioSkinProps) {
  const {
    error,
    setLocale,
    togglePlay,
    skip,
    seek,
    duration,
    volume,
    setVolume,
    toggleMute,
    cyclePlaybackRate,
  } = usePlayerControls();

  React.useEffect(() => {
    setLocale(locale);
  }, [locale, setLocale]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(e);
    if (e.defaultPrevented || error) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;

    const target = e.target as HTMLElement | null;
    const isButton = target?.tagName === 'BUTTON';

    switch (e.key) {
      case ' ':
      case 'k':
      case 'K': {
        if (e.key === ' ' && isButton) return;
        e.preventDefault();
        togglePlay();
        break;
      }
      case 'ArrowLeft':
      case 'j':
      case 'J': {
        e.preventDefault();
        skip(-10);
        break;
      }
      case 'ArrowRight':
      case 'l':
      case 'L': {
        e.preventDefault();
        skip(10);
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        setVolume(volume + 0.05);
        break;
      }
      case 'ArrowDown': {
        e.preventDefault();
        setVolume(volume - 0.05);
        break;
      }
      case 'm':
      case 'M': {
        e.preventDefault();
        toggleMute();
        break;
      }
      case '<': {
        e.preventDefault();
        cyclePlaybackRate(-1);
        break;
      }
      case '>': {
        e.preventDefault();
        cyclePlaybackRate(1);
        break;
      }
      default: {
        if (/^[0-9]$/.test(e.key) && duration > 0) {
          e.preventDefault();
          const percent = Number(e.key) * 0.1;
          seek(duration * percent);
        }
        break;
      }
    }
  };

  const dir = locale ? (isRtlLocale(locale) ? 'rtl' : 'ltr') : undefined;

  return (
    <div
      role="region"
      aria-label="Audio player"
      dir={dir}
      tabIndex={-1}
      data-slot="audio-skin"
      data-error={error ? 'true' : undefined}
      onKeyDown={handleKeyDown}
      className={cn(
        '@container/audio-skin relative flex items-center rounded-lg border border-border bg-bg-primary text-text-primary shadow-low outline-none focus-visible:ring-2 focus-visible:ring-ring/50',
        className,
      )}
      {...props}
    >
      {children}
      {error ? (
        <div
          role="alert"
          data-slot="audio-error"
          className="flex min-h-7 w-full items-center gap-2 px-2.5 py-1 text-body-small-regular text-text-secondary"
        >
          <AlertCircle className="size-4 shrink-0 text-destructive" aria-hidden="true" />
          <span className="truncate">{error}</span>
        </div>
      ) : (
        (controls ?? <DefaultAudioControls />)
      )}
    </div>
  );
}
