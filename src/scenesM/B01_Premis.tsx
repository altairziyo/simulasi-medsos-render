import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PopIn} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 672;

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

const CLUSTER_ICONS = [
  'icon_telepon.png',
  'icon_pesan.png',
  'icon_kamera.png',
  'icon_pengikut.png',
];

export const B01_Premis: React.FC = () => {
  const f = useCurrentFrame();

  const titleOut = interpolate(f, [216, 240], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const walkIdx = Math.floor(f / 8) % 4;

  const chips = [
    {text: '100 WARGA vs 100 WARGA', at: medsosLocalF('B01', 7.94), x: 640, y: 108},
    {text: 'JALAN SAMA LEBAR', at: medsosLocalF('B01', 9.7), x: 320, y: 150},
    {text: 'SINYAL SAMA KUAT', at: medsosLocalF('B01', 11.38), x: 960, y: 150},
    {text: 'PONSEL SAMA-SAMA ADA', at: medsosLocalF('B01', 14.84), x: 320, y: 566},
    {text: 'SINYAL SAMA KENCANG', at: medsosLocalF('B01', 18.86), x: 960, y: 566},
  ];

  const iconsAt = medsosLocalF('B01', 14.84);
  const splitRuleAt = medsosLocalF('B01', 17.94);
  const ruleActive = f >= splitRuleAt;
  const goldGlowAlpha = 0.35 + 0.35 * (0.5 + 0.5 * Math.sin(f / 6));

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.02}
        zoomTo={1.18}
        dim={0.12}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {/* Kartu judul pembuka (UI terpusat seperti templat B01 Pemimpin) */}
      {titleOut > 0.01 ? (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: titleOut,
            pointerEvents: 'none',
          }}
        >
          <PopIn at={2} seed="medsostitle">
            <PixelCard
              x={640}
              y={330}
              w={860}
              center
              borderColor={PX.gold}
              bg="rgba(16, 14, 12, 0.94)"
              pad="28px 34px"
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 24,
                }}
              >
                <PixelSprite src={`wiryo_walk_${walkIdx}.png`} w={48} h={78} />
                <div style={{textAlign: 'center', flex: 1}}>
                  <div style={{fontSize: 28, color: PX.gold, lineHeight: 1.35}}>
                    SIMULASI 20 TAHUN!
                  </div>
                  <div style={{fontSize: 13, color: PX.white, marginTop: 16, lineHeight: 1.6}}>
                    DESA TANPA MEDIA SOSIAL VS DESA MEDSOS BEBAS
                  </div>
                </div>
                <PixelSprite src={`danu_walk_${walkIdx}.png`} w={48} h={78} flipX />
              </div>
            </PixelCard>
          </PopIn>
        </div>
      ) : null}

      {/* Chip variabel awal */}
      {chips.map((ch) =>
        f >= ch.at ? (
          <PopIn key={ch.text} at={ch.at} seed={ch.text} origin={`${ch.x}px ${ch.y}px`}>
            <PixelChip
              text={ch.text}
              x={ch.x}
              y={ch.y}
              centerX
              borderColor={PX.gold}
              fontSize={13}
            />
          </PopIn>
        ) : null,
      )}

      {/* Kluster ikon per separuh */}
      {f >= iconsAt ? (
        <>
          <PopIn at={iconsAt} seed="icons-left" origin="320px 228px">
            <PixelCard
              x={170}
              y={196}
              w={300}
              h={64}
              pad="0 16px"
              borderColor={ruleActive ? PX.red : PX.white}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                {CLUSTER_ICONS.map((src, idx) => (
                  <div
                    key={src}
                    style={{
                      position: 'relative',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PixelSprite src={src} w={28} h={28} />
                    {ruleActive && idx >= 2 ? (
                      <div
                        style={{
                          position: 'absolute',
                          left: -1,
                          top: -1,
                          width: 30,
                          height: 30,
                          pointerEvents: 'none',
                        }}
                      >
                        <PixelSprite src="icon_x.png" w={30} h={30} />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </PixelCard>
          </PopIn>

          <PopIn at={iconsAt} seed="icons-right" origin="960px 228px">
            <PixelCard
              x={810}
              y={196}
              w={300}
              h={64}
              pad="0 16px"
              borderColor={ruleActive ? PX.gold : PX.white}
              style={
                ruleActive
                  ? {
                      boxShadow: `inset 0 0 0 2px rgba(255,255,255,0.12), 0 0 18px rgba(255, 220, 120, ${goldGlowAlpha.toFixed(3)}), 5px 5px 0 rgba(0,0,0,0.65)`,
                    }
                  : undefined
              }
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  height: '100%',
                }}
              >
                {CLUSTER_ICONS.map((src) => (
                  <div
                    key={src}
                    style={{
                      position: 'relative',
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <PixelSprite src={src} w={28} h={28} />
                  </div>
                ))}
              </div>
            </PixelCard>
          </PopIn>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
