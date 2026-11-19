import React from 'react';
import { interpolate } from 'remotion';
import {
  Cam,
  CardImg,
  EZ,
  H,
  HALF,
  Half,
  Portrait,
  Sprite,
  Walker,
  cam,
  fadeIn,
} from './common';
import { BalaiScene, DesaMap, WarungScene } from './scenes';

export interface Blok08Props {
  f: number;
}

function modPos(v: number, m: number): number {
  return ((v % m) + m) % m;
}

const DIALOG2_CARDS: ReadonlyArray<string> = [
  'd2_1',
  'd2_2',
  'd2_3',
  'd2_4',
];

// Papan hitung manual (blok kapur / garis lidi) menempel pada area papan BalaiScene
const PapanHitungKapur: React.FC<{
  f: number;
  startF: number;
  animateStagger?: boolean;
}> = ({ f, startF, animateStagger = false }) => {
  // 12 kelompok garis lidi kapur (2 baris x 6 kelompok)
  const groups = Array.from({ length: 12 }, (_, idx) => {
    const col = idx % 6;
    const row = Math.floor(idx / 6);
    const gx = 192 + col * 44;
    const gy = 148 + row * 48;
    const op = animateStagger
      ? fadeIn(f, startF + idx * 24, 14)
      : 0.9;
    return { gx, gy, op, idx };
  });

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: HALF,
        height: H,
        zIndex: 8,
        pointerEvents: 'none',
      }}
    >
      {/* Latar papan tulis hijau gelap di atas papan balai */}
      <div
        style={{
          position: 'absolute',
          left: 172,
          top: 112,
          width: 296,
          height: 158,
          backgroundColor: '#274d36',
          border: '6px solid #754c2e',
          boxSizing: 'border-box',
        }}
      />
      {/* Garis pemisah dua kolom kandidat */}
      <div
        style={{
          position: 'absolute',
          left: 184,
          top: 132,
          width: 272,
          height: 4,
          backgroundColor: '#e8e4d8',
          opacity: 0.75,
        }}
      />
      {/* Garis-garis lidi kapur */}
      {groups.map((g) => {
        if (g.op <= 0.005) {
          return null;
        }
        return (
          <div
            key={`tl-${g.idx}`}
            style={{
              position: 'absolute',
              left: g.gx,
              top: g.gy,
              width: 34,
              height: 28,
              opacity: g.op,
            }}
          >
            {[0, 7, 14, 21].map((sx) => (
              <div
                key={`st-${sx}`}
                style={{
                  position: 'absolute',
                  left: sx,
                  top: 2,
                  width: 3,
                  height: 24,
                  backgroundColor: '#f5f2e6',
                }}
              />
            ))}
            {/* Coretan miring ke-5 */}
            <div
              style={{
                position: 'absolute',
                left: -2,
                top: 12,
                width: 30,
                height: 3,
                backgroundColor: '#ffd98a',
                transform: 'rotate(-24deg)',
              }}
            />
          </div>
        );
      })}
    </div>
  );
};

// Figur warga melangkah dengan posisi kontinu terkendali (stepping hanya siklus kaki)
const StepCitizen: React.FC<{
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  flip?: boolean;
  f: number;
  z?: number;
}> = ({ name, x, y, w, h, flip = false, f, z = 25 }) => {
  const frameIdx = ((Math.floor(f / 8) % 4) + 4) % 4;
  return (
    <Sprite
      name={`${name}_${frameIdx}`}
      x={x}
      y={y}
      w={w}
      h={h}
      flip={flip}
      z={z}
    />
  );
};

