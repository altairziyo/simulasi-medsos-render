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
import { DesaMap } from './scenes';

export interface Blok12Props {
  f: number;
}

const POP_EASE = Easing.bezier(0.22, 1.25, 0.36, 1);

function popScale(f: number, f0: number, duration = 16): number {
  return interpolate(f, [f0, f0 + duration], [0.84, 1], {
    easing: POP_EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

// Kartu skor dengan animasi pop-in halus kontinu
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

// Bingkai vignette potret kecil untuk tokoh Tahun 20 di masing-masing dunia
const VignettePortrait: React.FC<{
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
  bg: string;
  opacity: number;
  z?: number;
}> = ({ name, x, y, w, h, accent, bg, opacity, z = 50 }) => {
  if (opacity <= 0.005) {
    return null;
  }
  const pad = 6;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w + pad * 2,
        height: h + pad * 2,
        backgroundColor: bg,
        border: `3px solid ${accent}`,
        boxSizing: 'border-box',
        opacity,
        zIndex: z,
        pointerEvents: 'none',
      }}
    >
      <Portrait name={name} x={pad - 3} y={pad - 3} w={w} h={h} />
    </div>
  );
};

// Lapisan Sukatenang Tahun 20 (era 5): icon_zzz redup di jendela rumah, tetangga mengobrol, balai hidup
const LeftYear20Layer: React.FC<{ f: number; showDetailsAt: number }> = ({
  f,
  showDetailsAt,
}) => {
  const zzzGate = fadeIn(f, showDetailsAt + 12, 20);
  const zzzPulseA = 0.42 + 0.16 * Math.sin(f * 0.06);
  const zzzPulseB = 0.42 + 0.16 * Math.sin(f * 0.06 + 1.9);
  const zzzBobA = Math.sin(f * 0.05) * 3;
  const zzzBobB = Math.sin(f * 0.05 + 1.5) * 3;

  const chatBobA = Math.sin(f * 0.07) * 1.4;
  const chatBobB = Math.sin(f * 0.07 + 1.8) * 1.4;
  const bubbleOpA = 0.68 + 0.28 * Math.sin(f * 0.08);
  const bubbleOpB = 0.68 + 0.28 * Math.sin(f * 0.08 + 2.1);

  return (
    <>
      <DesaMap f={f} side={0} era={5} senja={0.14} />

      {/* Pendar hangat di jendela deretan rumah kiri (anak tidur nyenyak) */}
      <div
        style={{
          position: 'absolute',
          left: 26,
          top: 466,
          width: 16,
          height: 14,
          backgroundColor: '#ffd98a',
          opacity: 0.65,
          zIndex: 13,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 100,
          top: 468,
          width: 16,
          height: 14,
          backgroundColor: '#ffd98a',
          opacity: 0.65,
          zIndex: 13,
          pointerEvents: 'none',
        }}
      />

      {/* Sprite icon_zzz redup di jendela rumah (tidur nyenyak) */}
      {zzzGate > 0.005 ? (
        <>
          <Sprite
            name="icon_zzz"
            x={22}
            y={442 + zzzBobA}
            w={24}
            h={24}
            opacity={zzzGate * zzzPulseA}
            z={24}
          />
          <Sprite
            name="icon_zzz"
            x={96}
            y={444 + zzzBobB}
            w={24}
            h={24}
            opacity={zzzGate * zzzPulseB}
            z={24}
          />
        </>
      ) : null}

      {/* Tetangga mengobrol di depan rumah (figur + prop_gelembung) */}
      <Sprite
        name="warga_a_walk_0"
        x={152}
        y={462 + chatBobA}
        w={28}
        h={46}
        z={23}
      />
      <Sprite
        name="warga_b_walk_0"
        x={186}
        y={464 + chatBobB}
        w={28}
        h={46}
        flip
        z={23}
      />
      <Sprite
        name="prop_gelembung"
        x={168}
        y={438}
        w={26}
        h={20}
        opacity={bubbleOpA}
        z={24}
      />

      {/* Tetangga mengobrol hangat dekat warung kiri */}
      <Sprite
        name="warga_c_walk_0"
        x={470}
        y={464 + chatBobB}
        w={28}
        h={46}
        z={23}
      />
      <Sprite
        name="warga_d_walk_0"
        x={504}
        y={466 + chatBobA}
        w={28}
        h={46}
        flip
        z={23}
      />
      <Sprite
        name="prop_gelembung"
        x={484}
        y={440}
        w={26}
        h={20}
        opacity={bubbleOpB}
        z={24}
      />

      {/* Balai desa hidup: warga berkumpul & berdiskusi hangat di depan balai */}
      <Sprite
        name="warga_a_walk_0"
        x={96}
        y={386 + chatBobA}
        w={28}
        h={46}
        z={22}
      />
      <Sprite
        name="nadia_walk_0"
        x={136}
        y={382 + chatBobB}
        w={28}
        h={46}
        z={22}
      />
      <Sprite
        name="warga_c_walk_0"
        x={174}
        y={386 + chatBobA}
        w={28}
        h={46}
        flip
        z={22}
      />
      <Sprite
        name="warga_d_walk_0"
        x={210}
        y={388 + chatBobB}
        w={28}
        h={46}
        flip
        z={22}
      />
      <Sprite
        name="prop_gelembung"
        x={146}
        y={358}
        w={28}
        h={21}
        opacity={bubbleOpA}
        z={23}
      />

      {/* Aktivitas warga & anak bermain di lapangan (tetap hidup di B44 & B45) */}
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
          name="anak_a_walk"
          side={0}
          y={450}
          seed={17}
          speed={0.46}
          scale={0.44}
          f={f}
        />
        <Walker
          name="anak_b_walk"
          side={0}
          y={464}
          seed={41}
          speed={-0.42}
          scale={0.44}
          f={f}
        />
      </div>
    </>
  );
};

