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
import { DesaMap, TerasScene } from './scenes';

export interface Blok09Props {
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

// Lapisan pemasangan toa, 3 kentongan, gelombang suara hangat, dan Nadia di sisi kiri (dipakai B35 & berlanjut di B36)
const LeftKentonganLayer: React.FC<{
  f: number;
  installStart: number;
}> = ({ f, installStart }) => {
  const toaOp = fadeIn(f, installStart + 8, 18);
  const kent1Op = fadeIn(f, installStart + 30, 18);
  const kent2Op = fadeIn(f, installStart + 66, 18);
  const kent3Op = fadeIn(f, installStart + 102, 18);
  const nadiaOp = fadeIn(f, installStart + 10, 18);
  const waveGate = fadeIn(f, installStart + 26, 22);

  const toaCenterX = 248;
  const toaCenterY = 294;
  const bobA = Math.sin(f * 0.075) * 2;
  const bobB = Math.sin(f * 0.075 + 1.6) * 2;

  const kentonganPoints: ReadonlyArray<{
    x: number;
    y: number;
    op: number;
  }> = [
    { x: 66, y: 386, op: kent1Op },
    { x: 262, y: 452, op: kent2Op },
    { x: 484, y: 448, op: kent3Op },
  ];

  return (
    <>
      <DesaMap f={f} side={0} era={3} />

      {/* Tiang pengeras suara (toa) dekat balai desa */}
      {toaOp > 0.005 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            opacity: toaOp,
            zIndex: 25,
            pointerEvents: 'none',
          }}
        >
          {/* Tiang kayu penyangga toa */}
          <div
            style={{
              position: 'absolute',
              left: 244,
              top: 296,
              width: 8,
              height: 112,
              backgroundColor: '#5c3c24',
              border: '1px solid #3d2716',
              boxSizing: 'border-box',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 236,
              top: 404,
              width: 24,
              height: 7,
              backgroundColor: '#7a6f5e',
            }}
          />
          <Sprite name="prop_toa" x={225} y={272} w={46} h={42} z={2} />
        </div>
      ) : null}

      {/* Gelombang suara hangat: lingkaran garis membesar kontinu + memudar berulang dari posisi toa */}
      {waveGate > 0.005
        ? [0, 0.25, 0.5, 0.75].map((offset, idx) => {
            const phase = modPos((f - installStart) * 0.011 + offset, 1);
            const radius = interpolate(phase, [0, 1], [14, 196]);
            const ringOp =
              interpolate(phase, [0, 0.16, 0.72, 1], [0, 0.86, 0.34, 0]) *
              waveGate;
            return (
              <div
                key={`toa-wave-${idx}`}
                style={{
                  position: 'absolute',
                  left: toaCenterX - radius,
                  top: toaCenterY - radius,
                  width: radius * 2,
                  height: radius * 2,
                  borderRadius: '50%',
                  border: '3px solid #ffd98a',
                  opacity: ringOp,
                  zIndex: 24,
                  boxSizing: 'border-box',
                  pointerEvents: 'none',
                }}
              />
            );
          })
        : null}

      {/* Gardu kentongan kayu di 3 titik strategis (fadeIn berjenjang) */}
      {kentonganPoints.map((pt, idx) =>
        pt.op > 0.005 ? (
          <div
            key={`kent-pt-${idx}`}
            style={{
              position: 'absolute',
              left: pt.x,
              top: pt.y,
              width: 44,
              height: 60,
              opacity: pt.op,
              zIndex: 26,
              pointerEvents: 'none',
            }}
          >
            {/* Atap & rangka gardu kentongan kayu */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: 44,
                height: 8,
                backgroundColor: '#9c452e',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 4,
                top: 8,
                width: 5,
                height: 50,
                backgroundColor: '#6b4529',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 35,
                top: 8,
                width: 5,
                height: 50,
                backgroundColor: '#6b4529',
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: 4,
                top: 10,
                width: 36,
                height: 4,
                backgroundColor: '#593920',
              }}
            />
            {/* Halo hangat kecil saat diuji */}
            <div
              style={{
                position: 'absolute',
                left: 6,
                top: 12,
                width: 32,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#ffd98a',
                opacity: 0.22 * (0.65 + 0.35 * Math.sin(f * 0.1 + idx * 1.4)),
              }}
            />
            <Sprite name="prop_kentongan" x={11} y={13} w={22} h={40} z={2} />
          </div>
        ) : null,
      )}

      {/* Warga membantu pemasangan di sekitar balai & gardu */}
      <Sprite
        name="warga_a_walk_0"
        x={208}
        y={374 + bobA}
        w={42}
        h={68}
        z={27}
      />
      <Sprite
        name="warga_b_walk_0"
        x={268}
        y={378 + bobB}
        w={42}
        h={68}
        flip
        z={27}
      />
      <Sprite
        name="warga_c_walk_0"
        x={448}
        y={454 + bobA}
        w={40}
        h={65}
        z={27}
      />

      {/* Walker warga tambahan agar suasana gotong royong tetap hidup */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          zIndex: 28,
        }}
      >
        <Walker
          name="warga_a_walk"
          side={0}
          y={502}
          seed={19}
          speed={0.44}
          scale={0.56}
          f={f}
        />
        <Walker
          name="warga_d_walk"
          side={0}
          y={508}
          seed={41}
          speed={-0.38}
          scale={0.56}
          f={f}
        />
      </div>

      {/* Portrait Nadia dewasa tersenyum memimpin pemasangan aturan kentongan */}
      {nadiaOp > 0.005 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            zIndex: 32,
            pointerEvents: 'none',
          }}
        >
          <Portrait
            name="nadia_dewasa_kiri_portrait_happy"
            x={22}
            y={462}
            w={176}
            h={220}
            opacity={nadiaOp}
          />
        </div>
      ) : null}
    </>
  );
};

