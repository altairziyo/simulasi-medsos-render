import React from 'react';
import { Easing, interpolate } from 'remotion';
import { CARDS } from './cardsData';
import { Cam, CardImg, H, HALF, Half, Portrait, Sprite, cam, fadeIn } from './common';
import { BalaiScene, DesaMap, TerasScene } from './scenes';

export interface Blok02Props {
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

function fadeOut(f: number, f0: number, duration = 14): number {
  return interpolate(f, [f0, f0 + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

const CenteredCard: React.FC<{
  name: string;
  cx: number;
  cy: number;
  f: number;
  f0: number;
  baseScale?: number;
  fadeOutAt?: number;
  fadeOutDur?: number;
  z?: number;
}> = ({
  name,
  cx,
  cy,
  f,
  f0,
  baseScale = 1,
  fadeOutAt,
  fadeOutDur = 14,
  z = 60,
}) => {
  const dims = CARDS[name];
  if (!dims) {
    return null;
  }
  const op =
    fadeIn(f, f0, 12) *
    (fadeOutAt !== undefined ? fadeOut(f, fadeOutAt, fadeOutDur) : 1);
  if (op <= 0.005) {
    return null;
  }
  const s = baseScale * popScale(f, f0, 14);
  const w = dims[0] * s;
  const h = dims[1] * s;
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

const B05_CHIPS: ReadonlyArray<{ name: string; cy: number; f0: number }> = [
  { name: 'chip_warga', cy: 196, f0: 42 },
  { name: 'chip_sawah', cy: 268, f0: 138 },
  { name: 'chip_sungai', cy: 340, f0: 234 },
  { name: 'chip_sinyal', cy: 412, f0: 330 },
  { name: 'chip_ponsel', cy: 496, f0: 448 },
];

export const Blok02: React.FC<Blok02Props> = ({ f }) => {
  // Beat ranges (local):
  // B05 0..725, B06 725..993, B07 993..1308, B08 1308..1592, B09 1592..1960, B10 1960..2104

  // --- B05: Kunci variabel ---
  if (f < 725) {
    const scale = cam(f, 0, 725, 1.0, 1.03);
    const renderB05Side = (side: 0 | 1) => (
      <Half side={side}>
        <Cam scale={scale}>
          <DesaMap f={f} side={side} era={0} />
        </Cam>
        {/* Redup ringan latar di belakang chip agar chip kontras tajam */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            backgroundColor: '#0b131e',
            opacity: 0.34,
            zIndex: 40,
            pointerEvents: 'none',
          }}
        />
        {B05_CHIPS.map((chip) => (
          <CenteredCard
            key={`b05-${side}-${chip.name}`}
            name={chip.name}
            cx={320}
            cy={chip.cy}
            f={f}
            f0={chip.f0}
            z={60}
          />
        ))}
      </Half>
    );
    return (
      <>
        {renderB05Side(0)}
        {renderB05Side(1)}
      </>
    );
  }

  // --- B06: Wiryo (kiri fokus, kanan dim 0.35 hidup) ---
  if (f < 993) {
    const scale = cam(f, 725, 993, 1.0, 1.03);
    const wiryoOp = fadeIn(f, 725, 14);
    return (
      <>
        <Half side={0}>
          <Cam scale={scale}>
            <BalaiScene f={f} side={0} />
            <Portrait
              name="wiryo_kades_portrait_happy"
              x={196}
              y={246}
              w={248}
              h={310}
              opacity={wiryoOp}
            />
          </Cam>
          <CenteredCard
            name="balon_wiryo"
            cx={320}
            cy={152}
            f={f}
            f0={786}
            z={62}
          />
          <CenteredCard
            name="tokoh_wiryo"
            cx={320}
            cy={632}
            f={f}
            f0={738}
            z={62}
          />
        </Half>

        <Half side={1} dim={0.35}>
          <Cam scale={scale}>
            <DesaMap f={f} side={1} era={0} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B07: Danu (kanan fokus, kiri dim 0.35 hidup) ---
  if (f < 1308) {
    const scale = cam(f, 993, 1308, 1.0, 1.03);
    const danuOp = fadeIn(f, 993, 14);
    const phoneOp = fadeIn(f, 1010, 14);
    const phonePulse = 0.22 + 0.14 * Math.sin((f - 993) * 0.14);
    return (
      <>
        <Half side={0} dim={0.35}>
          <Cam scale={scale}>
            <DesaMap f={f} side={0} era={0} />
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={scale}>
            <BalaiScene f={f} side={1} />
            <Portrait
              name="danu_muda_portrait_happy"
              x={186}
              y={246}
              w={248}
              h={310}
              opacity={danuOp}
            />
            {/* Pendar layar ponsel di tangan Danu */}
            <div
              style={{
                position: 'absolute',
                left: 382,
                top: 394,
                width: 86,
                height: 112,
                borderRadius: 24,
                backgroundColor: '#35c4e8',
                opacity: phoneOp * phonePulse,
                zIndex: 28,
                pointerEvents: 'none',
              }}
            />
            <Sprite
              name="prop_ponsel_feed"
              x={398}
              y={408}
              w={54}
              h={84}
              opacity={phoneOp}
              z={30}
            />
          </Cam>
          <CenteredCard
            name="tokoh_danu"
            cx={320}
            cy={632}
            f={f}
            f0={1006}
            z={62}
          />
        </Half>
      </>
    );
  }

  // --- B08: Nadia (dua sisi TerasScene sejajar; tokoh_nadia bergantian singkat) ---
  if (f < 1592) {
    const scale = cam(f, 1308, 1592, 1.0, 1.03);
    const figOp = fadeIn(f, 1308, 14);
    return (
      <>
        <Half side={0}>
          <Cam scale={scale}>
            <TerasScene f={f} side={0} />
            <Portrait
              name="nadia_remaja_kiri_portrait_happy"
              x={92}
              y={276}
              w={216}
              h={270}
              opacity={figOp}
            />
            <Portrait
              name="wiryo_kades_portrait_neutral"
              x={332}
              y={276}
              w={216}
              h={270}
              opacity={figOp}
            />
          </Cam>
          <CenteredCard
            name="tokoh_nadia"
            cx={320}
            cy={632}
            f={f}
            f0={1320}
            fadeOutAt={1436}
            fadeOutDur={16}
            z={62}
          />
        </Half>

        <Half side={1}>
          <Cam scale={scale}>
            <TerasScene f={f} side={1} />
            <Portrait
              name="nadia_remaja_kanan_portrait_happy"
              x={92}
              y={276}
              w={216}
              h={270}
              opacity={figOp}
            />
            <Portrait
              name="wiryo_warga_portrait_neutral"
              x={332}
              y={276}
              w={216}
              h={270}
              opacity={figOp}
            />
          </Cam>
          <CenteredCard
            name="tokoh_nadia"
            cx={320}
            cy={632}
            f={f}
            f0={1456}
            fadeOutAt={1574}
            fadeOutDur={16}
            z={62}
          />
        </Half>
      </>
    );
  }

  // --- B09: Indeks (koin + hati + jabat menyatu -> kartu_indeks; kiri tambahan X kamera bukan ponsel) ---
  if (f < 1960) {
    const scale = cam(f, 1592, 1960, 1.0, 1.03);

    const koinX = cam(f, 1618, 1716, 74, 184);
    const koinY = cam(f, 1618, 1716, 168, 244);
    const hatiX = cam(f, 1618, 1716, 290, 272);
    const hatiY = cam(f, 1618, 1716, 124, 250);
    const jabatX = cam(f, 1618, 1716, 462, 352);
    const jabatY = cam(f, 1618, 1716, 168, 244);

    const koinOp = fadeIn(f, 1598, 14);
    const hatiOp = fadeIn(f, 1606, 14);
    const jabatOp = fadeIn(f, 1614, 14);

    // Penegasan kiri: ponsel aktif (tidak di-X), hanya medsos (kamera) yang di-X
    const clarifyOp = fadeIn(f, 1805, 16);
    const clarifyXOp = fadeIn(f, 1838, 12);
    const clarifyXScale = popScale(f, 1838, 14);
    const xSize = 52 * clarifyXScale;

    const renderB09Side = (side: 0 | 1) => (
      <Half side={side}>
        <Cam scale={scale}>
          <DesaMap f={f} side={side} era={0} />
        </Cam>
        {/* Latar netral redup di belakang ikon indeks */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            backgroundColor: '#0c131d',
            opacity: 0.42,
            zIndex: 40,
            pointerEvents: 'none',
          }}
        />
        <Sprite
          name="icon_koin"
          x={koinX}
          y={koinY}
          w={68}
          h={68}
          opacity={koinOp}
          z={55}
        />
        <Sprite
          name="icon_hati"
          x={hatiX}
          y={hatiY}
          w={60}
          h={56}
          opacity={hatiOp}
          z={55}
        />
        <Sprite
          name="icon_jabat"
          x={jabatX}
          y={jabatY}
          w={104}
          h={68}
          opacity={jabatOp}
          z={55}
        />
        <CenteredCard
          name="kartu_indeks"
          cx={320}
          cy={384}
          f={f}
          f0={1720}
          z={60}
        />

        {side === 0 && clarifyOp > 0.005 ? (
          <>
            {/* Ponsel bersih (tidak di-X) */}
            <div
              style={{
                position: 'absolute',
                left: 208,
                top: 468,
                width: 76,
                height: 76,
                borderRadius: 16,
                backgroundColor: '#1b3526',
                border: '3px solid #58a05a',
                opacity: clarifyOp * 0.9,
                zIndex: 54,
              }}
            />
            <Sprite
              name="prop_ponsel_chat"
              x={228}
              y={478}
              w={36}
              h={56}
              opacity={clarifyOp}
              z={56}
            />

            {/* Ikon kamera kecil tertutup icon_x */}
            <div
              style={{
                position: 'absolute',
                left: 356,
                top: 468,
                width: 76,
                height: 76,
                borderRadius: 16,
                backgroundColor: '#2c1b22',
                border: '3px solid #c94a4a',
                opacity: clarifyOp * 0.9,
                zIndex: 54,
              }}
            />
            <Sprite
              name="icon_kamera"
              x={366}
              y={484}
              w={56}
              h={44}
              opacity={clarifyOp}
              z={56}
            />
            <Sprite
              name="icon_x"
              x={394 - xSize / 2}
              y={506 - xSize / 2}
              w={xSize}
              h={xSize}
              opacity={clarifyOp * clarifyXOp}
              z={58}
            />
          </>
        ) : null}
      </Half>
    );

    return (
      <>
        {renderB09Side(0)}
        {renderB09Side(1)}
      </>
    );
  }

  // --- B10: Gas (1960..2104) — zoom-out lembut ke peta era 0 dua sisi ---
  const b10Scale = cam(f, 1960, 2104, 1.06, 1.0);
  return (
    <>
      <Half side={0}>
        <Cam scale={b10Scale}>
          <DesaMap f={f} side={0} era={0} />
        </Cam>
      </Half>
      <Half side={1}>
        <Cam scale={b10Scale}>
          <DesaMap f={f} side={1} era={0} />
        </Cam>
      </Half>
    </>
  );
};
