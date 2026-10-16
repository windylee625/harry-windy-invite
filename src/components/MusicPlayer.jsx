import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * 背景音樂
 * - 瀏覽器禁止自動播放，必須在使用者點擊時呼叫 start()（由開信封觸發）
 * - 淡入播放、循環；切到其他 App／分頁時暫停，回來後繼續
 * - 音檔不存在時自動停用，不顯示按鈕
 */
const TARGET_VOLUME = 0.55;

export function useBackgroundMusic(src) {
  const audioRef = useRef(null);
  const fadeRef = useRef(null);
  const wasPlayingRef = useRef(false);
  const [available, setAvailable] = useState(false);
  const [playing, setPlaying] = useState(false);

  // 直接建立播放器：能讀到音訊資料就顯示按鈕，讀取失敗（檔案不存在／格式錯誤）才停用。
  // 不依賴伺服器回應標頭，避免部署平台設定不同而誤判。
  useEffect(() => {
    const audio = new Audio();
    audio.loop = true;
    audio.preload = 'auto';
    audio.addEventListener('loadedmetadata', () => setAvailable(true));
    audio.addEventListener('error', () => {
      setAvailable(false);
      if (audioRef.current === audio) audioRef.current = null;
    });
    audio.addEventListener('play', () => setPlaying(true));
    audio.addEventListener('pause', () => setPlaying(false));
    audio.src = src;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.removeAttribute('src');
    };
  }, [src]);

  const fadeTo = useCallback((target, ms, done) => {
    const audio = audioRef.current;
    if (!audio) return;
    clearInterval(fadeRef.current);
    const steps = 25;
    const delta = (target - audio.volume) / steps;
    let n = 0;
    fadeRef.current = setInterval(() => {
      n += 1;
      audio.volume = Math.min(1, Math.max(0, audio.volume + delta));
      if (n >= steps) {
        clearInterval(fadeRef.current);
        audio.volume = target;
        done?.();
      }
    }, ms / steps);
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0;
    audio.play().then(() => fadeTo(TARGET_VOLUME, 2500)).catch(() => {});
  }, [fadeTo]);

  const pause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    fadeTo(0, 600, () => audio.pause());
  }, [fadeTo]);

  const toggle = useCallback(() => {
    if (audioRef.current?.paused) play();
    else pause();
  }, [play, pause]);

  // 切換 App／分頁時暫停
  useEffect(() => {
    const onVisibility = () => {
      const audio = audioRef.current;
      if (!audio) return;
      if (document.hidden) {
        wasPlayingRef.current = !audio.paused;
        audio.pause();
      } else if (wasPlayingRef.current) {
        play();
      }
    };
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, [play]);

  // start 必須在點擊事件中同步呼叫，iOS 才允許播放
  return { available, playing, start: play, toggle };
}

export function MusicToggle({ visible, playing, onToggle }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={onToggle}
          aria-label={playing ? '暫停音樂' : '播放音樂'}
          aria-pressed={playing}
          className="fixed bottom-5 right-5 z-50 flex h-12 w-12 items-center justify-center rounded-full border border-beige/60 bg-earth text-beige shadow-soft sm:bottom-7 sm:right-7"
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileTap={{ scale: 0.92 }}
        >
          {/* 黑膠唱片：播放時旋轉 */}
          <motion.span
            className="absolute inset-1.5 rounded-full border border-beige/25"
            animate={{ rotate: playing ? 360 : 0 }}
            transition={playing ? { duration: 6, repeat: Infinity, ease: 'linear' } : { duration: 0.4 }}
          >
            <span className="absolute left-1/2 top-0.5 h-1 w-1 -translate-x-1/2 rounded-full bg-beige/60" />
          </motion.span>
          <svg viewBox="0 0 24 24" className="relative h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M9 18V6l10-2v12" strokeLinejoin="round" />
            <circle cx="6.5" cy="18" r="2.5" />
            <circle cx="16.5" cy="16" r="2.5" />
            {!playing && <path d="M4 4l16 16" strokeLinecap="round" />}
          </svg>
          {playing && (
            <span className="pointer-events-none absolute inset-0 animate-ping rounded-full border border-beige/30 [animation-duration:2.4s]" />
          )}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
