import React from 'react';
import { interpolate } from 'remotion';
import {
  Cam,
  CardImg,
  Half,
  Portrait,
  Sprite,
  Walker,
  cam,
  fadeIn,
} from './common';
import { StudioScene, TerasScene } from './scenes';

export interface Blok06Props {
  f: number;
}

function modPos(v: number, m: number): number {
  return ((v % m) + m) % m;
}

const DIALOG1_CARDS: ReadonlyArray<string> = [
  'd1_1',
  'd1_2',
  'd1_3',
  'd1_4',
  'd1_5',
];

interface NotifPopSpec {
  icon: 'icon_hati' | 'icon_pengikut';
  x: number;
  baseY: number;
  w: number;
  h: number;
  delay: number;
  phase: number;
}

const B24_NOTIFS: ReadonlyArray<NotifPopSpec> = [
  { icon: 'icon_hati', x: 350, baseY: 274, w: 34, h: 32, delay: 12, phase: 0.0 },
  { icon: 'icon_pengikut', x: 422, baseY: 224, w: 38, h: 38, delay: 32, phase: 1.4 },
  { icon: 'icon_hati', x: 506, baseY: 256, w: 32, h: 30, delay: 52, phase: 2.7 },
  { icon: 'icon_pengikut', x: 332, baseY: 186, w: 36, h: 36, delay: 74, phase: 3.9 },
  { icon: 'icon_hati', x: 468, baseY: 168, w: 34, h: 32, delay: 96, phase: 5.1 },
  { icon: 'icon_pengikut', x: 544, baseY: 204, w: 36, h: 36, delay: 118, phase: 0.8 },
];

const StudioAmbientNotifs: React.FC<{ f: number }> = ({ f }) => {
  const slots = [
    { x: 378, baseY: 292, offset: 0.0 },
    { x: 448, baseY: 254, offset: 0.34 },
    { x: 514, baseY: 280, offset: 0.67 },
  ];
  return (
    <>
      {slots.map((slot, idx) => {
        const phase = modPos(f * 0.015 + slot.offset, 1);
        const rise = interpolate(phase, [0, 1], [0, -34]);
        const op = interpolate(phase, [0, 0.2, 0.78, 1], [0, 0.82, 0.72, 0]);
        return (
          <Sprite
            key={`amb-ht-${idx}`}
            name="icon_hati"
            x={slot.x}
            y={slot.baseY + rise}
            w={30}
            h={28}
            opacity={op}
            z={18}
          />
        );
      })}
    </>
  );
};

