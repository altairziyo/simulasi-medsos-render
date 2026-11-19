import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {useCount} from '../lib/ui/ui';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelCard, PixelSprite, PixelStamp} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 368;

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

const LEFT_ACCENT = '#A5E075';
const RIGHT_ACCENT = '#6EC6E8';

export const B13_Skor2: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const scoreAt = medsosLocalF('B13', 160.6);
  const stampWinAt = medsosLocalF('B13', 167.7);
  const stampWaitAt = medsosLocalF('B13', 169.5);

  const leftScore = Math.round(useCount(scoreAt, 75, 30, 20));
  const rightScore = Math.round(useCount(scoreAt + 12, 75, 38, 20));

  const cardS = spring({
    frame: Math.max(0, f - (scoreAt - 18)),
    fps,
    config: {damping: 14, stiffness: 170},
  });

  const cardMotionStyle: React.CSSProperties = {
    opacity: Math.min(1, cardS * 1.4),
    transform: `scale(${interpolate(cardS, [0, 1], [0.92, 1])})`,
    transformOrigin: '50% 50%',
  };

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.17}
        zoomTo={1.1}
        dim={0.16}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {f >= scoreAt - 18 ? (
        <>
          {/* Kartu kiri: SUKATENANG */}
          <PixelCard
            x={40}
            y={185}
            w={560}
            h={240}
            borderColor={LEFT_ACCENT}
            pad="22px 26px"
            style={cardMotionStyle}
          >
            <div style={{fontSize: 13, color: PX.goldHi, textAlign: 'center'}}>
              INDEKS KESEJAHTERAAN — TAHUN 2
            </div>

            <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 16}}>
              <PixelSprite src="nadia_walk_0.png" w={32} h={52} />
              <div style={{width: 190, fontSize: 14, color: LEFT_ACCENT}}>SUKATENANG</div>
              <div style={{flex: 1, height: 28, background: '#100E0C', border: `2px solid ${PX.borderDark}`}}>
                <div style={{width: `${leftScore}%`, height: '100%', background: LEFT_ACCENT}} />
              </div>
              <div style={{width: 64, textAlign: 'right', fontSize: 24, color: LEFT_ACCENT}}>
                {leftScore}
              </div>
            </div>

            <div style={{marginTop: 22, fontSize: 10, color: PX.goldHi, textAlign: 'center'}}>
              WARUNG SEPI • NGOBROL PANJANG
            </div>
          </PixelCard>

          {/* Kartu kanan: SUKARAMAI */}
          <PixelCard
            x={680}
            y={185}
            w={560}
            h={240}
            borderColor={RIGHT_ACCENT}
            pad="22px 26px"
            style={cardMotionStyle}
          >
            <div style={{fontSize: 13, color: PX.goldHi, textAlign: 'center'}}>
              INDEKS KESEJAHTERAAN — TAHUN 2
            </div>

            <div style={{marginTop: 30, display: 'flex', alignItems: 'center', gap: 16}}>
              <PixelSprite src="nadia_walk_0.png" w={32} h={52} flipX />
              <div style={{width: 190, fontSize: 14, color: RIGHT_ACCENT}}>SUKARAMAI</div>
              <div style={{flex: 1, height: 28, background: '#100E0C', border: `2px solid ${PX.borderDark}`}}>
                <div style={{width: `${rightScore}%`, height: '100%', background: RIGHT_ACCENT}} />
              </div>
              <div style={{width: 64, textAlign: 'right', fontSize: 24, color: RIGHT_ACCENT}}>
                {rightScore}
              </div>
            </div>

            <div style={{marginTop: 22, fontSize: 10, color: PX.goldHi, textAlign: 'center'}}>
              WARUNG VIRAL • PENGIKUT NAIK
            </div>
          </PixelCard>
        </>
      ) : null}

      {/* Stempel kanan */}
      <PixelStamp
        text="MEDSOS MENANG TELAK"
        x={960}
        y={492}
        at={stampWinAt}
        color={PX.gold}
        fontSize={17}
        rot={-2}
      />
      <PixelStamp
        text="TAPI TUNGGU DULU..."
        x={960}
        y={556}
        at={stampWaitAt}
        color={PX.white}
        fontSize={13}
        rot={-2}
      />

      {/* Stempel kiri */}
      <PixelStamp
        text="BARU TAHUN KEDUA"
        x={320}
        y={492}
        at={stampWaitAt}
        color={LEFT_ACCENT}
        fontSize={13}
        rot={-2}
      />
    </AbsoluteFill>
  );
};
