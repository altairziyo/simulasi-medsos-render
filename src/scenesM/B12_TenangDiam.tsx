import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PopIn, RadioWaves} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelBubble, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import {NameMark} from '../components/NameMark';
import type {WalkerSpec} from '../components/Walker';

const DUR = 401;

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

const RIGHT_QUEUE: Array<{src: string; x: number; y: number}> = [
  {src: 'turis_walk_0.png', x: 1090, y: 330},
  {src: 'warga_hp_a_walk_0.png', x: 1145, y: 340},
  {src: 'warga_hp_b_walk_0.png', x: 1200, y: 332},
];

const SUNSET_GRADIENT =
  'linear-gradient(180deg, rgba(232,120,40,0.10) 0%, rgba(214,90,30,0.34) 100%)';

export const B12_TenangDiam: React.FC = () => {
  const f = useCurrentFrame();

  const rightChipAt = medsosLocalF('B12', 154.82);
  const lastriMarkAt = medsosLocalF('B12', 157.78);
  const bubbleAt = medsosLocalF('B12', 157.78);
  const boredAt = medsosLocalF('B12', 160.76);
  const pastChipAt = medsosLocalF('B12', 162.4);

  const sunsetOpacity = interpolate(f, [0, 300], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.06}
        zoomTo={1.20}
        dim={0.1}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {/* Senja magrib: dua overlay separuh */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 640,
          height: 720,
          background: SUNSET_GRADIENT,
          opacity: sunsetOpacity,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 0,
          width: 640,
          height: 720,
          background: SUNSET_GRADIENT,
          opacity: sunsetOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* === KIRI (SUKATENANG DIAM) === */}
      <PixelBubble
        text="NGOBROL SAMPAI MAGRIB."
        x={90}
        y={215}
        maxW={400}
        tail="bottom-left"
        at={bubbleAt}
      />

      <PixelSprite src="remaja_a_walk_0.png" x={150} y={470} w={32} h={52} />

      {/* Bu Lastri berjaga di warung kiri; penanda saat namanya terucap */}
      <PixelSprite src="lastri_walk_0.png" x={370} y={318} w={32} h={52} />
      <NameMark at={lastriMarkAt} feetX={386} feetY={370} labelY={292} text="BU LASTRI" color="#A5E075" holdFrames={90} />

      {f >= boredAt ? (
        <PopIn at={boredAt} seed="b12-bored" origin="320px 456px">
          <PixelCard x={215} y={430} w={210} pad="10px 12px" borderColor={PX.amber}>
            <div style={{display: 'flex', alignItems: 'center', gap: 10}}>
              <PixelSprite src="icon_jam.png" w={26} h={26} />
              <span style={{fontSize: 11, color: PX.amber}}>BOSAN...</span>
            </div>
          </PixelCard>
        </PopIn>
      ) : null}

      {f >= pastChipAt ? (
        <PopIn at={pastChipAt} seed="b12-past" origin="320px 576px">
          <PixelChip
            text="SEPERTI HIDUP DI MASA LALU"
            x={320}
            y={560}
            centerX
            fontSize={11}
            borderColor={PX.amber}
            color={PX.amber}
          />
        </PopIn>
      ) : null}

      {/* === KANAN (WARUNG TETAP RAMAI) === */}
      <RadioWaves x={1104} y={278} color="#FFDC78" from={0} />

      {/* Bu Lastri berjaga di warung kanan */}
      <PixelSprite src="lastri_walk_0.png" x={1010} y={318} w={32} h={52} />

      {RIGHT_QUEUE.map((q, i) => (
        <PixelSprite
          key={i}
          src={q.src}
          x={q.x}
          y={q.y + Math.sin(f / 7 + i * 2) * 2}
          w={32}
          h={52}
        />
      ))}

      {f >= rightChipAt ? (
        <PopIn at={rightChipAt} seed="b12-ramai" origin="960px 156px">
          <PixelChip
            text="WARUNG TETAP RAMAI"
            x={960}
            y={140}
            centerX
            fontSize={11}
            borderColor="#6EC6E8"
            color="#6EC6E8"
          />
        </PopIn>
      ) : null}
    </AbsoluteFill>
  );
};
