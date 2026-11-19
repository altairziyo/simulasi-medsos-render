import React from 'react';
import {AbsoluteFill, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PopIn, SlideIn} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 311;

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

export const B08_Nadia: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const bgScale = interpolate(f, [0, DUR], [1.0, 1.04], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const portraitEntrance = spring({
    frame: f,
    fps,
    config: {damping: 16, stiffness: 150, mass: 0.7},
  });
  const portraitY = interpolate(portraitEntrance, [0, 1], [40, 0]);
  const bob = Math.sin(f / 18) * 1.5;

  const blink = f % 100 >= 95;
  const nadiaLeftSrc = blink
    ? 'nadia_remaja_kiri_portrait_neutral.png'
    : 'nadia_remaja_kiri_portrait_happy.png';
  const nadiaRightSrc = blink
    ? 'nadia_remaja_kanan_portrait_neutral.png'
    : 'nadia_remaja_kanan_portrait_happy.png';

  const t1 = medsosLocalF('B08', 108.12);
  const t2 = medsosLocalF('B08', 109.28);
  const t3 = medsosLocalF('B08', 109.7);

  const activeChip =
    f >= t3
      ? {text: 'KELUARGA SAMA', at: t3}
      : f >= t2
        ? {text: 'BAKATNYA SAMA', at: t2}
        : f >= t1
          ? {text: 'ORANGNYA SAMA', at: t1}
          : null;

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.02}
        zoomTo={1.06}
        dim={0.2}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {/* Separuh kiri: Nadia Sukatenang */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 640,
          height: 720,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('sprites/bg_sunset_half.png')}
          className="pixel-img"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 640,
            height: 720,
            objectFit: 'cover',
            imageRendering: 'pixelated',
            opacity: 0.9,
            transform: `scale(${bgScale.toFixed(4)})`,
            transformOrigin: '45% 50%',
          }}
        />

        {/* Potret Wiryo kecil di belakang */}
        <div
          style={{
            position: 'absolute',
            left: 300,
            top: 250 + portraitY * 0.7 + bob * 0.6,
            width: 128,
            height: 160,
          }}
        >
          <PixelSprite src="wiryo_kades_portrait_neutral.png" w={128} h={160} />
        </div>

        {/* Potret Nadia */}
        <div
          style={{
            position: 'absolute',
            left: 56,
            top: 210 + portraitY + bob,
            width: 215,
            height: 269,
          }}
        >
          <PixelSprite src={nadiaLeftSrc} w={215} h={269} />
        </div>

        {/* Kartu nama kiri */}
        <SlideIn at={4} dx={-48} dur={14}>
          <PixelCard x={330} y={104} w={280} borderColor="#A5E075" pad="16px 14px">
            <div style={{fontSize: 15, color: '#A5E075', lineHeight: 1.25}}>
              NADIA • 15 TAHUN
            </div>
            <div style={{fontSize: 10, color: PX.goldHi, marginTop: 10}}>CUCU PAK WIRYO</div>
          </PixelCard>
        </SlideIn>
      </div>

      {/* Separuh kanan: Nadia Sukaramai */}
      <div
        style={{
          position: 'absolute',
          left: 640,
          top: 0,
          width: 640,
          height: 720,
          overflow: 'hidden',
        }}
      >
        <Img
          src={staticFile('sprites/bg_sunset_half.png')}
          className="pixel-img"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 640,
            height: 720,
            objectFit: 'cover',
            imageRendering: 'pixelated',
            opacity: 0.9,
            transform: `scaleX(-1) scale(${bgScale.toFixed(4)})`,
            transformOrigin: '55% 50%',
          }}
        />

        {/* Potret Wiryo kecil di belakang */}
        <div
          style={{
            position: 'absolute',
            left: 212,
            top: 250 + portraitY * 0.7 + bob * 0.6,
            width: 128,
            height: 160,
          }}
        >
          <PixelSprite src="wiryo_warga_portrait_neutral.png" w={128} h={160} />
        </div>

        {/* Potret Nadia */}
        <div
          style={{
            position: 'absolute',
            left: 369,
            top: 210 + portraitY + bob,
            width: 215,
            height: 269,
          }}
        >
          <PixelSprite src={nadiaRightSrc} w={215} h={269} />
        </div>

        {/* Kartu nama kanan */}
        <SlideIn at={4} dx={48} dur={14}>
          <PixelCard x={30} y={104} w={280} borderColor="#6EC6E8" pad="16px 14px">
            <div style={{fontSize: 15, color: '#6EC6E8', lineHeight: 1.25}}>
              NADIA • 15 TAHUN
            </div>
            <div style={{fontSize: 10, color: PX.goldHi, marginTop: 10}}>CUCU PAK WIRYO</div>
          </PixelCard>
        </SlideIn>
      </div>

      {/* Chip berganti per separuh di y=590 */}
      {activeChip ? (
        <>
          <PopIn
            key={`l-${activeChip.text}`}
            at={activeChip.at}
            seed={`nadia-l-${activeChip.text}`}
            origin="320px 590px"
          >
            <PixelChip
              text={activeChip.text}
              x={320}
              y={590}
              centerX
              borderColor={PX.gold}
              fontSize={12}
            />
          </PopIn>
          <PopIn
            key={`r-${activeChip.text}`}
            at={activeChip.at}
            seed={`nadia-r-${activeChip.text}`}
            origin="960px 590px"
          >
            <PixelChip
              text={activeChip.text}
              x={960}
              y={590}
              centerX
              borderColor={PX.gold}
              fontSize={12}
            />
          </PopIn>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
