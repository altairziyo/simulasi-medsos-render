import React from 'react';
import { interpolate } from 'remotion';
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
import { BalaiScene, FestivalScene, TerasScene } from './scenes';

export interface Blok11Props {
  f: number;
}

function modPos(v: number, m: number): number {
  return ((v % m) + m) % m;
}

const DIALOG3_CARDS: ReadonlyArray<string> = ['d3_1', 'd3_2', 'd3_3'];

interface CrowdSeatSpec {
  sprite: string;
  x: number;
  y: number;
  w: number;
  h: number;
  flip?: boolean;
  phase: number;
  z: number;
}

// Warga berderet memenuhi dua baris bangku di dalam BalaiScene (B40 & B41)
const BALAI_CROWD: ReadonlyArray<CrowdSeatSpec> = [
  // Baris bangku depan (belakang meja/bangku baris 1, y ~ 452)
  { sprite: 'warga_a_walk_0', x: 52, y: 454, w: 56, h: 91, phase: 0.2, z: 6 },
  { sprite: 'warga_b_walk_0', x: 112, y: 456, w: 56, h: 91, phase: 1.1, z: 6 },
  { sprite: 'remaja_a_walk_0', x: 170, y: 458, w: 54, h: 88, phase: 2.0, z: 6 },
  { sprite: 'warga_c_walk_0', x: 226, y: 454, w: 56, h: 91, phase: 2.8, z: 6 },
  { sprite: 'warga_d_walk_0', x: 360, y: 454, w: 56, h: 91, flip: true, phase: 0.7, z: 6 },
  { sprite: 'remaja_b_walk_0', x: 418, y: 458, w: 54, h: 88, flip: true, phase: 1.6, z: 6 },
  { sprite: 'warga_a_walk_0', x: 474, y: 456, w: 56, h: 91, flip: true, phase: 2.5, z: 6 },
  { sprite: 'warga_b_walk_0', x: 532, y: 454, w: 56, h: 91, flip: true, phase: 3.4, z: 6 },
  // Baris bangku belakang (y ~ 538)
  { sprite: 'warga_c_walk_0', x: 48, y: 540, w: 62, h: 100, phase: 0.9, z: 8 },
  { sprite: 'warga_d_walk_0', x: 114, y: 542, w: 62, h: 100, phase: 1.9, z: 8 },
  { sprite: 'warga_a_walk_0', x: 178, y: 540, w: 62, h: 100, phase: 2.9, z: 8 },
  { sprite: 'warga_b_walk_0', x: 236, y: 544, w: 60, h: 98, phase: 3.8, z: 8 },
  { sprite: 'warga_b_walk_0', x: 356, y: 542, w: 62, h: 100, flip: true, phase: 0.4, z: 8 },
  { sprite: 'warga_c_walk_0', x: 420, y: 540, w: 62, h: 100, flip: true, phase: 1.4, z: 8 },
  { sprite: 'warga_d_walk_0', x: 484, y: 542, w: 62, h: 100, flip: true, phase: 2.4, z: 8 },
  { sprite: 'warga_a_walk_0', x: 546, y: 540, w: 62, h: 100, flip: true, phase: 3.3, z: 8 },
];

interface RaisedPhoneSpec {
  x: number;
  y: number;
  w: number;
  h: number;
  phase: number;
  z: number;
}

// Banyak prop_ponsel_feed kecil terangkat di kerumunan festival kanan (B42)
const FESTIVAL_PHONES: ReadonlyArray<RaisedPhoneSpec> = [
  { x: 44, y: 546, w: 20, h: 31, phase: 0.2, z: 12 },
  { x: 96, y: 526, w: 18, h: 28, phase: 1.1, z: 12 },
  { x: 146, y: 554, w: 22, h: 34, phase: 2.0, z: 13 },
  { x: 194, y: 534, w: 20, h: 31, phase: 2.8, z: 12 },
  { x: 238, y: 518, w: 18, h: 28, phase: 0.6, z: 12 },
  { x: 274, y: 550, w: 22, h: 34, phase: 1.7, z: 13 },
  { x: 316, y: 528, w: 20, h: 31, phase: 2.5, z: 12 },
  { x: 356, y: 548, w: 22, h: 34, phase: 3.3, z: 13 },
  { x: 396, y: 522, w: 18, h: 28, phase: 0.9, z: 12 },
  { x: 438, y: 542, w: 20, h: 31, phase: 1.9, z: 13 },
  { x: 492, y: 526, w: 18, h: 28, phase: 2.7, z: 12 },
  { x: 544, y: 552, w: 22, h: 34, phase: 3.6, z: 13 },
  { x: 586, y: 536, w: 20, h: 31, phase: 1.4, z: 12 },
];

