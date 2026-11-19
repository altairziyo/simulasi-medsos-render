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
import { DesaMap, KelasScene, TerasScene } from './scenes';

export interface Blok04Props {
  f: number;
}

const POP_EASE = Easing.bezier(0.22, 1.25, 0.36, 1);

function popScale(f: number, f0: number, duration = 14): number {
  return interpolate(f, [f0, f0 + duration], [0.8, 1], {
    easing: POP_EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function modPos(v: number, m: number): number {
  return ((v % m) + m) % m;
}

const PopCard: React.FC<{
  name: string;
  x: number;
  y: number;
  f: number;
  f0: number;
  z?: number;
}> = ({ name, x, y, f, f0, z = 60 }) => {
  const dims = CARDS[name];
  if (!dims) {
    return null;
  }
  const op = fadeIn(f, f0, 14);
  if (op <= 0.005) {
    return null;
  }
  const s = popScale(f, f0, 16);
  const w = dims[0] * s;
  const h = dims[1] * s;
  const cx = x + dims[0] / 2;
  const cy = y + dims[1] / 2;
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

interface StudentSlot {
  x: number;
  y: number;
  size: number;
  variant: 'a' | 'b';
  hasBubble?: boolean;
  hasZzz?: boolean;
  delay: number;
}

const STUDENT_SLOTS: ReadonlyArray<StudentSlot> = [
  // Row 1 (behind front desks)
  { x: 82, y: 392, size: 106, variant: 'a', hasBubble: true, hasZzz: true, delay: 0 },
  { x: 260, y: 392, size: 106, variant: 'b', hasZzz: true, delay: 42 },
  { x: 438, y: 392, size: 106, variant: 'a', hasBubble: true, delay: 84 },
  // Row 2 (foreground desks)
  { x: 86, y: 492, size: 114, variant: 'b', hasZzz: true, delay: 24 },
  { x: 264, y: 492, size: 114, variant: 'a', hasBubble: true, hasZzz: true, delay: 66 },
  { x: 442, y: 492, size: 114, variant: 'b', delay: 108 },
];

const KelasContent: React.FC<{ f: number; side: 0 | 1; startF: number }> = ({
  f,
  side,
  startF,
}) => {
  const isLeft = side === 0;
  return (
    <>
      <KelasScene f={f} side={side} />

      {/* Bu Ratna di depan papan tulis */}
      <Portrait
        name={
          isLeft
            ? 'ratna_muda_portrait_happy'
            : 'ratna_muda_portrait_neutral'
        }
        x={236}
        y={142}
        w={168}
        h={210}
      />

      {/* Barisan murid duduk (skala ~106-114px) */}
      {STUDENT_SLOTS.map((slot, idx) => {
        const spriteName = isLeft
          ? slot.variant === 'a'
            ? 'murid_aktif_a'
            : 'murid_aktif_b'
          : slot.variant === 'a'
            ? 'murid_lesu_a'
            : 'murid_lesu_b';

        const activeBob = isLeft
          ? Math.sin(f * 0.11 + idx * 1.4) * 2.5
          : Math.sin(f * 0.03 + idx) * 0.8;

        const zzzPhase = modPos((f - startF) * 0.012 + idx * 0.27, 1);
        const zzzRise = interpolate(zzzPhase, [0, 1], [0, -24]);
        const zzzOp =
          interpolate(zzzPhase, [0, 0.22, 0.78, 1], [0, 0.52, 0.48, 0]) *
          fadeIn(f, startF + 20, 20);

        const bubbleOp = fadeIn(f, startF + 30 + slot.delay, 16);
        const bubbleBob = Math.sin(f * 0.09 + idx * 1.7) * 2.5;

        return (
          <React.Fragment key={`st-${side}-${idx}`}>
            <Sprite
              name={spriteName}
              x={slot.x}
              y={slot.y + activeBob}
              w={slot.size}
              h={slot.size}
              z={idx < 3 ? 12 : 16}
            />
            {isLeft && slot.hasBubble && bubbleOp > 0.005 ? (
              <Sprite
                name="prop_gelembung"
                x={slot.x + slot.size - 24}
                y={slot.y - 24 + bubbleBob}
                w={46}
                h={35}
                opacity={bubbleOp * 0.92}
                z={18}
              />
            ) : null}
            {!isLeft && slot.hasZzz && zzzOp > 0.005 ? (
              <Sprite
                name="icon_zzz"
                x={slot.x + slot.size - 34}
                y={slot.y - 14 + zzzRise}
                w={32}
                h={32}
                opacity={zzzOp}
                z={18}
              />
            ) : null}
          </React.Fragment>
        );
      })}
    </>
  );
};

export const Blok04: React.FC<Blok04Props> = ({ f }) => {
  // Beat ranges (local): B14 0..425, B15 425..900, B16 900..1008, B17 1008..1285

  // --- B14: Danu terkenal (kanan fokus sawah + turis; kiri lapangan ramai anak-anak) ---
  if (f < 425) {
    const leftScale = cam(f, 0, 425, 1.0, 1.05);
    const rightScale = cam(f, 0, 425, 1.0, 1.12);
    const rightTy = cam(f, 0, 425, 0, -28);

    const ballT = modPos(f * 0.026, 1);
    const ballX = interpolate(ballT, [0, 0.5, 1], [278, 382, 278]);
    const ballArc = Math.sin(ballT * Math.PI * 2);
    const ballY = 442 - Math.abs(ballArc) * 26;

    const danuOp = fadeIn(f, 8, 16);
    const camPulse = 1 + 0.06 * Math.sin(f * 0.14);

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale}>
            <DesaMap f={f} side={0} era={1} senja={0.22} />
            {/* Anak-anak bermain ramai di lapangan */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: HALF,
                height: H,
                zIndex: 21,
                pointerEvents: 'none',
              }}
            >
              <Walker
                name="anak_a_walk"
                side={0}
                y={438}
                seed={9}
                speed={0.56}
                scale={0.52}
                f={f}
              />
              <Walker
                name="anak_b_walk"
                side={0}
                y={452}
                seed={25}
                speed={-0.62}
                scale={0.52}
                f={f}
              />
              <Walker
                name="anak_a_walk"
                side={0}
                y={466}
                seed={47}
                speed={0.48}
                scale={0.5}
                f={f}
              />
              <Walker
                name="anak_b_walk"
                side={0}
                y={476}
                seed={63}
                speed={-0.5}
                scale={0.5}
                f={f}
              />
            </div>
            <Sprite
              name="prop_bola_voli"
              x={ballX}
              y={ballY}
              w={18}
              h={18}
              z={22}
            />
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={rightScale} ty={rightTy}>
            <DesaMap f={f} side={1} era={1} />
            {/* Rombongan turis akhir pekan di sawah */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: HALF,
                height: H,
                zIndex: 21,
                pointerEvents: 'none',
              }}
            >
              <Walker
                name="turis_walk"
                side={1}
                y={526}
                seed={11}
                speed={0.54}
                scale={0.62}
                f={f}
              />
              <Walker
                name="turis_walk"
                side={1}
                y={548}
                seed={33}
                speed={-0.46}
                scale={0.65}
                f={f}
              />
              <Walker
                name="turis_walk"
                side={1}
                y={566}
                seed={57}
                speed={0.44}
                scale={0.68}
                f={f}
              />
              <Walker
                name="warga_hp_a_walk"
                side={1}
                y={512}
                seed={79}
                speed={-0.5}
                scale={0.56}
                f={f}
              />
            </div>
            {/* Pak Danu berpose di tengah sawah */}
            <Portrait
              name="danu_muda_portrait_happy"
              x={210}
              y={236}
              w={220}
              h={275}
              opacity={danuOp}
            />
            <Sprite
              name="prop_ponsel_feed"
              x={404}
              y={390}
              w={42}
              h={66}
              opacity={danuOp}
              z={30}
            />
            <Sprite
              name="icon_kamera"
              x={142}
              y={368 + Math.sin(f * 0.1) * 3}
              w={38 * camPulse}
              h={30 * camPulse}
              opacity={danuOp * 0.95}
              z={31}
            />
            <Sprite
              name="icon_kamera"
              x={468}
              y={352 + Math.cos(f * 0.11) * 3}
              w={38 * camPulse}
              h={30 * camPulse}
              opacity={danuOp * 0.95}
              z={31}
            />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B15: Ratna & kelas (dua sisi KelasScene kontras aktif vs lesu) ---
  if (f < 900) {
    const pushScale = cam(f, 425, 900, 1.0, 1.07);
    return (
      <>
        <Half side={0}>
          <Cam scale={pushScale}>
            <KelasContent f={f} side={0} startF={425} />
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={pushScale}>
            <KelasContent f={f} side={1} startF={425} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B16: Nadia bosan (kiri fokus TerasScene + potret sedih agak turun; kanan dim 0.35 hidup) ---
  if (f < 1008) {
    const leftScale = cam(f, 900, 1008, 1.0, 1.04);
    const rightScale = cam(f, 900, 1008, 1.0, 1.02);
    const nadiaY = cam(f, 900, 1008, 318, 330);
    const nadiaOp = fadeIn(f, 900, 12);

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale}>
            <TerasScene f={f} side={0} />
            <Portrait
              name="nadia_muda_kiri_portrait_sad"
              x={278}
              y={nadiaY}
              w={216}
              h={270}
              opacity={nadiaOp}
            />
          </Cam>
        </Half>

        <Half side={1} dim={0.35}>
          <Cam scale={rightScale}>
            <DesaMap f={f} side={1} era={1} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B17: Skor Tahun 4 (latar kelas berlanjut + skor T4 pop; kamera berhenti lembut skala tetap) ---
  const veilOp = cam(f, 1008, 1032, 0, 0.24);
  return (
    <>
      <Half side={0}>
        <Cam scale={1.04}>
          <KelasContent f={f} side={0} startF={425} />
        </Cam>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            backgroundColor: '#0b1018',
            opacity: veilOp,
            zIndex: 45,
            pointerEvents: 'none',
          }}
        />
        <PopCard name="skor_t4_kiri" x={90} y={250} f={f} f0={1020} z={62} />
      </Half>

      <Half side={1}>
        <Cam scale={1.04}>
          <KelasContent f={f} side={1} startF={425} />
        </Cam>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            backgroundColor: '#0b1018',
            opacity: veilOp,
            zIndex: 45,
            pointerEvents: 'none',
          }}
        />
        <PopCard name="skor_t4_kanan" x={90} y={250} f={f} f0={1030} z={62} />
      </Half>
    </>
  );
};
