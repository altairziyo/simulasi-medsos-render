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
  cam,
  fadeIn,
} from './common';
import { DesaMap, Era, KelasScene } from './scenes';

export interface Blok14Props {
  f: number;
}

const POP_EASE = Easing.bezier(0.22, 1.25, 0.36, 1);

function popScale(f: number, f0: number, duration = 16): number {
  return interpolate(f, [f0, f0 + duration], [0.82, 1], {
    easing: POP_EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
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

interface FreshStudentSlot {
  x: number;
  y: number;
  size: number;
  variant: 'a' | 'b';
  hasBubble?: boolean;
}

const FRESH_STUDENTS: ReadonlyArray<FreshStudentSlot> = [
  { x: 82, y: 392, size: 106, variant: 'a', hasBubble: true },
  { x: 260, y: 392, size: 106, variant: 'b' },
  { x: 438, y: 392, size: 106, variant: 'a', hasBubble: true },
  { x: 86, y: 492, size: 114, variant: 'b' },
  { x: 264, y: 492, size: 114, variant: 'a', hasBubble: true },
  { x: 442, y: 492, size: 114, variant: 'b' },
];

// Lapisan sisi kiri terkunci stabil (DesaMap era 5 + bingkai halus + kartu_tetap tanpa angka)
const LockedLeftSide: React.FC<{
  f: number;
  scale: number;
  showCardFrom: number;
}> = ({ f, scale, showCardFrom }) => {
  return (
    <Half side={0}>
      <Cam scale={scale}>
        <DesaMap f={f} side={0} era={5} />
      </Cam>
      {/* Bingkai terkunci halus sisi kiri */}
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 76,
          width: HALF - 16,
          height: H - 84,
          border: '3px solid rgba(88, 160, 90, 0.65)',
          boxSizing: 'border-box',
          pointerEvents: 'none',
          zIndex: 40,
        }}
      />
      {/* kartu_tetap di kiri atas area sisi (TANPA angka) */}
      <PopCard
        name="kartu_tetap"
        x={22}
        y={88}
        f={f}
        f0={showCardFrom}
        scale={0.82}
        z={55}
      />
    </Half>
  );
};

// Sisi kanan kilas cepat 20 tahun pada B51 (292..732)
const RightRerunFlash: React.FC<{ f: number }> = ({ f }) => {
  // 5 sub-rentang x 88 frame:
  // 0: 292..380 -> DesaMap era 1 + Nadia remaja (main fisik/voli)
  // 1: 380..468 -> KelasScene segar (Bu Ratna happy + murid aktif)
  // 2: 468..556 -> DesaMap era 2 + Nadia muda (terjun konten dewasa)
  // 3: 556..644 -> DesaMap era 3 + Nadia dewasa (studio & ekonomi konten)
  // 4: 644..732 -> DesaMap era 4 + Nadia dewasa + icon_koin
  const subIdx = Math.min(4, Math.max(0, Math.floor((f - 292) / 88)));
  const subStart = 292 + subIdx * 88;
  const subEnd = subStart + 88;

  const cutFade = fadeIn(f, subStart, 10);
  const subScale = cam(f, subStart, subEnd, 1.0, 1.07);
  const portraitOp = fadeIn(f, subStart + 8, 12);
  const iconBob = Math.sin(f * 0.12) * 3;

  const renderContent = (): React.ReactNode => {
    if (subIdx === 0) {
      return (
        <>
          <DesaMap f={f} side={1} era={1} />
          <div
            style={{
              position: 'absolute',
              left: 398,
              top: 410,
              width: 210,
              height: 254,
              backgroundColor: 'rgba(20, 32, 52, 0.88)',
              border: '4px solid #35c4e8',
              boxSizing: 'border-box',
              opacity: portraitOp,
              zIndex: 35,
            }}
          >
            <Portrait
              name="nadia_remaja_kanan_portrait_happy"
              x={15}
              y={12}
              w={172}
              h={215}
            />
            <Sprite
              name="prop_bola_voli"
              x={146}
              y={178 + iconBob}
              w={44}
              h={44}
              z={4}
            />
          </div>
        </>
      );
    }

    if (subIdx === 1) {
      return (
        <>
          <KelasScene f={f} side={1} />
          <Portrait
            name="ratna_muda_portrait_happy"
            x={236}
            y={142}
            w={168}
            h={210}
          />
          {FRESH_STUDENTS.map((slot, idx) => {
            const spriteName =
              slot.variant === 'a' ? 'murid_aktif_a' : 'murid_aktif_b';
            const bob = Math.sin(f * 0.12 + idx * 1.3) * 2.5;
            return (
              <React.Fragment key={`fs-${idx}`}>
                <Sprite
                  name={spriteName}
                  x={slot.x}
                  y={slot.y + bob}
                  w={slot.size}
                  h={slot.size}
                  z={idx < 3 ? 12 : 16}
                />
                {slot.hasBubble ? (
                  <Sprite
                    name="prop_gelembung"
                    x={slot.x + slot.size - 24}
                    y={slot.y - 24 + bob}
                    w={44}
                    h={34}
                    opacity={0.92}
                    z={18}
                  />
                ) : null}
              </React.Fragment>
            );
          })}
        </>
      );
    }

    if (subIdx === 2) {
      return (
        <>
          <DesaMap f={f} side={1} era={2} />
          <div
            style={{
              position: 'absolute',
              left: 398,
              top: 410,
              width: 210,
              height: 254,
              backgroundColor: 'rgba(20, 32, 52, 0.88)',
              border: '4px solid #35c4e8',
              boxSizing: 'border-box',
              opacity: portraitOp,
              zIndex: 35,
            }}
          >
            <Portrait
              name="nadia_muda_kanan_portrait_neutral"
              x={15}
              y={12}
              w={172}
              h={215}
            />
            <Sprite
              name="prop_tripod"
              x={152}
              y={162}
              w={38}
              h={58}
              z={4}
            />
          </div>
        </>
      );
    }

    if (subIdx === 3) {
      return (
        <>
          <DesaMap f={f} side={1} era={3} />
          <div
            style={{
              position: 'absolute',
              left: 398,
              top: 410,
              width: 210,
              height: 254,
              backgroundColor: 'rgba(20, 32, 52, 0.88)',
              border: '4px solid #f05ab4',
              boxSizing: 'border-box',
              opacity: portraitOp,
              zIndex: 35,
            }}
          >
            <Portrait
              name="nadia_dewasa_kanan_portrait_calm"
              x={15}
              y={12}
              w={172}
              h={215}
            />
            <Sprite
              name="prop_ringlight"
              x={146}
              y={152}
              w={44}
              h={58}
              z={4}
            />
          </div>
        </>
      );
    }

    return (
      <>
        <DesaMap f={f} side={1} era={4} />
        <div
          style={{
            position: 'absolute',
            left: 398,
            top: 410,
            width: 210,
            height: 254,
            backgroundColor: 'rgba(20, 32, 52, 0.88)',
            border: '4px solid #35c4e8',
            boxSizing: 'border-box',
            opacity: portraitOp,
            zIndex: 35,
          }}
        >
          <Portrait
            name="nadia_dewasa_kanan_portrait_calm"
            x={15}
            y={12}
            w={172}
            h={215}
          />
          <Sprite
            name="icon_koin"
            x={144}
            y={168 + iconBob}
            w={46}
            h={46}
            z={4}
          />
        </div>
      </>
    );
  };

  return (
    <Half side={1}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          backgroundColor: '#101828',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          opacity: cutFade,
        }}
      >
        <Cam scale={subScale}>{renderContent()}</Cam>
      </div>
      {/* Lencana aturan baru tetap tampil kecil di atas kanan */}
      <CardImg
        name="kartu_16plus"
        x={124}
        y={84}
        scale={0.75}
        opacity={0.95}
        z={55}
      />
    </Half>
  );
};