interface FloatingHeartSpec {
  x: number;
  baseY: number;
  w: number;
  h: number;
  delay: number;
  offset: number;
  speed: number;
}

// icon_hati melayang fadeIn berjenjang di atas kerumunan festival kanan (B42)
const FESTIVAL_HEARTS: ReadonlyArray<FloatingHeartSpec> = [
  { x: 68, baseY: 512, w: 24, h: 22, delay: 14, offset: 0.0, speed: 0.0085 },
  { x: 138, baseY: 498, w: 28, h: 26, delay: 32, offset: 0.18, speed: 0.0078 },
  { x: 210, baseY: 506, w: 24, h: 22, delay: 50, offset: 0.35, speed: 0.009 },
  { x: 266, baseY: 490, w: 30, h: 28, delay: 68, offset: 0.52, speed: 0.0075 },
  { x: 322, baseY: 502, w: 26, h: 24, delay: 86, offset: 0.68, speed: 0.0082 },
  { x: 382, baseY: 492, w: 28, h: 26, delay: 104, offset: 0.84, speed: 0.0088 },
  { x: 444, baseY: 508, w: 24, h: 22, delay: 122, offset: 0.12, speed: 0.008 },
  { x: 514, baseY: 496, w: 28, h: 26, delay: 140, offset: 0.44, speed: 0.0086 },
  { x: 568, baseY: 514, w: 24, h: 22, delay: 158, offset: 0.74, speed: 0.0076 },
  { x: 294, baseY: 468, w: 26, h: 24, delay: 180, offset: 0.28, speed: 0.0092 },
];

// Lapisan balai penuh warga + Wiryo & Nadia di podium (dipakai B40, B41, dan transisi awal B42)
const LeftBalaiDialogLayer: React.FC<{
  f: number;
  wiryoPortrait: string;
  nadiaPortrait: string;
  wiryoX: number;
  nadiaX: number;
  hugGlow: number;
}> = ({ f, wiryoPortrait, nadiaPortrait, wiryoX, nadiaX, hugGlow }) => {
  return (
    <>
      <BalaiScene f={f} side={0} />

      {/* Pendar hangat di belakang Wiryo & Nadia saat momen pelukan */}
      {hugGlow > 0.005 ? (
        <div
          style={{
            position: 'absolute',
            left: 196,
            top: 156,
            width: 248,
            height: 248,
            borderRadius: '50%',
            backgroundColor: '#ffd98a',
            opacity: 0.24 * hugGlow,
            zIndex: 10,
            pointerEvents: 'none',
          }}
        />
      ) : null}

      {/* Portrait Pak Wiryo (76) di podium + Nadia (33) di sebelahnya */}
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 12 }}>
        <Portrait
          name={wiryoPortrait}
          x={wiryoX}
          y={186}
          w={196}
          h={245}
        />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 13 }}>
        <Portrait
          name={nadiaPortrait}
          x={nadiaX}
          y={192}
          w={196}
          h={245}
        />
      </div>

      {/* Hati kecil lembut melayang saat pelukan hangat */}
      {hugGlow > 0.05 ? (
        <Sprite
          name="icon_hati"
          x={305}
          y={156 - hugGlow * 14 + Math.sin(f * 0.09) * 3}
          w={30}
          h={28}
          opacity={0.85 * hugGlow}
          z={15}
        />
      ) : null}

      {/* Bibir podium depan tipis agar Pak Wiryo tampak berdiri tepat di balik podium */}
      <div
        style={{
          position: 'absolute',
          left: 256,
          top: 398,
          width: 128,
          height: 16,
          backgroundColor: '#8f5f3a',
          border: '3px solid #593920',
          boxSizing: 'border-box',
          zIndex: 14,
          opacity: 1 - hugGlow * 0.65,
        }}
      />

      {/* Warga berderet memenuhi bangku-bangku balai */}
      {BALAI_CROWD.map((cit, idx) => {
        const bob = Math.sin(f * 0.055 + cit.phase) * 1.6;
        return (
          <Sprite
            key={`bc-${idx}`}
            name={cit.sprite}
            x={cit.x}
            y={cit.y + bob}
            w={cit.w}
            h={cit.h}
            flip={cit.flip}
            z={cit.z + 10}
          />
        );
      })}
    </>
  );
};