// Lapisan Sukaramai Tahun 20 (era 5): warung 3x + teras ramai + studio ringlight + karung rapi + icon_pesan menyala
const RightYear20Layer: React.FC<{ f: number; highlightStart: number }> = ({
  f,
  highlightStart,
}) => {
  const pulseGlow = 0.72 + 0.28 * Math.sin(f * 0.1);
  const pesanGlow = 0.65 + 0.35 * Math.sin(f * 0.13);
  const bobA = Math.sin(f * 0.075) * 1.4;
  const bobB = Math.sin(f * 0.075 + 1.6) * 1.4;
  const alertGate = fadeIn(f, highlightStart + 10, 18);

  return (
    <>
      <DesaMap f={f} side={1} era={5} />

      {/* Aksen studio kreatif Nadia (rumah kiri-bawah era 5 adalah Studio Nadia, x=14..80, y=432..498) */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 424,
          width: 108,
          height: 82,
          borderRadius: 16,
          backgroundColor: '#35c4e8',
          opacity: 0.16 * pulseGlow,
          zIndex: 14,
          pointerEvents: 'none',
        }}
      />
      <Sprite
        name="prop_ringlight"
        x={76}
        y={442}
        w={34}
        h={45}
        z={24}
      />
      <Sprite
        name="prop_tripod"
        x={108}
        y={450}
        w={24}
        h={36}
        z={23}
      />

      {/* Teras ramai di depan warung besar 3x (x 432..628, y 462..516) */}
      <Sprite
        name="warga_a_walk_0"
        x={438}
        y={462 + bobA}
        w={26}
        h={42}
        z={23}
      />
      <Sprite
        name="turis_walk_0"
        x={472}
        y={464 + bobB}
        w={26}
        h={42}
        flip
        z={23}
      />
      <Sprite
        name="warga_b_walk_0"
        x={516}
        y={468 + bobB}
        w={26}
        h={42}
        z={23}
      />
      <Sprite
        name="turis_walk_0"
        x={552}
        y={468 + bobA}
        w={26}
        h={42}
        flip
        z={23}
      />
      <Sprite
        name="warga_c_walk_0"
        x={590}
        y={466 + bobA}
        w={26}
        h={42}
        flip
        z={23}
      />
      <Sprite
        name="prop_gelembung"
        x={454}
        y={440}
        w={24}
        h={18}
        opacity={0.78}
        z={24}
      />
      <Sprite
        name="prop_gelembung"
        x={534}
        y={444}
        w={24}
        h={18}
        opacity={0.78}
        z={24}
      />

      {/* prop_karung tersusun rapi (kesiapsiagaan tanggap bencana dekat tepi sawah/sungai) */}
      <Sprite name="prop_karung" x={238} y={558} w={30} h={25} z={23} />
      <Sprite name="prop_karung" x={264} y={558} w={30} h={25} z={23} />
      <Sprite name="prop_karung" x={290} y={558} w={30} h={25} z={23} />
      <Sprite name="prop_karung" x={251} y={540} w={30} h={25} z={24} />
      <Sprite name="prop_karung" x={277} y={540} w={30} h={25} z={24} />

      {/* icon_pesan menyala terang (sistem peringatan cepat & kabar sigap) */}
      {alertGate > 0.005 ? (
        <>
          <div
            style={{
              position: 'absolute',
              left: 36,
              top: 212,
              width: 58,
              height: 50,
              borderRadius: '50%',
              backgroundColor: '#35c4e8',
              opacity: 0.28 * pesanGlow * alertGate,
              zIndex: 23,
              pointerEvents: 'none',
            }}
          />
          <Sprite
            name="icon_pesan"
            x={46}
            y={222 + Math.sin(f * 0.09) * 2.5}
            w={38}
            h={30}
            opacity={alertGate * (0.8 + 0.2 * pesanGlow)}
            z={24}
          />
          <div
            style={{
              position: 'absolute',
              left: 266,
              top: 332,
              width: 60,
              height: 52,
              borderRadius: '50%',
              backgroundColor: '#35c4e8',
              opacity: 0.28 * pesanGlow * alertGate,
              zIndex: 23,
              pointerEvents: 'none',
            }}
          />
          <Sprite
            name="icon_pesan"
            x={277}
            y={342 + Math.sin(f * 0.09 + 1.4) * 2.5}
            w={38}
            h={30}
            opacity={alertGate * (0.8 + 0.2 * pesanGlow)}
            z={24}
          />
        </>
      ) : null}

      {/* Walker turis & warga ramai berjalan di jalur utama Sukaramai */}
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
          name="turis_walk"
          side={1}
          y={496}
          seed={13}
          speed={0.54}
          scale={0.48}
          f={f}
        />
        <Walker
          name="turis_walk"
          side={1}
          y={508}
          seed={47}
          speed={-0.46}
          scale={0.48}
          f={f}
        />
        <Walker
          name="warga_hp_a_walk"
          side={1}
          y={502}
          seed={71}
          speed={0.42}
          scale={0.46}
          f={f}
        />
      </div>
    </>
  );
};

