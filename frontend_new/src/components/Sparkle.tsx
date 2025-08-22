// src/components/Sparkle.tsx
import React from 'react';
import clsx from 'clsx';
import './styles/sparkle.css'; // Ensure you have the sparkle-anim class defined here

/**
 * Sparkle component
 * - Decorative animated star SVG with radial gradient fill
 * - Can be used as a standalone ornament or in groups
 *
 * Props:
 * - size: pixel size for width/height (default 28)
 * - className: additional Tailwind classes for positioning
 * - rotate: degrees to rotate the sparkle (default 0)
 * - opacity: opacity value (default 0.9)
 * - delay: animation delay for staggering (default "0s")
 * - variant: preset color variant ('peach', 'orange', 'pink')
 * - customStops: override gradient stops if needed
 * - decorative: aria-hidden for purely decorative use (default true)
 */

type SparkleProps = {
  // px size for width/height
  size?: number;              // default 28
  // Tailwind or custom classNames for positioning (e.g., "absolute top-1/4 left-1/4")
  className?: string;
  // Degrees for rotation
  rotate?: number;            // default 0
  // Opacity 0–1
  opacity?: number;           // default 0.9
  // Animation delay for staggering (e.g., "0.6s")
  delay?: string;             // default "0s"
  // Choose one of the preset fills or pass customStops
  variant?: 'peach' | 'orange' | 'pink';
  // Override gradient stops if needed
  customStops?: string;       // e.g., "from #FFD7B0 at 0%, ... (full css stops)"
  // Decorative by default
  decorative?: boolean;
  style?: React.CSSProperties;
};

const Sparkle: React.FC<SparkleProps> = ({
  size = 28,
  className,
  rotate = 0,
  opacity = 0.9,
  delay = '0s',
  variant = 'peach',
  customStops,
  decorative = true,
  style,
}) => {
  const gradientId = React.useId();

  const stopsByVariant: Record<string, JSX.Element[]> = {
    peach: [
      <stop key="0" offset="0%" stopColor="#FFD7B0" />,
      <stop key="1" offset="65%" stopColor="#FFB07A" />,
      <stop key="2" offset="100%" stopColor="#FFA564" />,
    ],
    orange: [
      <stop key="0" offset="0%" stopColor="#FFC58F" />,
      <stop key="1" offset="70%" stopColor="#FF8A3D" />,
      <stop key="2" offset="100%" stopColor="#FF7A2E" />,
    ],
    pink: [
      <stop key="0" offset="0%" stopColor="#FFD2C6" />,
      <stop key="1" offset="70%" stopColor="#FF9E8F" />,
      <stop key="2" offset="100%" stopColor="#FF7E7E" />,
    ],
  };

  return (
    <span
      className={clsx('inline-block select-none will-change-transform', className, 'sparkle-anim')}
      style={{
        width: size,
        height: size,
        transform: `rotate(${rotate}deg)`,
        opacity,
        animationDelay: delay,
        ...style,
      }}
      aria-hidden={decorative}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        role={decorative ? undefined : 'img'}
      >
        <defs>
          <radialGradient id={gradientId} cx="50%" cy="40%" r="65%">
            {customStops
              ? null
              : (stopsByVariant[variant] ?? stopsByVariant.peach)}
          </radialGradient>
          {/* Soft outer glow */}
          <filter id={`${gradientId}-blur`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Simple 4-point sparkle (diamond + small arms) */}
        <g filter={`url(#${gradientId}-blur)`} fill={`url(#${gradientId})`}>
          <path d="M16 0 L19.5 12.5 L32 16 L19.5 19.5 L16 32 L12.5 19.5 L0 16 L12.5 12.5 Z" />
        </g>
      </svg>
    </span>
  );
};

export default Sparkle;
