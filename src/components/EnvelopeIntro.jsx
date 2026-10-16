import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import LogoHeader from './LogoHeader.jsx';

/**
 * 開場信封動畫
 * closed → (點擊) opening：封蠟淡出 → 上蓋翻開 → 喜帖卡片升起 → 呼叫 onOpen()
 * 外層由 App 的 AnimatePresence 控制淡出。
 */

const ease = [0.22, 1, 0.36, 1];

const C = {
  brown: '#583217',
  brownLight: '#7A5236',
  brownDark: '#3F230F',
  brownDeep: '#2A1608',
  beige: '#D8CCB6',
  beigeDark: '#C4B59B',
};

export default function EnvelopeIntro({ onOpen }) {
  const [opening, setOpening] = useState(false);

  // 開場時鎖住頁面捲動
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    if (!opening) return;
    const id = setTimeout(onOpen, 2300);
    return () => clearTimeout(id);
  }, [opening, onOpen]);

  const open = () => setOpening(true);
  const state = opening ? 'open' : 'closed';

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-hidden px-6"
      style={{
        background: `radial-gradient(120% 80% at 50% 30%, ${C.brownLight} 0%, ${C.brown} 42%, ${C.brownDark} 75%, ${C.brownDeep} 100%)`,
      }}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, transition: { duration: 1, ease } }}
    >
      {/* 紙紋 + 雙線框 + 柔光，增加層次 */}
      <div className="paper-grain pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute inset-4 border border-beige/25 sm:inset-8" />
      <div className="pointer-events-none absolute inset-[22px] border border-beige/10 sm:inset-[38px]" />
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70vmin] w-[70vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, ${C.beige}33 0%, transparent 65%)` }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.7, 1, 0.7] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        className="relative text-center text-beige"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: opening ? 0 : 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: opening ? 0 : 0.2 }}
      >
        <p className="font-serif text-[11px] tracking-widest3 text-beige/70 sm:text-xs">You&rsquo;re Invited</p>
        <p className="mt-4 font-display text-3xl tracking-[0.25em] sm:text-4xl">HARRY &amp; WINDY</p>
        <div className="mt-4 flex items-center justify-center gap-3 font-serif text-xs tracking-widest2 text-beige/80">
          <span className="h-px w-8 bg-beige/40" />
          2026 · 11 · 07
          <span className="h-px w-8 bg-beige/40" />
        </div>
      </motion.div>

      {/* 信封本體 */}
      <motion.button
        type="button"
        onClick={open}
        disabled={opening}
        aria-label="點擊開啟喜帖"
        className="relative mt-10 aspect-[3/2] w-[min(86vw,500px)] cursor-pointer outline-none [perspective:1400px] focus-visible:ring-2 focus-visible:ring-beige/60"
        initial={{ opacity: 0, y: 30, scale: 0.94 }}
        animate={{ opacity: 1, y: opening ? 60 : 0, scale: 1 }}
        transition={{ duration: 1.1, ease, delay: opening ? 0.9 : 0.35 }}
        whileHover={opening ? undefined : { y: -4 }}
        style={{ filter: 'drop-shadow(0 30px 40px rgba(20,10,3,.55))' }}
      >
        {/* 背面 */}
        <svg viewBox="0 0 300 200" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="env-back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor={C.brownDeep} />
              <stop offset="1" stopColor={C.brownDark} />
            </linearGradient>
          </defs>
          <rect width="300" height="200" rx="4" fill="url(#env-back)" />
        </svg>

        {/* 喜帖卡片 */}
        <motion.div
          className="absolute inset-x-[7%] top-[7%] z-10 h-[86%] rounded-sm px-[6%] pt-[7%] shadow-soft"
          style={{ background: `linear-gradient(180deg, #F5F2EC 0%, ${C.beige} 100%)` }}
          variants={{ closed: { y: 0 }, open: { y: '-58%' } }}
          initial="closed"
          animate={state}
          transition={{ duration: 1, ease, delay: 1.05 }}
        >
          <div className="pointer-events-none absolute inset-[5px] border border-earth/25" />
          <LogoHeader className="mx-auto h-auto w-[78%]" animate={false} />
          <p className="mt-[4%] text-center font-serif text-[9px] tracking-widest2 text-earth/70 sm:text-[11px]">
            WITH LOVE ALWAYS
          </p>
        </motion.div>

        {/* 前方口袋：三片不同深淺的棕色，製造層次 */}
        <svg viewBox="0 0 300 200" className="absolute inset-0 z-20 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="env-bottom" x1="0" y1="1" x2="0" y2="0">
              <stop offset="0" stopColor={C.brown} />
              <stop offset="1" stopColor={C.brownLight} />
            </linearGradient>
          </defs>
          <path d="M0 0 L148 108 L0 200 Z" fill="#4E2C14" />
          <path d="M300 0 L152 108 L300 200 Z" fill="#53301A" />
          <path d="M0 200 L150 92 L300 200 Z" fill="url(#env-bottom)" />
          <path d="M14 200 L150 102 L286 200" fill="none" stroke={C.beige} strokeOpacity=".35" strokeWidth=".8" />
        </svg>

        {/* 上蓋：正面深棕、內襯奶茶色，翻開時看得到內襯 */}
        <motion.div
          className="absolute inset-x-0 top-0 h-[58%] origin-top [transform-style:preserve-3d]"
          variants={{
            closed: { rotateX: 0, zIndex: 30 },
            open: {
              rotateX: 180,
              zIndex: 5,
              transition: {
                rotateX: { duration: 0.9, ease: [0.65, 0, 0.35, 1], delay: 0.3 },
                zIndex: { delay: 0.75, duration: 0 },
              },
            },
          }}
          initial="closed"
          animate={state}
        >
          <svg
            viewBox="0 0 300 116"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full [backface-visibility:hidden]"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="env-flap" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor={C.brown} />
                <stop offset="1" stopColor={C.brownLight} />
              </linearGradient>
            </defs>
            <path d="M0 0 L300 0 L150 116 Z" fill="url(#env-flap)" />
            <path d="M14 0 L150 104 L286 0" fill="none" stroke={C.beige} strokeOpacity=".4" strokeWidth=".8" />
          </svg>
          <svg
            viewBox="0 0 300 116"
            preserveAspectRatio="none"
            className="absolute inset-0 h-full w-full [backface-visibility:hidden] [transform:rotateX(180deg)]"
            aria-hidden="true"
          >
            <path d="M0 0 L300 0 L150 116 Z" fill={C.beige} />
            <path d="M16 0 L150 102 L284 0" fill="none" stroke={C.brown} strokeOpacity=".35" strokeWidth=".8" />
          </svg>
        </motion.div>

        {/* 封蠟章 */}
        <motion.div
          className="absolute left-1/2 top-[58%] z-40 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full sm:h-20 sm:w-20"
          style={{
            background: `radial-gradient(circle at 35% 30%, #EFE6D6 0%, ${C.beige} 45%, ${C.beigeDark} 100%)`,
            boxShadow: '0 6px 14px rgba(20,10,3,.45), inset 0 -3px 6px rgba(88,50,23,.25)',
          }}
          variants={{ closed: { scale: 1, opacity: 1 }, open: { scale: 0.5, opacity: 0 } }}
          initial="closed"
          animate={state}
          transition={{ duration: 0.4 }}
        >
          <span className="absolute inset-[5px] rounded-full border border-earth/40" />
          <span className="absolute inset-[8px] rounded-full border border-earth/20" />
          <span className="font-display text-lg tracking-wider text-earth sm:text-xl">H&amp;W</span>
        </motion.div>
      </motion.button>

      <motion.p
        className="relative mt-12 font-serif text-[11px] tracking-widest2 text-beige/80 sm:text-xs"
        initial={{ opacity: 0 }}
        animate={opening ? { opacity: 0 } : { opacity: [0.35, 1, 0.35] }}
        transition={opening ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity, delay: 1 }}
      >
        TAP TO OPEN · 點擊開啟喜帖
      </motion.p>
    </motion.div>
  );
}
