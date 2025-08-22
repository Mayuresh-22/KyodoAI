// src/components/HeroOrb.tsx
import React from 'react';
import clsx from 'clsx';

type HeroOrbProps = {
  // Overall diameter in pixels at base (mobile). Use responsive classes to override at breakpoints.
  size?: number; // default 1200
  // Additional Tailwind classes to control responsive sizing (e.g., "sm:w-[1000px] sm:h-[1000px]")
  className?: string;
  // Vertical push downward as a CSS length or Tailwind arbitrary value (e.g., "55%" -> translate-y-[55%])
  translateY?: string; // default "55%"
  // Overall opacity 0–100 as a Tailwind value
  opacityClass?: string; // default "opacity-80"
  // Blur strength as a Tailwind class
  blurClass?: string; // default "blur-[36px]"
  // z-index layer
  zIndexClass?: string; // default "z-0"
  // Blend mode; 'normal' or 'multiply'
  blend?: 'normal' | 'multiply';
  // aria-hidden for decorative use
  decorative?: boolean;
};

const HeroOrb: React.FC<HeroOrbProps> = ({
  size = 1200,
  className,
  translateY = '55%',
  opacityClass = 'opacity-80',
  blurClass = 'blur-[36px]',
  zIndexClass = 'z-0',
  blend = 'normal',
  decorative = true,
}) => {
  return (
    <div
      className={clsx(
        // base positioning: bottom center, no pointer events
        'pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 rounded-full',
        // dynamic utilities
        opacityClass,
        blurClass,
        zIndexClass,
        className
      )}
      style={{
        // size is inline for pixel precision; can still be overridden by className on breakpoints
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-50%, ${translateY})`,
        background: `
          radial-gradient(
            55% 55% at 50% 50%,
            #ffd4a8 0%,
            #ffa25f 30%,
            #ff7e5f 55%,
            #ff6a5f 72%,
            rgba(255, 106, 95, 0) 85%
          )
        `,
        mixBlendMode: blend,
        overflow: 'hidden',
      }}
      aria-hidden={decorative}
    />
  );
};

export default HeroOrb;
