import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {RadioWaves} from '../lib/paper/kit';
import {Walker, evalWalker, type WalkerSpec} from './Walker';

const HALF_W = 640;
const HALF_H = 720;

// ===== Jangkar ambience: WAJIB selaras dengan tools/make_plate.py =====
// Cerobong rumah (108,48) & (24,140) pada plate desa modern.
const CHIMNEYS = [
  {x: 448, y: 150},
  {x: 112, y: 512},
];
// Tali jemuran plate: px y=521, x 54..98 (kain berkibar di atasnya).
const LAUNDRY = {y: 522, xs: [57, 72, 85]};
const LAUNDRY_COLORS = ['#D8786E', '#F0EBDC', '#78AEC8'];
// Titik tanah pohon bergoyang pada plate (sel 37,75 / 64,110 / 24,171).
const SWAY_TREES = [
  {x: 148, y: 300},
  {x: 256, y: 440},
  {x: 96, y: 684},
];
// Kepala lampu plaza pada plate (sel 56,61 / 104,61 / 56,75 / 104,75).
const LAMPS = [
  {x: 230, y: 230},
  {x: 422, y: 230},
  {x: 230, y: 286},
  {x: 422, y: 286},
];

// ===== Elemen ambience (semua di dalam separuh masing-masing) =====

const CloudShadow: React.FC<{frame: number; y: number; w: number; h: number; speed: number; off: number}> = ({
  frame,
  y,
  w,
  h,
  speed,
  off,
}) => {
  const x = -w - 60 + ((frame * speed + off) % (HALF_W + w + 120));
  const yy = y + Math.sin(frame / 90 + off) * 8;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: yy,
        width: w,
        height: h,
        borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(24,46,24,0.13) 0%, rgba(24,46,24,0) 70%)',
        pointerEvents: 'none',
      }}
    />
  );
};

const Smoke: React.FC<{frame: number; x: number; y: number; seed: number}> = ({frame, x, y, seed}) => (
  <>
    {[0, 1, 2].map((i) => {
      const t = ((frame + seed * 37 + i * 30) % 90) / 90;
      const size = 10 + t * 22;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x - size / 2 + Math.sin(t * 5 + seed) * 3 + t * 9,
            top: y - t * 46 - size / 2,
            width: size,
            height: size,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(238,238,238,0.75) 0%, rgba(238,238,238,0) 70%)',
            opacity: (1 - t) * 0.55,
            pointerEvents: 'none',
          }}
        />
      );
    })}
  </>
);

const Vehicle: React.FC<{
  frame: number;
  sprite: string;
  w: number;
  h: number;
  top: number;
  speed: number;
  off: number;
  flip?: boolean;
  bob?: boolean;
}> = ({frame, sprite, w, h, top, speed, off, flip, bob}) => {
  const x = -120 + ((frame * speed + off) % 790);
  const y = top + (bob ? Math.sin(frame / 3 + off) * 0.8 : 0);
  return (
    <Img
      src={staticFile(`sprites/${sprite}`)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: flip ? 'scaleX(-1)' : undefined,
        imageRendering: 'pixelated',
      }}
    />
  );
};

const Bird: React.FC<{frame: number; seed: number; cycle: number; yBase: number; off: number}> = ({
  frame,
  seed,
  cycle,
  yBase,
  off,
}) => {
  const t = (frame + off) % cycle;
  if (t > 250) {
    return null;
  }
  const p = t / 250;
  return (
    <Img
      src={staticFile('sprites/bird.png')}
      style={{
        position: 'absolute',
        left: -30 + p * 710,
        top: yBase + Math.sin(t / 16 + seed) * 5,
        width: 20,
        height: 10,
        opacity: Math.min(1, p * 8, (1 - p) * 8),
        imageRendering: 'pixelated',
      }}
    />
  );
};

const Ball: React.FC<{frame: number}> = ({frame}) => {
  const p = (frame % 96) / 96;
  const tri = p < 0.5 ? p * 2 : 2 - p * 2;
  return (
    <div
      style={{
        position: 'absolute',
        left: 430 + tri * 100,
        top: 520 + tri * 12 - Math.abs(Math.sin(frame / 5.5)) * 7,
        width: 11,
        height: 11,
        borderRadius: '50%',
        background: '#F5F5F0',
        border: '1.5px solid #5A5A5A',
        pointerEvents: 'none',
      }}
    />
  );
};

