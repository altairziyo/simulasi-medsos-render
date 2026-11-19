import React from 'react';
import { Easing, interpolate } from 'remotion';
import { CARDS } from './cardsData';
import {
  Cam,
  CardImg,
  H,
  HALF,
  Half,
  Sprite,
  cam,
  fadeIn,
} from './common';
import { DesaMap, GridScene } from './scenes';

export interface Blok15Props {
  f: number;
}

const POP_EASE = Easing.bezier(0.22, 1.25, 0.36, 1);

function popScale(f: number, f0: number, duration = 16): number {
  return interpolate(f, [f0, f0 + duration], [0.82, 1], {
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

// Siklus nyala kontinu 3 fase (tanpa stepping) untuk ikon penjelas di B55
function cyclicGlow(f: number, startF: number, phaseOffset: number): number {
  const t = Math.max(0, f - startF);
  const period = 180;
  const angle = ((t / period) * Math.PI * 2) - phaseOffset;
  const raw = 0.5 + 0.5 * Math.cos(angle);
  return 0.28 + 0.72 * Math.pow(raw, 2);
}

const IconBadge: React.FC<{
  name: string;
  x: number;
  y: number;
  accent: string;
  intensity: number;
  gate: number;
  z?: number;
}> = ({ name, x, y, accent, intensity, gate, z = 55 }) => {
  const op = gate * intensity;
  if (op <= 0.005) {
    return null;
  }
  const boxSize = 112;
  const iconSize = 76;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: boxSize,
        height: boxSize,
        borderRadius: 14,
        backgroundColor: 'rgba(14, 20, 30, 0.88)',
        border: `4px solid ${accent}`,
        boxShadow: `0 0 ${14 * intensity}px ${accent}`,
        boxSizing: 'border-box',
        opacity: op,
        zIndex: z,
        pointerEvents: 'none',
      }}
    >
      <Sprite
        name={name}
        x={(boxSize - iconSize) / 2 - 4}
        y={(boxSize - iconSize) / 2 - 4}
        w={iconSize}
        h={iconSize}
      />
    </div>
  );
};

// Lapisan latar DesaMap era 5 redup lembut (dim 0.45) + GridScene semi-transparan di atasnya
const GridOverDesa: React.FC<{
  f: number;
  side: 0 | 1;
  colOffset: number;
  fill: number;
  scale: number;
  gridOpacity: number;
}> = ({ f, side, colOffset, fill, scale, gridOpacity }) => {
  return (
    <Cam scale={scale}>
      <DesaMap f={f} side={side} era={5} />
      {/* Lapisan redup lembut 0.45 khusus latar peta */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          backgroundColor: '#000000',
          opacity: 0.45,
          zIndex: 28,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          opacity: gridOpacity,
          zIndex: 32,
        }}
      >
        <GridScene
          f={f}
          side={side}
          fill={fill}
          colOffset={colOffset}
          cols={5}
        />
      </div>
    </Cam>
  );
};

export const Blok15: React.FC<Blok15Props> = ({ f }) => {
  // Rentang lokal Blok15 (100 Kali, total 1186):
  // B53: 0..323, B54: 323..557, B55: 557..1186

  // --- B53: Ulang 100 kali (DesaMap era 5 dim 0.45; satu grid 10x10 terbelah 5+5 naik bersama) ---
  if (f < 323) {
    const zoomScale = cam(f, 0, 323, 1.08, 1.05);
    const gridOp = fadeIn(f, 0, 20) * 0.84;
    const fill = cam(f, 8, 323, 0, 0.7);

    return (
      <>
        <Half side={0}>
          <GridOverDesa
            f={f}
            side={0}
            colOffset={0}
            fill={fill}
            scale={zoomScale}
            gridOpacity={gridOp}
          />
        </Half>

        <Half side={1}>
          <GridOverDesa
            f={f}
            side={1}
            colOffset={5}
            fill={fill}
            scale={zoomScale}
            gridOpacity={gridOp}
          />
        </Half>
      </>
    );
  }

  // --- B54: Hasil 100x (grid terisi penuh ke 1 bersama lalu stabil; skor_100_kiri & skor_100_kanan pop) ---
  if (f < 557) {
    const zoomScale = cam(f, 323, 557, 1.05, 1.04);
    const fill = cam(f, 323, 362, 0.7, 1);
    const veilOp = cam(f, 342, 366, 0, 0.3);

    return (
      <>
        <Half side={0}>
          <GridOverDesa
            f={f}
            side={0}
            colOffset={0}
            fill={fill}
            scale={zoomScale}
            gridOpacity={0.84}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              backgroundColor: '#090d14',
              opacity: veilOp,
              zIndex: 48,
              pointerEvents: 'none',
            }}
          />
          <PopCard name="skor_100_kiri" x={90} y={254} f={f} f0={352} z={62} />
        </Half>

        <Half side={1}>
          <GridOverDesa
            f={f}
            side={1}
            colOffset={5}
            fill={fill}
            scale={zoomScale}
            gridOpacity={0.84}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              backgroundColor: '#090d14',
              opacity: veilOp,
              zIndex: 48,
              pointerEvents: 'none',
            }}
          />
          <PopCard name="skor_100_kanan" x={90} y={254} f={f} f0={362} z={62} />
        </Half>
      </>
    );
  }

  // --- B55: Kenapa tak telak (grid tetap; ikon penjelas menyala bergantian siklik kontinu; zoom-out halus) ---
  const zoomScale = cam(f, 557, 1186, 1.04, 1.0);
  const gate = fadeIn(f, 557, 22);

  // Fase 0: icon_bantal (kiri) & icon_petir (kanan)
  // Fase 1: icon_jabat (kiri) & icon_koin (kanan)
  // Fase 2: icon_timbangan (tengah bawah tiap sisi)
  const phaseA = cyclicGlow(f, 557, 0);
  const phaseB = cyclicGlow(f, 557, (Math.PI * 2) / 3);
  const phaseC = cyclicGlow(f, 557, (Math.PI * 4) / 3);

  return (
    <>
      <Half side={0}>
        <GridOverDesa
          f={f}
          side={0}
          colOffset={0}
          fill={1}
          scale={zoomScale}
          gridOpacity={0.84}
        />
        <IconBadge
          name="icon_bantal"
          x={124}
          y={224}
          accent="#ffd98a"
          intensity={phaseA}
          gate={gate}
          z={55}
        />
        <IconBadge
          name="icon_jabat"
          x={404}
          y={224}
          accent="#58a05a"
          intensity={phaseB}
          gate={gate}
          z={55}
        />
        <IconBadge
          name="icon_timbangan"
          x={264}
          y={484}
          accent="#d9c89a"
          intensity={phaseC}
          gate={gate}
          z={55}
        />
      </Half>

      <Half side={1}>
        <GridOverDesa
          f={f}
          side={1}
          colOffset={5}
          fill={1}
          scale={zoomScale}
          gridOpacity={0.84}
        />
        <IconBadge
          name="icon_petir"
          x={124}
          y={224}
          accent="#35c4e8"
          intensity={phaseA}
          gate={gate}
          z={55}
        />
        <IconBadge
          name="icon_koin"
          x={404}
          y={224}
          accent="#f05ab4"
          intensity={phaseB}
          gate={gate}
          z={55}
        />
        <IconBadge
          name="icon_timbangan"
          x={264}
          y={484}
          accent="#d9c89a"
          intensity={phaseC}
          gate={gate}
          z={55}
        />
      </Half>
    </>
  );
};
