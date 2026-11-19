import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PopIn} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 375;

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

const Q_LEFT: Array<[number, number]> = [
  [150, 240],
  [470, 430],
  [250, 520],
];

const Q_RIGHT: Array<[number, number]> = [
  [790, 240],
  [1110, 430],
  [890, 520],
];

export const B03_Tebakan: React.FC = () => {
  const f = useCurrentFrame();

  const topChipAt = medsosLocalF('B03', 39.26);
  const leftCardAt = medsosLocalF('B03', 44.84);
  const rightCardAt = medsosLocalF('B03', 46.6);
  const ctaChipAt = medsosLocalF('B03', 49.8);
  const driftY = Math.sin(f / 40) * 3;

  return (
    <AbsoluteFill style={{backgroundColor: '#1B2A18'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `translateY(${driftY.toFixed(2)}px)`,
        }}
      >
        <TwinMapBg
          zoomFrom={1.16}
          zoomTo={1.13}
          dim={0.14}
          dur={DUR}
          leftWalkers={LEFT_WALKERS}
          rightWalkers={RIGHT_WALKERS}
        />
      </div>

      {/* Chip atas per separuh */}
      {f >= topChipAt ? (
        <>
          <PopIn at={topChipAt} seed="after20-l" origin="320px 110px">
            <PixelChip
              text="SETELAH 20 TAHUN..."
              x={320}
              y={110}
              centerX
              borderColor={PX.white}
              color={PX.white}
              fontSize={12}
            />
          </PopIn>
          <PopIn at={topChipAt} seed="after20-r" origin="960px 110px">
            <PixelChip
              text="SETELAH 20 TAHUN..."
              x={960}
              y={110}
              centerX
              borderColor={PX.white}
              color={PX.white}
              fontSize={12}
            />
          </PopIn>
        </>
      ) : null}

      {/* Ikon tanda tanya (3 kiri, 3 kanan) */}
      {Q_LEFT.map(([qx, qy], i) => {
        const at = medsosLocalF('B03', 40.6 + i * 0.4);
        if (f < at) return null;
        const bobY = Math.sin(f / 9 + i) * 4;
        return (
          <PopIn key={`ql-${i}`} at={at} seed={`ql-${i}`} origin={`${qx + 15}px ${qy + 15}px`}>
            <PixelSprite src="icon_tanda_tanya.png" x={qx} y={qy + bobY} w={30} h={30} />
          </PopIn>
        );
      })}
      {Q_RIGHT.map(([qx, qy], i) => {
        const at = medsosLocalF('B03', 40.6 + i * 0.4);
        if (f < at) return null;
        const bobY = Math.sin(f / 9 + i) * 4;
        return (
          <PopIn key={`qr-${i}`} at={at} seed={`qr-${i}`} origin={`${qx + 15}px ${qy + 15}px`}>
            <PixelSprite src="icon_tanda_tanya.png" x={qx} y={qy + bobY} w={30} h={30} />
          </PopIn>
        );
      })}

      {/* Kartu pertanyaan kiri & kanan */}
      {f >= leftCardAt ? (
        <PopIn at={leftCardAt} seed="guess-left" origin="320px 330px">
          <PixelCard x={320} y={330} w={500} center borderColor="#A5E075" pad="22px 24px">
            <div
              style={{
                fontSize: 17,
                color: '#A5E075',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              YANG TENANG TANPA MEDIA SOSIAL?
            </div>
          </PixelCard>
        </PopIn>
      ) : null}

      {f >= rightCardAt ? (
        <PopIn at={rightCardAt} seed="guess-right" origin="960px 330px">
          <PixelCard x={960} y={330} w={500} center borderColor="#6EC6E8" pad="22px 24px">
            <div
              style={{
                fontSize: 17,
                color: '#6EC6E8',
                textAlign: 'center',
                lineHeight: 1.5,
              }}
            >
              ATAU YANG RAMAI TERHUBUNG?
            </div>
          </PixelCard>
        </PopIn>
      ) : null}

      {/* Chip CTA bawah per separuh */}
      {f >= ctaChipAt ? (
        <>
          <PopIn at={ctaChipAt} seed="cta-l" origin="320px 606px">
            <PixelChip
              text="TULIS TEBAKANMU DI KOMENTAR"
              x={320}
              y={606}
              centerX
              borderColor={PX.gold}
              fontSize={11}
            />
          </PopIn>
          <PopIn at={ctaChipAt} seed="cta-r" origin="960px 606px">
            <PixelChip
              text="TULIS TEBAKANMU DI KOMENTAR"
              x={960}
              y={606}
              centerX
              borderColor={PX.gold}
              fontSize={11}
            />
          </PopIn>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