const Ambience: React.FC<{frame: number; seed: number}> = ({frame, seed}) => (
  <>
    <CloudShadow frame={frame} y={110} w={320} h={150} speed={0.55} off={seed * 260} />
    <CloudShadow frame={frame} y={430} w={240} h={110} speed={0.38} off={seed * 410 + 180} />
    {CHIMNEYS.map((c, i) => (
      <Smoke key={i} frame={frame} x={c.x} y={c.y} seed={seed * 3 + i * 1.7} />
    ))}
    {LAUNDRY.xs.map((lx, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: lx,
          top: LAUNDRY.y,
          width: 12,
          height: 17,
          background: LAUNDRY_COLORS[i],
          border: '1px solid rgba(0,0,0,0.18)',
          transformOrigin: '50% 0%',
          transform: `rotate(${Math.sin(frame / 20 + i * 1.7 + seed) * 5}deg)`,
          pointerEvents: 'none',
        }}
      />
    ))}
    {SWAY_TREES.map((g, i) => (
      <Img
        key={i}
        src={staticFile('sprites/tree_sway.png')}
        style={{
          position: 'absolute',
          left: g.x - 26,
          top: g.y - 56,
          width: 52,
          height: 60,
          transformOrigin: '50% 100%',
          transform: `rotate(${Math.sin(frame / 46 + i * 2.1 + seed) * 1.7}deg)`,
          imageRendering: 'pixelated',
        }}
      />
    ))}
    {LAMPS.map((l, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: l.x - 13,
          top: l.y - 13,
          width: 26,
          height: 26,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,230,160,0.5) 0%, rgba(255,230,160,0) 70%)',
          opacity: 0.1 + 0.05 * Math.sin(frame / 38 + i * 1.9 + seed),
          pointerEvents: 'none',
        }}
      />
    ))}
    <Ball frame={frame} />
    <Vehicle frame={frame} sprite="veh_motor.png" w={60} h={38} top={315} speed={2.7} off={seed * 131} bob />
    <Vehicle frame={frame} sprite="veh_angkot.png" w={100} h={46} top={308} speed={1.8} off={seed * 257 + 300} flip />
    <Vehicle frame={frame} sprite="veh_pickup.png" w={96} h={44} top={312} speed={2.0} off={seed * 389 + 520} />
    <Bird frame={frame} seed={seed} cycle={900} yBase={84} off={seed * 300} />
    <Bird frame={frame} seed={seed + 2} cycle={1140} yBase={128} off={seed * 300 + 430} />
  </>
);

// ===== Walker ambience bawaan (rute jalan desa modern; per separuh) =====
const ambientWalkers = (side: 'L' | 'R'): WalkerSpec[] => {
  const hp = side === 'R';
  return [
    {
      id: 'amb_pedagang',
      sprite: hp ? 'warga_hp_a' : 'warga_c',
      path: [
        [60, 458],
        [300, 458],
        [300, 340],
        [560, 340],
      ],
      speed: 40,
      phase: 0.12,
    },
    {
      id: 'amb_sekolah',
      sprite: hp ? 'anak_a' : 'anak_b',
      path: [
        [186, 250],
        [186, 334],
        [454, 334],
        [454, 458],
        [420, 458],
      ],
      speed: 46,
      phase: 0.35,
    },
    {
      id: 'amb_bola1',
      sprite: hp ? 'anak_b' : 'anak_a',
      path: [
        [424, 514],
        [492, 514],
      ],
      speed: 30,
      phase: 0.05,
    },
    {
      id: 'amb_bola2',
      sprite: hp ? 'anak_a' : 'anak_b',
      path: [
        [498, 542],
        [562, 542],
      ],
      speed: 30,
      phase: 0.55,
    },
    {
      id: 'amb_selatan',
      sprite: hp ? 'warga_hp_b' : 'warga_d',
      path: [
        [140, 524],
        [320, 524],
        [320, 600],
        [560, 600],
      ],
      speed: 38,
      phase: 0.6,
    },
    {
      id: 'amb_remaja',
      sprite: hp ? 'remaja_b' : 'remaja_a',
      path: [
        [524, 380],
        [524, 458],
        [470, 458],
      ],
      speed: 44,
      phase: 0.8,
    },
  ];
};

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
  seed: number;
}> = ({leftOffset, plate, tx, ty, sc, frame, walkers, halfDim, tint, waves, seed}) => {
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
        <Ambience frame={frame} seed={seed} />
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
        walkers={[...ambientWalkers('L'), ...leftWalkers]}
        halfDim={leftDim}
        tint={tintL}
        waves={waves}
        seed={0}
      />
      <HalfVillage
        leftOffset={HALF_W}
        plate={plate}
        tx={tx}
        ty={ty}
        sc={sc}
        frame={f}
        walkers={[...ambientWalkers('R'), ...rightWalkers]}
        halfDim={rightDim}
        tint={tintR}
        waves={waves}
        seed={1}
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
