import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { Blok01 } from './Blok01';
import { Blok02 } from './Blok02';
import { Blok03 } from './Blok03';
import { Blok04 } from './Blok04';
import { Blok05 } from './Blok05';
import { Blok06 } from './Blok06';
import { Blok07 } from './Blok07';
import { Blok08 } from './Blok08';
import { Blok09 } from './Blok09';
import { Blok10 } from './Blok10';
import { Blok11 } from './Blok11';
import { Blok12 } from './Blok12';
import { Blok13 } from './Blok13';
import { Blok14 } from './Blok14';
import { Blok15 } from './Blok15';
import { Blok16 } from './Blok16';
import { Divider, EZ, H, Hud, W } from './common';

interface BlokEntry {
  start: number;
  end: number;
  Component: React.FC<{ f: number }>;
}

const BLOKS: ReadonlyArray<BlokEntry> = [
  { start: 0, end: 1774, Component: Blok01 },
  { start: 1774, end: 3878, Component: Blok02 },
  { start: 3878, end: 5129, Component: Blok03 },
  { start: 5129, end: 6414, Component: Blok04 },
  { start: 6414, end: 8138, Component: Blok05 },
  { start: 8138, end: 9320, Component: Blok06 },
  { start: 9320, end: 10804, Component: Blok07 },
  { start: 10804, end: 13589, Component: Blok08 },
  { start: 13589, end: 14651, Component: Blok09 },
  { start: 14651, end: 15875, Component: Blok10 },
  { start: 15875, end: 17252, Component: Blok11 },
  { start: 17252, end: 18764, Component: Blok12 },
  { start: 18764, end: 20037, Component: Blok13 },
  { start: 20037, end: 21382, Component: Blok14 },
  { start: 21382, end: 22568, Component: Blok15 },
  { start: 22568, end: 23675, Component: Blok16 },
];

function resolveTahun(frame: number): number | null {
  if (frame < 1541) return null;
  if (frame <= 4760) return 1;
  if (frame <= 5128) return 2;
  if (frame <= 6136) return 3;
  if (frame <= 6413) return 4;
  if (frame <= 7670) return 5;
  if (frame <= 8137) return 6;
  if (frame <= 9087) return 7;
  if (frame <= 9319) return 8;
  if (frame <= 10261) return 9;
  if (frame <= 10803) return 10;
  if (frame <= 11728) return 11;
  if (frame <= 13588) return 12;
  if (frame <= 14349) return 13;
  if (frame <= 14650) return 14;
  if (frame <= 15037) return 15;
  if (frame <= 15375) return 16;
  if (frame <= 15874) return 17;
  if (frame <= 16592) return 18;
  if (frame <= 17251) return 19;
  if (frame <= 18763) return 20;
  if (frame <= 22567) return null;
  return 20;
}

function findActiveBlok(frame: number): BlokEntry {
  for (let i = 0; i < BLOKS.length; i += 1) {
    const entry = BLOKS[i];
    if (frame < entry.end) {
      return entry;
    }
  }
  return BLOKS[BLOKS.length - 1];
}

export const Full: React.FC = () => {
  const frame = useCurrentFrame();
  const active = findActiveBlok(frame);
  const localF = Math.max(0, frame - active.start);
  const ActiveBlok = active.Component;
  const tahun = resolveTahun(frame);

  // Fade out global pada 80 frame terakhir (23595..23674), menutupi segalanya termasuk Divider
  const fadeOutOp = interpolate(frame, [23595, 23674], [0, 1], {
    easing: EZ,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill style={{ backgroundColor: '#000000' }}>
      <ActiveBlok f={localF} />
      <Hud tahun={tahun} />
      <Divider />
      {fadeOutOp > 0.001 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: W,
            height: H,
            backgroundColor: '#000000',
            opacity: fadeOutOp,
            zIndex: 20000,
            pointerEvents: 'none',
          }}
        />
      ) : null}
    </AbsoluteFill>
  );
};
