import React from 'react';
import { Easing, Img, interpolate, staticFile } from 'remotion';
import { CARDS } from './cardsData';

export const W = 1280;
export const H = 720;
export const HALF = 640;

export const EZ = Easing.bezier(0.45, 0, 0.2, 1);

export function cam(
  f: number,
  f0: number,
  f1: number,
  from: number,
  to: number,
): number {
  if (f1 <= f0) {
    return f < f0 ? from : to;
  }
  return interpolate(f, [f0, f1], [from, to], {
    easing: EZ,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export function fadeIn(f: number, f0: number, n = 12): number {
  if (n <= 0) {
    return f < f0 ? 0 : 1;
  }
  return interpolate(f, [f0, f0 + n], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

export interface HalfProps {
  side: 0 | 1;
  dim?: number;
  children?: React.ReactNode;
}

export const Half: React.FC<HalfProps> = ({ side, dim = 0, children }) => {
  const clampedDim = Math.max(0, Math.min(1, dim));
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: side * HALF,
        width: HALF,
        height: H,
        overflow: 'hidden',
        isolation: 'isolate',
      }}
    >
      {children}
      {clampedDim > 0 ? (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: HALF,
            height: H,
            backgroundColor: '#000000',
            opacity: clampedDim,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
};

export interface CamProps {
  scale: number;
  tx?: number;
  ty?: number;
  children?: React.ReactNode;
}

export const Cam: React.FC<CamProps> = ({
  scale,
  tx = 0,
  ty = 0,
  children,
}) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: HALF,
        height: H,
        transformOrigin: '320px 360px',
        transform: `translate(${tx}px, ${ty}px) scale(${scale})`,
      }}
    >
      {children}
    </div>
  );
};

export interface SpriteProps {
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  flip?: boolean;
  opacity?: number;
  z?: number;
}

export const Sprite: React.FC<SpriteProps> = ({
  name,
  x,
  y,
  w,
  h,
  flip = false,
  opacity = 1,
  z,
}) => {
  return (
    <Img
      src={staticFile(`sprites/${name}.png`)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        imageRendering: 'pixelated',
        transform: flip ? 'scaleX(-1)' : undefined,
        opacity,
        zIndex: z,
      }}
    />
  );
};

export interface CardImgProps {
  name: string;
  x: number;
  y: number;
  scale?: number;
  opacity?: number;
  z?: number;
}

export const CardImg: React.FC<CardImgProps> = ({
  name,
  x,
  y,
  scale = 1,
  opacity = 1,
  z,
}) => {
  const dims = CARDS[name];
  const width = dims ? dims[0] * scale : undefined;
  const height = dims ? dims[1] * scale : undefined;
  return (
    <Img
      src={staticFile(`cards/${name}.png`)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
        opacity,
        zIndex: z,
      }}
    />
  );
};

export interface WalkerProps {
  name: string;
  side: 0 | 1;
  y: number;
  seed: number;
  speed?: number;
  scale?: number;
  f: number;
}

export const Walker: React.FC<WalkerProps> = ({
  name,
  side,
  y,
  seed,
  speed = 0.6,
  scale = 1,
  f,
}) => {
  void side;
  const w = 48 * scale;
  const h = 84 * scale;
  const minX = 20;
  const maxX = HALF - 20 - w;
  const span = Math.max(1, maxX - minX);
  const period = 2 * span;

  const raw = f * speed + seed * 137;
  const phase = ((raw % period) + period) % period;
  const goingRight = phase <= span;
  const x = goingRight ? minX + phase : minX + (period - phase);
  const flip = speed >= 0 ? !goingRight : goingRight;

  const frameIdx = ((Math.floor(f / 8) % 4) + 4) % 4;

  return (
    <Sprite
      name={`${name}_${frameIdx}`}
      x={x}
      y={y}
      w={w}
      h={h}
      flip={flip}
    />
  );
};

export interface PortraitProps {
  name: string;
  x: number;
  y: number;
  w?: number;
  h?: number;
  flip?: boolean;
  opacity?: number;
}

export const Portrait: React.FC<PortraitProps> = ({
  name,
  x,
  y,
  w,
  h,
  flip = false,
  opacity = 1,
}) => {
  let width = 210;
  let height = 262;
  if (w !== undefined && h !== undefined) {
    width = w;
    height = h;
  } else if (w !== undefined) {
    width = w;
    height = (w * 120) / 96;
  } else if (h !== undefined) {
    width = (h * 96) / 120;
    height = h;
  }

  return (
    <Sprite
      name={name}
      x={x}
      y={y}
      w={width}
      h={height}
      flip={flip}
      opacity={opacity}
    />
  );
};

export const Divider: React.FC = () => {
  return (
    <div
      style={{
        position: 'absolute',
        left: HALF - 1,
        top: 0,
        width: 2,
        height: H,
        backgroundColor: '#000000',
        zIndex: 9999,
      }}
    />
  );
};

export interface HudProps {
  tahun: number | null;
}

export const Hud: React.FC<HudProps> = ({ tahun }) => {
  const tahunInt = tahun !== null ? Math.floor(tahun) : null;
  const tahunKey =
    tahunInt !== null && tahunInt >= 1 && tahunInt <= 20
      ? `tahun_${String(tahunInt).padStart(2, '0')}`
      : null;

  return (
    <>
      <CardImg name="label_sukatenang" x={16} y={14} z={5000} />
      <CardImg name="label_sukaramai" x={656} y={14} z={5000} />
      {tahunKey !== null ? (
        <>
          <CardImg name={tahunKey} x={235} y={14} z={5001} />
          <CardImg name={tahunKey} x={875} y={14} z={5001} />
        </>
      ) : null}
    </>
  );
};
