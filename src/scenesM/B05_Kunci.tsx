import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {PopIn, SlideIn, SparkleBurst} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 804;

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

type LockItem = {
  id: string;
  label: string;
  value: string;
  at: number;
  cx: number;
  globalIdx: number;
};

const LEFT_LOCKS: LockItem[] = [
  {id: 'warga', label: 'WARGA', value: '100 vs 100', at: medsosLocalF('B05', 68.04), cx: 125, globalIdx: 0},
  {id: 'lahan', label: 'LAHAN', value: 'SAMA LUAS', at: medsosLocalF('B05', 70.42), cx: 320, globalIdx: 1},
  {id: 'sinyal', label: 'SINYAL', value: 'SAMA', at: medsosLocalF('B05', 72.14), cx: 515, globalIdx: 2},
];

const RIGHT_LOCKS: LockItem[] = [
  {id: 'cuaca', label: 'CUACA', value: 'BARENGAN', at: medsosLocalF('B05', 73.72), cx: 125, globalIdx: 3},
  {id: 'ponsel', label: 'PONSEL', value: 'SAMA-SAMA PINTAR', at: medsosLocalF('B05', 74.08), cx: 320, globalIdx: 4},
  {id: 'internet', label: 'INTERNET', value: 'SAMA-SAMA KENCANG', at: medsosLocalF('B05', 75.96), cx: 515, globalIdx: 5},
];

const SERVICES = [
  {label: 'TELEPON', at: medsosLocalF('B05', 79.36)},
  {label: 'PESAN', at: medsosLocalF('B05', 79.9)},
  {label: 'BERITA', at: medsosLocalF('B05', 81.68)},
  {label: 'JUALAN', at: medsosLocalF('B05', 82.16)},
];

const PadlockIcon: React.FC<{locked: number}> = ({locked}) => {
  const shackleDrop = interpolate(locked, [0, 1], [-10, 0]);
  return (
    <svg width={52} height={58} viewBox="0 0 52 58" style={{display: 'block', margin: '0 auto'}}>
      {/* Shackle */}
      <path
        d="M14 26 V16 A12 12 0 0 1 38 16 V26"
        fill="none"
        stroke={locked > 0.5 ? PX.gold : '#88827A'}
        strokeWidth={6}
        transform={`translate(0 ${shackleDrop.toFixed(1)})`}
      />
      {/* Body */}
      <rect
        x={6}
        y={24}
        width={40}
        height={30}
        fill={locked > 0.5 ? '#D8A236' : '#4A4640'}
        stroke="#141210"
        strokeWidth={3}
      />
      <rect x={10} y={28} width={32} height={4} fill={locked > 0.5 ? '#FFF0B4' : '#6A645C'} />
      {/* Keyhole */}
      <circle cx={26} cy={38} r={4} fill="#141210" />
      <rect x={24} y={40} width={4} height={8} fill="#141210" />
    </svg>
  );
};

