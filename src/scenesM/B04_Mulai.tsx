import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {PopIn} from '../lib/paper/kit';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelChip, PixelStamp} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 233;

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

export const B04_Mulai: React.FC = () => {
  const f = useCurrentFrame();

  const t1 = medsosLocalF('B04', 51.4);
  const t2 = medsosLocalF('B04', 52.5);
  const t3 = medsosLocalF('B04', 53.6);
  const t4 = medsosLocalF('B04', 55.5);
  const startAt = medsosLocalF('B04', 56.9);

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.13}
        zoomTo={1.0}
        dim={0.10}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {/* Stamp ritmis bergantian */}
      {f >= t1 && f < t2 ? (
        <PixelStamp text="DUA DESA" x={320} y={320} at={t1} fontSize={22} />
      ) : null}
      {f >= t2 && f < t3 ? (
        <PixelStamp text="DUA DUNIA" x={960} y={320} at={t2} fontSize={22} />
      ) : null}
      {f >= t3 && f < t4 ? (
        <PixelStamp text="SATU ATURAN BEDA" x={320} y={320} at={t3} fontSize={18} />
      ) : null}
      {f >= t4 && f < startAt ? (
        <PixelStamp text="20 TAHUN" x={960} y={320} at={t4} color={PX.gold} fontSize={26} />
      ) : null}

      {/* Chip mulai per separuh */}
      {f >= startAt ? (
        <>
          <PopIn at={startAt} seed="mulai-l" origin="320px 470px">
            <PixelChip
              text="KITA MULAI!"
              x={320}
              y={470}
              centerX
              borderColor={PX.gold}
              fontSize={14}
            />
          </PopIn>
          <PopIn at={startAt} seed="mulai-r" origin="960px 470px">
            <PixelChip
              text="KITA MULAI!"
              x={960}
              y={470}
              centerX
              borderColor={PX.gold}
              fontSize={14}
            />
          </PopIn>
        </>
      ) : null}
    </AbsoluteFill>
  );
};
