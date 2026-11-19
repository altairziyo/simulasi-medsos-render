import React from 'react';
import { Easing, interpolate } from 'remotion';
import { CARDS } from './cardsData';
import {
  Cam,
  CardImg,
  H,
  HALF,
  Half,
  Portrait,
  Sprite,
  Walker,
  cam,
  fadeIn,
} from './common';
import { DesaMap } from './scenes';

export interface Blok16Props {
  f: number;
}

const POP_EASE = Easing.bezier(0.22, 1.25, 0.36, 1);

function popScale(f: number, f0: number, duration = 16): number {
  return interpolate(f, [f0, f0 + duration], [0.84, 1], {
    easing: POP_EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

const PopCard: React.FC<{
  name: string;
  x: number;
  y: number;
  f: number;
  f0: number;
  scale?: number;
  z?: number;
}> = ({ name, x, y, f, f0, scale = 1, z = 62 }) => {
  const dims = CARDS[name];
  if (!dims) {
    return null;
  }
  const op = fadeIn(f, f0, 14);
  if (op <= 0.005) {
    return null;
  }
  const s = popScale(f, f0, 16) * scale;
  const fullW = dims[0] * scale;
  const fullH = dims[1] * scale;
  const w = dims[0] * s;
  const h = dims[1] * s;
  const cx = x + fullW / 2;
  const cy = y + fullH / 2;
  return (
    <CardImg
      name={name}
      x={cx - w / 2}
      y={cy - h / 2}
      scale={s}
      opacity={op}
      z={z}
    />
  );
};

// Bingkai potret Nadia 35 skala sedang di bawah sisi (tidak menutupi seluruh peta)
const NadiaClosingPortrait: React.FC<{
  side: 0 | 1;
  opacity: number;
}> = ({ side, opacity }) => {
  if (opacity <= 0.005) {
    return null;
  }
  const isLeft = side === 0;
  const name = isLeft
    ? 'nadia_dewasa_kiri_portrait_happy'
    : 'nadia_dewasa_kanan_portrait_calm';
  const accent = isLeft ? '#ffd98a' : '#35c4e8';
  const bg = isLeft ? 'rgba(34, 48, 34, 0.88)' : 'rgba(22, 32, 52, 0.9)';
  const x = isLeft ? 28 : HALF - 28 - 156;
  const y = 424;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 156,
        height: 192,
        backgroundColor: bg,
        border: `4px solid ${accent}`,
        boxShadow: '0 6px 18px rgba(0, 0, 0, 0.35)',
        boxSizing: 'border-box',
        opacity,
        zIndex: 50,
        pointerEvents: 'none',
      }}
    >
      <Portrait name={name} x={6} y={6} w={136} h={170} />
    </div>
  );
};

// Latar DesaMap era 5 senja 0.7 + walker warga pulang
const SunsetVillage: React.FC<{ f: number; side: 0 | 1 }> = ({ f, side }) => {
  const isRight = side === 1;
  return (
    <>
      <DesaMap f={f} side={side} era={5} senja={0.7} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          zIndex: 25,
          pointerEvents: 'none',
        }}
      >
        <Walker
          name={isRight ? 'warga_hp_a_walk' : 'warga_a_walk'}
          side={side}
          y={496}
          seed={19}
          speed={0.44}
          scale={0.46}
          f={f}
        />
        <Walker
          name={isRight ? 'warga_hp_b_walk' : 'warga_b_walk'}
          side={side}
          y={510}
          seed={53}
          speed={-0.38}
          scale={0.46}
          f={f}
        />
        <Walker
          name="warga_c_walk"
          side={side}
          y={502}
          seed={87}
          speed={0.34}
          scale={0.44}
          f={f}
        />
      </div>
    </>
  );
};

export const Blok16: React.FC<Blok16Props> = ({ f }) => {
  // Rentang lokal Blok16 (Penutup, total 1107):
  // B56: 0..702, B57: 702..1107

  // Zoom-out sangat pelan simetris dua sisi sepanjang seluruh blok
  const zoomScale = cam(f, 0, 1107, 1.08, 1.0);
  const portraitOp = fadeIn(f, 16, 24);
  const pitaOp = fadeIn(f, 32, 22);

  // --- B56: Jawaban taruhan (DesaMap era 5 senja 0.7 + Portrait Nadia 35 + pita_fiktif di tiap sisi) ---
  if (f < 702) {
    return (
      <>
        <Half side={0}>
          <Cam scale={zoomScale}>
            <SunsetVillage f={f} side={0} />
          </Cam>
          <NadiaClosingPortrait side={0} opacity={portraitOp} />
          <CardImg
            name="pita_fiktif"
            x={20}
            y={626}
            opacity={pitaOp}
            z={56}
          />
        </Half>

        <Half side={1}>
          <Cam scale={zoomScale}>
            <SunsetVillage f={f} side={1} />
          </Cam>
          <NadiaClosingPortrait side={1} opacity={portraitOp} />
          <CardImg
            name="pita_fiktif"
            x={20}
            y={626}
            opacity={pitaOp}
            z={56}
          />
        </Half>
      </>
    );
  }

  // --- B57: Penutup & CTA (latar berlanjut + cta_tanya lalu cta_aksi; fade out global dilakukan di Full.tsx) ---
  const phoneOp = fadeIn(f, 734, 20);
  const phoneBob = Math.sin(f * 0.08) * 2.5;

  return (
    <>
      <Half side={0}>
        <Cam scale={zoomScale}>
          <SunsetVillage f={f} side={0} />
        </Cam>
        <NadiaClosingPortrait side={0} opacity={1} />
        <CardImg name="pita_fiktif" x={20} y={626} opacity={0.92} z={56} />

        {/* Kartu CTA tanya lalu CTA aksi di area langit senja atas */}
        <PopCard name="cta_tanya" x={40} y={118} f={f} f0={714} z={62} />
        <PopCard name="cta_aksi" x={40} y={192} f={f} f0={808} z={62} />

        {phoneOp > 0.005 ? (
          <Sprite
            name="prop_ponsel_chat"
            x={299}
            y={264 + phoneBob}
            w={42}
            h={66}
            opacity={phoneOp * 0.92}
            z={60}
          />
        ) : null}
      </Half>

      <Half side={1}>
        <Cam scale={zoomScale}>
          <SunsetVillage f={f} side={1} />
        </Cam>
        <NadiaClosingPortrait side={1} opacity={1} />
        <CardImg name="pita_fiktif" x={20} y={626} opacity={0.92} z={56} />

        <PopCard name="cta_tanya" x={40} y={118} f={f} f0={714} z={62} />
        <PopCard name="cta_aksi" x={40} y={192} f={f} f0={808} z={62} />

        {phoneOp > 0.005 ? (
          <Sprite
            name="prop_ponsel_chat"
            x={299}
            y={264 + phoneBob}
            w={42}
            h={66}
            opacity={phoneOp * 0.92}
            z={60}
          />
        ) : null}
      </Half>
    </>
  );
};
