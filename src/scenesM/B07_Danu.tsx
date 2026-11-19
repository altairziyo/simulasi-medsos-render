import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PopIn, SlideIn} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelBubble, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 322;
const ACCENT = '#6EC6E8';

const LEFT_WALKERS: WalkerSpec[] = [
  {id: 'w1', sprite: 'warga_a', path: [[70, 330], [300, 330], [300, 215]], speed: 44, phase: 0.15},
  {id: 'w2', sprite: 'warga_b', path: [[300, 345], [520, 345], [520, 470]], speed: 48, phase: 0.42},
  {id: 'w3', sprite: 'warga_c', path: [[80, 520], [280, 520], [280, 605], [460, 605]], speed: 46, phase: 0.68},
  {id: 'w4', sprite: 'warga_d', path: [[295, 455], [455, 455], [455, 520], [305, 520]], speed: 42, phase: 0.25},
  {id: 'w5', sprite: 'remaja_a', path: [[320, 120], [320, 300], [185, 300]], speed: 40, phase: 0.55},
  {id: 'w6', sprite: 'anak_a', path: [[120, 345], [330, 345], [330, 455]], speed: 38, phase: 0.8},
];

const RIGHT_WALKERS: WalkerSpec[] = [
  {id: 'w1', sprite: 'warga_hp_a', path: [[70, 330], [300, 330], [300, 215]], speed: 44, phase: 0.15},
  {id: 'w2', sprite: 'warga_hp_b', path: [[300, 345], [520, 345], [520, 470]], speed: 48, phase: 0.42},
  {id: 'w3', sprite: 'warga_a', path: [[80, 520], [280, 520], [280, 605], [460, 605]], speed: 46, phase: 0.68},
  {id: 'w4', sprite: 'warga_b', path: [[295, 455], [455, 455], [455, 520], [305, 520]], speed: 42, phase: 0.25},
  {id: 'w5', sprite: 'remaja_b', path: [[320, 120], [320, 300], [185, 300]], speed: 40, phase: 0.55},
  {id: 'w6', sprite: 'anak_b', path: [[120, 345], [330, 345], [330, 455]], speed: 38, phase: 0.8},
];

const ANNOTATIONS = [
  {label: 'DUNIA HARUS TAHU DESA KITA', x: 30, y: 430, tx: 390, ty: 300, at: 18},
  {
    label: 'PALING RAJIN MEMAKAI MEDSOS',
    x: 30,
    y: 510,
    tx: 420,
    ty: 470,
    at: medsosLocalF('B07', 106.4),
  },
];

export const B07_Danu: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const camScale = interpolate(f, [0, DUR], [1.0, 1.09], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const blink = f % 100 >= 95;
  const spriteSrc = blink
    ? 'danu_full_neutral.png'
    : 'danu_full_happy.png';

  const portraitEntrance = spring({
    frame: f,
    fps,
    config: {damping: 16, stiffness: 150, mass: 0.7},
  });
  const portraitY = interpolate(portraitEntrance, [0, 1], [40, 0]);
  const bob = Math.sin(f / 18) * 3;

  const bubbleAt = medsosLocalF('B07', 101.6);
  const phoneAt = medsosLocalF('B07', 103.9);
  const liveAt = medsosLocalF('B07', 105.16);
  const liveOpacity = 0.55 + 0.45 * Math.sin(f / 4);

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.02}
        zoomTo={1.08}
        dim={0.12}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {/* Redup separuh kiri (non-fokus) */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 640,
          height: 720,
          backgroundColor: '#0A0908',
          opacity: 0.38,
          pointerEvents: 'none',
        }}
      />

      {/* Showcase separuh kanan */}
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 0,
          width: 640,
          height: 720,
          overflow: 'hidden',
          backgroundColor: '#1E1420',
        }}
      >
        {/* Kamera push-in: backdrop + potret + prop + garis anotasi bergerak bersama */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${camScale.toFixed(4)})`,
            transformOrigin: '420px 325px',
          }}
        >
          <Img
            src={staticFile('sprites/bg_sunset_half_v2b.png')}
            className="pixel-img"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: 640,
              height: 720,
              objectFit: 'cover',
              imageRendering: 'pixelated',
            }}
          />

          {/* Potret Pak Danu full-body */}
          <div
            style={{
              position: 'absolute',
              left: 330,
              top: 140 + portraitY + bob,
              width: 179,
              height: 370,
            }}
          >
            <PixelSprite src={spriteSrc} w={179} h={370} />
          </div>

          {/* Prop ponsel di dekat tangan potret */}
          {f >= phoneAt ? (
            <PopIn at={phoneAt} seed="danu-phone" origin="484px 480px">
              <PixelSprite src="prop_ponsel_feed.png" x={452} y={448} w={64} h={64} />
            </PopIn>
          ) : null}

        {/* Garis anotasi SVG (koordinat lokal separuh kanan) */}
        <svg
          width={640}
          height={720}
          style={{position: 'absolute', left: 0, top: 0, pointerEvents: 'none'}}
        >
          {ANNOTATIONS.map((a) => {
            const p = spring({
              frame: Math.max(0, f - a.at),
              fps,
              config: {damping: 16, stiffness: 180},
            });
            if (p < 0.05) return null;
            return (
              <g key={a.label} opacity={p}>
                <line
                  x1={a.x + 250}
                  y1={a.y + 15}
                  x2={a.tx}
                  y2={a.ty + bob}
                  stroke={ACCENT}
                  strokeWidth={3}
                />
                <rect
                  x={a.tx - 5}
                  y={a.ty + bob - 5}
                  width={10}
                  height={10}
                  fill={ACCENT}
                  stroke={PX.bgDark}
                  strokeWidth={2}
                />
              </g>
            );
          })}
          </svg>
        </div>

        {/* Chip anotasi */}
        {ANNOTATIONS.map((a) =>
          f >= a.at ? (
            <SlideIn key={a.label} at={a.at} dx={-24} dur={12}>
              <PixelChip
                text={a.label}
                x={a.x}
                y={a.y}
                borderColor={ACCENT}
                color={PX.goldHi}
                fontSize={9}
                style={{padding: '7px 10px'}}
              />
            </SlideIn>
          ) : null,
        )}

        {/* Chip LIVE berdenyut */}
        {f >= liveAt ? (
          <PixelChip
            text="● LIVE"
            x={505}
            y={120}
            borderColor={PX.red}
            color={PX.red}
            fontSize={12}
            style={{opacity: liveOpacity}}
          />
        ) : null}

        {/* Kartu nama */}
        <SlideIn at={4} dx={48} dur={14}>
          <PixelCard x={30} y={104} w={310} borderColor={ACCENT} pad="16px 20px">
            <div style={{fontSize: 22, color: ACCENT, lineHeight: 1.2}}>PAK DANU</div>
            <div style={{fontSize: 11, color: PX.goldHi, marginTop: 10}}>
              KEPALA DESA • 45 TAHUN
            </div>
          </PixelCard>
        </SlideIn>

        {/* Gelembung kutipan (koordinat lokal x=60 => global 700) */}
        <PixelBubble
          text="DUNIA HARUS TAHU DESA KITA ADA."
          x={60}
          y={520}
          maxW={430}
          tail="bottom-right"
          at={bubbleAt}
        />
      </div>
    </AbsoluteFill>
  );
};
