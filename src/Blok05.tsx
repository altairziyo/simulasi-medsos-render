import React from 'react';
import { Easing, interpolate } from 'remotion';
import { CARDS } from './cardsData';
import {
  Cam,
  CardImg,
  H,
  HALF,
  Half,
  Portrait,
  Sprite,
  Walker,
  cam,
  fadeIn,
} from './common';
import { DesaMap, KamarScene, LapanganScene } from './scenes';

export interface Blok05Props {
  f: number;
}

const POP_EASE = Easing.bezier(0.22, 1.25, 0.36, 1);

function popScale(f: number, f0: number, duration = 16): number {
  return interpolate(f, [f0, f0 + duration], [0.8, 1], {
    easing: POP_EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function modPos(v: number, m: number): number {
  return ((v % m) + m) % m;
}

const PopCard: React.FC<{
  name: string;
  x: number;
  y: number;
  f: number;
  f0: number;
  scale?: number;
  z?: number;
}> = ({ name, x, y, f, f0, scale = 1, z = 62 }) => {
  const dims = CARDS[name];
  if (!dims) {
    return null;
  }
  const op = fadeIn(f, f0, 14);
  if (op <= 0.005) {
    return null;
  }
  const s = popScale(f, f0, 16) * scale;
  const fullW = dims[0] * scale;
  const fullH = dims[1] * scale;
  const w = dims[0] * s;
  const h = dims[1] * s;
  const cx = x + fullW / 2;
  const cy = y + fullH / 2;
  return (
    <CardImg
      name={name}
      x={cx - w / 2}
      y={cy - h / 2}
      scale={s}
      opacity={op}
      z={z}
    />
  );
};

interface GoldenWindowSpec {
  baseX: number;
  baseY: number;
  w: number;
  h: number;
  accent: string;
  phase: number;
  ampY: number;
}

const GOLDEN_WINDOWS: ReadonlyArray<GoldenWindowSpec> = [
  { baseX: 42, baseY: 168, w: 74, h: 52, accent: '#ffd98a', phase: 0.2, ampY: 7 },
  { baseX: 486, baseY: 152, w: 82, h: 56, accent: '#ffe7a8', phase: 1.5, ampY: 8 },
  { baseX: 54, baseY: 274, w: 68, h: 48, accent: '#ffc966', phase: 2.8, ampY: 6 },
  { baseX: 498, baseY: 268, w: 76, h: 52, accent: '#ffd98a', phase: 4.1, ampY: 7 },
  { baseX: 446, baseY: 368, w: 64, h: 44, accent: '#ffe49e', phase: 5.2, ampY: 5 },
];

// Deretan tinggi blok ECG / garis detak cemas di dada potret kanan
const HEARTBEAT_BARS: ReadonlyArray<number> = [
  4, 4, 6, 4, 16, 26, 8, 4, 12, 4, 4, 6, 4, 18, 28, 8, 4,
];

const VoliDanKamarScene: React.FC<{
  f: number;
  showStudyCard: boolean;
}> = ({ f, showStudyCard }) => {
  // Zoom-in sangat lambat kontinu sepanjang B18 dan B19 (0..1019)
  const leftScale = cam(f, 0, 1019, 1.0, 1.07);
  const leftTy = cam(f, 0, 1019, 0, -10);
  const rightScale = cam(f, 0, 1019, 1.0, 1.09);
  const rightTy = cam(f, 0, 1019, 0, 12);

  // Gerak lompat & bola voli kontinu di sisi kiri
  const volleyCycle = modPos(f * 0.028, 1);
  const nadiaJump = -Math.pow(Math.sin(volleyCycle * Math.PI), 2) * 18;
  const ballX = interpolate(volleyCycle, [0, 0.5, 1], [190, 424, 190]);
  const ballY = 236 - Math.sin(volleyCycle * Math.PI * 2) * 32 - Math.sin(volleyCycle * Math.PI) * 28;
  const teammateBobA = Math.sin(f * 0.09) * 3;
  const teammateBobB = Math.sin(f * 0.09 + 2.1) * 3;

  // Pendar biru dingin ponsel + denyut detak cemas di sisi kanan
  const screenPulse = 0.78 + 0.22 * Math.sin(f * 0.08);
  const beatSweep = modPos(f * 0.22, HEARTBEAT_BARS.length);
  const studyOp = showStudyCard ? fadeIn(f, 444, 18) : 0;

  return (
    <>
      {/* KIRI: Lapangan voli senja keemasan */}
      <Half side={0}>
        <Cam scale={leftScale} ty={leftTy}>
          <LapanganScene f={f} side={0} />

          {/* Overlay senja keemasan hangat */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: 310,
              backgroundColor: '#e89d58',
              opacity: 0.42,
              zIndex: 11,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              backgroundColor: '#f2b866',
              opacity: 0.22,
              zIndex: 12,
              pointerEvents: 'none',
            }}
          />
          {/* Matahari sore keemasan rendah */}
          <div
            style={{
              position: 'absolute',
              left: 468,
              top: 162,
              width: 68,
              height: 68,
              borderRadius: 34,
              backgroundColor: '#ffe3a3',
              opacity: 0.85,
              zIndex: 12,
              pointerEvents: 'none',
            }}
          />

          {/* Rekan tim voli di sisi lapangan */}
          <Sprite
            name="remaja_b_walk_0"
            x={72}
            y={428 + teammateBobA}
            w={78}
            h={136}
            z={16}
          />
          <Sprite
            name="warga_b_walk_0"
            x={476}
            y={422 + teammateBobB}
            w={78}
            h={136}
            flip
            z={16}
          />

          {/* Potret Nadia (20) kapten tim voli */}
          <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 18 }}>
            <Portrait
              name="nadia_muda_kiri_portrait_happy"
              x={214}
              y={268 + nadiaJump}
              w={210}
              h={262}
            />
          </div>

          {/* Bola voli melambung di atas lapangan */}
          <Sprite
            name="prop_bola_voli"
            x={ballX}
            y={ballY}
            w={54}
            h={54}
            z={20}
          />
        </Cam>
      </Half>

      {/* KANAN: Kamar malam Nadia diterangi layar biru dingin */}
      <Half side={1}>
        <Cam scale={rightScale} ty={rightTy}>
          <KamarScene f={f} side={1} />

          {/* Jam dinding lewat tengah malam (blok pixel tanpa teks DOM) */}
          <div
            style={{
              position: 'absolute',
              left: 470,
              top: 108,
              width: 44,
              height: 44,
              borderRadius: 22,
              backgroundColor: '#d9e3f0',
              border: '4px solid #3c4d6e',
              zIndex: 12,
              boxSizing: 'border-box',
            }}
          >
            {/* Jarum jam ~01:15 */}
            <div
              style={{
                position: 'absolute',
                left: 17,
                top: 8,
                width: 3,
                height: 12,
                backgroundColor: '#1a2338',
                transform: 'rotate(24deg)',
                transformOrigin: '50% 100%',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 18,
                top: 17,
                width: 11,
                height: 3,
                backgroundColor: '#1a2338',
              }}
            />
          </div>

          {/* Potret Nadia (20) cemas di bagian atas-tengah agar tidak tertutup kartu B19 */}
          <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 15 }}>
            <Portrait
              name="nadia_muda_kanan_portrait_worried"
              x={216}
              y={170}
              w={210}
              h={262}
            />
          </div>

          {/* Overlay cahaya biru dingin dari layar ke wajah potret */}
          <div
            style={{
              position: 'absolute',
              left: 162,
              top: 152,
              width: 316,
              height: 292,
              borderRadius: 150,
              backgroundColor: '#35c4e8',
              opacity: 0.18 * screenPulse,
              zIndex: 16,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              backgroundColor: '#1f4c7a',
              opacity: 0.14 * screenPulse,
              zIndex: 17,
              pointerEvents: 'none',
            }}
          />

          {/* Ponsel dengan feed vertikal menyala */}
          <div
            style={{
              position: 'absolute',
              left: 132,
              top: 300,
              width: 82,
              height: 108,
              borderRadius: 42,
              backgroundColor: '#7be3ff',
              opacity: 0.28 * screenPulse,
              zIndex: 17,
              pointerEvents: 'none',
            }}
          />
          <Sprite
            name="prop_ponsel_feed"
            x={146}
            y={316}
            w={54}
            h={84}
            z={18}
          />

          {/* Jendela kecil kehidupan orang lain: kotak blok keemasan melayang */}
          {GOLDEN_WINDOWS.map((win, idx) => {
            const floatY = Math.sin(f * 0.045 + win.phase) * win.ampY;
            const winOp = fadeIn(f, 18 + idx * 14, 18) * (0.78 + 0.18 * Math.sin(f * 0.06 + win.phase));
            return (
              <div
                key={`gwin-${idx}`}
                style={{
                  position: 'absolute',
                  left: win.baseX,
                  top: win.baseY + floatY,
                  width: win.w,
                  height: win.h,
                  backgroundColor: '#2c2419',
                  border: `3px solid ${win.accent}`,
                  opacity: winOp,
                  zIndex: 19,
                  boxSizing: 'border-box',
                }}
              >
                {/* Isi kilau keemasan abstrak di dalam jendela kecil */}
                <div
                  style={{
                    position: 'absolute',
                    left: 5,
                    top: 5,
                    width: win.w - 16,
                    height: Math.round(win.h * 0.48),
                    backgroundColor: win.accent,
                    opacity: 0.88,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    left: 5,
                    bottom: 6,
                    width: Math.round((win.w - 16) * 0.65),
                    height: 5,
                    backgroundColor: '#fff4cf',
                    opacity: 0.8,
                  }}
                />
              </div>
            );
          })}

          {/* Garis detak: deretan blok kecil merah muda berdenyut dekat dada potret */}
          <div
            style={{
              position: 'absolute',
              left: 254,
              top: 374,
              width: 136,
              height: 34,
              zIndex: 20,
              pointerEvents: 'none',
            }}
          >
            {HEARTBEAT_BARS.map((barH, idx) => {
              const dist = Math.abs(idx - beatSweep);
              const wrapDist = Math.min(dist, HEARTBEAT_BARS.length - dist);
              const glow = Math.max(0.28, 1 - wrapDist * 0.24);
              const pulseH = barH * (0.85 + 0.35 * glow);
              return (
                <div
                  key={`hb-${idx}`}
                  style={{
                    position: 'absolute',
                    left: idx * 8,
                    top: 17 - pulseH / 2,
                    width: 5,
                    height: pulseH,
                    backgroundColor: glow > 0.7 ? '#ff8ac8' : '#f05ab4',
                    opacity: glow,
                  }}
                />
              );
            })}
          </div>
        </Cam>

        {/* B19 saja: Kartu Studi Facebook di sisi KANAN bawah (x ~ 60, y 470, tidak menutupi wajah) */}
        {showStudyCard && studyOp > 0.005 ? (
          <CardImg
            name="studi_facebook"
            x={60}
            y={476}
            scale={0.88}
            opacity={studyOp}
            z={62}
          />
        ) : null}
      </Half>
    </>
  );
};