// Lapisan kanan B35 & B36: DesaMap era 3 + papan informasi desa sigap (blok) + Walker warga_hp ambient
const RightInfoBoardLayer: React.FC<{ f: number }> = ({ f }) => {
  const signalBlink = 0.55 + 0.45 * Math.sin(f * 0.14);

  return (
    <>
      <DesaMap f={f} side={1} era={3} />

      {/* Papan informasi desa modern (blok tanpa teks DOM) */}
      <div
        style={{
          position: 'absolute',
          left: 256,
          top: 342,
          width: 124,
          height: 102,
          zIndex: 24,
        }}
      >
        {/* Tiang logam kiri & kanan */}
        <div
          style={{
            position: 'absolute',
            left: 14,
            top: 70,
            width: 8,
            height: 32,
            backgroundColor: '#4a5568',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 102,
            top: 70,
            width: 8,
            height: 32,
            backgroundColor: '#4a5568',
          }}
        />
        {/* Bingkai papan */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: 124,
            height: 74,
            backgroundColor: '#1d273b',
            border: '4px solid #35c4e8',
            boxSizing: 'border-box',
          }}
        />
        {/* Header aksen sian & indikator aktif */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 10,
            width: 78,
            height: 9,
            backgroundColor: '#35c4e8',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 98,
            top: 9,
            width: 12,
            height: 12,
            borderRadius: '50%',
            backgroundColor: '#58e090',
            opacity: signalBlink,
          }}
        />
        {/* Baris blok informasi abstrak */}
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 28,
            width: 96,
            height: 6,
            backgroundColor: '#cfe8ff',
            opacity: 0.85,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 40,
            width: 74,
            height: 6,
            backgroundColor: '#cfe8ff',
            opacity: 0.72,
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: 10,
            top: 52,
            width: 88,
            height: 6,
            backgroundColor: '#f05ab4',
            opacity: 0.82,
          }}
        />
      </div>

      {/* Walker warga_hp ambient berjalan terus di sisi kanan */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          zIndex: 27,
        }}
      >
        <Walker
          name="warga_hp_a_walk"
          side={1}
          y={496}
          seed={17}
          speed={0.46}
          scale={0.62}
          f={f}
        />
        <Walker
          name="warga_hp_b_walk"
          side={1}
          y={506}
          seed={43}
          speed={-0.4}
          scale={0.62}
          f={f}
        />
      </div>
    </>
  );
};

