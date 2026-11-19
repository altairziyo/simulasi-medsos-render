import React from 'react';
import {interpolate, useCurrentFrame} from 'remotion';
import {PopIn} from '../lib/paper/kit';
import {PixelChip} from './PixelUI';

/**
 * Penanda nama tokoh (aturan Bos): muncul tepat saat nama tokoh terucap di
 * narasi — cincin sorot berdenyut di kaki + chip nama di atas kepala.
 * Koordinat absolut layar (1280x720). `at` = frame lokal adegan.
 */
export const NameMark: React.FC<{
  at: number;
  feetX: number;
  feetY: number;
  labelX?: number;
  labelY: number;
  text: string;
  color: string;
  holdFrames?: number;
}> = ({at, feetX, feetY, labelX, labelY, text, color, holdFrames = 90}) => {
  const f = useCurrentFrame();
  if (f < at || f > at + holdFrames) return null;
  const fade = interpolate(f, [at + holdFrames - 12, at + holdFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 1 + 0.13 * Math.sin(f / 4);
  const lx = labelX ?? feetX;
  return (
    <div style={{opacity: fade, pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: feetX - 32,
          top: feetY - 8,
          width: 64,
          height: 16,
          borderRadius: '50%',
          border: `3px solid ${color}`,
          transform: `scale(${pulse.toFixed(3)})`,
        }}
      />
      <PopIn at={at} seed={`nm-${text}-${feetX}`} origin={`${lx}px ${labelY}px`}>
        <PixelChip
          text={text}
          x={lx}
          y={labelY}
          centerX
          fontSize={10}
          borderColor={color}
          color={color}
        />
      </PopIn>
    </div>
  );
};
