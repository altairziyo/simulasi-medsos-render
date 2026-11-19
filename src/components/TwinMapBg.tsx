import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {RadioWaves} from '../lib/paper/kit';
import {Walker, evalWalker, type WalkerSpec} from './Walker';

const HALF_W = 640;
const HALF_H = 720;

const SPARKLE_INDICES = [0, 1, 2, 3, 4, 5];

const LocalRiverSparkles: React.FC<{frame: number}> = ({frame}) => (
  <div style={{position: 'absolute', inset: 0, pointerEvents: 'none'}}>
    {SPARKLE_INDICES.map((i) => {
      const xSeed = (i * 107 + 37) % 620;
      const x = ((frame * 1.4 + xSeed) % 620) + 10;
      const yBase = 648 + ((i * 19 + 5) % 34);
      const y = yBase + Math.sin(frame / 14 + i * 1.7) * 2;
      const pulse = 0.35 + 0.65 * Math.abs(Math.sin(frame / 9 + i * 1.4));
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: i % 2 === 0 ? 8 : 5,
            height: 3,
            background: i % 2 === 0 ? '#FFFFFF' : '#D6F0FF',
            opacity: pulse,
          }}
        />
      );
    })}
  </div>
);

const HalfVillage: React.FC<{
  leftOffset: number;
  plate: string;
  tx: number;
  ty: number;
  sc: number;
  frame: number;
  walkers: WalkerSpec[];
  halfDim: number;
  tint?: string;
  waves: boolean;
}> = ({leftOffset, plate, tx, ty, sc, frame, walkers, halfDim, tint, waves}) => {
  const sortedWalkers = walkers
    .map((w) => {
      const effSpeed = (w.speed ?? 52) / 1.6;
      return {
        spec: {...w, speed: effSpeed},
        y: evalWalker(frame, w.path, {
          speed: effSpeed,
          startFrame: w.startFrame,
          loopMode: w.loopMode,
          phase: w.phase,
          idleFacingLeft: w.idleFacingLeft,
        }).y,
      };
    })
    .sort((a, b) => a.y - b.y);

  return (
    <div
      style={{
        position: 'absolute',
        left: leftOffset,
        top: 0,
        width: HALF_W,
        height: HALF_H,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF_W,
          height: HALF_H,
          transform: `translate(${tx.toFixed(2)}px, ${ty.toFixed(2)}px) scale(${sc.toFixed(4)})`,
          transformOrigin: '50% 50%',
        }}
      >
        <Img
          src={staticFile(`sprites/${plate}`)}
          className="pixel-img"
          style={{width: HALF_W, height: HALF_H, objectFit: 'cover', imageRendering: 'pixelated'}}
        />
        {waves ? <RadioWaves x={584} y={16} color="#FFFFFF" /> : null}
        <LocalRiverSparkles frame={frame} />
        {sortedWalkers.map(({spec}) => (
          <Walker
            key={spec.id}
            sprite={spec.sprite}
            path={spec.path}
            speed={spec.speed}
            startFrame={spec.startFrame}
            loopMode={spec.loopMode}
            phase={spec.phase}
            scale={spec.scale}
            opacity={spec.opacity}
            label={spec.label}
            labelColor={spec.labelColor}
            idleFacingLeft={spec.idleFacingLeft}
          />
        ))}
      </div>
      {halfDim > 0 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: '#0A0908',
            opacity: halfDim,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      {tint ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: tint,
            opacity: 0.28,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </div>
  );
};

export const TwinMapBg: React.FC<{
  plate?: string;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: [number, number];
  panY?: [number, number];
  dim?: number;
  dur?: number;
  leftWalkers?: WalkerSpec[];
  rightWalkers?: WalkerSpec[];
  leftDim?: number;
  rightDim?: number;
  tintL?: string;
  tintR?: string;
  waves?: boolean;
}> = ({
  plate = 'plate_desa_y0.png',
  zoomFrom = 1,
  zoomTo = 1.05,
  panX = [0, 0],
  panY = [0, 0],
  dim = 0.12,
  dur = 300,
  leftWalkers = [],
  rightWalkers = [],
  leftDim = 0,
  rightDim = 0,
  tintL,
  tintR,
  waves = true,
}) => {
  const f = useCurrentFrame();
  const p =
    dur <= 0
      ? 0
      : interpolate(f, [0, dur], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
  const baseSc = zoomFrom + (zoomTo - zoomFrom) * p;
  const sc = baseSc * (1 + 0.1 * p);
  const tx = panX[0] + (panX[1] - panX[0]) * p + 26 * p;
  const ty = panY[0] + (panY[1] - panY[0]) * p - 14 * p;

  return (
    <AbsoluteFill style={{overflow: 'hidden', backgroundColor: '#1B2A18'}}>
      <HalfVillage
        leftOffset={0}
        plate={plate}
        tx={tx}
        ty={ty}
        sc={sc}
        frame={f}
        walkers={leftWalkers}
        halfDim={leftDim}
        tint={tintL}
        waves={waves}
      />
      <HalfVillage
        leftOffset={HALF_W}
        plate={plate}
        tx={tx}
        ty={ty}
        sc={sc}
        frame={f}
        walkers={rightWalkers}
        halfDim={rightDim}
        tint={tintR}
        waves={waves}
      />
      {dim > 0 ? (
        <AbsoluteFill style={{backgroundColor: '#0A0908', opacity: dim, pointerEvents: 'none'}} />
      ) : null}
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 58%, rgba(0,0,0,0.48) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

export const SplitLine: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      left: 639,
      top: 0,
      width: 2,
      height: 720,
      backgroundColor: '#000',
      zIndex: 45,
      pointerEvents: 'none',
    }}
  />
);
