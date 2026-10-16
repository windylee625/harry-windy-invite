import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

// 證婚儀式開始時間（台灣時間）
const WEDDING_DATE = new Date('2026-11-07T11:00:00+08:00');

function getRemaining(target) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    done: diff === 0,
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff / 3600000) % 24),
    minutes: Math.floor((diff / 60000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function Unit({ value, label, zh }) {
  const text = String(value).padStart(2, '0');
  return (
    <div className="flex w-16 flex-col items-center sm:w-24">
      <div className="relative h-12 w-full overflow-hidden sm:h-16">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={text}
            initial={{ y: '60%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-60%', opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center font-elegant text-4xl tabular-nums sm:text-5xl"
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </div>
      <span className="mt-2 font-serif text-[10px] tracking-widest2 sm:text-xs">{label}</span>
      <span className="mt-0.5 text-[10px] tracking-[0.3em] opacity-60">{zh}</span>
    </div>
  );
}

export default function Countdown({ className = '', target = WEDDING_DATE }) {
  const [t, setT] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setT(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (t.done) {
    return (
      <p className={`font-serif text-lg tracking-widest2 ${className}`}>
        TODAY IS THE DAY · 今天就是婚禮日
      </p>
    );
  }

  const Sep = () => <span className="mb-10 select-none font-elegant text-2xl opacity-40 sm:mb-12">·</span>;

  return (
    <div className={`flex items-end justify-center gap-1 sm:gap-3 ${className}`} aria-live="off">
      <Unit value={t.days} label="DAYS" zh="天" />
      <Sep />
      <Unit value={t.hours} label="HOURS" zh="時" />
      <Sep />
      <Unit value={t.minutes} label="MINS" zh="分" />
      <Sep />
      <Unit value={t.seconds} label="SECS" zh="秒" />
    </div>
  );
}