const LockHalfRow: React.FC<{
  leftOffset: number;
  locks: LockItem[];
  lockRowY: number;
  lockRowScale: number;
}> = ({leftOffset, locks, lockRowY, lockRowScale}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <div
      style={{
        position: 'absolute',
        left: leftOffset,
        top: lockRowY,
        width: 640,
        height: 196,
        transform: `scale(${lockRowScale.toFixed(4)})`,
        transformOrigin: '50% 0%',
      }}
    >
      {locks.map((lk) => {
        const appearAt = 20 + lk.globalIdx * 10;
        const lockS = spring({
          frame: Math.max(0, f - lk.at),
          fps,
          config: {damping: 12, stiffness: 220, mass: 0.6},
        });
        const cardIn = spring({
          frame: Math.max(0, f - appearAt),
          fps,
          config: {damping: 15, stiffness: 180},
        });
        const isLocked = f >= lk.at;
        return (
          <div
            key={lk.id}
            style={{
              position: 'absolute',
              left: lk.cx - 90,
              top: 0,
              width: 180,
              opacity: f >= appearAt ? Math.min(1, cardIn * 1.4) : 0,
              transform: `translateY(${(1 - cardIn) * 24}px)`,
            }}
          >
            <PixelCard
              w={180}
              h={196}
              borderColor={isLocked ? PX.gold : PX.borderDark}
              pad="16px 10px"
              style={{textAlign: 'center'}}
            >
              <PadlockIcon locked={isLocked ? lockS : 0} />
              <div style={{fontSize: 13, color: PX.gold, marginTop: 14}}>{lk.label}</div>
              <div style={{fontSize: 9, color: PX.white, marginTop: 8, lineHeight: 1.35}}>
                {lk.value}
              </div>
              <div
                style={{
                  marginTop: 10,
                  display: 'inline-block',
                  padding: '5px 8px',
                  fontSize: 9,
                  background: isLocked ? '#332610' : '#24211E',
                  border: `2px solid ${isLocked ? PX.gold : '#4A4640'}`,
                  color: isLocked ? PX.gold : '#88827A',
                }}
              >
                {isLocked ? 'TERKUNCI' : 'SIAP'}
              </div>
            </PixelCard>
          </div>
        );
      })}
    </div>
  );
};