// Lapisan kanan B40 & B41: TerasScene sore + Wiryo warga duduk di beranda + aktivitas ambient pelan
const RightTerasWiryoLayer: React.FC<{ f: number }> = ({ f }) => {
  const calmBob = Math.sin(f * 0.045) * 1.4;
  return (
    <>
      <TerasScene f={f} side={1} />

      {/* Pak Wiryo versi warga biasa duduk tenang di bangku beranda sore */}
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 11 }}>
        <Portrait
          name="wiryo_warga_portrait_neutral"
          x={314}
          y={278 + calmBob}
          w={192}
          h={240}
        />
      </div>

      {/* Cangkir teh hangat di samping bangku beranda */}
      <Sprite
        name="prop_cangkir"
        x={478}
        y={476}
        w={32}
        h={28}
        z={12}
      />

      {/* Warga ambient melintas pelan agar sisi redup tetap hidup */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          zIndex: 14,
          opacity: 0.78,
        }}
      >
        <Walker
          name="warga_hp_a_walk"
          side={1}
          y={576}
          seed={19}
          speed={0.3}
          scale={0.92}
          f={f}
        />
        <Walker
          name="warga_c_walk"
          side={1}
          y={594}
          seed={53}
          speed={-0.24}
          scale={0.86}
          f={f}
        />
      </div>
    </>
  );
};

