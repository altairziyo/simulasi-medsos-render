import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PopIn} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PIXEL_FONT} from '../pixelFont';
import {PX, PixelCard, PixelChip, PixelSprite, PixelStamp} from '../components/PixelUI';
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

const METRICS = [
  {src: 'icon_koin.png', label: 'UANG', localCx: 105, at: medsosLocalF('B09', 115.4)},
  {src: 'icon_hati.png', label: 'KESEHATAN', localCx: 320, at: medsosLocalF('B09', 116.2)},
  {src: 'icon_jabat.png', label: 'RUKUN WARGA', localCx: 535, at: medsosLocalF('B09', 117.2)},
];

const IconBadgeBox: React.FC<{
  icon: string;
  text: string;
  x: number;
  y: number;
  borderColor: string;
  color: string;
}> = ({icon, text, x, y, borderColor, color}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      translate: '-50% 0',
      border: `2px solid ${borderColor}`,
      background: PX.bgPanel,
      boxShadow: '3px 3px 0 rgba(0,0,0,0.65)',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontFamily: PIXEL_FONT,
      fontSize: 11,
      color,
      whiteSpace: 'nowrap',
    }}
  >
    <PixelSprite src={icon} w={22} h={22} />
    <span>{text}</span>
  </div>
);

export const B09_Indeks: React.FC = () => {
  const f = useCurrentFrame();

  const titleAt = medsosLocalF('B09', 112.8);
  const badgeAt = medsosLocalF('B09', 118.4);
  const phoneOkAt = medsosLocalF('B09', 119.5);
  const medsosTestAt = medsosLocalF('B09', 121.5);
  const stampAt = medsosLocalF('B09', 122.4);

  const halves = [
    {
      side: 'L' as const,
      offset: 0,
      cx: 320,
      medsosText: 'MEDSOS: DIUJI',
      medsosColor: PX.red,
    },
    {
      side: 'R' as const,
      offset: 640,
      cx: 960,
      medsosText: 'MEDSOS: BEBAS',
      medsosColor: '#6EC6E8',
    },
  ];

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.01}
        zoomTo={1.04}
        dim={0.5}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {halves.map((h) => (
        <React.Fragment key={h.side}>
          {/* Chip judul */}
          {f >= titleAt ? (
            <PopIn at={titleAt} seed={`b09-t-${h.side}`} origin={`${h.cx}px 92px`}>
              <PixelChip
                text="YANG KITA UKUR"
                x={h.cx}
                y={92}
                centerX
                fontSize={12}
                borderColor={PX.white}
                color={PX.white}
              />
            </PopIn>
          ) : null}

          {/* Tiga kartu ikon */}
          {METRICS.map((m) =>
            f >= m.at ? (
              <PopIn
                key={`${h.side}-${m.label}`}
                at={m.at}
                seed={`b09-${h.side}-${m.label}`}
                origin={`${h.offset + m.localCx}px 213px`}
              >
                <PixelCard
                  x={h.offset + m.localCx - 75}
                  y={150}
                  w={150}
                  h={126}
                  borderColor={PX.gold}
                  pad="12px"
                  style={{textAlign: 'center'}}
                >
                  <div style={{display: 'flex', justifyContent: 'center', marginTop: 4}}>
                    <PixelSprite src={m.src} w={44} h={44} />
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: PX.goldHi,
                      marginTop: 8,
                      lineHeight: 1.35,
                    }}
                  >
                    {m.label}
                  </div>
                </PixelCard>
              </PopIn>
            ) : null,
          )}

          {/* Lencana gabungan */}
          {f >= badgeAt ? (
            <PopIn at={badgeAt} seed={`b09-idx-${h.side}`} origin={`${h.cx}px 350px`}>
              <PixelCard
                x={h.cx}
                y={350}
                w={430}
                center
                borderColor={PX.gold}
                pad="18px"
                style={{textAlign: 'center'}}
              >
                <div style={{display: 'flex', justifyContent: 'center', gap: 16}}>
                  <PixelSprite src="icon_koin.png" w={30} h={30} />
                  <PixelSprite src="icon_hati.png" w={30} h={30} />
                  <PixelSprite src="icon_jabat.png" w={30} h={30} />
                </div>
                <div style={{fontSize: 14, color: PX.goldHi, marginTop: 12}}>
                  INDEKS KESEJAHTERAAN
                </div>
                <div style={{fontSize: 11, color: PX.gold, marginTop: 8}}>= 1 ANGKA</div>
              </PixelCard>
            </PopIn>
          ) : null}

          {/* Baris penegasan: PONSEL AMAN */}
          {f >= phoneOkAt ? (
            <PopIn at={phoneOkAt} seed={`b09-ph-${h.side}`} origin={`${h.cx}px 520px`}>
              <IconBadgeBox
                icon="icon_telepon.png"
                text="PONSEL: AMAN"
                x={h.cx}
                y={520}
                borderColor={PX.green}
                color={PX.greenHi}
              />
            </PopIn>
          ) : null}

          {/* Baris penegasan: MEDSOS */}
          {f >= medsosTestAt ? (
            <PopIn at={medsosTestAt} seed={`b09-ms-${h.side}`} origin={`${h.cx}px 580px`}>
              <IconBadgeBox
                icon="icon_kamera.png"
                text={h.medsosText}
                x={h.cx}
                y={580}
                borderColor={h.medsosColor}
                color={h.medsosColor}
              />
            </PopIn>
          ) : null}

          {/* Stempel BUKAN LAYARNYA */}
          <PixelStamp
            text="BUKAN LAYARNYA"
            x={h.cx}
            y={620}
            at={stampAt}
            fontSize={13}
            color={PX.white}
            rot={-2}
          />
        </React.Fragment>
      ))}
    </AbsoluteFill>
  );
};