export const Blok09: React.FC<Blok09Props> = ({ f }) => {
  // Rentang lokal Blok09 (Tahun 13-14, total 1062):
  // B34: 0..434, B35: 434..761, B36: 761..1062

  // --- B34: Sukaramai pulih (kanan fokus TerasScene; kiri DesaMap era 3 kering & rapi redup hidup) ---
  if (f < 434) {
    const leftTx = cam(f, 0, 434, -8, 8);
    const rightTx = cam(f, 0, 434, -18, 18);
    const rightTy = cam(f, 0, 434, 4, -4);

    // Gerak napas lelah pelan pada figur anak muda duduk di teras
    const sighBob = Math.sin(f * 0.055) * 2.5;
    // Pak Danu melintas kontinu pelan di latar belakang (di balik pagar teras)
    const danuX = cam(f, 0, 434, 286, 444);
    const danuBob = Math.sin(f * 0.09) * 1.8;
    // Denyar lampu studio & warung aktif di latar
    const studioGlow = 0.72 + 0.28 * Math.sin(f * 0.08);
    const phoneOp = fadeIn(f, 18, 18) * 0.48;

    return (
      <>
        {/* Kiri: DesaMap era 3 pasca-banjir kering dan rapi, warga beraktivitas normal (redup hidup) */}
        <Half side={0} dim={0.35}>
          <Cam scale={1.04} tx={leftTx}>
            <DesaMap f={f} side={0} era={3} flood={0} rain={false} />
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
                seed={23}
                speed={0.44}
                scale={0.58}
                f={f}
              />
              <Walker
                name="warga_b_walk"
                side={0}
                y={506}
                seed={57}
                speed={-0.38}
                scale={0.58}
                f={f}
              />
            </div>
          </Cam>
        </Half>

        {/* Kanan fokus: TerasScene + anak muda duduk + ponsel redup di meja + aksen studio aktif + Danu melintas di latar */}
        <Half side={1}>
          <Cam scale={1.08} tx={rightTx} ty={rightTy}>
            <TerasScene f={f} side={1} />

            {/* Aksen studio aktif di jendela rumah & sudut latar kanan (ekonomi konten tetap berjalan) */}
            <div
              style={{
                position: 'absolute',
                left: 158,
                top: 220,
                width: 76,
                height: 106,
                backgroundColor: '#35c4e8',
                opacity: 0.28 * studioGlow,
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
            <Sprite
              name="prop_ringlight"
              x={172}
              y={238}
              w={48}
              h={64}
              opacity={0.92}
              z={11}
            />
            {/* Lampu neon kecil transaksi warung/studio aktif di latar jauh */}
            <div
              style={{
                position: 'absolute',
                left: 492,
                top: 266,
                width: 82,
                height: 54,
                backgroundColor: '#253147',
                border: '2px solid #35c4e8',
                zIndex: 10,
                boxSizing: 'border-box',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 78,
                  height: 7,
                  backgroundColor: '#f05ab4',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 10,
                  top: 16,
                  width: 40,
                  height: 20,
                  backgroundColor: '#7ee4ff',
                  opacity: 0.72 * studioGlow,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 56,
                  top: 16,
                  width: 14,
                  height: 34,
                  backgroundColor: '#3f4f6b',
                }}
              />
            </div>
            <div
              style={{
                position: 'absolute',
                left: 468,
                top: 244,
                width: 126,
                height: 98,
                borderRadius: '50%',
                backgroundColor: '#35c4e8',
                opacity: 0.14 * studioGlow,
                zIndex: 11,
                pointerEvents: 'none',
              }}
            />

            {/* Warga latar menjaga jarak saat Pak Danu melintas */}
            <Sprite
              name="warga_hp_b_walk_0"
              x={518}
              y={308}
              w={46}
              h={75}
              flip
              opacity={0.86}
              z={12}
            />

            {/* Portrait Danu letih melintas pelan kontinu di latar (di balik pagar teras) */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 13,
                pointerEvents: 'none',
              }}
            >
              <Portrait
                name="danu_letih_portrait_neutral"
                x={danuX}
                y={254 + danuBob}
                w={120}
                h={150}
                opacity={0.9}
              />
            </div>

            {/* Pagar kayu teras depan agar Danu tampak benar-benar berada di latar luar */}
            <div
              style={{
                position: 'absolute',
                left: 280,
                top: 396,
                width: 302,
                height: 10,
                backgroundColor: '#7d5336',
                zIndex: 15,
              }}
            />
            {[316, 364, 412, 460, 508, 556].map((px) => (
              <div
                key={`b34-rail-${px}`}
                style={{
                  position: 'absolute',
                  left: px,
                  top: 404,
                  width: 8,
                  height: 46,
                  backgroundColor: '#6e482e',
                  zIndex: 15,
                }}
              />
            ))}

            {/* Figur anak muda duduk di bangku teras (Sprite remaja_a_walk_0 besar) */}
            <Sprite
              name="remaja_a_walk_0"
              x={336}
              y={356 + sighBob}
              w={144}
              h={234}
              flip
              z={20}
            />

            {/* Meja kayu teras di sebelah/depan anak muda */}
            <div
              style={{
                position: 'absolute',
                left: 146,
                top: 526,
                width: 176,
                height: 112,
                zIndex: 22,
              }}
            >
              {/* Permukaan meja */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: 176,
                  height: 22,
                  backgroundColor: '#a36e43',
                  border: '3px solid #5e3b21',
                  boxSizing: 'border-box',
                }}
              />
              {/* Panel & kaki meja */}
              <div
                style={{
                  position: 'absolute',
                  left: 14,
                  top: 22,
                  width: 14,
                  height: 88,
                  backgroundColor: '#5e3b21',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 148,
                  top: 22,
                  width: 14,
                  height: 88,
                  backgroundColor: '#5e3b21',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: 28,
                  top: 44,
                  width: 120,
                  height: 10,
                  backgroundColor: '#754b2c',
                }}
              />
            </div>

            {/* Cangkir kopi kecil di ujung kiri meja */}
            <Sprite name="prop_cangkir" x={166} y={498} w={34} h={29} z={23} />

            {/* Sprite prop_ponsel_chat redup tergeletak mendatar di meja (tanda ponsel diletakkan) */}
            {phoneOp > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 238,
                  top: 492,
                  width: 34,
                  height: 52,
                  transform: 'rotate(78deg)',
                  transformOrigin: '50% 50%',
                  zIndex: 24,
                }}
              >
                <Sprite
                  name="prop_ponsel_chat"
                  x={0}
                  y={0}
                  w={34}
                  h={52}
                  opacity={phoneOp}
                />
              </div>
            ) : null}
          </Cam>
        </Half>
      </>
    );
  }

  // --- B35: Aturan kentongan (kiri fokus DesaMap era 3 + toa + 3 kentongan + gelombang suara + Nadia; kanan papan info + walker redup hidup) ---
  if (f < 761) {
    const leftTx = cam(f, 434, 761, 16, -16);
    const leftTy = cam(f, 434, 761, 8, -4);
    const rightTx = cam(f, 434, 761, -14, 14);

    return (
      <>
        <Half side={0}>
          <Cam scale={1.08} tx={leftTx} ty={leftTy}>
            <LeftKentonganLayer f={f} installStart={434} />
          </Cam>
        </Half>

        <Half side={1} dim={0.35}>
          <Cam scale={1.08} tx={rightTx}>
            <RightInfoBoardLayer f={f} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B36: Skor Tahun 14 (checkpoint skor resmi: skor_t14_kiri + skor_t14_kanan) ---
  const settleScale = cam(f, 761, 825, 1.08, 1.02);
  const settleLeftTx = cam(f, 761, 825, -16, 0);
  const settleLeftTy = cam(f, 761, 825, -4, 0);
  const settleRightTx = cam(f, 761, 825, 14, 0);
  const veilOp = cam(f, 761, 788, 0, 0.28);

  return (
    <>
      <Half side={0}>
        <Cam scale={settleScale} tx={settleLeftTx} ty={settleLeftTy}>
          <LeftKentonganLayer f={f} installStart={434} />
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
        <PopCard name="skor_t14_kiri" x={90} y={248} f={f} f0={773} z={62} />
      </Half>

      <Half side={1}>
        <Cam scale={settleScale} tx={settleRightTx}>
          <RightInfoBoardLayer f={f} />
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
        <PopCard name="skor_t14_kanan" x={90} y={237} f={f} f0={785} z={62} />
      </Half>
    </>
  );
};
