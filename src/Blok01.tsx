import React from 'react';
import { Easing, interpolate } from 'remotion';
import { CARDS } from './cardsData';
import { Cam, CardImg, HALF, Half, Sprite, cam, fadeIn } from './common';
import { DesaMap } from './scenes';

export interface Blok01Props {
  f: number;
}

const POP_EASE = Easing.bezier(0.22, 1.25, 0.36, 1);

function popScale(f: number, f0: number, duration = 14): number {
  return interpolate(f, [f0, f0 + duration], [0.76, 1], {
    easing: POP_EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function fadeOut(f: number, f0: number, duration = 18): number {
  return interpolate(f, [f0, f0 + duration], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
}

function modPos(v: number, m: number): number {
  return ((v % m) + m) % m;
}

/**
 * Computes the horizontal center of an ambient DesaMap era-0 walker
 * using the exact ping-pong trajectory from Walker in common.tsx.
 */
function desaWalkerCenterX(f: number, seed: number, speed: number): number {
  const w = 48 * 0.44;
  const minX = 20;
  const maxX = HALF - 20 - w;
  const span = Math.max(1, maxX - minX);
  const period = 2 * span;
  const raw = f * speed + seed * 137;
  const phase = modPos(raw, period);
  const goingRight = phase <= span;
  const x = goingRight ? minX + phase : minX + (period - phase);
  return x + w / 2;
}

interface BubbleIconProps {
  centerX: number;
  baseY: number;
  iconName: string;
  iconW: number;
  iconH: number;
  opacity: number;
  scale?: number;
  crossed?: boolean;
  crossOpacity?: number;
  crossScale?: number;
  glowColor?: string;
}

const BubbleIcon: React.FC<BubbleIconProps> = ({
  centerX,
  baseY,
  iconName,
  iconW,
  iconH,
  opacity,
  scale = 1,
  crossed = false,
  crossOpacity = 0,
  crossScale = 1,
  glowColor,
}) => {
  if (opacity <= 0.005) {
    return null;
  }
  const bw = 66 * scale;
  const bh = 50 * scale;
  const clampedX = Math.max(16, Math.min(HALF - 16 - bw, centerX - bw / 2));
  const y = baseY - bh;
  const iw = iconW * scale;
  const ih = iconH * scale;
  const ix = clampedX + (bw - iw) / 2;
  const iy = y + (bh * 0.82 - ih) / 2;

  const xSize = 34 * scale * crossScale;
  const xx = clampedX + (bw - xSize) / 2;
  const xy = y + (bh * 0.82 - xSize) / 2;

  return (
    <>
      {glowColor ? (
        <div
          style={{
            position: 'absolute',
            left: clampedX - 6,
            top: y - 6,
            width: bw + 12,
            height: bh + 6,
            borderRadius: 24,
            backgroundColor: glowColor,
            opacity: opacity * 0.28,
            zIndex: 34,
            pointerEvents: 'none',
          }}
        />
      ) : null}
      <Sprite
        name="prop_gelembung"
        x={clampedX}
        y={y}
        w={bw}
        h={bh}
        opacity={opacity}
        z={35}
      />
      <Sprite
        name={iconName}
        x={ix}
        y={iy}
        w={iw}
        h={ih}
        opacity={opacity}
        z={36}
      />
      {crossed && crossOpacity > 0.005 ? (
        <Sprite
          name="icon_x"
          x={xx}
          y={xy}
          w={xSize}
          h={xSize}
          opacity={opacity * crossOpacity}
          z={37}
        />
      ) : null}
    </>
  );
};

const CenteredCardPop: React.FC<{
  name: string;
  cx: number;
  cy: number;
  f: number;
  f0: number;
  fadeOutAt?: number;
  fadeOutDur?: number;
  z?: number;
}> = ({ name, cx, cy, f, f0, fadeOutAt, fadeOutDur = 16, z = 45 }) => {
  const dims = CARDS[name];
  if (!dims) {
    return null;
  }
  const opIn = fadeIn(f, f0, 14);
  const opOut = fadeOutAt !== undefined ? fadeOut(f, fadeOutAt, fadeOutDur) : 1;
  const op = opIn * opOut;
  if (op <= 0.005) {
    return null;
  }
  const s = popScale(f, f0, 16);
  const w = dims[0] * s;
  const h = dims[1] * s;
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

export const Blok01: React.FC<Blok01Props> = ({ f }) => {
  // Beat ranges (local): B01 0..679, B02 679..1197, B03 1197..1541, B04 1541..1774
  const isB01 = f < 679;
  const isB02 = f >= 679 && f < 1197;
  const isB03 = f >= 1197 && f < 1541;

  // Continuous camera curve synchronized on both sides
  let scale = 1.0;
  let tx = 0;
  let ty = 0;

  if (f < 50) {
    scale = 1.0;
    tx = 0;
    ty = 0;
  } else if (f < 1197) {
    scale = cam(f, 50, 1197, 1.0, 1.12);
    ty = cam(f, 50, 1197, 0, -24);
  } else if (f < 1541) {
    const env = interpolate(f, [1197, 1235, 1500, 1541], [0, 1, 1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    scale = 1.12 + env * 0.004 * Math.sin((f - 1197) * 0.032);
    tx = env * 3.2 * Math.sin((f - 1197) * 0.025);
    ty = -24 + env * 2.4 * Math.cos((f - 1197) * 0.021);
  } else {
    scale = cam(f, 1541, 1745, 1.12, 1.0);
    ty = cam(f, 1541, 1745, -24, 0);
  }

  // Walker anchor centers matching DesaMap era 0 ambient walkers
  const wkA = desaWalkerCenterX(f, 13, 0.46);
  const wkB = desaWalkerCenterX(f, 31, -0.4);
  const wkC = desaWalkerCenterX(f, 52, 0.38);
  const wkD = desaWalkerCenterX(f, 71, -0.44);

  const bob0 = Math.sin(f * 0.08) * 2.5;
  const bob1 = Math.sin(f * 0.08 + 1.9) * 2.5;
  const bob2 = Math.sin(f * 0.08 + 3.6) * 2.5;
  const bob3 = Math.sin(f * 0.08 + 5.1) * 2.5;

  const pulse0 = 1 + 0.055 * Math.sin(f * 0.14);
  const pulse1 = 1 + 0.055 * Math.sin(f * 0.14 + 1.5);
  const pulse2 = 1 + 0.055 * Math.sin(f * 0.14 + 3.1);
  const pulse3 = 1 + 0.055 * Math.sin(f * 0.14 + 4.6);

  // B01 left side: phase 1 (telepon/pesan/chat), then phase 2 (medsos + icon_x)
  const b01LeftP1Out = fadeOut(f, 315, 22);
  const b01LeftP2Out = fadeOut(f, 654, 24);
  const b01RightOut = fadeOut(f, 654, 24);

  // B02 left side: medsos X'd again, then phone slips down into pocket
  const b02LeftPocketY = cam(f, 955, 1085, 0, 36);
  const b02LeftPocketOp = fadeOut(f, 955, 115);

  // B02 right side: glowing feed + rising followers
  const b02RightOut = fadeOut(f, 1170, 26);

  // B03 question mark pop + gentle float
  const b03Op = fadeIn(f, 1202, 16) * fadeOut(f, 1520, 20);
  const b03Scale = popScale(f, 1202, 18);
  const b03Bob = Math.sin((f - 1197) * 0.07) * 3.5;
  const qW = 64 * b03Scale;
  const qH = 92 * b03Scale;

  return (
    <>
      {/* SISI KIRI — SUKATENANG */}
      <Half side={0}>
        <Cam scale={scale} tx={tx} ty={ty}>
          <DesaMap f={f} side={0} era={0} />

          {/* B01 Kiri: telepon/pesan/chat, lalu medsos kena X */}
          {isB01 ? (
            <>
              <BubbleIcon
                centerX={wkC}
                baseY={498 + bob0}
                iconName="icon_telepon"
                iconW={26}
                iconH={26}
                opacity={fadeIn(f, 88, 14) * b01LeftP1Out}
                scale={popScale(f, 88, 14)}
                glowColor="#58a05a"
              />
              <BubbleIcon
                centerX={wkB}
                baseY={496 + bob1}
                iconName="icon_pesan"
                iconW={28}
                iconH={22}
                opacity={fadeIn(f, 148, 14) * b01LeftP1Out}
                scale={popScale(f, 148, 14)}
                glowColor="#58a05a"
              />
              <BubbleIcon
                centerX={wkA}
                baseY={495 + bob2}
                iconName="prop_ponsel_chat"
                iconW={18}
                iconH={28}
                opacity={fadeIn(f, 208, 14) * b01LeftP1Out}
                scale={popScale(f, 208, 14)}
                glowColor="#58a05a"
              />

              <BubbleIcon
                centerX={wkC}
                baseY={498 + bob0}
                iconName="icon_kamera"
                iconW={28}
                iconH={22}
                opacity={fadeIn(f, 355, 14) * b01LeftP2Out}
                scale={popScale(f, 355, 14)}
                crossed
                crossOpacity={fadeIn(f, 445, 10)}
                crossScale={popScale(f, 445, 12)}
              />
              <BubbleIcon
                centerX={wkB}
                baseY={496 + bob1}
                iconName="icon_hati"
                iconW={26}
                iconH={24}
                opacity={fadeIn(f, 390, 14) * b01LeftP2Out}
                scale={popScale(f, 390, 14)}
                crossed
                crossOpacity={fadeIn(f, 480, 10)}
                crossScale={popScale(f, 480, 12)}
              />
              <BubbleIcon
                centerX={wkA}
                baseY={495 + bob2}
                iconName="icon_pengikut"
                iconW={26}
                iconH={26}
                opacity={fadeIn(f, 425, 14) * b01LeftP2Out}
                scale={popScale(f, 425, 14)}
                crossed
                crossOpacity={fadeIn(f, 515, 10)}
                crossScale={popScale(f, 515, 12)}
              />
            </>
          ) : null}

          {/* B02 Kiri: medsos di-X lagi + ponsel masuk saku (memudar turun) */}
          {isB02 ? (
            <>
              <BubbleIcon
                centerX={wkC}
                baseY={498 + bob0 + b02LeftPocketY}
                iconName="prop_ponsel_feed"
                iconW={18}
                iconH={28}
                opacity={fadeIn(f, 695, 14) * b02LeftPocketOp}
                scale={popScale(f, 695, 14)}
                crossed
                crossOpacity={fadeIn(f, 755, 10)}
                crossScale={popScale(f, 755, 12)}
              />
              <BubbleIcon
                centerX={wkA}
                baseY={495 + bob1 + b02LeftPocketY}
                iconName="icon_kamera"
                iconW={28}
                iconH={22}
                opacity={fadeIn(f, 720, 14) * b02LeftPocketOp}
                scale={popScale(f, 720, 14)}
                crossed
                crossOpacity={fadeIn(f, 785, 10)}
                crossScale={popScale(f, 785, 12)}
              />
              <BubbleIcon
                centerX={wkB}
                baseY={496 + bob2 + b02LeftPocketY}
                iconName="icon_hati"
                iconW={26}
                iconH={24}
                opacity={fadeIn(f, 745, 14) * b02LeftPocketOp}
                scale={popScale(f, 745, 14)}
                crossed
                crossOpacity={fadeIn(f, 810, 10)}
                crossScale={popScale(f, 810, 12)}
              />
            </>
          ) : null}
        </Cam>

        {/* B03 Kiri: ikon tanda tanya besar + kartu tebak di area atas sisi kiri */}
        {isB03 ? (
          <>
            <Sprite
              name="icon_tanda_tanya"
              x={320 - qW / 2}
              y={136 - qH / 2 + b03Bob}
              w={qW}
              h={qH}
              opacity={b03Op}
              z={44}
            />
            <CenteredCardPop
              name="tebak_kiri"
              cx={320}
              cy={242}
              f={f}
              f0={1216}
              fadeOutAt={1520}
              fadeOutDur={20}
              z={45}
            />
          </>
        ) : null}
      </Half>

      {/* SISI KANAN — SUKARAMAI */}
      <Half side={1}>
        <Cam scale={scale} tx={tx} ty={ty}>
          <DesaMap f={f} side={1} era={0} />

          {/* B01 Kanan: kamera/hati/pengikut/feed menyala terang + denyut kontinu */}
          {isB01 ? (
            <>
              <BubbleIcon
                centerX={wkC}
                baseY={498 + bob0}
                iconName="icon_kamera"
                iconW={28}
                iconH={22}
                opacity={fadeIn(f, 115, 14) * b01RightOut}
                scale={popScale(f, 115, 14) * pulse0}
                glowColor="#35c4e8"
              />
              <BubbleIcon
                centerX={wkB}
                baseY={496 + bob1}
                iconName="icon_hati"
                iconW={26}
                iconH={24}
                opacity={fadeIn(f, 175, 14) * b01RightOut}
                scale={popScale(f, 175, 14) * pulse1}
                glowColor="#f05ab4"
              />
              <BubbleIcon
                centerX={wkA}
                baseY={495 + bob2}
                iconName="icon_pengikut"
                iconW={26}
                iconH={26}
                opacity={fadeIn(f, 235, 14) * b01RightOut}
                scale={popScale(f, 235, 14) * pulse2}
                glowColor="#35c4e8"
              />
              <BubbleIcon
                centerX={wkD}
                baseY={498 + bob3}
                iconName="prop_ponsel_feed"
                iconW={18}
                iconH={28}
                opacity={fadeIn(f, 295, 14) * b01RightOut}
                scale={popScale(f, 295, 14) * pulse3}
                glowColor="#f05ab4"
              />
            </>
          ) : null}

          {/* B02 Kanan: feed menyala + pengikut naik (icon_pengikut + denyut kontinu) */}
          {isB02 ? (
            <>
              <BubbleIcon
                centerX={wkC}
                baseY={498 + bob0}
                iconName="prop_ponsel_feed"
                iconW={18}
                iconH={28}
                opacity={fadeIn(f, 692, 14) * b02RightOut}
                scale={popScale(f, 692, 14) * pulse0}
                glowColor="#35c4e8"
              />
              <BubbleIcon
                centerX={wkB}
                baseY={496 + bob1}
                iconName="icon_pengikut"
                iconW={28}
                iconH={28}
                opacity={fadeIn(f, 714, 14) * b02RightOut}
                scale={popScale(f, 714, 14) * pulse1}
                glowColor="#35c4e8"
              />
              <BubbleIcon
                centerX={wkA}
                baseY={495 + bob2}
                iconName="icon_hati"
                iconW={26}
                iconH={24}
                opacity={fadeIn(f, 736, 14) * b02RightOut}
                scale={popScale(f, 736, 14) * pulse2}
                glowColor="#f05ab4"
              />

              {/* Ikon pengikut & hati naik melayang kontinu */}
              {[
                { x: 148, offset: 0.0, icon: 'icon_pengikut', w: 28, h: 28 },
                { x: 286, offset: 0.34, icon: 'icon_hati', w: 24, h: 22 },
                { x: 432, offset: 0.67, icon: 'icon_pengikut', w: 28, h: 28 },
              ].map((item, idx) => {
                const cycle = modPos((f - 679) * 0.011 + item.offset, 1);
                const riseY = interpolate(cycle, [0, 1], [442, 352]);
                const riseOp =
                  interpolate(cycle, [0, 0.18, 0.78, 1], [0, 0.95, 0.95, 0]) *
                  fadeIn(f, 730, 18) *
                  b02RightOut;
                const pScale = 1 + 0.06 * Math.sin(f * 0.16 + idx * 2.1);
                return (
                  <Sprite
                    key={`rise-${idx}`}
                    name={item.icon}
                    x={item.x - (item.w * pScale) / 2}
                    y={riseY - (item.h * pScale) / 2}
                    w={item.w * pScale}
                    h={item.h * pScale}
                    opacity={riseOp}
                    z={38}
                  />
                );
              })}
            </>
          ) : null}
        </Cam>

        {/* B03 Kanan: ikon tanda tanya besar + kartu tebak di area atas sisi kanan */}
        {isB03 ? (
          <>
            <Sprite
              name="icon_tanda_tanya"
              x={320 - qW / 2}
              y={136 - qH / 2 + b03Bob}
              w={qW}
              h={qH}
              opacity={b03Op}
              z={44}
            />
            <CenteredCardPop
              name="tebak_kanan"
              cx={320}
              cy={242}
              f={f}
              f0={1216}
              fadeOutAt={1520}
              fadeOutDur={20}
              z={45}
            />
          </>
        ) : null}
      </Half>
    </>
  );
};
