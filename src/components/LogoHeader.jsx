import { motion } from 'framer-motion';

/**
 * 三圓弧連體拱形雙線花框 Logo
 * 中央大橢圓 + 左右兩個小圓弧，以外框粗線 + 內框細線組成雙線質感。
 *
 * 幾何（viewBox 座標）：
 *  - 中央橢圓：中心 (450,190)，外框 rx240 / ry130，內框 rx228 / ry118
 *  - 左右圓弧：中心 (155,190) / (745,190)，外框 rx105 / ry100，內框 rx93 / ry88
 *  - 外框交接點 x = 238 / 662，y = 129 / 251；內框交接點 x = 237 / 663，y = 148 / 232
 */
const OUTER =
  'M238 129 A240 130 0 0 1 662 129 A105 100 0 1 1 662 251 A240 130 0 0 1 238 251 A105 100 0 1 1 238 129 Z';
const INNER =
  'M237 148 A228 118 0 0 1 663 148 A93 88 0 1 1 663 232 A228 118 0 0 1 237 232 A93 88 0 1 1 237 148 Z';

export default function LogoHeader({ className = '', color = '#583217', animate = true, play = true }) {
  const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    show: (delay) => ({
      pathLength: 1,
      opacity: 1,
      transition: { pathLength: { duration: 2.2, ease: 'easeInOut', delay }, opacity: { duration: 0.3, delay } },
    }),
  };
  const fade = {
    hidden: { opacity: 0, y: 8 },
    show: (delay) => ({ opacity: 1, y: 0, transition: { duration: 1, ease: 'easeOut', delay } }),
  };

  return (
    <motion.svg
      // 外框上下緣在 y=60 / y=320，左右在 x=50 / x=850，預留線寬不裁切
      viewBox="40 50 820 280"
      className={className}
      role="img"
      aria-label="HARRY WINDY · 2026 · 1107"
      initial={animate ? 'hidden' : 'show'}
      animate={play ? 'show' : 'hidden'}
    >
      <motion.path d={OUTER} fill="none" stroke={color} strokeWidth="3.2" variants={draw} custom={0} />
      <motion.path d={INNER} fill="none" stroke={color} strokeWidth="1.4" variants={draw} custom={0.35} />

      <motion.g variants={fade} custom={1.2} fill={color}>
        <text
          x="450"
          y="178"
          textAnchor="middle"
          fontFamily="Italiana, Cinzel, serif"
          fontSize="62"
          letterSpacing="6"
        >
          HARRY
        </text>
        <text
          x="450"
          y="246"
          textAnchor="middle"
          fontFamily="Italiana, Cinzel, serif"
          fontSize="62"
          letterSpacing="6"
        >
          WINDY
        </text>
      </motion.g>

      <motion.g variants={fade} custom={1.6} fill={color}>
        {[
          { cx: 155, label: '2026' },
          { cx: 745, label: '1107' },
        ].map(({ cx, label }) => (
          <g key={label}>
            <circle cx={cx - 66} cy="186" r="3.2" />
            <text
              x={cx}
              y="194"
              textAnchor="middle"
              fontFamily="Cinzel, 'Playfair Display', serif"
              fontSize="24"
              letterSpacing="5"
            >
              {label}
            </text>
            <circle cx={cx + 66} cy="186" r="3.2" />
          </g>
        ))}
      </motion.g>
    </motion.svg>
  );
}