export const Blok08: React.FC<Blok08Props> = ({ f }) => {
  // Rentang lokal Blok08 (total 2785):
  // B28: 0..260, B29: 260..925, B30: 925..1447, B31: 1447..1972, B32: 1972..2452, B33: 2452..2785

  // --- B28: Cerita berbelok (Balai + papan hitung kiri; DesaMap era 3 + baliho + Danu kanan) ---
  if (f < 260) {
    // Zoom-in ringan tegas (tempo naik, tetap easing kontinu)
    const zoomScale = cam(f, 0, 260, 1.0, 1.12);
    const danuOp = fadeIn(f, 14, 18);

    return (
      <>
        <Half side={0}>
          <Cam scale={zoomScale}>
            <BalaiScene f={f} side={0} />
            <PapanHitungKapur f={f} startF={0} animateStagger={false} />
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 13 }}>
              <Portrait
                name="wiryo_pensiun_portrait_neutral"
                x={216}
                y={266}
                w={206}
                h={258}
              />
            </div>
            <Sprite name="warga_a_walk_0" x={76} y={462} w={72} h={126} z={14} />
            <Sprite name="warga_b_walk_0" x={492} y={462} w={72} h={126} flip z={14} />
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={zoomScale}>
            <DesaMap f={f} side={1} era={3} />
            {/* Baliho pilkades tambahan memenuhi sudut desa */}
            <Sprite name="prop_baliho" x={118} y={456} w={68} h={45} z={18} />
            <Sprite name="prop_baliho" x={428} y={368} w={72} h={48} z={18} />
            <Sprite name="prop_baliho" x={238} y={548} w={74} h={49} z={18} />
            {/* Potret Pak Danu tampil singkat di dunia kanan */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 24 }}>
              <Portrait
                name="danu_muda_portrait_happy"
                x={218}
                y={166}
                w={204}
                h={255}
                opacity={danuOp}
              />
            </div>
          </Cam>
        </Half>
      </>
    );
  }

  // --- B29: Video potongan / hoaks (kanan fokus; kiri tenang dim 0.15) ---
  if (f < 925) {
    const leftScale = cam(f, 260, 925, 1.0, 1.03);
    const rightScale = cam(f, 260, 925, 1.02, 1.1);

    // Penyebaran hoaks: ponsel berpindah kontinu antar warga
    const phoneX = interpolate(
      f,
      [260, 410, 560, 720, 925],
      [78, 246, 446, 168, 512],
      { easing: EZ, extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
    );
    const phoneY = 456 - Math.abs(Math.sin((f - 260) * 0.04)) * 24;
    const viralPulse = 0.5 + 0.5 * Math.sin(f * 0.16);

    // Cuplikan asli di belakang (Danu menolak amplop — amplop bergeser menjauh kontinu)
    const truthOp = fadeIn(f, 340, 22);
    const pushAmplopX = cam(f, 430, 740, 118, 198);

    // Cuplikan palsu terpotong di depan (Danu letih + amplop dekat + gunting)
    const fakeOp = fadeIn(f, 395, 22);
    const guntingShift = Math.sin(f * 0.15) * 5;

    // Warga terpecah menjadi dua kubu saling menjauh kontinu
    const splitShift = cam(f, 520, 880, 0, 138);

    return (
      <>
        <Half side={0} dim={0.15}>
          <Cam scale={leftScale}>
            <BalaiScene f={f} side={0} />
            <PapanHitungKapur f={f} startF={260} animateStagger={false} />
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 13 }}>
              <Portrait
                name="wiryo_pensiun_portrait_neutral"
                x={216}
                y={266}
                w={206}
                h={258}
              />
            </div>
            <Sprite name="warga_a_walk_0" x={76} y={462} w={72} h={117} z={14} />
            <Sprite name="warga_b_walk_0" x={492} y={462} w={72} h={117} flip z={14} />
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 15 }}>
              <Walker
                name="warga_c_walk"
                side={0}
                y={534}
                seed={19}
                speed={0.22}
                scale={0.82}
                f={f}
              />
            </div>
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={rightScale}>
            <DesaMap f={f} side={1} era={3} />

            {/* Bingkai asli di belakang (kanan-atas): Danu muda mendorong menolak amplop */}
            {truthOp > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 274,
                  top: 88,
                  width: 306,
                  height: 204,
                  backgroundColor: '#1b263b',
                  border: '4px solid #69a84f',
                  opacity: truthOp,
                  zIndex: 23,
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                <Portrait
                  name="danu_muda_portrait_neutral"
                  x={34}
                  y={16}
                  w={136}
                  h={170}
                />
                {/* Amplop didorong menjauh secara kontinu */}
                <Sprite
                  name="prop_amplop"
                  x={pushAmplopX + 38}
                  y={104}
                  w={56}
                  h={40}
                  z={24}
                />
                <Sprite
                  name="icon_x"
                  x={pushAmplopX + 50}
                  y={66}
                  w={32}
                  h={32}
                  opacity={0.9}
                  z={25}
                />
              </div>
            ) : null}

            {/* Cuplikan potongan palsu di depan (kiri-bawah): bingkai blok merah muda + gunting */}
            {fakeOp > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 52,
                  top: 162,
                  width: 248,
                  height: 196,
                  backgroundColor: '#29192b',
                  border: '4px dashed #f05ab4',
                  opacity: fakeOp,
                  zIndex: 26,
                  overflow: 'hidden',
                  boxSizing: 'border-box',
                }}
              >
                <Portrait
                  name="danu_letih_portrait_neutral"
                  x={18}
                  y={14}
                  w={134}
                  h={168}
                />
                <Sprite
                  name="prop_amplop"
                  x={150}
                  y={98}
                  w={60}
                  h={43}
                  z={27}
                />
              </div>
            ) : null}

            {/* Gunting pemotong di tepi bingkai cuplikan palsu */}
            {fakeOp > 0.005 ? (
              <Sprite
                name="prop_gunting"
                x={272}
                y={146 + guntingShift}
                w={54}
                h={54}
                opacity={fakeOp}
                z={28}
              />
            ) : null}

            {/* Ponsel penyebar hoaks berpindah kontinu antar warga */}
            <div
              style={{
                position: 'absolute',
                left: phoneX - 18,
                top: phoneY - 14,
                width: 82,
                height: 98,
                borderRadius: 42,
                backgroundColor: '#f05ab4',
                opacity: 0.25 + 0.25 * viralPulse,
                zIndex: 28,
                pointerEvents: 'none',
              }}
            />
            <Sprite
              name="prop_ponsel_feed"
              x={phoneX}
              y={phoneY}
              w={46}
              h={72}
              z={29}
            />

            {/* Dua kubu warga terpecah dan saling menjauh kontinu */}
            <StepCitizen
              name="warga_a_walk"
              x={216 - splitShift}
              y={516}
              w={48}
              h={84}
              flip
              f={f}
              z={27}
            />
            <StepCitizen
              name="warga_b_walk"
              x={262 - splitShift}
              y={522}
              w={48}
              h={84}
              flip
              f={f}
              z={27}
            />
            <StepCitizen
              name="warga_hp_a_walk"
              x={334 + splitShift}
              y={516}
              w={48}
              h={84}
              f={f}
              z={27}
            />
            <StepCitizen
              name="warga_hp_b_walk"
              x={380 + splitShift}
              y={522}
              w={48}
              h={84}
              f={f}
              z={27}
            />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B30: Dialog Danu-Lastri (kanan fokus WarungScene big night + d2_1..d2_4; kiri dim 0.35) ---
  if (f < 1447) {
    const leftScale = cam(f, 925, 1447, 1.0, 1.02);
    const rightScale = cam(f, 925, 1447, 1.0, 1.05);
    const rightTx = cam(f, 925, 1447, -5, 5);

    // 4 kartu dialog d2_1..d2_4 bergantian pada sub-rentang B30 (sesuai panjang baris)
    // d2_1 (Danu): 925..1025, d2_2 (Lastri): 1025..1195, d2_3 (Lastri): 1195..1295, d2_4 (Danu): 1295..1447
    let segIdx = 0;
    let segStart = 925;
    if (f >= 1295) {
      segIdx = 3;
      segStart = 1295;
    } else if (f >= 1195) {
      segIdx = 2;
      segStart = 1195;
    } else if (f >= 1025) {
      segIdx = 1;
      segStart = 1025;
    }
    const cardName = DIALOG2_CARDS[segIdx];
    const cardOp = fadeIn(f, segStart, 12);

    const mouthOpen = Math.floor(f / 6) % 2 === 1;
    const lastriSpeaks = segIdx === 1 || segIdx === 2;
    const danuSpeaks = !lastriSpeaks;

    const danuPortrait =
      danuSpeaks && mouthOpen
        ? 'danu_letih_portrait_open'
        : 'danu_letih_portrait_sad';
    const lastriPortrait =
      lastriSpeaks && mouthOpen
        ? 'lastri_tua_portrait_open'
        : 'lastri_tua_portrait_neutral';

    const wipeX = Math.sin(f * 0.1) * 6;

    return (
      <>
        <Half side={0} dim={0.35}>
          <Cam scale={leftScale}>
            <BalaiScene f={f} side={0} />
            <PapanHitungKapur f={f} startF={925} animateStagger={false} />
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
              <Walker
                name="warga_a_walk"
                side={0}
                y={524}
                seed={9}
                speed={0.28}
                scale={0.85}
                f={f}
              />
              <Walker
                name="warga_b_walk"
                side={0}
                y={542}
                seed={41}
                speed={-0.22}
                scale={0.82}
                f={f}
              />
            </div>
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={rightScale} tx={rightTx}>
            <WarungScene f={f} side={1} big={true} night={true} />

            {/* Pak Danu duduk letih di sisi kiri meja */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
              <Portrait
                name={danuPortrait}
                x={68}
                y={278}
                w={210}
                h={262}
              />
            </div>

            {/* Bu Lastri berdiri di seberang meja mengelap gelas */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
              <Portrait
                name={lastriPortrait}
                x={356}
                y={246}
                w={210}
                h={262}
              />
            </div>

            {/* Cangkir kopi di atas meja antara Danu dan Lastri */}
            <Sprite
              name="prop_cangkir"
              x={278}
              y={488}
              w={48}
              h={42}
              z={16}
            />
            {/* Kain lap / gelas kecil bergerak halus di tangan Lastri */}
            <div
              style={{
                position: 'absolute',
                left: 344 + wipeX,
                top: 454,
                width: 24,
                height: 18,
                backgroundColor: '#e8e2d5',
                border: '2px solid #9aa4b8',
                zIndex: 16,
              }}
            />
          </Cam>

          {/* Kotak dialog RPG (d2_1..d2_4) di bawah sisi kanan, aman di dalam 0..639 */}
          {cardOp > 0.005 ? (
            <CardImg
              name={cardName}
              x={56}
              y={576}
              scale={0.88}
              opacity={cardOp}
              z={62}
            />
          ) : null}
        </Half>
      </>
    );
  }

  // --- B31: Wiryo pensiun & Nadia terpilih (kiri fokus BalaiScene; kanan dim 0.35 terpisah) ---
  if (f < 1972) {
    const leftScale = cam(f, 1447, 1972, 1.0, 1.06);
    const rightScale = cam(f, 1447, 1972, 1.0, 1.02);

    // Pak Wiryo menyerahkan prop_map secara kontinu ke arah Nadia
    const mapX = cam(f, 1510, 1690, 212, 294);
    const mapOp = fadeIn(f, 1470, 18);
    const jabatOp = fadeIn(f, 1740, 20);
    const jabatBob = Math.sin(f * 0.1) * 3;

    // Dua kubu di kanan tetap menjaga jarak di sisi jauh kiri & kanan jalan
    const leftCampX = 76 + Math.sin(f * 0.025) * 14;
    const rightCampX = 504 + Math.sin(f * 0.025 + 2.4) * 14;

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale}>
            <BalaiScene f={f} side={0} />
            {/* Papan hitung manual terisi garis lidi kapur bertahap */}
            <PapanHitungKapur f={f} startF={1460} animateStagger={true} />

            {/* Pak Wiryo (70) pensiun tersenyum menyerahkan map desa */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 13 }}>
              <Portrait
                name="wiryo_pensiun_portrait_happy"
                x={44}
                y={272}
                w={196}
                h={245}
              />
            </div>

            {/* Nadia (27) terpilih tersenyum */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 13 }}>
              <Portrait
                name="nadia_dewasa_kiri_portrait_happy"
                x={278}
                y={272}
                w={196}
                h={245}
              />
            </div>

            {/* Map desa diserahkan */}
            {mapOp > 0.005 ? (
              <Sprite
                name="prop_map"
                x={mapX}
                y={416}
                w={64}
                h={48}
                opacity={mapOp}
                z={15}
              />
            ) : null}

            {/* Kandidat lawan berjabat tangan damai dengan Nadia */}
            <Sprite
              name="warga_b_walk_0"
              x={494}
              y={356}
              w={92}
              h={150}
              flip
              z={14}
            />
            {jabatOp > 0.005 ? (
              <Sprite
                name="icon_jabat"
                x={452}
                y={332 + jabatBob}
                w={58}
                h={38}
                opacity={jabatOp}
                z={16}
              />
            ) : null}
          </Cam>
        </Half>

        <Half side={1} dim={0.35}>
          <Cam scale={rightScale}>
            <DesaMap f={f} side={1} era={3} />
            {/* Dua kubu warga tetap menjaga jarak jauh */}
            <StepCitizen
              name="warga_a_walk"
              x={leftCampX}
              y={502}
              w={42}
              h={74}
              f={f}
              z={25}
            />
            <StepCitizen
              name="warga_b_walk"
              x={leftCampX + 34}
              y={506}
              w={42}
              h={74}
              f={f}
              z={25}
            />
            <StepCitizen
              name="warga_hp_a_walk"
              x={rightCampX - 34}
              y={502}
              w={42}
              h={74}
              flip
              f={f}
              z={25}
            />
            <StepCitizen
              name="warga_hp_b_walk"
              x={rightCampX}
              y={506}
              w={42}
              h={74}
              flip
              f={f}
              z={25}
            />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B32: Banjir (rain=true, flood 0->0.8 kontinu; kiri jam_plus2 & kaget; kanan icon_pesan + karung) ---
  if (f < 2452) {
    const floodLevel = cam(f, 1972, 2452, 0, 0.8);
    const jamOp = fadeIn(f, 2032, 18);
    const panicOp = fadeIn(f, 2220, 18);
    const houseFloodOp = cam(f, 2240, 2452, 0, 0.54);

    // Kanan: icon_pesan menyala SERENTAK di atas semua warga
    const alertOp = fadeIn(f, 2014, 12);
    const alertPulse = 0.78 + 0.22 * Math.sin(f * 0.22);
    const carryBagOp = fadeIn(f, 2046, 14);

    // Posisi karung pasir berderet di tepi tanggul kanan
    const sandbagXs = [58, 122, 186, 250, 314, 378, 442, 506, 566];
    const alertCitizens = [92, 214, 344, 468, 560];

    return (
      <>
        <Half side={0}>
          <Cam scale={1.0}>
            <DesaMap f={f} side={0} era={3} rain={true} flood={floodLevel} />

            {/* Luapan air mulai merendam bagian lantai rumah kiri di akhir beat */}
            {houseFloodOp > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 8,
                  top: 478,
                  width: 232,
                  height: 28,
                  backgroundColor: '#2c6ea3',
                  opacity: houseFloodOp,
                  zIndex: 18,
                  pointerEvents: 'none',
                }}
              />
            ) : null}

            {/* Warga kaget & bergerak jauh lebih cepat di akhir beat saat air sudah naik */}
            {panicOp > 0.005 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: HALF,
                  height: H,
                  opacity: panicOp,
                  zIndex: 25,
                }}
              >
                <Walker
                  name="warga_a_walk"
                  side={0}
                  y={492}
                  seed={2}
                  speed={1.45}
                  scale={0.56}
                  f={f}
                />
                <Walker
                  name="warga_b_walk"
                  side={0}
                  y={496}
                  seed={17}
                  speed={-1.35}
                  scale={0.56}
                  f={f}
                />
                <Walker
                  name="remaja_a_walk"
                  side={0}
                  y={494}
                  seed={31}
                  speed={1.55}
                  scale={0.54}
                  f={f}
                />
              </div>
            ) : null}
          </Cam>

          {/* Kartu jam +2 jam di sisi kiri (keterlambatan kabar) */}
          {jamOp > 0.005 ? (
            <CardImg
              name="jam_plus2"
              x={190}
              y={92}
              opacity={jamOp}
              z={60}
            />
          ) : null}
        </Half>

        <Half side={1}>
          <Cam scale={1.0}>
            <DesaMap f={f} side={1} era={3} rain={true} flood={floodLevel} />

            {/* Warga kanan sigap menerima peringatan serentak dan membawa karung pasir */}
            {alertCitizens.map((cx, idx) => {
              const stepDrift = Math.sin(f * 0.06 + idx * 1.3) * 14;
              return (
                <React.Fragment key={`al-${idx}`}>
                  <StepCitizen
                    name={idx % 2 === 0 ? 'warga_hp_a_walk' : 'warga_hp_b_walk'}
                    x={cx + stepDrift - 18}
                    y={496}
                    w={38}
                    h={66}
                    flip={idx % 2 === 1}
                    f={f}
                    z={25}
                  />
                  {/* Karung pasir dibawa warga saat bergerak menumpuk tanggul */}
                  {carryBagOp > 0.005 ? (
                    <Sprite
                      name="prop_karung"
                      x={cx + stepDrift - 14}
                      y={522}
                      w={30}
                      h={25}
                      opacity={carryBagOp}
                      z={26}
                    />
                  ) : null}
                  {/* Ikon pesan menyala serempak di atas tiap warga */}
                  {alertOp > 0.005 ? (
                    <>
                      <div
                        style={{
                          position: 'absolute',
                          left: cx + stepDrift - 22,
                          top: 454,
                          width: 48,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: '#35c4e8',
                          opacity: 0.34 * alertOp * alertPulse,
                          zIndex: 26,
                          pointerEvents: 'none',
                        }}
                      />
                      <Sprite
                        name="icon_pesan"
                        x={cx + stepDrift - 16}
                        y={460}
                        w={36}
                        h={28}
                        opacity={alertOp}
                        z={27}
                      />
                    </>
                  ) : null}
                </React.Fragment>
              );
            })}

            {/* Deretan karung pasir ditumpuk di tepi jalan/sawah untuk menahan luapan air */}
            {sandbagXs.map((sx, idx) => {
              const bagOp = fadeIn(f, 2060 + idx * 16, 14);
              if (bagOp <= 0.005) {
                return null;
              }
              return (
                <Sprite
                  key={`bag-${idx}`}
                  name="prop_karung"
                  x={sx}
                  y={534 + (idx % 2) * 4}
                  w={44}
                  h={36}
                  opacity={bagOp}
                  z={28}
                />
              );
            })}
          </Cam>
        </Half>
      </>
    );
  }

  // --- B33: Pasca-banjir (flood surut 0.8->0.25 kontinu; kiri sisa rendaman; kanan turunkan karung; pull-back lembut) ---
  const recedeFlood = cam(f, 2452, 2785, 0.8, 0.25);
  const pullScale = cam(f, 2452, 2785, 1.05, 1.0);

  // Sisa rendaman air di sekitar rumah & sawah kiri (surut perlahan)
  const puddleOp = cam(f, 2452, 2785, 0.56, 0.28);

  // Warga kanan menurunkan karung pasir secara kontinu
  const sandbagXs = [58, 122, 186, 250, 314, 378, 442, 506, 566];
  const bagLowerY = cam(f, 2475, 2745, 534, 554);

  return (
    <>
      <Half side={0}>
        <Cam scale={pullScale}>
          <DesaMap f={f} side={0} era={3} rain={false} flood={recedeFlood} />

          {/* Overlay air sisa merendam bagian bawah rumah & sawah kiri */}
          <div
            style={{
              position: 'absolute',
              left: 8,
              top: 478,
              width: 232,
              height: 28,
              backgroundColor: '#2c6ea3',
              opacity: puddleOp,
              zIndex: 18,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 545,
              width: HALF,
              height: 76,
              backgroundColor: '#2c6ea3',
              opacity: puddleOp * 0.72,
              zIndex: 18,
              pointerEvents: 'none',
            }}
          />
          {/* Riak sisa genangan */}
          {[42, 190, 360, 510].map((rx, idx) => {
            const driftX = modPos(rx + f * 0.35, HALF - 40);
            return (
              <div
                key={`pud-${idx}`}
                style={{
                  position: 'absolute',
                  left: driftX,
                  top: 564 + (idx % 2) * 24,
                  width: 34,
                  height: 3,
                  backgroundColor: '#9dd4f5',
                  opacity: puddleOp * 0.85,
                  zIndex: 19,
                  pointerEvents: 'none',
                }}
              />
            );
          })}

          {/* Warga memandang air yang surut */}
          <Sprite name="warga_a_walk_0" x={112} y={494} w={42} h={74} z={25} />
          <Sprite name="warga_b_walk_0" x={294} y={496} w={42} h={74} flip z={25} />
        </Cam>
      </Half>

      <Half side={1}>
        <Cam scale={pullScale}>
          <DesaMap f={f} side={1} era={3} rain={false} flood={recedeFlood} />

          {/* Warga menurunkan / membereskan karung pasir */}
          {[96, 268, 444].map((wx, idx) => (
            <Sprite
              key={`clr-${idx}`}
              name={idx % 2 === 0 ? 'warga_a_walk_0' : 'warga_c_walk_0'}
              x={wx}
              y={496}
              w={42}
              h={74}
              flip={idx === 2}
              z={25}
            />
          ))}
          {sandbagXs.map((sx, idx) => {
            // Sebagian karung perlahan menghilang (diangkat warga)
            const liftOp =
              idx % 2 === 0
                ? cam(f, 2520 + idx * 18, 2650 + idx * 18, 1, 0.15)
                : 0.92;
            return (
              <Sprite
                key={`rbag-${idx}`}
                name="prop_karung"
                x={sx}
                y={bagLowerY + (idx % 2) * 3}
                w={42}
                h={34}
                opacity={liftOp}
                z={26}
              />
            );
          })}
        </Cam>
      </Half>
    </>
  );
};
