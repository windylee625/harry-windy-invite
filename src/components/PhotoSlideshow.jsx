import { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView } from 'framer-motion';

/**
 * 婚紗照幻燈片
 * - 直式／橫式照片都完整顯示（object-contain），空白處以同張照片的柔焦背景補滿
 * - 左右箭頭、滑動手勢、鍵盤方向鍵、縮圖、自動播放（進入畫面才播放，可暫停）
 */

const AUTOPLAY_MS = 5000;
const ease = [0.22, 1, 0.36, 1];

const slide = {
  enter: (dir) => ({ x: dir > 0 ? '12%' : '-12%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? '-12%' : '12%', opacity: 0 }),
};

function Chevron({ dir }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
      <path d={dir === 'left' ? 'M15 5l-7 7 7 7' : 'M9 5l7 7-7 7'} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function PhotoSlideshow({ photos }) {
  const [[index, dir], setState] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const [hovering, setHovering] = useState(false);
  const rootRef = useRef(null);
  const inView = useInView(rootRef, { amount: 0.4 });
  const count = photos.length;

  const go = useCallback(
    (step) => setState(([i]) => [(i + step + count) % count, step > 0 ? 1 : -1]),
    [count]
  );
  const goTo = (i) => setState(([cur]) => [i, i >= cur ? 1 : -1]);

  // 自動播放：在畫面中、未暫停、滑鼠未停留時才輪播
  useEffect(() => {
    if (count < 2 || paused || hovering || !inView) return;
    const id = setTimeout(() => go(1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [index, count, paused, hovering, inView, go]);

  // 預先載入下一張，切換更順暢
  useEffect(() => {
    if (count < 2) return;
    const img = new Image();
    img.src = photos[(index + 1) % count].src;
  }, [index, count, photos]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  };

  const current = photos[index];

  return (
    <div
      ref={rootRef}
      className="mx-auto max-w-5xl outline-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="婚紗照幻燈片"
    >
      {/* 舞台 */}
      <div className="relative overflow-hidden rounded-[22px] border-[6px] border-beige bg-earth shadow-soft">
        <div className="relative aspect-[4/5] w-full sm:aspect-[3/2]">
          <AnimatePresence initial={false} custom={dir}>
            <motion.div
              key={current.src}
              custom={dir}
              variants={slide}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.7, ease }}
              className="absolute inset-0"
              drag={count > 1 ? 'x' : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60 || info.velocity.x < -400) go(1);
                else if (info.offset.x > 60 || info.velocity.x > 400) go(-1);
              }}
            >
              {/* 柔焦背景，補滿直式／橫式的留白 */}
              <img
                src={current.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-50 blur-2xl"
              />
              <div className="absolute inset-0 bg-earth/25" />
              <img
                src={current.src}
                alt={current.alt}
                draggable={false}
                className="relative h-full w-full select-none object-contain"
              />
            </motion.div>
          </AnimatePresence>

          {/* 內框雙線 */}
          <div className="pointer-events-none absolute inset-2 rounded-2xl border border-beige/35" />

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="上一張"
                className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-earth shadow-soft backdrop-blur transition hover:bg-cream sm:left-5 sm:h-12 sm:w-12"
              >
                <Chevron dir="left" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="下一張"
                className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-cream/85 text-earth shadow-soft backdrop-blur transition hover:bg-cream sm:right-5 sm:h-12 sm:w-12"
              >
                <Chevron dir="right" />
              </button>

              {/* 張數 + 播放控制 */}
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full bg-earth/60 px-4 py-1.5 font-serif text-[11px] tracking-[0.25em] text-beige backdrop-blur">
                <span className="tabular-nums">
                  {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
                </span>
                <span className="h-3 w-px bg-beige/40" />
                <button
                  type="button"
                  onClick={() => setPaused((p) => !p)}
                  aria-label={paused ? '繼續播放' : '暫停播放'}
                  className="flex h-4 w-4 items-center justify-center"
                >
                  {paused ? (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M7 4.5v15l12-7.5z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden="true">
                      <path d="M7 4h3.5v16H7zM13.5 4H17v16h-3.5z" />
                    </svg>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 縮圖列 */}
      {count > 1 && (
        <div className="mt-5 flex justify-center">
          <div className="flex max-w-full gap-2.5 overflow-x-auto px-1 pb-2 [scrollbar-width:none] sm:gap-3">
            {photos.map((p, i) => (
              <button
                key={p.src}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`第 ${i + 1} 張`}
                aria-current={i === index}
                className={`relative h-14 w-14 shrink-0 overflow-hidden rounded-lg transition sm:h-16 sm:w-16 ${
                  i === index ? 'ring-2 ring-earth ring-offset-2 ring-offset-cream' : 'opacity-55 hover:opacity-90'
                }`}
              >
                <img
                  src={p.thumb || p.src}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    // 沒有縮圖時退回原圖
                    if (p.thumb && !e.currentTarget.src.endsWith(p.src)) e.currentTarget.src = p.src;
                  }}
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
