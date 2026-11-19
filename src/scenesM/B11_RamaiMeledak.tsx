import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PopIn, RadioWaves} from '../lib/paper/kit';
import {useCount} from '../lib/ui/ui';
import {FPS, medsosLocalF} from '../medsosPlan';
import {PIXEL_FONT} from '../pixelFont';
import {PX, PixelChip, PixelSprite, PixelStamp} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import {NameMark} from '../components/NameMark';
import type {WalkerSpec} from '../components/Walker';

const DUR = 499;

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

const RIGHT_QUEUE: Array<{src: string; x: number; y: number; flipX?: boolean}> = [
  {src: 'turis_walk_0.png', x: 1090, y: 330},
  {src: 'warga_hp_a_walk_0.png', x: 1140, y: 342},
  {src: 'warga_hp_b_walk_0.png', x: 1195, y: 330},
  {src: 'turis_walk_0.png', x: 1235, y: 345, flipX: true},
];

export const B11_RamaiMeledak: React.FC = () => {
  const f = useCurrentFrame();

  const cupAt = medsosLocalF('B11', 137.68);
  const camAt = medsosLocalF('B11', 139.56);
  const wavesAt = medsosLocalF('B11', 139.56);
  const chatChipAt = medsosLocalF('B11', 139.8);
  const viralAt = medsosLocalF('B11', 139.96);
  const queueBaseAt = medsosLocalF('B11', 139.96);
  const buyersChipAt = medsosLocalF('B11', 141.02);
  const coinChipAt = medsosLocalF('B11', 143.68);
  const nadiaAt = medsosLocalF('B11', 145.96);
  const lastriMarkAt = medsosLocalF('B11', 139.56);
  const nadiaMarkAt = medsosLocalF('B11', 147.72);
  const followersAt = medsosLocalF('B11', 148.5);

  const followersCount = Math.round(useCount(followersAt, 90, 132));
  const nadiaFrame = Math.floor(f / 6) % 4;
  const nadiaJump = Math.abs(Math.sin(f / 5)) * 8;

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.05}
        zoomTo={1.22}
        dim={0.1}
        panX={[0, -20]}
        panY={[0, 8]}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {/* === AKSI KIRI (TENANG) === */}
      <PixelSprite src="warga_a_walk_0.png" x={445} y={318} w={32} h={52} />
      <PixelSprite src="warga_b_walk_0.png" x={492} y={326} w={32} h={52} flipX />

      {f >= cupAt ? (
        <PopIn at={cupAt} seed="b11-cup" origin="481px 317px">
          <PixelSprite src="prop_cangkir.png" x={470} y={306} w={22} h={22} />
        </PopIn>
      ) : null}

      {f >= chatChipAt ? (
        <PopIn at={chatChipAt} seed="b11-chat" origin="320px 230px">
          <PixelChip
            text="NGOBROL SANTAI"
            x={320}
            y={215}
            centerX
            fontSize={10}
            borderColor="#A5E075"
            color="#A5E075"
          />
        </PopIn>
      ) : null}

      {/* === AKSI KANAN (RAMAI MELEDAK) === */}
      <RadioWaves x={1104} y={278} color="#FFDC78" from={wavesAt} />

      {/* Bu Lastri berjaga di warung kanan; penanda saat namanya terucap */}
      <PixelSprite src="lastri_walk_0.png" x={1010} y={318} w={32} h={52} />
      <NameMark at={lastriMarkAt} feetX={1026} feetY={370} labelY={292} text="BU LASTRI" color="#6EC6E8" holdFrames={90} />

      {/* Ikon kamera di atas dua posisi antrean */}
      {f >= camAt ? (
        <>
          <PopIn at={camAt} seed="b11-cam-0" origin="1106px 313px">
            <PixelSprite src="icon_kamera.png" x={1095} y={302} w={22} h={22} />
          </PopIn>
          <PopIn at={camAt} seed="b11-cam-1" origin="1211px 313px">
            <PixelSprite src="icon_kamera.png" x={1200} y={302} w={22} h={22} />
          </PopIn>
        </>
      ) : null}

      {/* Antrean pembeli */}
      {RIGHT_QUEUE.map((q, idx) => {
        const at = queueBaseAt + Math.round(idx * 0.5 * FPS);
        if (f < at) return null;
        const bobY = Math.sin(f / 7 + idx * 1.8) * 2;
        return (
          <PopIn key={idx} at={at} seed={`b11-q-${idx}`} origin={`${q.x + 16}px ${q.y + 26}px`}>
            <PixelSprite
              src={q.src}
              x={q.x}
              y={q.y + bobY}
              w={32}
              h={52}
              flipX={q.flipX}
            />
          </PopIn>
        );
      })}

      {/* Stempel VIRAL! */}
      <PixelStamp text="VIRAL!" x={1104} y={205} at={viralAt} color={PX.gold} fontSize={18} rot={-3} />

      {/* Chip antrean pembeli luar desa */}
      {f >= buyersChipAt ? (
        <PopIn at={buyersChipAt} seed="b11-buyers" origin="960px 156px">
          <PixelChip
            text="PEMBELI LUAR DESA ANTRI"
            x={960}
            y={140}
            centerX
            borderColor="#6EC6E8"
            color="#6EC6E8"
            fontSize={11}
          />
        </PopIn>
      ) : null}

      {/* Chip flex ikon koin + teks */}
      {f >= coinChipAt ? (
        <PopIn at={coinChipAt} seed="b11-coin" origin="960px 472px">
          <div
            style={{
              position: 'absolute',
              left: 960,
              top: 455,
              translate: '-50% 0',
              maxWidth: 540,
              boxSizing: 'border-box',
              border: `2px solid ${PX.gold}`,
              background: PX.bgPanel,
              boxShadow: '3px 3px 0 rgba(0,0,0,0.65)',
              padding: '8px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontFamily: PIXEL_FONT,
              fontSize: 10,
              color: PX.goldHi,
              whiteSpace: 'nowrap',
            }}
          >
            <PixelSprite src="icon_koin.png" w={22} h={22} style={{flexShrink: 0}} />
            <span>ANAK MUDA DAPAT UANG DARI KONTEN</span>
          </div>
        </PopIn>
      ) : null}

      {/* Nadia menari di lapangan kanan + tripod + ringlight + chip pengikut */}
      {f >= nadiaAt ? (
        <>
          <PopIn at={nadiaAt} seed="b11-nadia" origin="775px 190px">
            <PixelSprite src="prop_ringlight.png" x={700} y={128} w={46} />
            <PixelSprite
              src={`nadia_walk_${nadiaFrame}.png`}
              x={745}
              y={150 - nadiaJump}
              w={64}
              h={104}
            />
            <PixelSprite src="prop_tripod.png" x={838} y={168} w={54} />
          </PopIn>
          <NameMark at={nadiaMarkAt} feetX={777} feetY={258} labelY={284} text="NADIA" color="#6EC6E8" holdFrames={80} />
          <PopIn at={nadiaAt} seed="b11-followers" origin="775px 108px">
            <PixelChip
              text={`PENGIKUT ${followersCount}+`}
              x={775}
              y={92}
              centerX
              borderColor="#6EC6E8"
              color="#6EC6E8"
              fontSize={12}
            />
          </PopIn>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