export const Blok06: React.FC<Blok06Props> = ({ f }) => {
  // Rentang lokal Blok06 (total 1182):
  // B22: 0..395, B23: 395..950, B24: 950..1182

  // --- B22: Rahasia terbongkar (TerasScene sore kiri; StudioScene redup kanan) ---
  if (f < 395) {
    const leftScale = cam(f, 0, 395, 1.0, 1.04);
    const rightScale = cam(f, 0, 395, 1.0, 1.02);

    // Pak Wiryo masuk dari arah pintu (x lebih kiri -> x 76)
    const wiryoX = cam(f, 110, 215, -36, 76);
    const wiryoOp = fadeIn(f, 110, 22);
    const phoneGlow = 0.7 + 0.3 * Math.sin(f * 0.09);

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale}>
            <TerasScene f={f} side={0} />

            {/* Nadia (22) duduk di bangku teras memegang ponsel sepupunya */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 12 }}>
              <Portrait
                name="nadia_muda_kiri_portrait_neutral"
                x={354}
                y={272}
                w={210}
                h={262}
              />
            </div>
            {/* Pendar biru halus layar ponsel */}
            <div
              style={{
                position: 'absolute',
                left: 304,
                top: 394,
                width: 68,
                height: 82,
                borderRadius: 34,
                backgroundColor: '#35c4e8',
                opacity: 0.24 * phoneGlow,
                zIndex: 13,
                pointerEvents: 'none',
              }}
            />
            <Sprite
              name="prop_ponsel_feed"
              x={318}
              y={408}
              w={42}
              h={65}
              z={14}
            />

            {/* Pak Wiryo muncul kaget dari arah pintu */}
            {wiryoOp > 0.005 ? (
              <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 15 }}>
                <Portrait
                  name="wiryo_kades_portrait_kaget"
                  x={wiryoX}
                  y={256}
                  w={210}
                  h={262}
                  opacity={wiryoOp}
                />
              </div>
            ) : null}
          </Cam>
        </Half>

        <Half side={1} dim={0.35}>
          <Cam scale={rightScale}>
            <StudioScene f={f} side={1} />
            <Sprite
              name="prop_ringlight"
              x={68}
              y={324}
              w={78}
              h={102}
              z={11}
            />
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 12 }}>
              <Portrait
                name="nadia_muda_kanan_portrait_neutral"
                x={178}
                y={240}
                w={210}
                h={262}
              />
            </div>
            <StudioAmbientNotifs f={f} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B23: Dialog Wiryo-Nadia (d1_1..d1_5 bergantian di kiri bawah; kanan dim 0.35 hidup) ---
  if (f < 950) {
    const leftScale = cam(f, 395, 950, 1.04, 1.07);
    const rightScale = cam(f, 395, 950, 1.02, 1.04);

    // Bagi rentang B23 (555 frame) menjadi 5 bagian berurutan (111 frame per kartu)
    const segLen = (950 - 395) / DIALOG1_CARDS.length;
    const rawIdx = Math.floor((f - 395) / segLen);
    const segIdx = Math.max(0, Math.min(DIALOG1_CARDS.length - 1, rawIdx));
    const segStart = 395 + segIdx * segLen;
    const cardName = DIALOG1_CARDS[segIdx];
    const cardOp = fadeIn(f, segStart, 12);

    // Animasi mulut stepping (hanya stepping sprite, bukan kamera)
    const mouthOpen = Math.floor(f / 6) % 2 === 1;
    const wiryoSpeaks = segIdx === 0 || segIdx === 3;
    const nadiaSpeaks = !wiryoSpeaks;

    // Ekspresi Wiryo: kaget (awal) -> tegas (segIdx >= 2)
    let wiryoPortrait: string;
    if (segIdx <= 1) {
      wiryoPortrait =
        wiryoSpeaks && mouthOpen
          ? 'wiryo_kades_portrait_open'
          : 'wiryo_kades_portrait_kaget';
    } else {
      wiryoPortrait =
        wiryoSpeaks && mouthOpen
          ? 'wiryo_kades_portrait_open'
          : 'wiryo_kades_portrait_tegas';
    }

    // Ekspresi Nadia: defensif (neutral, segIdx <= 2) -> sendu (sad, segIdx >= 3)
    let nadiaPortrait: string;
    if (segIdx <= 2) {
      nadiaPortrait =
        nadiaSpeaks && mouthOpen
          ? 'nadia_muda_kiri_portrait_open'
          : 'nadia_muda_kiri_portrait_neutral';
    } else {
      nadiaPortrait =
        nadiaSpeaks && mouthOpen
          ? 'nadia_muda_kiri_portrait_open'
          : 'nadia_muda_kiri_portrait_sad';
    }

    return (
      <>
        <Half side={0}>
          <Cam scale={leftScale}>
            <TerasScene f={f} side={0} />

            {/* Pak Wiryo di sisi kiri teras */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
              <Portrait
                name={wiryoPortrait}
                x={76}
                y={256}
                w={210}
                h={262}
              />
            </div>

            {/* Nadia di sisi kanan teras memegang ponsel */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
              <Portrait
                name={nadiaPortrait}
                x={354}
                y={272}
                w={210}
                h={262}
              />
            </div>
            <Sprite
              name="prop_ponsel_feed"
              x={318}
              y={414}
              w={40}
              h={62}
              z={15}
            />
          </Cam>

          {/* Kotak dialog RPG (d1_1..d1_5) di bawah sisi kiri, aman di dalam 0..639 */}
          {cardOp > 0.005 ? (
            <CardImg
              name={cardName}
              x={62}
              y={560}
              scale={0.86}
              opacity={cardOp}
              z={62}
            />
          ) : null}
        </Half>

        <Half side={1} dim={0.35}>
          <Cam scale={rightScale}>
            <StudioScene f={f} side={1} />
            <Sprite
              name="prop_ringlight"
              x={68}
              y={324}
              w={78}
              h={102}
              z={11}
            />
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 12 }}>
              <Portrait
                name="nadia_muda_kanan_portrait_neutral"
                x={178}
                y={240}
                w={210}
                h={262}
              />
            </div>
            {/* Aktivitas ambient pelan di studio redup */}
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 15, opacity: 0.45 }}>
              <Walker
                name="nadia_walk"
                side={1}
                y={586}
                seed={5}
                speed={0.28}
                scale={0.78}
                f={f}
              />
            </div>
            <StudioAmbientNotifs f={f} />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B24: Pertanyaan menggantung (kiri terdiam micro push-in; kanan MENCERAH dim->0) ---
  const leftScale = cam(f, 950, 1182, 1.07, 1.11);
  const leftDim = cam(f, 950, 1045, 0, 0.22);
  const rightDim = cam(f, 950, 1035, 0.35, 0);
  const rightScale = cam(f, 950, 1182, 1.04, 1.1);
  const rightTy = cam(f, 950, 1182, 0, -14);

  return (
    <>
      <Half side={0} dim={leftDim}>
        <Cam scale={leftScale}>
          <TerasScene f={f} side={0} />
          <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
            <Portrait
              name="wiryo_kades_portrait_neutral"
              x={76}
              y={256}
              w={210}
              h={262}
            />
          </div>
          <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
            <Portrait
              name="nadia_muda_kiri_portrait_sad"
              x={354}
              y={276}
              w={210}
              h={262}
            />
          </div>
        </Cam>
      </Half>

      <Half side={1} dim={rightDim}>
        <Cam scale={rightScale} ty={rightTy}>
          <StudioScene f={f} side={1} />

          {/* Nadia duduk memeluk lutut (posisi potret lebih rendah) menjauhi tripod & ringlight */}
          <div style={{ position: 'absolute', left: 0, top: 0, zIndex: 14 }}>
            <Portrait
              name="nadia_muda_kanan_portrait_sad"
              x={84}
              y={374}
              w={204}
              h={255}
            />
          </div>

          {/* Tripod & ringlight di sisi seberang ruangan */}
          <Sprite
            name="prop_tripod"
            x={364}
            y={360}
            w={68}
            h={100}
            z={13}
          />
          <Sprite
            name="prop_ringlight"
            x={452}
            y={326}
            w={92}
            h={120}
            z={14}
          />

          {/* Notifikasi pengikut & hati bermunculan berjenjang tanpa henti */}
          {B24_NOTIFS.map((nf, idx) => {
            const appearOp = fadeIn(f, 950 + nf.delay, 16);
            if (appearOp <= 0.005) {
              return null;
            }
            const bob = Math.sin(f * 0.075 + nf.phase) * 6;
            const pulse = 0.8 + 0.2 * Math.sin(f * 0.1 + nf.phase);
            return (
              <Sprite
                key={`b24-nf-${idx}`}
                name={nf.icon}
                x={nf.x}
                y={nf.baseY + bob}
                w={nf.w}
                h={nf.h}
                opacity={appearOp * pulse}
                z={18}
              />
            );
          })}
        </Cam>
      </Half>
    </>
  );
};