export const Blok12: React.FC<Blok12Props> = ({ f }) => {
  // Rentang lokal Blok12 (Tahun 20, total 1512):
  // B43: 0..190, B44: 190..610, B45: 610..1512

  // --- B43: Skor akhir Tahun 20 (checkpoint skor resmi: skor_t20_kiri + skor_t20_kanan + icon_mahkota) ---
  if (f < 190) {
    // Micro drift sangat kecil (hampir statis lembut)
    const driftScale = cam(f, 0, 190, 1.005, 1.022);
    const veilOp = cam(f, 0, 24, 0, 0.28);
    const crownOp = fadeIn(f, 24, 16);
    const crownBob = Math.sin(f * 0.085) * 2.5;
    const crownGlow = 0.72 + 0.28 * Math.sin(f * 0.11);

    return (
      <>
        <Half side={0}>
          <Cam scale={driftScale}>
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
          {/* Kartu skor akhir Sukatenang (460x212) tampil penuh di tengah sisi kiri */}
          <PopCard name="skor_t20_kiri" x={90} y={254} f={f} f0={10} z={62} />

          {/* Sprite icon_mahkota kecil di atas kartu skor kiri */}
          {crownOp > 0.005 ? (
            <>
              <div
                style={{
                  position: 'absolute',
                  left: 280,
                  top: 192 + crownBob,
                  width: 80,
                  height: 60,
                  borderRadius: '50%',
                  backgroundColor: '#ffd98a',
                  opacity: 0.26 * crownOp * crownGlow,
                  zIndex: 63,
                  pointerEvents: 'none',
                }}
              />
              <Sprite
                name="icon_mahkota"
                x={292}
                y={202 + crownBob}
                w={56}
                h={40}
                opacity={crownOp}
                z={64}
              />
            </>
          ) : null}
        </Half>

        <Half side={1}>
          <Cam scale={driftScale}>
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
          {/* Kartu skor akhir Sukaramai (460x212) tampil penuh di tengah sisi kanan */}
          <PopCard name="skor_t20_kanan" x={90} y={254} f={f} f0={20} z={62} />
        </Half>
      </>
    );
  }

  // --- B44: Kenapa Sukatenang (kiri fokus pan pelan menyapu vignette + portrait kecil; kanan DesaMap era 5 ambient makmur) ---
  if (f < 610) {
    // Kiri: pan pelan kontinu menyapu rumah (icon_zzz), tetangga mengobrol, dan balai hidup
    // Margin aman: scale 1.18..1.24 -> max |tx| >= 57.6, max |ty| >= 64.8
    const leftScale = cam(f, 190, 610, 1.18, 1.24);
    const leftTx = cam(f, 190, 610, 44, -36);
    const leftTy = cam(f, 190, 610, -24, -36);

    // Kanan: ambient makmur pelan, sedikit diredupkan agar fokus di kiri
    const rightScale = cam(f, 190, 610, 1.02, 1.05);
    const rightDim = cam(f, 190, 220, 0, 0.28);

    const wiryoVigOp = fadeIn(f, 224, 20);
    const ratnaVigOp = fadeIn(f, 294, 20);

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale} tx={leftTx} ty={leftTy}>
            <LeftYear20Layer f={f} showDetailsAt={190} />
          </Cam>

          {/* Vignette Portrait kecil tokoh Tahun 20 Sukatenang */}
          <VignettePortrait
            name="wiryo_tua_portrait_happy"
            x={28}
            y={554}
            w={104}
            h={130}
            accent="#ffd98a"
            bg="rgba(30, 46, 34, 0.88)"
            opacity={wiryoVigOp}
            z={50}
          />
          <VignettePortrait
            name="ratna_tua_portrait_neutral"
            x={156}
            y={554}
            w={104}
            h={130}
            accent="#58a05a"
            bg="rgba(30, 46, 34, 0.88)"
            opacity={ratnaVigOp}
            z={50}
          />
        </Half>

        <Half side={1} dim={rightDim}>
          <Cam scale={rightScale}>
            <RightYear20Layer f={f} highlightStart={610} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B45: Pengecualian jujur (kanan fokus zoom ke warung besar + studio + tanggap bencana + portrait; kiri vignette tenang) ---
  // Kiri: kembali lembut ke wide vignette tenang, dim halus agar fokus di kanan
  const leftScale = cam(f, 610, 1512, 1.24, 1.06);
  const leftTx = cam(f, 610, 1512, -36, 0);
  const leftTy = cam(f, 610, 1512, -36, 0);
  const leftDim = cam(f, 610, 642, 0, 0.28);
  const nadiaKiriVigOp = fadeIn(f, 660, 22);

  // Kanan: mencerah penuh, zoom fokus ke warung besar & teras ramai (610..1040) lalu pan lembut ke studio & tanggap bencana (1040..1512)
  const rightDim = cam(f, 610, 642, 0.28, 0);
  const rightScale =
    f < 1040
      ? cam(f, 610, 1040, 1.05, 1.28)
      : cam(f, 1040, 1512, 1.28, 1.18);
  const rightTx =
    f < 1040
      ? cam(f, 610, 1040, 0, -72)
      : cam(f, 1040, 1512, -72, 42);
  const rightTy =
    f < 1040
      ? cam(f, 610, 1040, 0, -52)
      : cam(f, 1040, 1512, -52, -28);

  const nadiaKananOp = fadeIn(f, 638, 22);
  const lastriVigOp = fadeIn(f, 686, 22);
  const danuVigOp = fadeIn(f, 756, 22);

  return (
    <>
      <Half side={0} dim={leftDim}>
        <Cam scale={leftScale} tx={leftTx} ty={leftTy}>
          <LeftYear20Layer f={f} showDetailsAt={190} />
        </Cam>

        {/* Vignette tenang Sukatenang di bagian bawah */}
        <VignettePortrait
          name="wiryo_tua_portrait_happy"
          x={28}
          y={554}
          w={104}
          h={130}
          accent="#ffd98a"
          bg="rgba(30, 46, 34, 0.88)"
          opacity={1}
          z={50}
        />
        <VignettePortrait
          name="ratna_tua_portrait_neutral"
          x={156}
          y={554}
          w={104}
          h={130}
          accent="#58a05a"
          bg="rgba(30, 46, 34, 0.88)"
          opacity={1}
          z={50}
        />
        <VignettePortrait
          name="nadia_dewasa_kiri_portrait_happy"
          x={284}
          y={554}
          w={104}
          h={130}
          accent="#ffd98a"
          bg="rgba(30, 46, 34, 0.88)"
          opacity={nadiaKiriVigOp}
          z={50}
        />
      </Half>

      <Half side={1} dim={rightDim}>
        <Cam scale={rightScale} tx={rightTx} ty={rightTy}>
          <RightYear20Layer f={f} highlightStart={610} />
        </Cam>

        {/* Vignette Portrait kanan: Bu Lastri & Pak Danu Tahun 20 */}
        <VignettePortrait
          name="lastri_tua_portrait_happy"
          x={24}
          y={558}
          w={100}
          h={125}
          accent="#35c4e8"
          bg="rgba(22, 32, 52, 0.9)"
          opacity={lastriVigOp}
          z={50}
        />
        <VignettePortrait
          name="danu_tua_portrait_happy"
          x={148}
          y={558}
          w={100}
          h={125}
          accent="#35c4e8"
          bg="rgba(22, 32, 52, 0.9)"
          opacity={danuVigOp}
          z={50}
        />

        {/* Portrait Nadia (35) kreator tenang + aksen ringlight studio di sudut kanan bawah */}
        {nadiaKananOp > 0.005 ? (
          <div
            style={{
              position: 'absolute',
              left: 446,
              top: 500,
              width: 170,
              height: 196,
              backgroundColor: 'rgba(22, 30, 48, 0.92)',
              border: '3px solid #f05ab4',
              boxSizing: 'border-box',
              opacity: nadiaKananOp,
              zIndex: 52,
              pointerEvents: 'none',
            }}
          >
            <Portrait
              name="nadia_dewasa_kanan_portrait_calm"
              x={12}
              y={8}
              w={144}
              h={180}
            />
            <Sprite
              name="prop_ringlight"
              x={132}
              y={12}
              w={28}
              h={37}
              z={2}
            />
          </div>
        ) : null}
      </Half>
    </>
  );
};