export const Blok11: React.FC<Blok11Props> = ({ f }) => {
  // Rentang lokal Blok11 (Dialog 3, total 1377):
  // B40: 0..325, B41: 325..718, B42: 718..1377

  // --- B40: Wiryo mengaku (kiri fokus BalaiScene penuh warga + Wiryo & Nadia di podium; kanan dim 0.3 TerasScene sore) ---
  if (f < 325) {
    const leftScale = cam(f, 0, 325, 1.0, 1.08);
    const leftTy = cam(f, 0, 325, 0, 14);
    const rightScale = cam(f, 0, 325, 1.0, 1.03);

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale} ty={leftTy}>
            <LeftBalaiDialogLayer
              f={f}
              wiryoPortrait="wiryo_tua_portrait_neutral"
              nadiaPortrait="nadia_dewasa_kiri_portrait_neutral"
              wiryoX={148}
              nadiaX={344}
              hugGlow={0}
            />
          </Cam>
        </Half>

        <Half side={1} dim={0.3}>
          <Cam scale={rightScale}>
            <RightTerasWiryoLayer f={f} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B41: Dialog pengakuan (d3_1..d3_3 bergantian di kiri bawah + momen pelukan kontinu; kanan dim hidup pelan) ---
  if (f < 718) {
    const leftScale = cam(f, 325, 718, 1.08, 1.15);
    const leftTy = cam(f, 325, 718, 14, 24);
    const rightScale = cam(f, 325, 718, 1.03, 1.06);
    const rightDim = cam(f, 325, 360, 0.3, 0.35);

    // Sub-rentang dialog d3_1..d3_3 (325..620), diikuti jeda hening & momen pelukan (620..718)
    // d3_1: 325..424, d3_2: 424..523, d3_3: 523..620
    const isDialogueActive = f < 632;
    let segIdx = 0;
    let segStart = 325;
    if (f >= 523) {
      segIdx = 2;
      segStart = 523;
    } else if (f >= 424) {
      segIdx = 1;
      segStart = 424;
    }
    const cardName = DIALOG3_CARDS[segIdx];
    const cardFadeIn = fadeIn(f, segStart, 12);
    const cardFadeOut =
      f >= 616
        ? interpolate(f, [616, 632], [1, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          })
        : 1;
    const cardOp = cardFadeIn * cardFadeOut;

    // Animasi mulut stepping (hanya stepping sprite, bukan kamera) saat Wiryo berbicara
    const mouthOpen = Math.floor(f / 6) % 2 === 1;

    // Momen pelukan: kedua potret bergerak mendekat kontinu via cam()
    const wiryoX = cam(f, 616, 694, 148, 198);
    const nadiaX = cam(f, 616, 694, 344, 294);
    const hugGlow = cam(f, 628, 696, 0, 1);

    // Ekspresi Wiryo & Nadia:
    // Selama d3_1..d3_3: Wiryo berbicara (neutral <-> open); memasuki pelukan: wiryo_tua_portrait_open -> wiryo_tua_portrait_happy
    // Nadia: neutral saat menyimak -> nadia_dewasa_kiri_portrait_open saat pelukan
    let wiryoPortrait: string;
    if (f < 616) {
      wiryoPortrait = mouthOpen
        ? 'wiryo_tua_portrait_open'
        : 'wiryo_tua_portrait_neutral';
    } else if (f < 660) {
      wiryoPortrait = 'wiryo_tua_portrait_open';
    } else {
      wiryoPortrait = 'wiryo_tua_portrait_happy';
    }

    const nadiaPortrait =
      f >= 608
        ? 'nadia_dewasa_kiri_portrait_open'
        : 'nadia_dewasa_kiri_portrait_neutral';

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale} ty={leftTy}>
            <LeftBalaiDialogLayer
              f={f}
              wiryoPortrait={wiryoPortrait}
              nadiaPortrait={nadiaPortrait}
              wiryoX={wiryoX}
              nadiaX={nadiaX}
              hugGlow={hugGlow}
            />
          </Cam>

          {/* Kotak dialog RPG (d3_1..d3_3) di bawah sisi kiri, aman di dalam 0..639 */}
          {isDialogueActive && cardOp > 0.005 ? (
            <CardImg
              name={cardName}
              x={50}
              y={602}
              scale={0.9}
              opacity={cardOp}
              z={62}
            />
          ) : null}
        </Half>

        <Half side={1} dim={rightDim}>
          <Cam scale={rightScale}>
            <RightTerasWiryoLayer f={f} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B42: Festival cermin (FestivalScene dua sisi + zoom-out megah kontinu) ---
  const festScale = cam(f, 718, 1377, 1.24, 1.0);
  const festTy = cam(f, 718, 1377, 26, 0);
  // Crossfade lembut antar-tampilan paralel di awal B42 (masing-masing strictly di dalam sisinya)
  const crossOp = fadeIn(f, 718, 22);
  const showPrevTail = f < 742;

  const lastriOp = fadeIn(f, 748, 22);
  const danuOp = fadeIn(f, 768, 22);
  const stageBobA = Math.sin(f * 0.09) * 3;
  const stageBobB = Math.sin(f * 0.09 + 1.6) * 3;
  const stageBobC = Math.sin(f * 0.09 + 3.1) * 3;

  return (
    <>
      {/* Kiri: FestivalScene lampion hangat + pentas tradisional + warga menonton langsung */}
      <Half side={0}>
        {showPrevTail ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              opacity: 1 - crossOp,
            }}
          >
            <Cam scale={1.15} ty={24}>
              <LeftBalaiDialogLayer
                f={717}
                wiryoPortrait="wiryo_tua_portrait_happy"
                nadiaPortrait="nadia_dewasa_kiri_portrait_open"
                wiryoX={198}
                nadiaX={294}
                hugGlow={1}
              />
            </Cam>
          </div>
        ) : null}

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            opacity: crossOp,
          }}
        >
          <Cam scale={festScale} ty={festTy}>
            <FestivalScene f={f} side={0} />

            {/* Penampil musik tradisional di atas panggung kayu hangat */}
            <Sprite
              name="warga_a_walk_0"
              x={210}
              y={374 + stageBobA}
              w={52}
              h={84}
              z={8}
            />
            <Sprite
              name="warga_c_walk_0"
              x={294}
              y={370 + stageBobB}
              w={54}
              h={88}
              z={8}
            />
            <Sprite
              name="warga_b_walk_0"
              x={378}
              y={374 + stageBobC}
              w={52}
              h={84}
              flip
              z={8}
            />

            {/* Partikel cahaya lampion hangat melayang lembut kontinu */}
            {[
              { x: 92, baseY: 360, off: 0.0 },
              { x: 186, baseY: 320, off: 0.25 },
              { x: 318, baseY: 300, off: 0.5 },
              { x: 452, baseY: 334, off: 0.72 },
              { x: 548, baseY: 352, off: 0.88 },
            ].map((mote, idx) => {
              const ph = modPos((f - 718) * 0.006 + mote.off, 1);
              const dy = interpolate(ph, [0, 1], [0, -76]);
              const op = interpolate(ph, [0, 0.25, 0.8, 1], [0, 0.65, 0.55, 0]);
              return (
                <div
                  key={`lmote-${idx}`}
                  style={{
                    position: 'absolute',
                    left: mote.x + Math.sin(f * 0.04 + idx * 1.3) * 8,
                    top: mote.baseY + dy,
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: '#ffd98a',
                    opacity: op,
                    zIndex: 9,
                    pointerEvents: 'none',
                  }}
                />
              );
            })}

            {/* Warga menonton langsung di depan panggung tanpa layar ponsel */}
            {[
              { sprite: 'warga_d_walk_0', x: 54, y: 516, flip: false, ph: 0.2 },
              { sprite: 'anak_a_walk_0', x: 118, y: 528, flip: false, ph: 1.0 },
              { sprite: 'warga_b_walk_0', x: 186, y: 514, flip: false, ph: 1.8 },
              { sprite: 'remaja_a_walk_0', x: 258, y: 520, flip: false, ph: 2.5 },
              { sprite: 'anak_b_walk_0', x: 336, y: 528, flip: true, ph: 0.6 },
              { sprite: 'warga_a_walk_0', x: 406, y: 516, flip: true, ph: 1.5 },
              { sprite: 'remaja_b_walk_0', x: 478, y: 520, flip: true, ph: 2.2 },
              { sprite: 'warga_c_walk_0', x: 544, y: 514, flip: true, ph: 3.0 },
            ].map((w, idx) => (
              <Sprite
                key={`lfest-w-${idx}`}
                name={w.sprite}
                x={w.x}
                y={w.y + Math.sin(f * 0.065 + w.ph) * 2.5}
                w={46}
                h={75}
                flip={w.flip}
                z={9}
              />
            ))}

            {/* Walker warga melintas ceria di area festival kiri */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: HALF,
                height: H,
                zIndex: 11,
              }}
            >
              <Walker
                name="warga_a_walk"
                side={0}
                y={522}
                seed={14}
                speed={0.42}
                scale={0.72}
                f={f}
              />
              <Walker
                name="anak_a_walk"
                side={0}
                y={536}
                seed={37}
                speed={-0.48}
                scale={0.68}
                f={f}
              />
            </div>
          </Cam>
        </div>
      </Half>

      {/* Kanan: FestivalScene panggung besar + banyak prop_ponsel_feed terangkat + icon_hati melayang + Portrait Lastri & Danu */}
      <Half side={1}>
        {showPrevTail ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              opacity: (1 - crossOp) * 0.65,
            }}
          >
            <Cam scale={1.06}>
              <RightTerasWiryoLayer f={717} />
            </Cam>
          </div>
        ) : null}

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            opacity: crossOp,
          }}
        >
          <Cam scale={festScale} ty={festTy}>
            <FestivalScene f={f} side={1} />

            {/* Kerumunan warga & remaja festival kanan */}
            {[
              { sprite: 'warga_hp_a_walk_0', x: 76, y: 512, flip: false, ph: 0.4 },
              { sprite: 'remaja_a_walk_0', x: 158, y: 518, flip: false, ph: 1.2 },
              { sprite: 'warga_c_walk_0', x: 230, y: 514, flip: false, ph: 2.1 },
              { sprite: 'warga_hp_b_walk_0', x: 304, y: 516, flip: true, ph: 2.9 },
              { sprite: 'remaja_b_walk_0', x: 378, y: 518, flip: true, ph: 0.8 },
              { sprite: 'warga_a_walk_0', x: 452, y: 514, flip: true, ph: 1.7 },
              { sprite: 'warga_hp_a_walk_0', x: 526, y: 516, flip: true, ph: 2.6 },
            ].map((w, idx) => (
              <Sprite
                key={`rfest-w-${idx}`}
                name={w.sprite}
                x={w.x}
                y={w.y + Math.sin(f * 0.065 + w.ph) * 2.5}
                w={46}
                h={75}
                flip={w.flip}
                z={9}
              />
            ))}

            {/* Walker warga ambient di kerumunan festival kanan */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: HALF,
                height: H,
                zIndex: 11,
              }}
            >
              <Walker
                name="warga_hp_a_walk"
                side={1}
                y={520}
                seed={21}
                speed={0.44}
                scale={0.72}
                f={f}
              />
              <Walker
                name="warga_c_walk"
                side={1}
                y={534}
                seed={49}
                speed={-0.38}
                scale={0.7}
                f={f}
              />
            </div>

            {/* Banyak prop_ponsel_feed kecil terangkat merekam di kerumunan */}
            {FESTIVAL_PHONES.map((ph, idx) => {
              const swayY = Math.sin(f * 0.07 + ph.phase) * 3.5;
              const glow = 0.65 + 0.35 * Math.sin(f * 0.1 + ph.phase);
              return (
                <React.Fragment key={`rph-${idx}`}>
                  <div
                    style={{
                      position: 'absolute',
                      left: ph.x - 6,
                      top: ph.y + swayY - 6,
                      width: ph.w + 12,
                      height: ph.h + 12,
                      borderRadius: '50%',
                      backgroundColor: '#35c4e8',
                      opacity: 0.24 * glow,
                      zIndex: ph.z - 1,
                      pointerEvents: 'none',
                    }}
                  />
                  <Sprite
                    name="prop_ponsel_feed"
                    x={ph.x}
                    y={ph.y + swayY}
                    w={ph.w}
                    h={ph.h}
                    z={ph.z}
                  />
                </React.Fragment>
              );
            })}

            {/* icon_hati melayang fadeIn berjenjang dari layar-layar ponsel */}
            {FESTIVAL_HEARTS.map((ht, idx) => {
              const gate = fadeIn(f, 718 + ht.delay, 18);
              if (gate <= 0.005) {
                return null;
              }
              const cycle = modPos((f - 718) * ht.speed + ht.offset, 1);
              const rise = interpolate(cycle, [0, 1], [0, -118]);
              const driftX = Math.sin((f - 718) * 0.045 + idx * 1.4) * 10;
              const cycleOp = interpolate(
                cycle,
                [0, 0.18, 0.76, 1],
                [0, 0.92, 0.78, 0],
              );
              return (
                <Sprite
                  key={`rht-${idx}`}
                  name="icon_hati"
                  x={ht.x + driftX}
                  y={ht.baseY + rise}
                  w={ht.w}
                  h={ht.h}
                  opacity={gate * cycleOp}
                  z={16}
                />
              );
            })}

            {/* Tokoh kanan skala sedang di kerumunan: Bu Lastri & Pak Danu tersenyum */}
            {lastriOp > 0.005 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 15 }}>
                <Portrait
                  name="lastri_tua_portrait_happy"
                  x={42}
                  y={520}
                  w={136}
                  h={170}
                  opacity={lastriOp}
                />
              </div>
            ) : null}
            {danuOp > 0.005 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 15 }}>
                <Portrait
                  name="danu_tua_portrait_happy"
                  x={458}
                  y={520}
                  w={136}
                  h={170}
                  opacity={danuOp}
                />
              </div>
            ) : null}
          </Cam>
        </div>
      </Half>
    </>
  );
};
