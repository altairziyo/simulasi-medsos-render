import React from 'react';
import { interpolate } from 'remotion';
import {
  Cam,
  H,
  HALF,
  Half,
  Portrait,
  Sprite,
  Walker,
  cam,
  fadeIn,
} from './common';
import { DesaMap, LapanganScene, TerasScene, WarungScene } from './scenes';

export interface Blok10Props {
  f: number;
}

function modPos(v: number, m: number): number {
  return ((v % m) + m) % m;
}

// Anak-anak bermain bola di area lapangan peta desa (stepping siklus sprite per 8 frame)
const LapanganKidsPlay: React.FC<{ f: number; seedOffset: number }> = ({
  f,
  seedOffset,
}) => {
  const stepIdx = ((Math.floor(f / 8) % 4) + 4) % 4;
  const ballPhase = modPos((f + seedOffset) * 0.024, 1);
  const ballX = interpolate(ballPhase, [0, 0.5, 1], [292, 376, 292]);
  const ballY = 442 - Math.sin(ballPhase * Math.PI * 2) * 20;
  const hopA = Math.abs(Math.sin((f + seedOffset) * 0.09)) * 4;
  const hopB = Math.abs(Math.sin((f + seedOffset) * 0.09 + 1.5)) * 4;

  return (
    <>
      <Sprite
        name={`anak_a_walk_${stepIdx}`}
        x={276}
        y={434 - hopA}
        w={28}
        h={45}
        z={23}
      />
      <Sprite
        name={`anak_b_walk_${stepIdx}`}
        x={368}
        y={436 - hopB}
        w={28}
        h={45}
        flip
        z={23}
      />
      <Sprite name="prop_bola_voli" x={ballX} y={ballY} w={18} h={18} z={24} />
    </>
  );
};

// Satu set meja kayu luar warung (blok cokelat) + sepasang warga duduk bertatap muka + ponsel redup di meja
const OutdoorTablePair: React.FC<{
  x: number;
  y: number;
  leftSprite: string;
  rightSprite: string;
  opacity: number;
  f: number;
  phaseOffset: number;
  z?: number;
}> = ({
  x,
  y,
  leftSprite,
  rightSprite,
  opacity,
  f,
  phaseOffset,
  z = 26,
}) => {
  if (opacity <= 0.005) {
    return null;
  }
  const bobL = Math.sin(f * 0.075 + phaseOffset) * 1.4;
  const bobR = Math.sin(f * 0.075 + phaseOffset + 1.7) * 1.4;
  const bubbleOp = 0.65 + 0.3 * Math.sin(f * 0.08 + phaseOffset);

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 82,
        height: 62,
        opacity,
        zIndex: z,
      }}
    >
      {/* Warga duduk bertatap muka di kiri & kanan meja */}
      <Sprite name={leftSprite} x={2} y={8 + bobL} w={28} h={45} z={2} />
      <Sprite name={rightSprite} x={52} y={8 + bobR} w={28} h={45} flip z={2} />

      {/* Meja kayu luar (blok cokelat) */}
      <div
        style={{
          position: 'absolute',
          left: 20,
          top: 28,
          width: 42,
          height: 9,
          backgroundColor: '#9c683d',
          border: '2px solid #59381e',
          boxSizing: 'border-box',
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 37,
          width: 5,
          height: 18,
          backgroundColor: '#59381e',
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 53,
          top: 37,
          width: 5,
          height: 18,
          backgroundColor: '#59381e',
          zIndex: 3,
        }}
      />
      {/* Bangku kecil kiri & kanan */}
      <div
        style={{
          position: 'absolute',
          left: 6,
          top: 41,
          width: 14,
          height: 6,
          backgroundColor: '#7a4f2d',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 62,
          top: 41,
          width: 14,
          height: 6,
          backgroundColor: '#7a4f2d',
          zIndex: 1,
        }}
      />

      {/* Ponsel redup tergeletak di atas meja (bukan dipegang/merekam) */}
      <div
        style={{
          position: 'absolute',
          left: 35,
          top: 19,
          width: 12,
          height: 18,
          transform: 'rotate(78deg)',
          transformOrigin: '50% 50%',
          zIndex: 4,
        }}
      >
        <Sprite name="prop_ponsel_chat" x={0} y={0} w={12} h={18} opacity={0.44} />
      </div>

      {/* Gelembung obrolan tatap muka */}
      <Sprite
        name="prop_gelembung"
        x={28}
        y={-6}
        w={24}
        h={18}
        opacity={bubbleOp}
        z={5}
      />
    </div>
  );
};

