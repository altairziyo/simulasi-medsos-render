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
import { BalaiScene, DesaMap, LapanganScene, WarungScene } from './scenes';

export interface Blok07Props {
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

// Balai ramai diskusi (dipakai di B25 dan awal montage B26)
const BalaiRamaiContent: React.FC<{ f: number }> = ({ f }) => {
  const bobA = Math.sin(f * 0.08) * 2.5;
  const bobB = Math.sin(f * 0.08 + 1.8) * 2.5;
  const bubbleOp = 0.72 + 0.24 * Math.sin(f * 0.09);

  return (
    <>
      <BalaiScene f={f} side={0} />
      {/* Pak Wiryo memimpin diskusi balai dengan ceria */}
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 11 }}>
        <Portrait
          name="wiryo_kades_portrait_happy"
          x={224}
          y={192}
          w={192}
          h={240}
        />
      </div>
      {/* Barisan tengah warga berdiskusi (terlihat jelas di atas area kartu B25) */}
      <Sprite name="warga_c_walk_0" x={54} y={338 + bobB} w={74} h={120} z={12} />
      <Sprite name="warga_d_walk_0" x={140} y={346 + bobA} w={74} h={120} flip z={12} />
      <Sprite name="warga_a_walk_0" x={426} y={344 + bobA} w={74} h={120} z={12} />
      <Sprite name="warga_b_walk_0" x={512} y={338 + bobB} w={74} h={120} flip z={12} />
      {/* Barisan depan warga duduk di bangku balai */}
      <Sprite name="warga_a_walk_0" x={76} y={456 + bobA} w={76} h={124} z={13} />
      <Sprite name="warga_b_walk_0" x={174} y={462 + bobB} w={76} h={124} flip z={13} />
      <Sprite name="warga_c_walk_0" x={388} y={460 + bobB} w={76} h={124} z={13} />
      <Sprite name="warga_d_walk_0" x={488} y={456 + bobA} w={76} h={124} flip z={13} />
      {/* Gelembung obrolan hangat di kedua sisi balai */}
      <Sprite
        name="prop_gelembung"
        x={106}
        y={308}
        w={44}
        h={34}
        opacity={bubbleOp}
        z={15}
      />
      <Sprite
        name="prop_gelembung"
        x={476}
        y={310}
        w={44}
        h={34}
        opacity={bubbleOp}
        z={15}
      />
    </>
  );
};

// Ruang duduk malam Sukaramai: warga duduk terpisah berjauhan menatap layar
const RuangDudukTerpisahContent: React.FC<{ f: number }> = ({ f }) => {
  const glowPulse = 0.75 + 0.25 * Math.sin(f * 0.08);
  const seats: ReadonlyArray<{
    name: string;
    x: number;
    y: number;
    flip: boolean;
  }> = [
    { name: 'warga_hp_a_walk_0', x: 58, y: 416, flip: false },
    { name: 'warga_hp_b_walk_0', x: 278, y: 462, flip: true },
    { name: 'warga_hp_a_walk_0', x: 494, y: 454, flip: true },
  ];

  return (
    <>
      <WarungScene f={f} side={1} night={true} />
      {seats.map((seat, idx) => (
        <React.Fragment key={`sep-${idx}`}>
          {/* Pendar layar biru dingin kecil di depan tiap warga terpisah */}
          <div
            style={{
              position: 'absolute',
              left: seat.x + 12,
              top: seat.y + 36,
              width: 56,
              height: 56,
              borderRadius: 28,
              backgroundColor: '#35c4e8',
              opacity: 0.26 * glowPulse,
              zIndex: 12,
              pointerEvents: 'none',
            }}
          />
          <Sprite
            name={seat.name}
            x={seat.x}
            y={seat.y}
            w={78}
            h={127}
            flip={seat.flip}
            z={13}
          />
        </React.Fragment>
      ))}
    </>
  );
};

// Meja makan hangat keluarga Sukatenang (Nadia & Pak Wiryo, tanpa layar)
const MejaMakanHangatContent: React.FC<{ f: number }> = ({ f }) => {
  const steamBob = Math.sin(f * 0.08) * 3;
  return (
    <>
      <WarungScene f={f} side={0} big={false} night={false} />
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 12 }}>
        <Portrait
          name="wiryo_kades_portrait_happy"
          x={74}
          y={254}
          w={204}
          h={255}
        />
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 12 }}>
        <Portrait
          name="nadia_muda_kiri_portrait_happy"
          x={354}
          y={258}
          w={204}
          h={255}
        />
      </div>
      {/* Teko & cangkir hangat di meja, tanpa ponsel */}
      <Sprite
        name="prop_teko"
        x={282}
        y={468 + steamBob * 0.2}
        w={56}
        h={45}
        z={14}
      />
      <Sprite name="prop_cangkir" x={232} y={482} w={38} h={33} z={14} />
      <Sprite name="prop_cangkir" x={352} y={482} w={38} h={33} z={14} />
    </>
  );
};