export const B05_Kunci: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();

  const panelShowAt = medsosLocalF('B05', 79.14);
  const banAt = medsosLocalF('B05', 84.22);
  const freeAt = medsosLocalF('B05', 85.76);

  const headerOpacity = interpolate(f, [panelShowAt, panelShowAt + 10], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const compress = interpolate(f, [panelShowAt, panelShowAt + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const lockRowY = interpolate(compress, [0, 1], [118, 104]);
  const lockRowScale = interpolate(compress, [0, 1], [1, 0.8]);

  const banS = spring({
    frame: Math.max(0, f - banAt),
    fps,
    config: {damping: 13, stiffness: 200},
  });
  const freeS = spring({
    frame: Math.max(0, f - freeAt),
    fps,
    config: {damping: 13, stiffness: 200},
  });

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.03}
        zoomTo={1.15}
        dim={0.45}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {/* Chip header per separuh */}
      {f >= 6 ? (
        <>
          <PopIn at={6} seed="b05-hdr-l" origin="320px 84px">
            <PixelChip
              text="ATURAN: 5 VARIABEL DIKUNCI"
              x={320}
              y={84}
              centerX
              borderColor={PX.gold}
              fontSize={12}
              style={{opacity: headerOpacity}}
            />
          </PopIn>
          <PopIn at={6} seed="b05-hdr-r" origin="960px 84px">
            <PixelChip
              text="ATURAN: 5 VARIABEL DIKUNCI"
              x={960}
              y={84}
              centerX
              borderColor={PX.gold}
              fontSize={12}
              style={{opacity: headerOpacity}}
            />
          </PopIn>
        </>
      ) : null}

      {/* 6 Kartu Gembok: 3 kiri + 3 kanan */}
      <LockHalfRow
        leftOffset={0}
        locks={LEFT_LOCKS}
        lockRowY={lockRowY}
        lockRowScale={lockRowScale}
      />
      <LockHalfRow
        leftOffset={640}
        locks={RIGHT_LOCKS}
        lockRowY={lockRowY}
        lockRowScale={lockRowScale}
      />

      {/* Sparkle bursts saat tiap gembok mengunci */}
      {LEFT_LOCKS.map((lk) => (
        <SparkleBurst key={lk.id} at={lk.at} x={lk.cx} y={150} seed={`lk${lk.id}`} spread={0.75} />
      ))}
      {RIGHT_LOCKS.map((lk) => (
        <SparkleBurst
          key={lk.id}
          at={lk.at}
          x={640 + lk.cx}
          y={150}
          seed={`lk${lk.id}`}
          spread={0.75}
        />
      ))}

      {/* Panel layanan per separuh */}
      {f >= panelShowAt ? (
        <>
          <SlideIn at={panelShowAt} dx={-60} dur={14}>
            <PixelCard
              x={30}
              y={330}
              w={580}
              h={270}
              borderColor="#A5E075"
              pad="20px 22px"
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <div
                  style={{
                    width: 56,
                    height: 64,
                    background: '#1E2A1C',
                    border: '2px solid #A5E075',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PixelSprite src="wiryo_walk_0.png" w={36} h={58} />
                </div>
                <div>
                  <div style={{fontSize: 17, color: '#A5E075'}}>SUKATENANG</div>
                  <div style={{fontSize: 10, color: PX.goldHi, marginTop: 8}}>
                    KEPALA DESA: PAK WIRYO
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18}}>
                {SERVICES.map((sv) => {
                  const s = spring({
                    frame: Math.max(0, f - sv.at),
                    fps,
                    config: {damping: 14, stiffness: 200},
                  });
                  return (
                    <div
                      key={sv.label}
                      style={{
                        opacity: f >= sv.at ? Math.min(1, s * 1.4) : 0,
                        transform: `scale(${interpolate(s, [0, 1], [0.85, 1]).toFixed(4)})`,
                        border: `2px solid ${PX.green}`,
                        background: '#20262E',
                        padding: '10px 12px',
                        fontSize: 11,
                        color: PX.greenHi,
                      }}
                    >
                      &gt; {sv.label}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 16,
                  opacity: f >= banAt ? Math.min(1, banS * 1.4) : 0,
                  transform: `translateY(${((1 - banS) * 12).toFixed(1)}px)`,
                  border: `2px solid ${PX.red}`,
                  background: '#2B1B18',
                  padding: '12px 14px',
                  fontSize: 12,
                  color: PX.red,
                }}
              >
                X MEDIA SOSIAL — DILARANG
              </div>
            </PixelCard>
          </SlideIn>

          <SlideIn at={panelShowAt} dx={60} dur={14}>
            <PixelCard
              x={670}
              y={330}
              w={580}
              h={270}
              borderColor="#6EC6E8"
              pad="20px 22px"
            >
              <div style={{display: 'flex', alignItems: 'center', gap: 16}}>
                <div
                  style={{
                    width: 56,
                    height: 64,
                    background: '#162530',
                    border: '2px solid #6EC6E8',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <PixelSprite src="danu_walk_0.png" w={36} h={58} />
                </div>
                <div>
                  <div style={{fontSize: 17, color: '#6EC6E8'}}>SUKARAMAI</div>
                  <div style={{fontSize: 10, color: PX.goldHi, marginTop: 8}}>
                    KEPALA DESA: PAK DANU
                  </div>
                </div>
              </div>

              <div style={{display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 18}}>
                {SERVICES.map((sv) => {
                  const s = spring({
                    frame: Math.max(0, f - sv.at),
                    fps,
                    config: {damping: 14, stiffness: 200},
                  });
                  return (
                    <div
                      key={sv.label}
                      style={{
                        opacity: f >= sv.at ? Math.min(1, s * 1.4) : 0,
                        transform: `scale(${interpolate(s, [0, 1], [0.85, 1]).toFixed(4)})`,
                        border: `2px solid ${PX.green}`,
                        background: '#20262E',
                        padding: '10px 12px',
                        fontSize: 11,
                        color: PX.greenHi,
                      }}
                    >
                      &gt; {sv.label}
                    </div>
                  );
                })}
              </div>

              <div
                style={{
                  marginTop: 16,
                  opacity: f >= freeAt ? Math.min(1, freeS * 1.4) : 0,
                  transform: `translateY(${((1 - freeS) * 12).toFixed(1)}px)`,
                  border: '2px solid #6EC6E8',
                  background: '#16222B',
                  padding: '12px 14px',
                  fontSize: 12,
                  color: '#6EC6E8',
                }}
              >
                &gt; MEDIA SOSIAL — BEBAS TOTAL
              </div>
            </PixelCard>
          </SlideIn>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
