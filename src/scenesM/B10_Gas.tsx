import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PopIn} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelChip, PixelStamp} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 144;

const LEFT_WALKERS: WalkerSpec[] = [
  {id: 'w1', sprite: 'warga_a', path: [[70, 330], [300, 330], [300, 215]], speed: 44, phase: 0.15},
  {id: 'w2', sprite: 'warga_b', path: [[300, 345], [520, 345], [520, 470]], speed: 48, phase: 0.42},
  {id: 'w3', sprite: 'warga_c', path: [[80, 520], [280, 520], [280, 605], [460, 605]], speed: 46, phase: 0.68},
  {id: 'w4', sprite: 'warga_d', path: [[295, 455], [455, 455], [455, 520], [305, 520]], speed: 42, phase: 0.25},
  {id: 'w5', sprite: 'remaja_a', path: [[320, 120], [320, 300], [185, 300]], speed: 40, phase: 0.55},
  {id: 'w6', sprite: 'anak_a', path: [[120, 345], [330, 345], [330, 455]], speed: 38, phase: 0.8},
];

const RIGHT_WALKERS: WalkerSpec[] = [
  {id: 'w1', sprite: 'warga_hp_a', path: [[70, 330], [300, 330], [300, 215]], speed: 44, phase: 0.15},
  {id: 'w2', sprite: 'warga_hp_b', path: [[300, 345], [520, 345], [520, 470]], speed: 48, phase: 0.42},
  {id: 'w3', sprite: 'warga_a', path: [[80, 520], [280, 520], [280, 605], [460, 605]], speed: 46, phase: 0.68},
  {id: 'w4', sprite: 'warga_b', path: [[295, 455], [455, 455], [455, 520], [305, 520]], speed: 42, phase: 0.25},
  {id: 'w5', sprite: 'remaja_b', path: [[320, 120], [320, 300], [185, 300]], speed: 40, phase: 0.55},
  {id: 'w6', sprite: 'anak_b', path: [[120, 345], [330, 345], [330, 455]], speed: 38, phase: 0.8},
];

export const B10_Gas: React.FC = () => {
  const f = useCurrentFrame();

  const chipAt = medsosLocalF('B10', 123.66);
  const gasAt = medsosLocalF('B10', 125.66);

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.1}
        zoomTo={1.0}
        dim={0.08}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {f >= chipAt ? (
        <>
          <PopIn at={chipAt} seed="b10-chip-l" origin="320px 104px">
            <PixelChip
              text="SIMULASI BERJALAN TAHUN PER TAHUN"
              x={320}
              y={104}
              centerX
              fontSize={11}
              borderColor={PX.gold}
            />
          </PopIn>
          <PopIn at={chipAt} seed="b10-chip-r" origin="960px 104px">
            <PixelChip
              text="SIMULASI BERJALAN TAHUN PER TAHUN"
              x={960}
              y={104}
              centerX
              fontSize={11}
              borderColor={PX.gold}
            />
          </PopIn>
        </>
      ) : null}

      <PixelStamp text="GAS!" x={320} y={330} at={gasAt} fontSize={30} color={PX.gold} rot={-3} />
      <PixelStamp text="GAS!" x={960} y={330} at={gasAt} fontSize={30} color={PX.gold} rot={-3} />
    </AbsoluteFill>
  );
};
