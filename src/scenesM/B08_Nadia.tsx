import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {PopIn, SlideIn} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import {NameMark} from '../components/NameMark';
import type {WalkerSpec} from '../components/Walker';

const DUR = 271;

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

  const camScale = interpolate(f, [0, DUR], [1.0, 1.07], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
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
    ? 'nadia_full_neutral.png'
    : 'nadia_full_happy.png';
  const nadiaRightSrc = blink
    ? 'nadia_full_neutral.png'
    : 'nadia_full_happy.png';

  const wiryoMarkAt = medsosLocalF('B08', 114.14);
  const t1 = medsosLocalF('B08', 114.56);
  const t2 = medsosLocalF('B08', 116.06);
  const t3 = medsosLocalF('B08', 116.86);

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
        zoomTo={1.08}
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
        {/* Kamera push-in separuh kiri */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${camScale.toFixed(4)})`,
            transformOrigin: '151px 351px',
          }}
        >
          <Img
            src={staticFile('sprites/bg_sunset_half_v2.png')}
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

          {/* Pak Wiryo full-body kecil di belakang (sprite sama dengan kanan) */}
          <div
            style={{
              position: 'absolute',
              left: 322,
              top: 318 + portraitY * 0.7 + bob * 0.6,
              width: 92,
              height: 190,
            }}
          >
            <PixelSprite src="wiryo_full_neutral.png" w={92} h={190} />
          </div>

          {/* Potret Nadia full-body */}
          <div
            style={{
              position: 'absolute',
              left: 76,
              top: 204 + portraitY + bob,
              width: 150,
              height: 309,
            }}
          >
            <PixelSprite src={nadiaLeftSrc} w={150} h={309} />
          </div>

          <NameMark at={wiryoMarkAt} feetX={368} feetY={508} labelY={262} text="PAK WIRYO" color="#A5E075" holdFrames={100} />
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
        {/* Kamera push-in separuh kanan */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            transform: `scale(${camScale.toFixed(4)})`,
            transformOrigin: '489px 351px',
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

          {/* Pak Wiryo full-body kecil di belakang (sprite sama dengan kiri) */}
          <div
            style={{
              position: 'absolute',
              left: 226,
              top: 318 + portraitY * 0.7 + bob * 0.6,
              width: 92,
              height: 190,
            }}
          >
            <PixelSprite src="wiryo_full_neutral.png" w={92} h={190} />
          </div>

          {/* Potret Nadia full-body */}
          <div
            style={{
              position: 'absolute',
              left: 414,
              top: 204 + portraitY + bob,
              width: 150,
              height: 309,
            }}
          >
            <PixelSprite src={nadiaRightSrc} w={150} h={309} />
          </div>

          <NameMark at={wiryoMarkAt} feetX={272} feetY={508} labelY={262} text="PAK WIRYO" color="#6EC6E8" holdFrames={100} />
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
