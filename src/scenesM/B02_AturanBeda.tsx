import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {PopIn, SlideIn} from '../lib/paper/kit';
import {useCount} from '../lib/ui/ui';
import {medsosLocalF} from '../medsosPlan';
import {PX, PixelBoard, PixelCard, PixelChip, PixelSprite} from '../components/PixelUI';
import {TwinMapBg} from '../components/TwinMapBg';
import type {WalkerSpec} from '../components/Walker';

const DUR = 538;

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

const BANNED_ICONS = [
  {src: 'prop_ponsel_feed.png', x: 225, xAtSec: 28.88},
  {src: 'icon_kamera.png', x: 320, xAtSec: 30.5},
  {src: 'icon_pengikut.png', x: 415, xAtSec: 31.7},
];

const HEART_XS = [880, 960, 1040];

export const B02_AturanBeda: React.FC = () => {
  const f = useCurrentFrame();

  const leftBoardAt = medsosLocalF('B02', 26.14);
  const pocketChipAt = medsosLocalF('B02', 31.7);
  const rightBoardAt = medsosLocalF('B02', 33.56);
  const feedCardAt = medsosLocalF('B02', 35.96);
  const followerCount = Math.round(useCount(medsosLocalF('B02', 36.4), 66, 128));

  return (
    <AbsoluteFill>
      <TwinMapBg
        zoomFrom={1.05}
        zoomTo={1.19}
        dim={0.12}
        dur={DUR}
        leftWalkers={LEFT_WALKERS}
        rightWalkers={RIGHT_WALKERS}
      />

      {/* Kiri: SUKATENANG */}
      {f >= leftBoardAt ? (
        <SlideIn at={leftBoardAt} dx={-40} dur={12}>
          <PixelBoard
            title="SUKATENANG"
            subtitle="MEDIA SOSIAL DILARANG TOTAL"
            x={320}
            y={170}
            w={350}
            accent={PX.red}
          />
        </SlideIn>
      ) : null}

      {/* Kiri: 3 ikon + tanda X bertahap */}
      {f >= leftBoardAt
        ? BANNED_ICONS.map((item) => {
            const xAt = medsosLocalF('B02', item.xAtSec);
            return (
              <React.Fragment key={item.src}>
                <PopIn at={leftBoardAt + 6} seed={item.src} origin={`${item.x}px 272px`}>
                  <div
                    style={{
                      position: 'absolute',
                      left: item.x,
                      top: 250,
                      translate: '-50% 0',
                      width: 44,
                      height: 44,
                    }}
                  >
                    <PixelSprite src={item.src} w={44} h={44} />
                  </div>
                </PopIn>
                {f >= xAt ? (
                  <PopIn at={xAt} seed={`x-${item.src}`} origin={`${item.x}px 272px`}>
                    <div
                      style={{
                        position: 'absolute',
                        left: item.x,
                        top: 249,
                        translate: '-50% 0',
                        width: 46,
                        height: 46,
                        pointerEvents: 'none',
                      }}
                    >
                      <PixelSprite src="icon_x.png" w={46} h={46} />
                    </div>
                  </PopIn>
                ) : null}
              </React.Fragment>
            );
          })
        : null}

      {f >= pocketChipAt ? (
        <PopIn at={pocketChipAt} seed="pocket-chip" origin="320px 330px">
          <PixelChip
            text="PONSEL MASUK SAKU"
            x={320}
            y={330}
            centerX
            borderColor={PX.red}
            color={PX.red}
            fontSize={11}
          />
        </PopIn>
      ) : null}

      {/* Kanan: SUKARAMAI */}
      {f >= rightBoardAt ? (
        <SlideIn at={rightBoardAt} dx={40} dur={12}>
          <PixelBoard
            title="SUKARAMAI"
            subtitle="MEDIA SOSIAL BEBAS TOTAL"
            x={960}
            y={170}
            w={350}
            accent="#6EC6E8"
          />
        </SlideIn>
      ) : null}

      {/* Kanan: kartu feed + penghitung pengikut + hati melayang */}
      {f >= feedCardAt ? (
        <>
          <PopIn at={feedCardAt} seed="feed-card" origin="960px 420px">
            <PixelCard
              x={960}
              y={420}
              w={250}
              center
              borderColor="#6EC6E8"
              pad="16px"
            >
              <div style={{textAlign: 'center'}}>
                <PixelSprite src="prop_ponsel_feed.png" w={110} h={110} />
              </div>
              <div style={{marginTop: 10, textAlign: 'center'}}>
                <PixelChip
                  text={`PENGIKUT ${followerCount}`}
                  borderColor="#6EC6E8"
                  color="#6EC6E8"
                  fontSize={13}
                />
              </div>
            </PixelCard>
          </PopIn>

          {HEART_XS.map((hx, i) => {
            const cycle = (f + i * 20) % 60;
            const y = 470 - cycle;
            const opacity = interpolate(cycle, [0, 10, 44, 60], [0, 0.95, 0.85, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <PixelSprite
                key={hx}
                src="icon_hati.png"
                x={hx - 10}
                y={y}
                w={20}
                h={20}
                style={{opacity, pointerEvents: 'none'}}
              />
            );
          })}
        </>
      ) : null}
    </AbsoluteFill>
  );
};
