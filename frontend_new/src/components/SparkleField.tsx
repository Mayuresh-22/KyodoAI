// src/components/SparkleField.tsx
import React from 'react';
import Sparkle from './Sparkle';

type Item = {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  size?: number;
  rotate?: number;
  delay?: string;
  variant?: 'peach' | 'orange' | 'pink';
  opacity?: number;
};

type SparkleFieldProps = {
  items: Item[];
  className?: string; // wrapper classes, e.g., "pointer-events-none absolute inset-0"
};

const SparkleField: React.FC<SparkleFieldProps> = ({ items, className }) => {
  return (
    <div className={className} aria-hidden="true">
      {items.map((s, i) => (
        <Sparkle
          key={i}
          className="absolute"
          size={s.size ?? 28}
          rotate={s.rotate ?? 0}
          delay={s.delay ?? '0s'}
          variant={s.variant ?? 'peach'}
          opacity={s.opacity ?? 0.9}
          style={{
top: s.top,
left: s.left,
right: s.right,
bottom: s.bottom,
position: 'absolute', // ensure absolute when style is used
}}
          // position via style so we can mix top/left/right/bottom freely
          {...{
            // pass-through positioning via style prop on wrapper span
          } as any}
        />
      ))}
    </div>
  );
};

export default SparkleField;
