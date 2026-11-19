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
import { DesaMap, WarungScene } from './scenes';

export interface Blok03Props {
  f: number;
}

const POP_EASE = Easing.bezier(0.22, 1.25, 0.36, 1);

function popScale(f: number, f0: number, duration = 14): number {
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
  z?: number;
}> = ({ name, x, y, f, f0, z = 60 }) => {
  const dims = CARDS[name];
  if (!dims) {
    return null;
  }
  const op = fadeIn(f, f0, 14);
  if (op <= 0.005) {
    return null;
  }
  const s = popScale(f, f0, 16);
  const w = dims[0] * s;
  const h = dims[1] * s;
  const cx = x + dims[0] / 2;
  const cy = y + dims[1] / 2;
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

interface WarungLeftContentProps {
  f: number;
  showBoredYouth: boolean;
  senjaOpacity: number;
}

const WarungLeftContent: React.FC<WarungLeftContentProps> = ({
  f,
  showBoredYouth,
  senjaOpacity,
}) => {
  const bubbleBob = Math.sin(f * 0.07) * 2.5;
  const jamPulse = 1 + 0.05 * Math.sin(f * 0.1);
  const youthBubbleOp = showBoredYouth ? fadeIn(f, 560, 18) : 0;

  return (
    <>
      <WarungScene f={f} side={0} big={false} />

      {/* Bu Lastri tenang di balik etalase */}
      <Portrait
        name="lastri_muda_portrait_happy"
        x={396}
        y={236}
        w={172}
        h={215}
      />
      <Sprite name="prop_teko" x={422} y={454} w={42} h={34} z={14} />

      {/* Warga lokal santai minum kopi & bertatap muka */}
      <Sprite name="warga_a_walk_0" x={66} y={422} w={80} h={130} z={14} />
      <Sprite
        name="warga_b_walk_0"
        x={198}
        y={422}
        w={80}
        h={130}
        flip
        z={14}
      />
      <Sprite name="prop_cangkir" x={128} y={488} w={28} h={24} z={15} />
      <Sprite name="prop_cangkir" x={180} y={488} w={28} h={24} z={15} />
      <Sprite
        name="prop_gelembung"
        x={144}
        y={380 + bubbleBob}
        w={54}
        h={41}
        opacity={0.92}
        z={16}
      />

      {/* B12/B13: anak muda duduk lesu + gelembung jam pasir */}
      {showBoredYouth ? (
        <>
          <Sprite
            name="remaja_a_walk_0"
            x={392}
            y={476}
            w={92}
            h={150}
            z={18}
          />
          {youthBubbleOp > 0.005 ? (
            <>
              <Sprite
                name="prop_gelembung"
                x={468}
                y={412 + bubbleBob}
                w={74}
                h={56}
                opacity={youthBubbleOp}
                z={19}
              />
              <Sprite
                name="icon_jam"
                x={488 - (34 * (jamPulse - 1)) / 2}
                y={419 + bubbleBob - (34 * (jamPulse - 1)) / 2}
                w={34 * jamPulse}
                h={34 * jamPulse}
                opacity={youthBubbleOp}
                z={20}
              />
            </>
          ) : null}
        </>
      ) : null}

      {/* Overlay senja oranye kontinu */}
      {senjaOpacity > 0.005 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            backgroundColor: '#e88234',
            opacity: senjaOpacity,
            zIndex: 25,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </>
  );
};

interface WarungRightCrowdedProps {
  f: number;
  senjaOpacity: number;
  showViralWaves: boolean;
}

const WarungRightCrowded: React.FC<WarungRightCrowdedProps> = ({
  f,
  senjaOpacity,
  showViralWaves,
}) => {
  return (
    <>
      <WarungScene f={f} side={1} big />

      {/* Bu Lastri sibuk melayani di warung besar */}
      <Portrait
        name="lastri_muda_portrait_happy"
        x={414}
        y={224}
        w={168}
        h={210}
      />
      <Sprite name="prop_teko" x={332} y={448} w={42} h={34} z={14} />

      {/* Warga merekam dengan ponsel di tangan */}
      <Sprite name="warga_hp_b_walk_0" x={74} y={422} w={92} h={150} z={16} />
      <Sprite name="prop_ponsel_feed" x={150} y={444} w={36} h={56} z={17} />

      {/* Gelombang viral menyebar dari ponsel (di dalam sisi kanan) */}
      {showViralWaves
        ? [0, 0.33, 0.66].map((offset, idx) => {
            const cycle = modPos(f * 0.02 + offset, 1);
            const r = interpolate(cycle, [0, 1], [16, 118]);
            const op = interpolate(cycle, [0, 0.2, 1], [0, 0.65, 0]);
            return (
              <div
                key={`vwave-${idx}`}
                style={{
                  position: 'absolute',
                  left: 168 - r,
                  top: 468 - r,
                  width: r * 2,
                  height: r * 2,
                  borderRadius: r,
                  border: `3px solid ${idx % 2 === 0 ? '#35c4e8' : '#f05ab4'}`,
                  opacity: op,
                  zIndex: 15,
                  boxSizing: 'border-box',
                  pointerEvents: 'none',
                }}
              />
            );
          })
        : null}

      {/* Antrean turis & warga ramai berjalan di depan warung */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: HALF,
          height: H,
          zIndex: 18,
          pointerEvents: 'none',
        }}
      >
        <Walker
          name="turis_walk"
          side={1}
          y={500}
          seed={7}
          speed={0.58}
          scale={1.45}
          f={f}
        />
        <Walker
          name="warga_hp_a_walk"
          side={1}
          y={516}
          seed={29}
          speed={-0.48}
          scale={1.5}
          f={f}
        />
        <Walker
          name="turis_walk"
          side={1}
          y={534}
          seed={51}
          speed={0.52}
          scale={1.6}
          f={f}
        />
        <Walker
          name="turis_walk"
          side={1}
          y={548}
          seed={79}
          speed={-0.56}
          scale={1.68}
          f={f}
        />
      </div>

      {senjaOpacity > 0.005 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            backgroundColor: '#e88234',
            opacity: senjaOpacity,
            zIndex: 25,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </>
  );
};

export const Blok03: React.FC<Blok03Props> = ({ f }) => {
  // Beat ranges (local): B11 0..515, B12 515..883, B13 883..1251

  // --- B11: Sukaramai meledak (warung ramai 0..325, potongan sawah Nadia 325..515) ---
  if (f < 515) {
    const leftScale = cam(f, 0, 515, 1.0, 1.03);
    const leftTx = cam(f, 0, 515, -4, 4);

    const isSawahCut = f >= 325;
    const sawahOp = fadeIn(f, 325, 12);
    const nadiaBounce = Math.sin((f - 325) * 0.16) * 4;
    const heartPulse = 1 + 0.08 * Math.sin(f * 0.16);

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale} tx={leftTx}>
            <WarungLeftContent f={f} showBoredYouth={false} senjaOpacity={0} />
          </Cam>
        </Half>

        <Half side={1}>
          {!isSawahCut ? (
            <>
              <Cam scale={1.05} tx={cam(f, 0, 325, -14, 14)}>
                <WarungRightCrowded
                  f={f}
                  senjaOpacity={0}
                  showViralWaves
                />
              </Cam>
              <PopCard name="viral" x={170} y={102} f={f} f0={92} z={62} />
            </>
          ) : (
            <>
              <Cam
                scale={cam(f, 325, 515, 1.16, 1.24)}
                tx={cam(f, 325, 515, -12, 12)}
                ty={-74}
              >
                <DesaMap f={f} side={1} era={1} />
              </Cam>
              {/* Potongan Nadia menari ceria di depan tripod */}
              <Portrait
                name="nadia_remaja_kanan_portrait_happy"
                x={136}
                y={254 + nadiaBounce}
                w={232}
                h={290}
                opacity={sawahOp}
              />
              <Sprite
                name="prop_tripod"
                x={396}
                y={382}
                w={100}
                h={148}
                opacity={sawahOp}
                z={35}
              />
              <Sprite
                name="prop_ponsel_feed"
                x={430}
                y={356}
                w={32}
                h={50}
                opacity={sawahOp}
                z={36}
              />
              <Sprite
                name="icon_pengikut"
                x={486}
                y={322 + Math.sin(f * 0.12) * 4}
                w={36 * heartPulse}
                h={36 * heartPulse}
                opacity={sawahOp}
                z={37}
              />
              <Sprite
                name="icon_hati"
                x={376}
                y={312 + Math.cos(f * 0.14) * 4}
                w={30 * heartPulse}
                h={28 * heartPulse}
                opacity={sawahOp}
                z={37}
              />
              <PopCard
                name="pengikut100"
                x={110}
                y={104}
                f={f}
                f0={352}
                z={62}
              />
            </>
          )}
        </Half>
      </>
    );
  }

  // --- B12: Sukatenang diam (senja naik kontinu, anak muda lesu; kanan tetap ramai) ---
  if (f < 883) {
    const senjaLeft = cam(f, 515, 865, 0.02, 0.28);
    const senjaRight = cam(f, 515, 865, 0.02, 0.2);

    return (
      <>
        <Half side={0}>
          <Cam scale={1.05} tx={cam(f, 515, 883, -12, 12)}>
            <WarungLeftContent
              f={f}
              showBoredYouth
              senjaOpacity={senjaLeft}
            />
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={1.04} tx={cam(f, 515, 883, 8, -8)}>
            <WarungRightCrowded
              f={f}
              senjaOpacity={senjaRight}
              showViralWaves={false}
            />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B13: Skor Tahun 2 (latar warung berlanjut + zoom-out halus + kartu skor T2) ---
  const leftScale = cam(f, 883, 1220, 1.05, 1.0);
  const leftTx = cam(f, 883, 1220, 12, 0);
  const rightScale = cam(f, 883, 1220, 1.04, 1.0);
  const rightTx = cam(f, 883, 1220, -8, 0);
  const veilOp = cam(f, 883, 912, 0, 0.22);

  return (
    <>
      <Half side={0}>
        <Cam scale={leftScale} tx={leftTx}>
          <WarungLeftContent f={f} showBoredYouth senjaOpacity={0.28} />
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
        <PopCard name="skor_t2_kiri" x={90} y={250} f={f} f0={896} z={62} />
      </Half>

      <Half side={1}>
        <Cam scale={rightScale} tx={rightTx}>
          <WarungRightCrowded
            f={f}
            senjaOpacity={0.2}
            showViralWaves={false}
          />
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
        <PopCard name="skor_t2_kanan" x={90} y={250} f={f} f0={906} z={62} />
      </Half>
    </>
  );
};