// Ikon jam pixel dengan indikator isi hijau hangat (kiri) atau terkuras biru (kanan)
const JamMeterBadge: React.FC<{
  x: number;
  y: number;
  fillRatio: number;
  color: string;
  opacity: number;
  z?: number;
}> = ({ x, y, fillRatio, color, opacity, z = 60 }) => {
  const clamped = Math.max(0.08, Math.min(1, fillRatio));
  const barW = 44 * clamped;

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 52,
        height: 62,
        opacity,
        zIndex: z,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: 52,
          height: 52,
          borderRadius: 26,
          backgroundColor: color,
          opacity: 0.24,
        }}
      />
      <Sprite name="icon_jam" x={3} y={2} w={46} h={46} z={2} />
      <div
        style={{
          position: 'absolute',
          left: 4,
          top: 52,
          width: 44,
          height: 8,
          backgroundColor: '#1a202c',
          border: '2px solid #0b0f17',
          boxSizing: 'border-box',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: barW,
            height: 4,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
};

export const Blok07: React.FC<Blok07Props> = ({ f }) => {
  // Rentang lokal Blok07 (total 1484):
  // B25: 0..547, B26: 547..942, B27: 942..1484

  // --- B25: Kartu studi Allcott (Balai ramai kiri; ruang duduk terpisah kanan) ---
  if (f < 547) {
    // Skala 1.06 memberi margin ~19px tiap sisi sehingga pan horizontal tx kontinu aman tanpa celah
    const leftTx = cam(f, 0, 547, -14, 14);
    const rightTx = cam(f, 0, 547, 14, -14);
    const studyOp = fadeIn(f, 24, 18);

    return (
      <>
        <Half side={0}>
          <Cam scale={1.06} tx={leftTx}>
            <BalaiRamaiContent f={f} />
          </Cam>
          {/* Satu kartu studi_allcott di sisi kiri bawah (x=90, y=470; scale 0.85 -> 493x144.5, aman < 640) */}
          {studyOp > 0.005 ? (
            <CardImg
              name="studi_allcott"
              x={90}
              y={470}
              scale={0.85}
              opacity={studyOp}
              z={62}
            />
          ) : null}
        </Half>

        <Half side={1}>
          <Cam scale={1.06} tx={rightTx}>
            <RuangDudukTerpisahContent f={f} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B26: Jam yang kembali (montage 3 ruang kiri + jam_plus1; kanan layar + jam_minus1 + koran) ---
  if (f < 942) {
    const panTx = cam(f, 547, 942, -14, 14);
    const rightPanTx = cam(f, 547, 942, 14, -14);

    // Crossfade mulus 3 ruang di sisi kiri tanpa celah gelap (lapisan bawah 1, lapisan baru 0->1):
    // Balai 547..679 -> Lapangan 679..811 -> Meja Makan (WarungScene hangat) 811..942
    const toLapangan = cam(f, 667, 691, 0, 1);
    const toMeja = cam(f, 799, 823, 0, 1);

    // Crossfade ringan di kanan: ruang duduk malam -> DesaMap era 2 malam parsial
    const rightMapReveal = cam(f, 732, 764, 0, 1);

    // Bola voli aktif di sub-adegan Lapangan
    const ballT = modPos(f * 0.03, 1);
    const ballX = interpolate(ballT, [0, 0.5, 1], [176, 434, 176]);
    const ballY = 248 - Math.sin(ballT * Math.PI * 2) * 34;

    const jamLeftOp = fadeIn(f, 562, 16);
    const jamRightOp = fadeIn(f, 572, 16);
    const jamFillLeft = cam(f, 562, 910, 0.25, 1.0);
    const jamDrainRight = cam(f, 572, 910, 0.92, 0.18);
    const koranOp = fadeIn(f, 608, 16);
    const koranGlow = 0.72 + 0.28 * Math.sin(f * 0.1);

    return (
      <>
        <Half side={0}>
          <Cam scale={1.06} tx={panTx}>
            {toLapangan < 0.995 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: HALF,
                  height: H,
                  opacity: 1,
                  zIndex: 2,
                }}
              >
                <BalaiRamaiContent f={f} />
              </div>
            ) : null}

            {toLapangan > 0.005 && toMeja < 0.995 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: HALF,
                  height: H,
                  opacity: toLapangan,
                  zIndex: 3,
                }}
              >
                <LapanganScene f={f} side={0} />
                <Sprite name="remaja_a_walk_0" x={86} y={428} w={76} h={124} z={13} />
                <Sprite name="remaja_b_walk_0" x={468} y={432} w={76} h={124} flip z={13} />
                <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
                  <Portrait
                    name="nadia_muda_kiri_portrait_happy"
                    x={216}
                    y={268}
                    w={206}
                    h={258}
                  />
                </div>
                <Sprite name="prop_bola_voli" x={ballX} y={ballY} w={52} h={52} z={16} />
              </div>
            ) : null}

            {toMeja > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: HALF,
                  height: H,
                  opacity: toMeja,
                  zIndex: 4,
                }}
              >
                <MejaMakanHangatContent f={f} />
              </div>
            ) : null}
          </Cam>

          {/* Ikon jam terisi hijau hangat + kartu jam_plus1 di kiri */}
          {jamLeftOp > 0.005 ? (
            <>
              <JamMeterBadge
                x={140}
                y={96}
                fillRatio={jamFillLeft}
                color="#58a05a"
                opacity={jamLeftOp}
                z={60}
              />
              <CardImg
                name="jam_plus1"
                x={204}
                y={94}
                opacity={jamLeftOp}
                z={60}
              />
            </>
          ) : null}

          {/* Ikon koran redup di kiri (kontras studi Allcott: berita lebih redup di kiri) */}
          {koranOp > 0.005 ? (
            <Sprite
              name="icon_koran"
              x={538}
              y={104}
              w={56}
              h={45}
              opacity={koranOp * 0.34}
              z={60}
            />
          ) : null}
        </Half>

        <Half side={1}>
          <Cam scale={1.06} tx={rightPanTx}>
            {rightMapReveal < 0.995 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: HALF,
                  height: H,
                  opacity: 1,
                  zIndex: 2,
                }}
              >
                <RuangDudukTerpisahContent f={f} />
              </div>
            ) : null}

            {rightMapReveal > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: HALF,
                  height: H,
                  opacity: rightMapReveal,
                  zIndex: 3,
                }}
              >
                <DesaMap f={f} side={1} era={2} night={0.68} />
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
                    seed={15}
                    speed={0.42}
                    scale={0.62}
                    f={f}
                  />
                  <Walker
                    name="warga_hp_b_walk"
                    side={1}
                    y={500}
                    seed={33}
                    speed={-0.38}
                    scale={0.62}
                    f={f}
                  />
                </div>
              </div>
            ) : null}
          </Cam>

          {/* Ikon jam terkuras biru + kartu jam_minus1 di kanan */}
          {jamRightOp > 0.005 ? (
            <>
              <JamMeterBadge
                x={140}
                y={96}
                fillRatio={jamDrainRight}
                color="#35c4e8"
                opacity={jamRightOp}
                z={60}
              />
              <CardImg
                name="jam_minus1"
                x={204}
                y={94}
                opacity={jamRightOp}
                z={60}
              />
            </>
          ) : null}

          {/* Ikon koran menyala lebih terang di kanan (pengetahuan berita) */}
          {koranOp > 0.005 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 518,
                  top: 85,
                  width: 98,
                  height: 82,
                  borderRadius: 42,
                  backgroundColor: '#35c4e8',
                  opacity: 0.36 * koranOp * koranGlow,
                  zIndex: 59,
                  pointerEvents: 'none',
                }}
              />
              <Sprite
                name="icon_koran"
                x={536}
                y={101}
                w={62}
                h={50}
                opacity={koranOp}
                z={61}
              />
            </>
          ) : null}
        </Half>
      </>
    );
  }

  // --- B27: Skor Tahun 10 (58 vs 52) + pertanyaan kedua (tanya2_kiri & tanya2_kanan) ---
  const settleScale = cam(f, 942, 1005, 1.06, 1.02);
  const settleLeftTx = cam(f, 942, 1005, 14, 0);
  const settleRightTx = cam(f, 942, 1005, -14, 0);
  const veilOp = cam(f, 942, 968, 0, 0.26);
  const tanyaLeftOp = fadeIn(f, 1140, 20);
  const tanyaRightOp = fadeIn(f, 1152, 20);

  return (
    <>
      <Half side={0}>
        <Cam scale={settleScale} tx={settleLeftTx}>
          <MejaMakanHangatContent f={f} />
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
        <PopCard name="skor_t10_kiri" x={90} y={166} f={f} f0={954} z={62} />
        {tanyaLeftOp > 0.005 ? (
          <CardImg
            name="tanya2_kiri"
            x={60}
            y={434}
            opacity={tanyaLeftOp}
            z={63}
          />
        ) : null}
      </Half>

      <Half side={1}>
        <Cam scale={settleScale} tx={settleRightTx}>
          <DesaMap f={f} side={1} era={2} night={0.68} />
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
              seed={15}
              speed={0.42}
              scale={0.62}
              f={f}
            />
            <Walker
              name="warga_hp_b_walk"
              side={1}
              y={500}
              seed={33}
              speed={-0.38}
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
        <PopCard name="skor_t10_kanan" x={90} y={155} f={f} f0={966} z={62} />
        {tanyaRightOp > 0.005 ? (
          <CardImg
            name="tanya2_kanan"
            x={60}
            y={434}
            opacity={tanyaRightOp}
            z={63}
          />
        ) : null}
      </Half>
    </>
  );
};