export const Blok05: React.FC<Blok05Props> = ({ f }) => {
  // Rentang lokal Blok05 (total 1724):
  // B18: 0..436, B19: 436..1019, B20: 1019..1257, B21: 1257..1724

  // --- B18: Perbandingan sosial (voli senja kiri vs kamar malam biru kanan) ---
  if (f < 436) {
    return <VoliDanKamarScene f={f} showStudyCard={false} />;
  }

  // --- B19: Adegan B18 berlanjut + kartu studi_facebook di kanan ---
  if (f < 1019) {
    return <VoliDanKamarScene f={f} showStudyCard={true} />;
  }

  // --- B20: Nadia istirahat lalu transisi DesaMap era 2 jalan; pull-back lembut ---
  if (f < 1257) {
    const pullScale = cam(f, 1019, 1257, 1.12, 1.02);
    // Crossfade kiri: 1019..1105 Nadia istirahat di lapangan -> 1105..1148 DesaMap era 2 jalan
    const mapReveal = cam(f, 1105, 1148, 0, 1);
    const restOp = 1 - mapReveal;
    const greetOp = fadeIn(f, 1154, 18) * (0.78 + 0.22 * Math.sin(f * 0.08));

    return (
      <>
        <Half side={0}>
          <Cam scale={pullScale}>
            {/* Bagian awal B20 kiri: Nadia duduk istirahat menatap cakrawala */}
            {restOp > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: HALF,
                  height: H,
                  opacity: restOp,
                  zIndex: 2,
                }}
              >
                <LapanganScene f={f} side={0} />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: HALF,
                    height: H,
                    backgroundColor: '#e8a25d',
                    opacity: 0.24,
                    zIndex: 11,
                    pointerEvents: 'none',
                  }}
                />
                <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
                  <Portrait
                    name="nadia_muda_kiri_portrait_neutral"
                    x={216}
                    y={324}
                    w={210}
                    h={262}
                  />
                </div>
                <Sprite
                  name="prop_bola_voli"
                  x={152}
                  y={522}
                  w={48}
                  h={48}
                  z={15}
                />
              </div>
            ) : null}

            {/* Transisi ke DesaMap era 2 jalan: warga tegak saling sapa */}
            {mapReveal > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: HALF,
                  height: H,
                  opacity: mapReveal,
                  zIndex: 4,
                }}
              >
                <DesaMap f={f} side={0} era={2} senja={0.28} />
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: HALF,
                    height: H,
                    zIndex: 25,
                  }}
                >
                  <Walker
                    name="warga_a_walk"
                    side={0}
                    y={496}
                    seed={4}
                    speed={0.55}
                    scale={0.62}
                    f={f}
                  />
                  <Walker
                    name="warga_b_walk"
                    side={0}
                    y={500}
                    seed={19}
                    speed={-0.52}
                    scale={0.62}
                    f={f}
                  />
                  {/* Gelembung sapaan hangat warga */}
                  {greetOp > 0.005 ? (
                    <Sprite
                      name="prop_gelembung"
                      x={286}
                      y={462}
                      w={44}
                      h={34}
                      opacity={greetOp}
                      z={26}
                    />
                  ) : null}
                </div>
              </div>
            ) : null}
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={pullScale}>
            <DesaMap f={f} side={1} era={2} senja={0.28} />
            {/* Warga menunduk menatap layar ponsel */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: HALF,
                height: H,
                zIndex: 25,
              }}
            >
              <Walker
                name="warga_hp_a_walk"
                side={1}
                y={496}
                seed={7}
                speed={0.44}
                scale={0.62}
                f={f}
              />
              <Walker
                name="warga_hp_b_walk"
                side={1}
                y={500}
                seed={23}
                speed={-0.42}
                scale={0.62}
                f={f}
              />
            </div>
          </Cam>
        </Half>
      </>
    );
  }

  // --- B21: Skor Tahun 6 (persilangan 50 vs 48) di atas latar jalan desa ---
  const settleScale = cam(f, 1257, 1340, 1.02, 1.0);
  const veilOp = cam(f, 1257, 1282, 0, 0.24);

  return (
    <>
      <Half side={0}>
        <Cam scale={settleScale}>
          <DesaMap f={f} side={0} era={2} senja={0.28} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              zIndex: 25,
            }}
          >
            <Walker
              name="warga_a_walk"
              side={0}
              y={496}
              seed={4}
              speed={0.55}
              scale={0.62}
              f={f}
            />
            <Walker
              name="warga_b_walk"
              side={0}
              y={500}
              seed={19}
              speed={-0.52}
              scale={0.62}
              f={f}
            />
          </div>
        </Cam>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            backgroundColor: '#0b1018',
            opacity: veilOp,
            zIndex: 45,
            pointerEvents: 'none',
          }}
        />
        <PopCard name="skor_t6_kiri" x={90} y={236} f={f} f0={1269} z={62} />
      </Half>

      <Half side={1}>
        <Cam scale={settleScale}>
          <DesaMap f={f} side={1} era={2} senja={0.28} />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              zIndex: 25,
            }}
          >
            <Walker
              name="warga_hp_a_walk"
              side={1}
              y={496}
              seed={7}
              speed={0.44}
              scale={0.62}
              f={f}
            />
            <Walker
              name="warga_hp_b_walk"
              side={1}
              y={500}
              seed={23}
              speed={-0.42}
              scale={0.62}
              f={f}
            />
          </div>
        </Cam>
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            backgroundColor: '#0b1018',
            opacity: veilOp,
            zIndex: 45,
            pointerEvents: 'none',
          }}
        />
        <PopCard name="skor_t6_kanan" x={90} y={247} f={f} f0={1279} z={62} />
      </Half>
    </>
  );
};
