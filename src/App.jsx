import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion';
import LogoHeader from './components/LogoHeader.jsx';
import Countdown from './components/Countdown.jsx';
import EnvelopeIntro from './components/EnvelopeIntro.jsx';
import PhotoSlideshow from './components/PhotoSlideshow.jsx';
import {
  couple,
  date,
  venue,
  timeline,
  dressCode,
  traffic,
  photos,
  mapsNavUrl,
  mapsEmbedUrl,
  calendarUrl,
} from './data/wedding.js';

/* ------------------------------------------------------------------ */
/* 共用小元件                                                           */
/* ------------------------------------------------------------------ */

const ease = [0.22, 1, 0.36, 1];

function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </M>
  );
}

// 五瓣小花（延續實體喜帖 Dress Code 色票造型）
function Blossom({ className = '', color = 'currentColor' }) {
  const petals = [0, 72, 144, 216, 288];
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      {petals.map((deg) => (
        <circle key={deg} cx="20" cy="11.5" r="7" fill={color} transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="8" fill={color} />
    </svg>
  );
}

function Divider({ className = '' }) {
  return (
    <div className={`flex items-center justify-center gap-4 ${className}`} aria-hidden="true">
      <span className="h-px w-12 bg-current opacity-40 sm:w-20" />
      <Blossom className="h-3.5 w-3.5 opacity-70" />
      <span className="h-px w-12 bg-current opacity-40 sm:w-20" />
    </div>
  );
}

function SectionHeading({ en, zh, light = false }) {
  return (
    <Reveal className="text-center">
      <h2 className="section-title">{en}</h2>
      <p className={`mt-3 text-sm tracking-[0.6em] ${light ? 'text-beige/80' : 'text-earth/70'}`}>{zh}</p>
      <Divider className="mt-6" />
    </Reveal>
  );
}

function Icon({ name, className = 'h-5 w-5' }) {
  const common = {
    className,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.4,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    viewBox: '0 0 24 24',
    'aria-hidden': true,
  };
  switch (name) {
    case 'pin':
      return (
        <svg {...common}>
          <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
          <circle cx="12" cy="9.5" r="2.5" />
        </svg>
      );
    case 'car':
      return (
        <svg {...common}>
          <path d="M4 16v-4l2-5h12l2 5v4" />
          <path d="M3 16h18v2H3z" />
          <circle cx="7.5" cy="13.5" r="1" />
          <circle cx="16.5" cy="13.5" r="1" />
        </svg>
      );
    case 'parking':
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="3" />
          <path d="M10 16V8h3a2.5 2.5 0 0 1 0 5h-3" />
        </svg>
      );
    case 'shuttle':
      return (
        <svg {...common}>
          <rect x="5" y="3.5" width="14" height="14" rx="3" />
          <path d="M5 11h14M8 20.5l1.5-3M16 20.5l-1.5-3" />
          <circle cx="9" cy="14.5" r=".8" />
          <circle cx="15" cy="14.5" r=".8" />
        </svg>
      );
    case 'calendar':
      return (
        <svg {...common}>
          <rect x="4" y="5" width="16" height="15" rx="2" />
          <path d="M4 10h16M9 3v4M15 3v4" />
        </svg>
      );
    case 'candy':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.5" />
          <path d="M7.5 12 3.5 9v6l4-3ZM16.5 12l4-3v6l-4-3Z" />
          <path d="M10.5 9.5c1 1.2 1 3.8 0 5M13.5 9.5c-1 1.2-1 3.8 0 5" />
        </svg>
      );
    case 'copy':
      return (
        <svg {...common}>
          <rect x="8" y="8" width="12" height="12" rx="2" />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
      );
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* 1. Hero                                                             */
/* ------------------------------------------------------------------ */

function Hero({ play }) {
  const { scrollY } = useScroll();
  const logoY = useTransform(scrollY, [0, 600], [0, 80]);
  const fade = useTransform(scrollY, [0, 500], [1, 0.2]);
  // play 為 false（信封尚未開啟）時停在初始狀態
  const show = (target) => (play ? target : undefined);

  return (
    <header className="paper-grain relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-5 pb-24 pt-16 text-center">
      {/* 背景層次：柔光 + 奶茶色雙線拱窗 + 底部棕色漸層 */}
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-beige/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-80 w-80 rounded-full bg-beige/40 blur-3xl" />
      <motion.div
        className="pointer-events-none absolute inset-x-3 bottom-0 top-6 mx-auto max-w-[680px] rounded-t-[999px] bg-gradient-to-b from-beige/55 via-beige/30 to-transparent sm:inset-x-6"
        initial={{ opacity: 0, y: 40 }}
        animate={show({ opacity: 1, y: 0 })}
        transition={{ duration: 1.6, ease }}
      >
        <div className="absolute inset-3 rounded-t-[999px] border border-earth/20 sm:inset-4" />
        <div className="absolute inset-[18px] rounded-t-[999px] border border-earth/10 sm:inset-[22px]" />
      </motion.div>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-earth/10 to-transparent" />

      <motion.p
        className="eyebrow relative"
        initial={{ opacity: 0, letterSpacing: '0.2em' }}
        animate={show({ opacity: 1, letterSpacing: '0.5em' })}
        transition={{ duration: 1.6, ease }}
      >
        The Wedding Of
      </motion.p>

      <motion.div style={{ y: logoY, opacity: fade }} className="relative mt-8 w-full max-w-[540px] px-2">
        <LogoHeader className="h-auto w-full" play={play} />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={show({ opacity: 1, y: 0 })}
        transition={{ duration: 1.2, ease, delay: 1.8 }}
        className="relative mt-10"
      >
        <h1 className="font-serif text-3xl tracking-[0.18em] sm:text-5xl">
          {couple.groom.en} <span className="font-elegant italic tracking-normal opacity-70">&amp;</span>{' '}
          {couple.bride.en}
        </h1>
        <p className="mt-3 text-sm tracking-[0.5em] text-earth/75">
          {couple.groom.zh}　·　{couple.bride.zh}
        </p>
        <div className="mx-auto mt-6 flex items-center justify-center gap-4 font-serif text-sm tracking-widest2 sm:text-base">
          <span className="h-px w-8 bg-earth/40" />
          {date.display}
          <span className="opacity-60">{date.weekdayEn}</span>
          <span className="h-px w-8 bg-earth/40" />
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={show({ opacity: 1 })}
        transition={{ duration: 1.6, delay: 2.4 }}
        className="relative mt-12 font-display text-2xl tracking-[0.3em] sm:text-3xl"
      >
        WITH LOVE ALWAYS
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={show({ opacity: 1, y: 0 })}
        transition={{ duration: 1.2, ease, delay: 2.8 }}
        className="relative mt-10"
      >
        <Countdown />
      </motion.div>

      <motion.a
        href="#story"
        aria-label="向下捲動"
        className="absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-earth/60"
        initial={{ opacity: 0 }}
        animate={show({ opacity: 1 })}
        transition={{ delay: 3.4, duration: 1 }}
      >
        <span className="font-serif text-[10px] tracking-widest2">SCROLL</span>
        <motion.span
          className="block h-10 w-px origin-top bg-earth/50"
          animate={{ scaleY: [0, 1, 1], opacity: [1, 1, 0] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.a>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Our Story                                                        */
/* ------------------------------------------------------------------ */

function Story() {
  return (
    <section id="story" className="relative bg-beige px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <p className="eyebrow">Our Story · 邀請獻詞</p>
        </Reveal>

        <Reveal delay={0.1}>
          <blockquote className="mt-8 font-serif text-xl uppercase leading-relaxed tracking-[0.14em] sm:text-3xl sm:leading-relaxed">
            Perhaps the most beautiful kind of love is the one that feels natural…
          </blockquote>
        </Reveal>

        <Reveal delay={0.2}>
          <Divider className="my-10" />
        </Reveal>

        <Reveal delay={0.3}>
          <p className="text-[15px] leading-[2.2] tracking-[0.2em] sm:text-lg sm:leading-[2.3]">
            在彼此身邊，是最舒服自然的陪伴。
            <br />
            誠摯邀請最親愛的您，
            <br className="sm:hidden" />
            前來與我們一同分享這份喜悅與美好。
          </p>
        </Reveal>

        <Reveal delay={0.4}>
          <p className="mx-auto mt-10 max-w-md font-elegant text-sm italic leading-7 text-earth/75 sm:text-base">
            Together with their families, request the honor of your presence at the celebration of their marriage,
            Saturday, the Seventh of November, Two Thousand Twenty-Six.
          </p>
        </Reveal>

        <Reveal delay={0.5} className="mt-14 grid grid-cols-2 gap-4 sm:gap-8">
          {[
            { role: '新郎 · GROOM', ...couple.groom },
            { role: '新娘 · BRIDE', ...couple.bride },
          ].map((p) => (
            <div key={p.en} className="rounded-t-full border border-earth/25 bg-cream/60 px-4 pb-8 pt-12">
              <p className="text-[11px] tracking-[0.3em] text-earth/60">{p.role}</p>
              <p className="mt-4 font-serif text-2xl tracking-[0.2em] sm:text-3xl">{p.en}</p>
              <p className="mt-2 tracking-[0.4em]">{p.zh}</p>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2.5 Dress Code                                                      */
/* ------------------------------------------------------------------ */

function DressCode() {
  const [active, setActive] = useState(null);
  const current = active === null ? null : dressCode.colors[active];

  return (
    <section id="dresscode" className="paper-grain relative px-5 py-24 sm:py-32">
      <SectionHeading en="Dress Code" zh="穿搭色系" />

      <Reveal delay={0.1}>
        <p className="mx-auto mt-8 max-w-xl text-center text-[15px] leading-[2.1] tracking-[0.15em] sm:text-base">
          {dressCode.intro}
        </p>
      </Reveal>

      {/* 色票：點擊查看穿搭建議 */}
      <Reveal delay={0.2} className="mx-auto mt-12 max-w-3xl">
        <ul className="grid grid-cols-5 gap-2 sm:gap-6">
          {dressCode.colors.map((c, i) => {
            const selected = active === i;
            return (
              <li key={c.en} className="flex justify-center">
                <motion.button
                  type="button"
                  onClick={() => setActive(selected ? null : i)}
                  aria-pressed={selected}
                  aria-label={`${c.zh} ${c.en}`}
                  className="group flex flex-col items-center outline-none"
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.94 }}
                >
                  <motion.span
                    className="relative block h-14 w-14 sm:h-24 sm:w-24"
                    animate={{ rotate: selected ? 36 : 0, scale: selected ? 1.1 : 1 }}
                    transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                  >
                    <Blossom className="h-full w-full drop-shadow-[0_6px_10px_rgba(88,50,23,0.18)]" color={c.hex} />
                    {selected && (
                      <motion.span
                        layoutId="blossom-ring"
                        className="absolute -inset-1.5 rounded-full border border-earth/40 sm:-inset-2"
                      />
                    )}
                  </motion.span>
                  <span className="mt-3 text-sm tracking-[0.3em] sm:text-base">{c.zh}</span>
                  <span className="mt-1 font-serif text-[9px] tracking-[0.2em] text-earth/60 sm:text-[11px]">{c.en}</span>
                </motion.button>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <div className="mx-auto mt-8 min-h-[92px] max-w-xl">
        <AnimatePresence mode="wait">
          {current ? (
            <motion.div
              key={current.en}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35 }}
              className="flex items-center gap-4 rounded-2xl border border-earth/15 bg-cream-light p-5"
            >
              <Blossom className="h-10 w-10 shrink-0" color={current.hex} />
              <div className="text-left">
                <p className="text-sm tracking-[0.25em]">
                  {current.zh} <span className="font-serif text-[11px] text-earth/60">{current.en}</span>
                </p>
                <p className="mt-1.5 text-sm leading-7 tracking-wider text-earth/85">{current.tip}</p>
              </div>
            </motion.div>
          ) : (
            <motion.p
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="pt-6 text-center text-xs tracking-[0.3em] text-earth/55"
            >
              點選上方小花，看看穿搭建議
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <Reveal className="mx-auto mt-6 max-w-xl text-center">
        <p className="text-sm tracking-[0.15em] text-earth/80">{dressCode.note}</p>
      </Reveal>

      {/* 互動提醒 */}
      <Reveal delay={0.1} className="mx-auto mt-10 max-w-xl">
        <div className="relative overflow-hidden rounded-2xl bg-earth px-6 py-7 text-center text-beige shadow-soft sm:px-10">
          <div className="pointer-events-none absolute inset-2 rounded-xl border border-beige/20" />
          <div className="flex items-center justify-center gap-1.5">
            {dressCode.colors.map((c) => (
              <Blossom key={c.en} className="h-4 w-4" color={c.hex} />
            ))}
          </div>
          <p className="mt-4 font-serif text-xs tracking-widest2 sm:text-sm">{dressCode.activity.title}</p>
          <ul className="mt-4 space-y-2 text-sm leading-7 tracking-wider text-beige/90">
            {dressCode.activity.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Wedding Timeline                                                 */
/* ------------------------------------------------------------------ */

function Timeline() {
  return (
    <section id="timeline" className="relative overflow-hidden bg-earth px-6 py-24 text-beige sm:py-32">
      <div className="pointer-events-none absolute inset-4 border border-beige/15 sm:inset-8" />
      <div className="pointer-events-none absolute inset-[22px] border border-beige/10 sm:inset-[38px]" />

      <SectionHeading en="Wedding Timeline" zh="婚禮流程" light />

      <p className="mt-6 text-center font-serif text-xs tracking-widest2 text-beige/70">
        {date.display} · {date.weekdayZh}
      </p>

      {/* 由 ol 觸發進場，避免 scale 0 的子元素（零尺寸）無法被偵測 */}
      <motion.ol
        className="relative mx-auto mt-16 max-w-3xl"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
      >
        {/* 中線 */}
        <motion.span
          className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px origin-top bg-beige/40 md:left-1/2"
          variants={{ hidden: { scaleY: 0 }, show: { scaleY: 1, transition: { duration: 1.8, ease } } }}
        />

        {timeline.map((item, i) => {
          const right = i % 2 === 1;
          return (
            <li key={item.time} className="relative mb-14 last:mb-0 md:mb-4 md:grid md:grid-cols-2 md:gap-16">
              {/* 節點 */}
              <motion.span
                className="absolute left-0 top-2 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-beige bg-earth md:left-1/2 md:-translate-x-1/2"
                variants={{
                  hidden: { scale: 0 },
                  show: { scale: 1, transition: { duration: 0.5, delay: 0.3 + i * 0.15 } },
                }}
              >
                <span className="h-[5px] w-[5px] rounded-full bg-beige" />
              </motion.span>

              <Reveal
                delay={0.2 + i * 0.12}
                className={`pl-9 md:pl-0 ${right ? 'md:col-start-2' : 'md:col-start-1 md:text-right'}`}
              >
                <p className="font-elegant text-4xl tabular-nums tracking-wider sm:text-5xl">{item.time}</p>
                <p className="mt-3 font-serif text-xs tracking-widest2 text-beige/70 sm:text-sm">{item.en}</p>
                <p className="mt-2 text-lg tracking-[0.35em]">{item.zh}</p>
                <p
                  className={`mt-3 inline-flex items-center gap-1.5 rounded-full border border-beige/30 px-3 py-1 text-xs tracking-[0.2em] text-beige/85`}
                >
                  <Icon name="pin" className="h-3.5 w-3.5" />
                  {item.place}
                </p>
                {item.note && (
                  <div
                    className={`mt-4 flex max-w-xs items-start gap-2 rounded-xl bg-beige/95 px-4 py-3 text-left text-[13px] leading-6 tracking-wider text-earth shadow-soft ${
                      right ? '' : 'md:ml-auto'
                    }`}
                  >
                    <Icon name="candy" className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>
                      <span className="mr-1 font-serif text-[10px] tracking-[0.25em] text-earth/70">COME EARLY</span>
                      <br />
                      {item.note}
                    </span>
                  </div>
                )}
              </Reveal>
            </li>
          );
        })}
      </motion.ol>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Location & Traffic                                               */
/* ------------------------------------------------------------------ */

function Location() {
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(venue.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 部分瀏覽器不支援剪貼簿，忽略即可 */
    }
  };

  return (
    <section id="location" className="paper-grain px-5 py-24 sm:py-32">
      <SectionHeading en="Location" zh="地點與交通" />

      <div className="mx-auto mt-16 grid max-w-5xl gap-6 md:grid-cols-5 md:gap-8">
        {/* 場地資訊卡 */}
        <Reveal className="relative overflow-hidden rounded-t-[999px] bg-beige px-7 pb-10 pt-20 text-center shadow-soft md:col-span-2 md:px-8">
          <div className="pointer-events-none absolute inset-3 rounded-t-[999px] border border-earth/25" />
          <p className="eyebrow">Venue</p>
          <h3 className="mt-5 text-xl tracking-[0.25em] sm:text-2xl">{venue.nameZh}</h3>
          <p className="mt-3 font-serif text-xs leading-6 tracking-[0.2em] text-earth/75">{venue.nameEn}</p>
          <Divider className="my-6" />
          <dl className="space-y-3 text-sm tracking-[0.15em]">
            <div>
              <dt className="text-[11px] tracking-[0.3em] text-earth/60">證婚</dt>
              <dd className="mt-1">{venue.church}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.3em] text-earth/60">午宴</dt>
              <dd className="mt-1">{venue.hall}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-[0.3em] text-earth/60">地址</dt>
              <dd className="mt-1 leading-6">{venue.address}</dd>
            </div>
          </dl>

          <div className="relative mt-8 flex flex-col gap-3">
            <motion.a
              href={mapsNavUrl}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-earth px-6 py-3.5 text-sm tracking-[0.25em] text-cream shadow-soft transition-colors hover:bg-earth-light"
            >
              <Icon name="pin" className="h-4 w-4" />
              Google Maps 導航
            </motion.a>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={copyAddress}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-earth/50 px-3 py-3 text-xs tracking-[0.15em] transition-colors hover:bg-earth hover:text-cream"
              >
                <Icon name="copy" className="h-4 w-4" />
                {copied ? '已複製 ✓' : '複製地址'}
              </button>
              <a
                href={calendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-earth/50 px-3 py-3 text-xs tracking-[0.15em] transition-colors hover:bg-earth hover:text-cream"
              >
                <Icon name="calendar" className="h-4 w-4" />
                加入行事曆
              </a>
            </div>
          </div>
        </Reveal>

        {/* 地圖 */}
        <Reveal delay={0.15} className="md:col-span-3">
          <div className="h-full min-h-[320px] overflow-hidden rounded-2xl border-[6px] border-beige bg-beige shadow-soft">
            <iframe
              title="桃園大溪威斯汀酒店地圖"
              src={mapsEmbedUrl}
              className="h-full min-h-[320px] w-full grayscale-[35%] sepia-[20%]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </div>

      {/* 交通卡片 */}
      <div className="mx-auto mt-8 grid max-w-5xl gap-5 sm:grid-cols-3 md:gap-8">
        {traffic.map((t, i) => (
          <Reveal
            key={t.key}
            delay={0.1 * i}
            className="group rounded-2xl border border-earth/15 bg-cream-light p-7 transition-shadow hover:shadow-soft"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-beige text-earth transition-colors group-hover:bg-earth group-hover:text-beige">
              <Icon name={t.key} />
            </div>
            <p className="mt-5 font-serif text-[11px] tracking-widest2 text-earth/60">{t.titleEn}</p>
            <h4 className="mt-1 text-lg tracking-[0.3em]">{t.titleZh}</h4>
            <ul className="mt-4 space-y-2 text-sm leading-7 tracking-wider text-earth/85">
              {t.lines.map((l) => (
                <li key={l} className="flex gap-2">
                  <span className="mt-[11px] h-1 w-1 shrink-0 rounded-full bg-earth/50" />
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Footer                                                           */
/* ------------------------------------------------------------------ */

// 只保留實際載入成功的照片；public/photos 尚未放照片時整區隱藏，不顯示空白色塊
function useLoadedPhotos(list) {
  const [loaded, setLoaded] = useState([]);
  useEffect(() => {
    let alive = true;
    Promise.all(
      list.map(
        (p) =>
          new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(p);
            img.onerror = () => resolve(null);
            img.src = p.src;
          })
      )
    ).then((res) => alive && setLoaded(res.filter(Boolean)));
    return () => {
      alive = false;
    };
  }, [list]);
  return loaded;
}

function Gallery() {
  const loaded = useLoadedPhotos(photos);
  if (loaded.length === 0) return null;

  return (
    <div className="mb-24">
      <SectionHeading en="Moments" zh="婚紗紀錄" />
      <Reveal delay={0.1} className="mt-14">
        <PhotoSlideshow photos={loaded} />
      </Reveal>
    </div>
  );
}

function Footer() {
  return (
    <footer className="bg-cream px-5 pb-14 pt-24 sm:pt-32">
      <Gallery />

      <Reveal className="mx-auto max-w-xl text-center">
        <p className="text-[15px] leading-[2.2] tracking-[0.2em] sm:text-base">
          謝謝您一路以來的陪伴與祝福，
          <br />
          期待在這個秋日，與您相見。
        </p>
        <p className="mt-6 font-elegant italic text-earth/70">Thank you for being part of our story.</p>
      </Reveal>

      <Reveal className="mx-auto mt-16 w-64 max-w-full px-2 sm:w-80">
        <LogoHeader className="h-auto w-full" animate={false} />
      </Reveal>

      <div className="mx-auto mt-12 max-w-5xl border-t border-earth/20 pt-8 text-center">
        <p className="font-serif text-xs tracking-widest2 sm:text-sm">
          HARRY &amp; WINDY <span className="mx-2 opacity-40">|</span> {date.display}
        </p>
        <p className="mt-3 font-display text-sm tracking-[0.35em] text-earth/60">WITH LOVE ALWAYS</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */

export default function App() {
  const { scrollYProgress } = useScroll();
  const [opened, setOpened] = useState(false);
  const handleOpen = useCallback(() => setOpened(true), []);

  return (
    <>
      <AnimatePresence>{!opened && <EnvelopeIntro key="envelope" onOpen={handleOpen} />}</AnimatePresence>
      <motion.div
        className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-earth/70"
        style={{ scaleX: scrollYProgress }}
      />
      <main>
        <Hero play={opened} />
        <Story />
        <DressCode />
        <Timeline />
        <Location />
      </main>
      <Footer />
    </>
  );
}