export const Blok14: React.FC<Blok14Props> = ({ f }) => {
  // Rentang lokal Blok14 (Eksperimen Balik, total 1345):
  // B50: 0..292, B51: 292..732, B52: 732..1345

  // --- B50: Eksperimen balik (kiri era 5 stabil + kartu_tetap; kanan rewind era 5->0 + icon_rewind + kartu_16plus) ---
  if (f < 292) {
    const leftScale = cam(f, 0, 292, 1.0, 1.02);
    const rightScale =
      f < 210
        ? cam(f, 0, 210, 1.0, 1.08)
        : cam(f, 210, 292, 1.08, 1.03);

    // Era berubah mundur 5 -> 4 -> 3 -> 2 -> 1 -> 0 memakai ambang f
    let rightEra: Era = 0;
    if (f < 42) {
      rightEra = 5;
    } else if (f < 84) {
      rightEra = 4;
    } else if (f < 126) {
      rightEra = 3;
    } else if (f < 168) {
      rightEra = 2;
    } else if (f < 210) {
      rightEra = 1;
    } else {
      rightEra = 0;
    }

    const rewindIn = fadeIn(f, 6, 12);
    const rewindOut = cam(f, 200, 224, 1, 0);
    const rewindOp = rewindIn * rewindOut;
    const rewindPulse = 0.82 + 0.18 * Math.sin(f * 0.25);

    return (
      <>
        <LockedLeftSide f={f} scale={leftScale} showCardFrom={14} />

        <Half side={1}>
          <Cam scale={rightScale}>
            <DesaMap f={f} side={1} era={rightEra} />
          </Cam>

          {/* Overlay cyan tipis saat rewind berlangsung */}
          {rewindOp > 0.005 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: HALF,
                height: H,
                backgroundColor: '#122842',
                opacity: 0.22 * rewindOp,
                zIndex: 42,
                pointerEvents: 'none',
              }}
            />
          ) : null}

          {/* Sprite icon_rewind besar (tanpa rotasi di Sprite) */}
          {rewindOp > 0.005 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 224,
                  top: 234,
                  width: 192,
                  height: 192,
                  borderRadius: '50%',
                  backgroundColor: '#35c4e8',
                  opacity: 0.22 * rewindOp * rewindPulse,
                  zIndex: 48,
                  pointerEvents: 'none',
                }}
              />
              <Sprite
                name="icon_rewind"
                x={250}
                y={260}
                w={140}
                h={140}
                opacity={rewindOp * rewindPulse}
                z={50}
              />
            </>
          ) : null}

          {/* Kartu aturan baru MEDSOS 16+ SAJA muncul pop */}
          <PopCard name="kartu_16plus" x={60} y={292} f={f} f0={186} z={62} />
        </Half>
      </>
    );
  }

  // --- B51: Hasil rerun (kiri tetap stabil; kanan kilas cepat era 1->4 + KelasScene segar + Nadia remaja->dewasa) ---
  if (f < 732) {
    const leftScale = cam(f, 292, 732, 1.02, 1.0);
    return (
      <>
        <LockedLeftSide f={f} scale={leftScale} showCardFrom={0} />
        <RightRerunFlash f={f} />
      </>
    );
  }

  // --- B52: Skor rerun (dua sisi stabil + skor_rerun_kiri & skor_rerun_kanan pop — checkpoint skor resmi) ---
  const stableScale = cam(f, 732, 1345, 1.03, 1.0);
  const veilOp = cam(f, 732, 758, 0, 0.28);

  return (
    <>
      <Half side={0}>
        <Cam scale={stableScale}>
          <DesaMap f={f} side={0} era={5} />
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
        <PopCard name="skor_rerun_kiri" x={90} y={254} f={f} f0={746} z={62} />
      </Half>

      <Half side={1}>
        <Cam scale={stableScale}>
          <DesaMap f={f} side={1} era={5} />
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
        <PopCard name="skor_rerun_kanan" x={90} y={254} f={f} f0={760} z={62} />
      </Half>
    </>
  );
};