export const Blok10: React.FC<Blok10Props> = ({ f }) => {
  // Rentang lokal Blok10 (Tahun 15-17, total 1224):
  // B37: 0..387, B38: 387..725, B39: 725..1224

  // --- B37: Titik tengah (DesaMap era 4 dua sisi + anak bermain di lapangan + zoom-out lembut kontinu) ---
  if (f < 387) {
    const zoomScale = cam(f, 0, 387, 1.18, 1.02);
    const zoomTy = cam(f, 0, 387, -16, 0);

    return (
      <>
        {/* Kiri: DesaMap era 4 asri, lapangan/balai hidup (Walker warga + anak) */}
        <Half side={0}>
          <Cam scale={zoomScale} ty={zoomTy}>
            <DesaMap f={f} side={0} era={4} />
            <LapanganKidsPlay f={f} seedOffset={0} />
            {/* Warga berkumpul hidup di depan balai */}
            <Sprite name="warga_a_walk_0" x={118} y={388} w={30} h={48} z={22} />
            <Sprite name="warga_c_walk_0" x={156} y={390} w={30} h={48} flip z={22} />
            <Sprite
              name="prop_gelembung"
              x={134}
              y={368}
              w={26}
              h={20}
              opacity={0.78}
              z={23}
            />
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
                name="warga_b_walk"
                side={0}
                y={406}
                seed={12}
                speed={0.4}
                scale={0.46}
                f={f}
              />
              <Walker
                name="anak_a_walk"
                side={0}
                y={452}
                seed={27}
                speed={0.56}
                scale={0.44}
                f={f}
              />
              <Walker
                name="anak_b_walk"
                side={0}
                y={464}
                seed={51}
                speed={-0.5}
                scale={0.44}
                f={f}
              />
            </div>
          </Cam>
        </Half>

        {/* Kanan: DesaMap era 4, anak-anak kembali bermain di area lapangan */}
        <Half side={1}>
          <Cam scale={zoomScale} ty={zoomTy}>
            <DesaMap f={f} side={1} era={4} />
            <LapanganKidsPlay f={f} seedOffset={37} />
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
                side={1}
                y={448}
                seed={19}
                speed={0.58}
                scale={0.44}
                f={f}
              />
              <Walker
                name="anak_b_walk"
                side={1}
                y={462}
                seed={44}
                speed={-0.52}
                scale={0.44}
                f={f}
              />
            </div>
          </Cam>
        </Half>
      </>
    );
  }

  // --- B38: Sukaramai ke lapangan (kanan fokus zoom warung + meja kayu luar + Lastri + pasangan warga + ponsel redup; kiri LapanganScene voli redup hidup) ---
  if (f < 725) {
    // Zoom-out lembut berlanjut di kedua sisi
    const leftScale = cam(f, 387, 725, 1.09, 1.02);
    // Kanan: zoom fokus ke warung & meja kayu luar (x~420..600, y~430..540) lalu zoom-out lembut
    // Margin aman: scale 1.42 -> max |tx|=134.4, |ty|=151.2; scale 1.24 -> max |tx|=76.8, |ty|=86.4
    const rightScale = cam(f, 387, 725, 1.42, 1.24);
    const rightTx = cam(f, 387, 725, -118, -68);
    const rightTy = cam(f, 387, 725, -96, -54);

    // Bola voli kiri melambung kontinu melintasi net
    const vBallT = modPos(f * 0.026, 1);
    const vBallX = interpolate(vBallT, [0, 0.5, 1], [156, 444, 156]);
    const vBallY = 264 - Math.sin(vBallT * Math.PI * 2) * 44;
    const vJumpL = Math.abs(Math.sin(f * 0.08)) * 10;
    const vJumpR = Math.abs(Math.sin(f * 0.08 + 1.8)) * 10;

    // Fade-in berjenjang 3 meja kayu luar warung di kanan
    const tbl1Op = fadeIn(f, 404, 18);
    const tbl2Op = fadeIn(f, 442, 18);
    const tbl3Op = fadeIn(f, 480, 18);
    const lastriOp = fadeIn(f, 398, 18);

    return (
      <>
        {/* Kiri (redup hidup): LapanganScene ramai voli */}
        <Half side={0} dim={0.35}>
          <Cam scale={leftScale}>
            <LapanganScene f={f} side={0} />
            {/* Pemain voli aktif di kedua sisi net */}
            <Sprite
              name="remaja_a_walk_0"
              x={116}
              y={426 - vJumpL}
              w={74}
              h={120}
              z={13}
            />
            <Sprite
              name="warga_c_walk_0"
              x={214}
              y={454}
              w={74}
              h={120}
              z={13}
            />
            <Sprite
              name="remaja_b_walk_0"
              x={448}
              y={428 - vJumpR}
              w={74}
              h={120}
              flip
              z={13}
            />
            <Sprite
              name="warga_d_walk_0"
              x={364}
              y={458}
              w={74}
              h={120}
              flip
              z={13}
            />
            <Sprite
              name="prop_bola_voli"
              x={vBallX}
              y={vBallY}
              w={46}
              h={46}
              z={16}
            />
            <Sprite
              name="prop_gelembung"
              x={522}
              y={392}
              w={42}
              h={32}
              opacity={0.76}
              z={16}
            />
            {/* Walker warga ramai di area lapangan */}
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                width: HALF,
                height: H,
                zIndex: 18,
              }}
            >
              <Walker
                name="warga_a_walk"
                side={0}
                y={516}
                seed={11}
                speed={0.5}
                scale={0.95}
                f={f}
              />
              <Walker
                name="warga_b_walk"
                side={0}
                y={548}
                seed={33}
                speed={-0.44}
                scale={1.0}
                f={f}
              />
            </div>
          </Cam>
        </Half>

        {/* Kanan (fokus): DesaMap era 4 zoom ke warung + deretan meja kayu luar + warga bertatap muka + ponsel redup + Portrait Lastri */}
        <Half side={1}>
          <Cam scale={rightScale} tx={rightTx} ty={rightTy}>
            <DesaMap f={f} side={1} era={4} />
            {/* Anak-anak bermain di lapangan di sebelah kiri warung */}
            <LapanganKidsPlay f={f} seedOffset={14} />

            {/* Deretan 3 meja kayu luar warung (blok cokelat, fadeIn berjenjang) + warga duduk bertatap muka + prop_ponsel_chat redup */}
            <OutdoorTablePair
              x={376}
              y={462}
              leftSprite="warga_a_walk_0"
              rightSprite="warga_b_walk_0"
              opacity={tbl1Op}
              f={f}
              phaseOffset={0}
              z={26}
            />
            <OutdoorTablePair
              x={468}
              y={496}
              leftSprite="warga_c_walk_0"
              rightSprite="warga_d_walk_0"
              opacity={tbl2Op}
              f={f}
              phaseOffset={1.3}
              z={27}
            />
            <OutdoorTablePair
              x={548}
              y={492}
              leftSprite="warga_a_walk_0"
              rightSprite="warga_c_walk_0"
              opacity={tbl3Op}
              f={f}
              phaseOffset={2.6}
              z={27}
            />
          </Cam>

          {/* Portrait Bu Lastri tua tersenyum ramah di latar depan kiri-bawah */}
          {lastriOp > 0.005 ? (
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                zIndex: 40,
                pointerEvents: 'none',
              }}
            >
              <Portrait
                name="lastri_tua_portrait_happy"
                x={18}
                y={442}
                w={188}
                h={235}
                opacity={lastriOp}
              />
            </div>
          ) : null}
        </Half>
      </>
    );
  }

  // --- B39: Sukatenang melonggar (kiri fokus malam TerasScene + 2 remaja mengintip layar + warga tua melintas; kanan WarungScene night hangat ambient + gelembung) ---
  const leftScale = cam(f, 725, 1224, 1.1, 1.02);
  const leftTx = cam(f, 725, 1224, -14, 4);
  const rightScale = cam(f, 725, 1224, 1.07, 1.01);

  const lampPulse = 0.84 + 0.16 * Math.sin(f * 0.06);
  const screenPulse = 0.72 + 0.28 * Math.sin(f * 0.11);
  const teenBobA = Math.sin(f * 0.065) * 1.8;
  const teenBobB = Math.sin(f * 0.065 + 1.4) * 1.8;

  const chatBob1 = Math.sin(f * 0.07) * 2;
  const chatBob2 = Math.sin(f * 0.07 + 1.9) * 2;
  const bubblePulse1 = 0.7 + 0.28 * Math.sin(f * 0.085);
  const bubblePulse2 = 0.7 + 0.28 * Math.sin(f * 0.085 + 2.1);

  return (
    <>
      {/* Kiri (fokus malam): TerasScene dengan overlay malam + lampu hangat + 2 remaja mengintip layar + Walker warga_d_walk */}
      <Half side={0}>
        <Cam scale={leftScale} tx={leftTx}>
          <TerasScene f={f} side={0} />

          {/* Overlay langit malam di bukaan belakang teras */}
          <div
            style={{
              position: 'absolute',
              left: 274,
              top: 60,
              width: 366,
              height: 360,
              backgroundColor: '#16213d',
              opacity: 0.74,
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {/* Bintang kecil kelap-kelip */}
            {[
              { x: 42, y: 28, ph: 0.3 },
              { x: 118, y: 54, ph: 1.7 },
              { x: 196, y: 32, ph: 2.9 },
              { x: 268, y: 66, ph: 4.1 },
              { x: 314, y: 38, ph: 0.9 },
            ].map((st, idx) => (
              <div
                key={`b39-star-${idx}`}
                style={{
                  position: 'absolute',
                  left: st.x,
                  top: st.y,
                  width: 3,
                  height: 3,
                  backgroundColor: '#eef5ff',
                  opacity: 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f * 0.06 + st.ph)),
                }}
              />
            ))}
          </div>

          {/* Overlay malam lembut menyeluruh di atas teras */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              backgroundColor: '#0e172e',
              opacity: 0.44,
              zIndex: 12,
              pointerEvents: 'none',
            }}
          />

          {/* Lampu teras hangat + pendar cahaya kuning hangat */}
          {[196, 434].map((lx, idx) => (
            <React.Fragment key={`teras-lamp-${idx}`}>
              <div
                style={{
                  position: 'absolute',
                  left: lx - 1,
                  top: 60,
                  width: 3,
                  height: 28,
                  backgroundColor: '#2a221c',
                  zIndex: 14,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: lx - 14,
                  top: 86,
                  width: 28,
                  height: 12,
                  backgroundColor: '#8c4732',
                  zIndex: 14,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: lx - 8,
                  top: 96,
                  width: 16,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: '#ffd98a',
                  zIndex: 14,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  left: lx - 110,
                  top: 70,
                  width: 220,
                  height: 220,
                  borderRadius: '50%',
                  backgroundColor: '#ffd98a',
                  opacity: 0.2 * lampPulse,
                  zIndex: 13,
                  pointerEvents: 'none',
                }}
              />
            </React.Fragment>
          ))}

          {/* Pendar jendela hangat dari dalam rumah */}
          <div
            style={{
              position: 'absolute',
              left: 158,
              top: 220,
              width: 76,
              height: 106,
              backgroundColor: '#ffd98a',
              opacity: 0.32 * lampPulse,
              zIndex: 13,
              pointerEvents: 'none',
            }}
          />

          {/* Dua remaja diam-diam mengintip layar ponsel kecil berdua di bangku teras */}
          <Sprite
            name="remaja_a_walk_0"
            x={306}
            y={378 + teenBobA}
            w={118}
            h={192}
            z={18}
          />
          <Sprite
            name="remaja_b_walk_0"
            x={424}
            y={382 + teenBobB}
            w={118}
            h={192}
            flip
            z={18}
          />

          {/* Pendar layar kecil redup di antara kedua remaja */}
          <div
            style={{
              position: 'absolute',
              left: 392,
              top: 446,
              width: 62,
              height: 62,
              borderRadius: '50%',
              backgroundColor: '#8cd8f5',
              opacity: 0.2 * screenPulse,
              zIndex: 19,
              pointerEvents: 'none',
            }}
          />
          <Sprite
            name="prop_ponsel_feed"
            x={411}
            y={462}
            w={24}
            h={38}
            opacity={0.62}
            z={20}
          />

          {/* Warga tua melintas santai di depan teras, melihat sekilas lalu berjalan terus */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              zIndex: 24,
            }}
          >
            <Walker
              name="warga_d_walk"
              side={0}
              y={534}
              seed={7}
              speed={0.48}
              scale={1.65}
              f={f}
            />
          </div>
        </Cam>
      </Half>

      {/* Kanan (redup hidup): WarungScene night hangat ambient + warga mengobrol + prop_gelembung kecil */}
      <Half side={1} dim={0.35}>
        <Cam scale={rightScale}>
          <WarungScene f={f} side={1} big={true} night={true} />

          {/* Nuansa cahaya malam hangat di teras/interior warung */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              backgroundColor: '#ffd98a',
              opacity: 0.1 * lampPulse,
              zIndex: 11,
              pointerEvents: 'none',
            }}
          />

          {/* Bu Lastri di dekat etalase warung */}
          <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 12 }}>
            <Portrait
              name="lastri_tua_portrait_happy"
              x={436}
              y={224}
              w={136}
              h={170}
              flip
            />
          </div>

          {/* Pasangan warga duduk mengobrol hangat di meja-meja warung */}
          <Sprite
            name="warga_a_walk_0"
            x={32}
            y={420 + chatBob1}
            w={72}
            h={117}
            z={13}
          />
          <Sprite
            name="warga_b_walk_0"
            x={116}
            y={424 + chatBob2}
            w={72}
            h={117}
            flip
            z={13}
          />
          <Sprite
            name="prop_gelembung"
            x={94}
            y={386}
            w={38}
            h={29}
            opacity={bubblePulse1}
            z={16}
          />

          <Sprite
            name="warga_c_walk_0"
            x={236}
            y={476 + chatBob2}
            w={74}
            h={120}
            z={14}
          />
          <Sprite
            name="warga_d_walk_0"
            x={328}
            y={480 + chatBob1}
            w={74}
            h={120}
            flip
            z={14}
          />
          <Sprite
            name="prop_gelembung"
            x={300}
            y={442}
            w={38}
            h={29}
            opacity={bubblePulse2}
            z={16}
          />

          <Sprite
            name="warga_b_walk_0"
            x={452}
            y={478 + chatBob1}
            w={74}
            h={120}
            z={14}
          />
          <Sprite
            name="warga_a_walk_0"
            x={538}
            y={482 + chatBob2}
            w={74}
            h={120}
            flip
            z={14}
          />
          <Sprite
            name="prop_gelembung"
            x={510}
            y={444}
            w={38}
            h={29}
            opacity={bubblePulse1}
            z={16}
          />

          {/* Teko & cangkir hangat di meja */}
          <Sprite name="prop_teko" x={94} y={482} w={36} h={29} z={15} />
          <Sprite name="prop_cangkir" x={304} y={536} w={30} h={26} z={15} />

          {/* Walker ambient pelan di latar depan warung agar sisi redup tetap hidup */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: HALF,
              height: H,
              zIndex: 18,
            }}
          >
            <Walker
              name="warga_c_walk"
              side={1}
              y={592}
              seed={21}
              speed={0.4}
              scale={1.08}
              f={f}
            />
          </div>
        </Cam>
      </Half>
    </>
  );
};
