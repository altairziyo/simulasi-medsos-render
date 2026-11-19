import React from 'react';
import { interpolate } from 'remotion';
import { EZ, H, HALF, Sprite, Walker, cam, fadeIn } from './common';

export type Side = 0 | 1;
export type Era = 0 | 1 | 2 | 3 | 4 | 5;
export type GridTone = 'hangat' | 'cerah' | 'netral';

interface BoxProps {
  x: number;
  y: number;
  w: number;
  h: number;
  bg: string;
  opacity?: number;
  z?: number;
  border?: string;
  radius?: number;
  transform?: string;
  transformOrigin?: string;
}

const Box: React.FC<BoxProps> = ({
  x,
  y,
  w,
  h,
  bg,
  opacity,
  z,
  border,
  radius,
  transform,
  transformOrigin,
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      backgroundColor: bg,
      opacity,
      zIndex: z,
      border,
      borderRadius: radius,
      transform,
      transformOrigin,
      boxSizing: 'border-box',
    }}
  />
);

const SceneFrame: React.FC<{ bg?: string; children?: React.ReactNode }> = ({
  bg = '#000000',
  children,
}) => (
  <div
    style={{
      position: 'relative',
      width: HALF,
      height: H,
      overflow: 'hidden',
      backgroundColor: bg,
    }}
  >
    {children}
  </div>
);

const clamp01 = (v: number): number => Math.max(0, Math.min(1, v));

const modPos = (v: number, m: number): number => ((v % m) + m) % m;

const SKY_DAY_BANDS = [
  '#79b5e0',
  '#82bce3',
  '#8cc3e6',
  '#96cae9',
  '#9fd0ec',
  '#a8d4f0',
] as const;

const SKY_SENJA_BANDS = [
  '#d88f5a',
  '#e29c64',
  '#e8a56b',
  '#edb174',
  '#f0ba7d',
  '#f2c184',
] as const;

const SKY_NIGHT_BANDS = [
  '#1d2a4a',
  '#202e50',
  '#233255',
  '#26355a',
  '#28385d',
  '#2a3a5f',
] as const;

const STARS: ReadonlyArray<{ x: number; y: number; s: number; phase: number }> = [
  { x: 34, y: 28, s: 2, phase: 0.4 },
  { x: 96, y: 54, s: 3, phase: 1.7 },
  { x: 158, y: 22, s: 2, phase: 2.9 },
  { x: 214, y: 74, s: 2, phase: 0.9 },
  { x: 278, y: 36, s: 3, phase: 3.5 },
  { x: 342, y: 62, s: 2, phase: 2.1 },
  { x: 406, y: 26, s: 2, phase: 4.2 },
  { x: 468, y: 58, s: 3, phase: 1.3 },
  { x: 522, y: 32, s: 2, phase: 5.0 },
  { x: 590, y: 48, s: 2, phase: 2.6 },
  { x: 72, y: 112, s: 2, phase: 3.9 },
  { x: 192, y: 126, s: 2, phase: 1.1 },
  { x: 318, y: 108, s: 2, phase: 4.8 },
  { x: 446, y: 118, s: 2, phase: 0.2 },
  { x: 564, y: 102, s: 3, phase: 3.1 },
];

const CLOUDS: ReadonlyArray<{
  baseX: number;
  y: number;
  w: number;
  h: number;
  speed: number;
}> = [
  { baseX: 40, y: 46, w: 96, h: 24, speed: 0.16 },
  { baseX: 220, y: 84, w: 118, h: 28, speed: 0.12 },
  { baseX: 430, y: 52, w: 88, h: 22, speed: 0.2 },
  { baseX: 540, y: 122, w: 104, h: 24, speed: 0.14 },
];

const PixelCloud: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  topColor: string;
  shadeColor: string;
  opacity?: number;
  z?: number;
}> = ({ x, y, w, h, topColor, shadeColor, opacity = 1, z }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      opacity,
      zIndex: z,
    }}
  >
    <Box x={Math.round(w * 0.22)} y={0} w={Math.round(w * 0.44)} h={Math.round(h * 0.55)} bg={topColor} />
    <Box x={Math.round(w * 0.08)} y={Math.round(h * 0.3)} w={Math.round(w * 0.84)} h={Math.round(h * 0.5)} bg={topColor} />
    <Box x={0} y={Math.round(h * 0.55)} w={w} h={Math.round(h * 0.45)} bg={shadeColor} />
  </div>
);

const PixelTree: React.FC<{
  x: number;
  y: number;
  scale?: number;
  dark?: boolean;
  z?: number;
}> = ({ x, y, scale = 1, dark = false, z }) => {
  const w = Math.round(28 * scale);
  const h = Math.round(36 * scale);
  const cTop = dark ? '#36683c' : '#4a8a4b';
  const cMid = dark ? '#2d5834' : '#3d7740';
  const trunk = '#6c4932';
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, zIndex: z }}>
      <Box x={Math.round(w * 0.36)} y={Math.round(h * 0.62)} w={Math.round(w * 0.28)} h={Math.round(h * 0.38)} bg={trunk} />
      <Box x={Math.round(w * 0.18)} y={0} w={Math.round(w * 0.64)} h={Math.round(h * 0.34)} bg={cTop} />
      <Box x={0} y={Math.round(h * 0.22)} w={w} h={Math.round(h * 0.38)} bg={cTop} />
      <Box x={Math.round(w * 0.08)} y={Math.round(h * 0.48)} w={Math.round(w * 0.84)} h={Math.round(h * 0.22)} bg={cMid} />
    </div>
  );
};

// ============================================================================
// 1. DesaMap
// ============================================================================

export interface DesaMapProps {
  f: number;
  side: Side;
  era: Era;
  flood?: number;
  rain?: boolean;
  night?: number;
  senja?: number;
  festival?: boolean;
}

const RAIN_DROPS: ReadonlyArray<{ x: number; baseY: number; len: number; speed: number }> =
  Array.from({ length: 42 }, (_, i) => ({
    x: ((i * 53 + 17) % (HALF - 16)) + 8,
    baseY: (i * 97) % (H + 60),
    len: 14 + (i % 3) * 6,
    speed: 9 + (i % 4) * 2.2,
  }));

export const DesaMap: React.FC<DesaMapProps> = ({
  f,
  side,
  era,
  flood = 0,
  rain = false,
  night = 0,
  senja = 0,
  festival = false,
}) => {
  const n = clamp01(night);
  const s = clamp01(senja);
  const fl = clamp01(flood);
  const isRight = side === 1;
  const isRightEvolved = isRight && era >= 1;
  const isAsphalt = isRight && era >= 2;
  const isCoolNight = isRight && era >= 2;

  const towerX = isRight ? 60 : 540;
  const towerTipY = 178;
  const beaconPulse = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f * 0.14));

  // Warung geometry (grows with era on right side)
  let warungX = 510;
  let warungY = 446;
  let warungW = 84;
  let warungH = 52;
  if (isRight) {
    if (era === 1) {
      warungX = 496;
      warungY = 438;
      warungW = 104;
      warungH = 60;
    } else if (era >= 2 && era < 5) {
      warungX = 478;
      warungY = 426;
      warungW = 132;
      warungH = 74;
    } else if (era >= 5) {
      warungX = 468;
      warungY = 414;
      warungW = 156;
      warungH = 86;
    }
  }

  const winGlowColor = isCoolNight ? '#7ee4ff' : '#ffd98a';
  const winGlowOuter = isCoolNight ? '#35c4e8' : '#ffb84d';
  const windowLitOpacity = clamp01(n * 1.15 + (festival ? 0.5 : 0));

  const walkerList: ReadonlyArray<{
    name: string;
    y: number;
    seed: number;
    speed: number;
  }> = isRightEvolved
    ? [
        { name: 'warga_hp_a_walk', y: 505, seed: 11, speed: 0.48 },
        { name: 'warga_hp_b_walk', y: 507, seed: 29, speed: -0.42 },
        { name: 'warga_c_walk', y: 506, seed: 47, speed: 0.36 },
        { name: 'warga_d_walk', y: 508, seed: 63, speed: -0.5 },
      ]
    : [
        { name: 'warga_a_walk', y: 505, seed: 13, speed: 0.46 },
        { name: 'warga_b_walk', y: 507, seed: 31, speed: -0.4 },
        { name: 'warga_c_walk', y: 506, seed: 52, speed: 0.38 },
        { name: 'warga_d_walk', y: 508, seed: 71, speed: -0.44 },
      ];

  const floodTop = 650 - fl * 70;

  return (
    <SceneFrame bg="#79b5e0">
      {/* 1. Langit siang (y 0-300) */}
      {SKY_DAY_BANDS.map((color, idx) => (
        <Box key={`sky-d-${idx}`} x={0} y={idx * 50} w={HALF} h={51} bg={color} z={1} />
      ))}

      {/* Overlay langit senja */}
      {s > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: HALF, height: 300, opacity: s, zIndex: 2 }}>
          {SKY_SENJA_BANDS.map((color, idx) => (
            <Box key={`sky-s-${idx}`} x={0} y={idx * 50} w={HALF} h={51} bg={color} />
          ))}
          {/* Matahari senja */}
          <Box x={isRight ? 460 : 120} y={184} w={52} h={52} bg="#ffe2a8" radius={26} opacity={0.85} />
          <Box x={isRight ? 468 : 128} y={192} w={36} h={36} bg="#fff4d2" radius={18} />
        </div>
      ) : null}

      {/* Overlay langit malam */}
      {n > 0 ? (
        <div style={{ position: 'absolute', left: 0, top: 0, width: HALF, height: 300, opacity: n, zIndex: 3 }}>
          {SKY_NIGHT_BANDS.map((color, idx) => (
            <Box key={`sky-n-${idx}`} x={0} y={idx * 50} w={HALF} h={51} bg={color} />
          ))}
          {STARS.map((st, idx) => {
            const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f * 0.06 + st.phase));
            return (
              <Box
                key={`star-${idx}`}
                x={st.x}
                y={st.y}
                w={st.s}
                h={st.s}
                bg="#eef5ff"
                opacity={tw}
              />
            );
          })}
          {/* Bulan malam */}
          <Box x={isRight ? 488 : 112} y={42} w={34} h={34} bg="#f7ecc4" radius={17} />
          <Box x={isRight ? 497 : 121} y={40} w={28} h={28} bg="#1d2a4a" radius={14} />
        </div>
      ) : null}

      {/* Awan blok pixel bergerak lambat kontinu */}
      {CLOUDS.map((cl, idx) => {
        const span = HALF + cl.w + 48;
        const cx = modPos(cl.baseX + f * cl.speed, span) - cl.w;
        const cloudOpacity = clamp01(1 - n * 0.55);
        const topC = s > 0.4 ? '#f9dec2' : '#f4f9fd';
        const shadeC = s > 0.4 ? '#ebb98c' : '#d6e8f5';
        return (
          <PixelCloud
            key={`cloud-${idx}`}
            x={cx}
            y={cl.y}
            w={cl.w}
            h={cl.h}
            topColor={topC}
            shadeColor={shadeC}
            opacity={cloudOpacity}
            z={4}
          />
        );
      })}

      {/* 2. Bukit (y 240-330) */}
      {/* Lapisan bukit jauh */}
      <Box x={0} y={266} w={130} h={64} bg="#4b8252" z={5} />
      <Box x={24} y={252} w={92} h={24} bg="#4b8252" z={5} />
      <Box x={110} y={258} w={164} h={72} bg="#4f8855" z={5} />
      <Box x={148} y={244} w={96} h={24} bg="#4f8855" z={5} />
      <Box x={260} y={264} w={156} h={66} bg="#4b8252" z={5} />
      <Box x={294} y={250} w={92} h={22} bg="#4b8252" z={5} />
      <Box x={404} y={256} w={140} h={74} bg="#4f8855" z={5} />
      <Box x={442} y={242} w={84} h={24} bg="#4f8855" z={5} />
      <Box x={516} y={260} w={124} h={70} bg="#4b8252" z={5} />
      <Box x={540} y={246} w={76} h={22} bg="#4b8252" z={5} />

      {/* Lapisan bukit dekat */}
      <Box x={0} y={286} w={HALF} h={44} bg="#619c58" z={6} />
      <Box x={30} y={276} w={160} h={18} bg="#619c58" z={6} />
      <Box x={230} y={280} w={190} h={14} bg="#619c58" z={6} />
      <Box x={462} y={274} w={154} h={18} bg="#619c58" z={6} />

      {/* Pepohonan di kaki bukit */}
      <PixelTree x={16} y={264} scale={0.95} z={7} />
      <PixelTree x={286} y={268} scale={0.9} z={7} />
      <PixelTree x={330} y={272} scale={0.85} z={7} />
      <PixelTree x={368} y={266} scale={0.95} z={7} />
      <PixelTree x={602} y={268} scale={0.9} z={7} />

      {/* 3. Menara sinyal (x=540 kiri, cermin x=60 kanan) */}
      <div style={{ position: 'absolute', left: towerX - 18, top: towerTipY, width: 36, height: 102, zIndex: 8 }}>
        {/* Tiang antena atas */}
        <Box x={17} y={0} w={2} h={24} bg="#8b96a3" />
        {/* Lampu puncak berkedip halus */}
        <Box x={15} y={0} w={6} h={6} bg="#ef4d4d" opacity={beaconPulse} radius={3} />
        {/* Rangka menara bertingkat */}
        <Box x={13} y={24} w={10} h={22} bg="transparent" border="2px solid #727d8a" />
        <Box x={10} y={46} w={16} h={24} bg="transparent" border="2px solid #65707d" />
        <Box x={6} y={70} w={24} h={28} bg="transparent" border="2px solid #596370" />
        {/* Palang horizontal */}
        <Box x={12} y={35} w={12} h={2} bg="#8e99a6" />
        <Box x={9} y={58} w={18} h={2} bg="#8e99a6" />
        <Box x={6} y={84} w={24} h={2} bg="#7e8996" />
        {/* Pondasi beton */}
        <Box x={3} y={96} w={30} h={6} bg="#5a6169" />
      </div>

      {/* Gelombang sinyal tipis berdenyut kontinu */}
      {[0, 0.33, 0.66].map((offset, idx) => {
        const phase = modPos(f * 0.015 + offset, 1);
        const radius = interpolate(phase, [0, 1], [7, 42]);
        const waveOpacity =
          interpolate(phase, [0, 0.25, 1], [0, 0.8, 0]) *
          (isRightEvolved ? 0.95 : 0.6);
        const waveColor = isRightEvolved ? '#35c4e8' : '#e4f2fb';
        return (
          <div
            key={`sig-${idx}`}
            style={{
              position: 'absolute',
              left: towerX - radius,
              top: towerTipY + 4 - radius,
              width: radius * 2,
              height: radius * 2,
              borderRadius: radius,
              border: `2px solid ${waveColor}`,
              opacity: waveOpacity,
              zIndex: 9,
              boxSizing: 'border-box',
            }}
          />
        );
      })}

      {/* 4. Tanah desa & hamparan rumput (y 300-500) */}
      <Box x={0} y={300} w={HALF} h={200} bg="#7ab45c" z={6} />
      {/* Patch rumput lembut */}
      <Box x={24} y={322} w={90} h={18} bg="#72ab55" z={6} />
      <Box x={274} y={346} w={110} h={22} bg="#82bc64" z={6} />
      <Box x={440} y={418} w={80} h={16} bg="#72ab55" z={6} />
      {/* Jalan setapak dari balai & sekolah ke jalan utama */}
      <Box x={144} y={416} w={32} h={84} bg="#c0a473" z={7} />
      <Box x={476} y={408} w={26} h={92} bg="#c0a473" z={7} />

      {/* 5. Balai desa (x 60-260, y 300-420) */}
      <div style={{ position: 'absolute', left: 60, top: 300, width: 200, height: 120, zIndex: 10 }}>
        {/* Atap joglo/limasan terakota */}
        <Box x={42} y={0} w={116} h={18} bg="#a24831" />
        <Box x={24} y={16} w={152} h={18} bg="#b5563c" />
        <Box x={4} y={32} w={192} h={18} bg="#c26146" />
        <Box x={0} y={46} w={200} h={6} bg="#863925" />
        {/* Dinding krem */}
        <Box x={14} y={52} w={172} h={58} bg="#e8dcc0" />
        <Box x={14} y={98} w={172} h={12} bg="#cfc0a0" />
        {/* Tiang pendopo kayu */}
        <Box x={20} y={52} w={8} h={58} bg="#7b5236" />
        <Box x={64} y={52} w={6} h={58} bg="#7b5236" />
        <Box x={130} y={52} w={6} h={58} bg="#7b5236" />
        <Box x={172} y={52} w={8} h={58} bg="#7b5236" />
        {/* Pintu utama */}
        <Box x={86} y={66} w={28} h={44} bg="#6b452d" />
        <Box x={90} y={70} w={9} h={36} bg="#7d5338" />
        <Box x={101} y={70} w={9} h={36} bg="#7d5338" />
        {/* Jendela balai */}
        <Box x={34} y={66} w={22} h={20} bg="#4a5f75" border="2px solid #7b5236" />
        <Box x={144} y={66} w={22} h={20} bg="#4a5f75" border="2px solid #7b5236" />
        {/* Teras tangga depan */}
        <Box x={10} y={110} w={180} h={10} bg="#b5a68c" />
        <Box x={72} y={114} w={56} h={6} bg="#9c8d73" />
        {/* Papan hitung kiri untuk era>=3 */}
        {!isRight && era >= 3 ? (
          <div style={{ position: 'absolute', left: 146, top: 92, width: 26, height: 22 }}>
            <Box x={0} y={0} w={26} h={16} bg="#3b5e41" border="2px solid #6b452d" />
            <Box x={4} y={4} w={8} h={2} bg="#f2efe6" />
            <Box x={4} y={8} w={14} h={2} bg="#ffd98a" />
            <Box x={4} y={16} w={3} h={6} bg="#6b452d" />
            <Box x={19} y={16} w={3} h={6} bg="#6b452d" />
          </div>
        ) : null}
      </div>

      {/* 6. Sekolah (x 400-580, y 310-410) */}
      <div style={{ position: 'absolute', left: 400, top: 310, width: 180, height: 100, zIndex: 10 }}>
        {/* Atap terakota */}
        <Box x={14} y={0} w={152} h={16} bg="#a24831" />
        <Box x={4} y={14} w={172} h={18} bg="#b5563c" />
        <Box x={0} y={30} w={180} h={5} bg="#863925" />
        {/* Dinding krem */}
        <Box x={10} y={35} w={160} h={57} bg="#ece1c7" />
        <Box x={10} y={82} w={160} h={10} bg="#d1c3a5" />
        {/* Pintu kelas */}
        <Box x={24} y={54} w={20} h={38} bg="#7b5236" />
        {/* Deret jendela kelas */}
        <Box x={56} y={50} w={24} h={20} bg="#5a7691" border="2px solid #8a6042" />
        <Box x={92} y={50} w={24} h={20} bg="#5a7691" border="2px solid #8a6042" />
        <Box x={128} y={50} w={24} h={20} bg="#5a7691" border="2px solid #8a6042" />
        {/* Tiang bendera */}
        <Box x={174} y={24} w={3} h={74} bg="#d8dce0" />
        <Box x={160} y={26} w={14} h={5} bg="#d93b3b" />
        <Box x={160} y={31} w={14} h={5} bg="#f5f5f5" />
        {/* Dasar */}
        <Box x={6} y={92} w={168} h={8} bg="#b4a68b" />
      </div>

      {/* 7. Lapangan voli (x 250-420, y 420-500) */}
      <div style={{ position: 'absolute', left: 250, top: 420, width: 170, height: 80, zIndex: 9 }}>
        {/* Tanah lapangan */}
        <Box x={0} y={0} w={170} h={80} bg="#c9ad78" />
        <Box x={6} y={6} w={158} h={68} bg="#d3ba88" border="2px solid #f4f1e6" />
        {/* Garis serang & garis tengah */}
        <Box x={60} y={6} w={2} h={68} bg="#f4f1e6" opacity={0.85} />
        <Box x={108} y={6} w={2} h={68} bg="#f4f1e6" opacity={0.85} />
        {/* Tiang & net voli di tengah lapangan */}
        <Box x={83} y={2} w={4} h={76} bg="#545c66" />
        <Box x={84} y={8} w={2} h={64} bg="#f7f7f2" />
      </div>

      {/* Panggung festival di lapangan bila festival=true */}
      {festival ? (
        <div style={{ position: 'absolute', left: 262, top: 422, width: 146, height: 64, zIndex: 13 }}>
          <Box
            x={8}
            y={0}
            w={130}
            h={38}
            bg={isRight ? '#1e2742' : '#5e3b28'}
            border={isRight ? '2px solid #35c4e8' : '2px solid #ffd98a'}
          />
          <Box x={18} y={8} w={110} h={20} bg={isRight ? '#f05ab4' : '#d99848'} opacity={0.75} />
          <Box x={0} y={38} w={146} h={20} bg={isRight ? '#3b4357' : '#85583a'} />
          <Box x={4} y={56} w={138} h={8} bg="#2d2b30" />
        </div>
      ) : null}

      {/* 8. Deretan rumah di kiri jalan (y 430-500, x 12-232) */}
      {[
        { x: 14, y: 432, w: 66, h: 66, roof: '#b5563c', wall: '#e8dcc0', isStudio: isRight && era >= 5 },
        { x: 88, y: 434, w: 66, h: 64, roof: '#a64d36', wall: '#e5d6b7', isStudio: false },
        { x: 162, y: 432, w: 66, h: 66, roof: '#bd5d43', wall: '#ebe0c6', isStudio: false },
      ].map((house, idx) => (
        <div
          key={`house-${idx}`}
          style={{ position: 'absolute', left: house.x, top: house.y, width: house.w, height: house.h, zIndex: 11 }}
        >
          {house.isStudio ? (
            <>
              {/* Studio Nadia (Era 5 kanan) */}
              <Box x={2} y={4} w={house.w - 4} h={16} bg="#2d384f" />
              <Box x={2} y={18} w={house.w - 4} h={3} bg="#35c4e8" />
              <Box x={6} y={21} w={house.w - 12} h={41} bg="#d6dde8" />
              <Box x={12} y={30} w={22} h={16} bg="#324b6b" border="2px solid #35c4e8" />
              <Box x={40} y={34} w={14} h={28} bg="#414c61" />
              <Box x={6} y={22} w={house.w - 12} h={3} bg="#f05ab4" />
            </>
          ) : (
            <>
              <Box x={6} y={0} w={house.w - 12} h={12} bg="#96422c" />
              <Box x={0} y={10} w={house.w} h={14} bg={house.roof} />
              <Box x={6} y={24} w={house.w - 12} h={38} bg={house.wall} />
              <Box x={12} y={34} w={16} h={14} bg="#4b5f75" border="2px solid #7b5236" />
              <Box x={36} y={36} w={14} h={26} bg="#7b5236" />
            </>
          )}
          <Box x={4} y={60} w={house.w - 8} h={6} bg="#a89a82" />
        </div>
      ))}

      {/* Pepohonan rindang tambahan untuk kiri era 5 (matang teduh) */}
      {!isRight && era >= 5 ? (
        <>
          <PixelTree x={232} y={376} scale={1.05} dark z={11} />
          <PixelTree x={378} y={372} scale={1.0} z={11} />
          <PixelTree x={600} y={414} scale={1.0} dark z={11} />
        </>
      ) : null}

      {/* 9. Warung (x 470-620, y 430-520; membesar sesuai era untuk sisi kanan) */}
      <div
        style={{
          position: 'absolute',
          left: warungX,
          top: warungY,
          width: warungW,
          height: warungH,
          zIndex: 12,
        }}
      >
        {isRight && era >= 2 ? (
          <>
            {/* Versi besar modern Sukaramai */}
            {era >= 5 ? (
              <>
                <Box x={8} y={0} w={warungW - 16} h={16} bg="#2d3a54" />
                <Box x={8} y={14} w={warungW - 16} h={4} bg="#35c4e8" />
              </>
            ) : null}
            <Box x={0} y={era >= 5 ? 18 : 0} w={warungW} h={18} bg="#394661" />
            {/* Strip neon/awning */}
            <Box x={0} y={era >= 5 ? 34 : 16} w={warungW} h={5} bg="#f05ab4" />
            {/* Dinding modern */}
            <Box x={4} y={era >= 5 ? 39 : 21} w={warungW - 8} h={warungH - (era >= 5 ? 43 : 25)} bg="#ebe6dc" />
            {/* Etalase kaca lebar */}
            <Box x={12} y={era >= 5 ? 48 : 30} w={Math.round(warungW * 0.52)} h={24} bg="#8ecae6" border="2px solid #35c4e8" />
            {/* Pintu lebar */}
            <Box x={warungW - 34} y={era >= 5 ? 46 : 30} w={22} h={warungH - (era >= 5 ? 50 : 34)} bg="#4a5870" />
            {/* Papan nama blok */}
            <Box x={Math.round(warungW * 0.25)} y={era >= 5 ? 21 : 3} w={Math.round(warungW * 0.5)} h={10} bg="#35c4e8" />
          </>
        ) : (
          <>
            {/* Warung tradisional / era 1 */}
            <Box x={4} y={0} w={warungW - 8} h={12} bg="#9c452e" />
            <Box x={0} y={10} w={warungW} h={12} bg="#b5563c" />
            {isRight && era === 1 ? (
              <Box x={14} y={12} w={warungW - 28} h={6} bg="#35c4e8" />
            ) : null}
            <Box x={4} y={22} w={warungW - 8} h={warungH - 24} bg="#e8dcc0" />
            {/* Kanopi etalase */}
            <Box x={8} y={26} w={Math.round(warungW * 0.5)} h={16} bg="#63452f" />
            <Box x={10} y={28} w={Math.round(warungW * 0.5) - 4} h={10} bg="#e0ba77" />
            {/* Pintu */}
            <Box x={warungW - 26} y={28} w={16} h={warungH - 30} bg="#7b5236" />
          </>
        )}
      </div>

      {/* Teras tambahan warung untuk kanan era>=5 */}
      {isRight && era >= 5 ? (
        <div style={{ position: 'absolute', left: 462, top: 494, width: 166, height: 22, zIndex: 13 }}>
          <Box x={0} y={4} w={166} h={14} bg="#9c734b" border="2px solid #6b4c30" />
          {/* Meja & kursi teras */}
          <Box x={14} y={0} w={24} h={8} bg="#7a5133" />
          <Box x={64} y={0} w={24} h={8} bg="#7a5133" />
          <Box x={116} y={0} w={24} h={8} bg="#7a5133" />
          {/* Lampu tepi teras */}
          <Box x={4} y={2} w={6} h={6} bg="#cfe8ff" />
          <Box x={156} y={2} w={6} h={6} bg="#cfe8ff" />
        </div>
      ) : null}

      {/* Meja kayu luar warung untuk sisi kanan era>=4 */}
      {isRight && era >= 4 ? (
        <div style={{ position: 'absolute', left: 432, top: 472, width: 42, height: 26, zIndex: 13 }}>
          <Box x={2} y={4} w={16} h={6} bg="#875a37" />
          <Box x={4} y={10} w={3} h={10} bg="#633f24" />
          <Box x={13} y={10} w={3} h={10} bg="#633f24" />
          <Box x={22} y={8} w={18} h={6} bg="#875a37" />
          <Box x={24} y={14} w={3} h={10} bg="#633f24" />
          <Box x={35} y={14} w={3} h={10} bg="#633f24" />
        </div>
      ) : null}

      {/* 10. Jalan horizontal (y 500-545) */}
      <div style={{ position: 'absolute', left: 0, top: 500, width: HALF, height: 45, zIndex: 8 }}>
        {isAsphalt ? (
          <>
            <Box x={0} y={0} w={HALF} h={4} bg="#6e7682" />
            <Box x={0} y={4} w={HALF} h={37} bg="#444a54" />
            <Box x={0} y={41} w={HALF} h={4} bg="#6e7682" />
            {Array.from({ length: 12 }, (_, idx) => (
              <Box key={`lane-${idx}`} x={16 + idx * 54} y={21} w={28} h={3} bg="#dce2eb" opacity={0.85} />
            ))}
          </>
        ) : (
          <>
            <Box x={0} y={0} w={HALF} h={45} bg="#b99a68" />
            <Box x={0} y={0} w={HALF} h={4} bg="#9c8053" />
            <Box x={0} y={14} w={HALF} h={16} bg="#c5a776" />
            <Box x={0} y={41} w={HALF} h={4} bg="#9c8053" />
          </>
        )}
      </div>

      {/* 11. Sawah bertingkat (y 545-650) */}
      <div style={{ position: 'absolute', left: 0, top: 545, width: HALF, height: 105, zIndex: 8 }}>
        {[
          { y: 0, h: 20, bg: '#69a84f' },
          { y: 20, h: 20, bg: '#7fbc5f' },
          { y: 40, h: 21, bg: '#69a84f' },
          { y: 61, h: 22, bg: '#7fbc5f' },
          { y: 83, h: 22, bg: '#69a84f' },
        ].map((strip, idx) => (
          <React.Fragment key={`sawah-${idx}`}>
            <Box x={0} y={strip.y} w={HALF} h={strip.h} bg={strip.bg} />
            {/* Pematang sawah horizontal */}
            <Box x={0} y={strip.y + strip.h - 3} w={HALF} h={3} bg="#538a3e" />
          </React.Fragment>
        ))}
        {/* Pematang vertikal antar petak */}
        <Box x={118} y={0} w={4} h={62} bg="#5a9142" />
        <Box x={264} y={20} w={4} h={85} bg="#5a9142" />
        <Box x={412} y={0} w={4} h={84} bg="#5a9142" />
        <Box x={534} y={20} w={4} h={85} bg="#5a9142" />
      </div>

      {/* Gapura spot foto di sawah untuk kanan era>=1 */}
      {isRight && era >= 1 ? (
        <div style={{ position: 'absolute', left: 140, top: 552, width: 76, height: 54, zIndex: 14 }}>
          {/* Dek kayu kecil */}
          <Box x={4} y={44} w={68} h={10} bg="#9c734b" />
          {/* Tiang gapura */}
          <Box x={10} y={10} w={8} h={36} bg="#e8ecf2" />
          <Box x={58} y={10} w={8} h={36} bg="#e8ecf2" />
          {/* Lengkungan/puncak spot foto warna cerah */}
          <Box x={6} y={4} w={64} h={10} bg="#35c4e8" />
          <Box x={18} y={0} w={40} h={6} bg="#f05ab4" />
          <Box x={28} y={14} w={20} h={6} bg="#ffd98a" />
        </div>
      ) : null}

      {/* 12. Sungai (y 650-720) */}
      <div style={{ position: 'absolute', left: 0, top: 650, width: HALF, height: 70, zIndex: 10 }}>
        {/* Tanggul tepi sungai */}
        <Box x={0} y={0} w={HALF} h={6} bg="#7e6c4b" />
        {/* Air sungai */}
        <Box x={0} y={6} w={HALF} h={22} bg="#3d86bf" />
        <Box x={0} y={28} w={HALF} h={22} bg="#3276ad" />
        <Box x={0} y={50} w={HALF} h={20} bg="#286496" />
        {/* Riak air bergerak kontinu */}
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const rx = modPos(idx * 116 + f * (0.45 + (idx % 2) * 0.2), HALF + 48) - 24;
          const ry = 14 + (idx % 3) * 18;
          return (
            <Box key={`rip-${idx}`} x={rx} y={ry} w={28} h={3} bg="#8ccbf2" opacity={0.55} />
          );
        })}
      </div>

      {/* Banjir (flood > 0): air naik menutupi sawah bagian bawah sebanding flood */}
      {fl > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: floodTop,
            width: HALF,
            height: H - floodTop,
            zIndex: 16,
            overflow: 'hidden',
          }}
        >
          <Box x={0} y={0} w={HALF} h={H - floodTop} bg="#2c6ea3" opacity={0.82} />
          <Box x={0} y={0} w={HALF} h={4} bg="#9dd4f5" opacity={0.7} />
          {[0, 1, 2, 3, 4].map((idx) => {
            const wx = modPos(idx * 138 + f * 0.6, HALF + 60) - 30;
            return (
              <Box
                key={`flw-${idx}`}
                x={wx}
                y={10 + (idx % 3) * 16}
                w={36}
                h={3}
                bg="#a6dbf7"
                opacity={0.48}
              />
            );
          })}
        </div>
      ) : null}

      {/* 13. Prop Era */}
      {/* Kanan era>=1: mobil & motor dekat warung */}
      {isRight && era >= 1 ? (
        <>
          <Sprite name="prop_mobil" x={402} y={512} w={56} h={25} z={17} />
          <Sprite name="prop_motor" x={580} y={514} w={36} h={23} z={17} />
        </>
      ) : null}

      {/* Kanan era>=3: baliho pilkades beberapa titik */}
      {isRight && era >= 3 ? (
        <>
          <Sprite name="prop_baliho" x={268} y={356} w={48} h={32} z={15} />
          <Sprite name="prop_baliho" x={368} y={456} w={48} h={32} z={15} />
          <Sprite name="prop_baliho" x={44} y={548} w={48} h={32} z={15} />
        </>
      ) : null}

      {/* Kiri era>=3: toa di balai + kentongan 3 titik */}
      {!isRight && era >= 3 ? (
        <>
          <Sprite name="prop_toa" x={242} y={316} w={28} h={25} z={15} />
          <Sprite name="prop_kentongan" x={62} y={388} w={16} h={29} z={15} />
          <Sprite name="prop_kentongan" x={232} y={468} w={16} h={29} z={15} />
          <Sprite name="prop_kentongan" x={476} y={468} w={16} h={29} z={15} />
        </>
      ) : null}

      {/* Festival lampion berderet */}
      {festival ? (
        <>
          <Box x={32} y={409} w={576} h={2} bg="#2d2b35" z={18} />
          {[48, 132, 216, 300, 384, 468, 552].map((lx, idx) => (
            <Sprite key={`lamp-${idx}`} name="prop_lampion" x={lx} y={408} w={18} h={26} z={19} />
          ))}
        </>
      ) : null}

      {/* 14. Walker ambient di jalur jalan (y 505-540) */}
      <div style={{ position: 'absolute', left: 0, top: 0, width: HALF, height: H, zIndex: 20 }}>
        {walkerList.map((wk, idx) => (
          <Walker
            key={`wk-${idx}`}
            name={wk.name}
            side={side}
            y={wk.y}
            seed={wk.seed}
            speed={wk.speed}
            scale={0.44}
            f={f}
          />
        ))}
      </div>

      {/* 15. Atmosfer senja/malam di atas daratan (di bawah cahaya jendela/lampu) */}
      {s > 0 ? (
        <Box x={0} y={240} w={HALF} h={480} bg="#e08f4f" opacity={s * 0.22} z={22} />
      ) : null}
      {n > 0 ? (
        <Box x={0} y={240} w={HALF} h={480} bg="#15203b" opacity={n * 0.48} z={23} />
      ) : null}

      {/* Cahaya jendela & lampu saat malam / festival */}
      {windowLitOpacity > 0.05 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            opacity: windowLitOpacity,
            zIndex: 24,
          }}
        >
          {/* Balai windows */}
          <Box x={96} y={368} w={18} h={16} bg={winGlowColor} />
          <Box x={206} y={368} w={18} h={16} bg={winGlowColor} />
          {/* Sekolah windows */}
          <Box x={458} y={362} w={20} h={16} bg={winGlowColor} opacity={0.75} />
          <Box x={494} y={362} w={20} h={16} bg={winGlowColor} opacity={0.75} />
          {/* Rumah-rumah windows */}
          <Box x={28} y={468} w={12} h={10} bg={winGlowColor} />
          <Box x={102} y={470} w={12} h={10} bg={winGlowColor} />
          <Box x={176} y={468} w={12} h={10} bg={winGlowColor} />
          {/* Halo lampu teras kiri (hangat) atau etalase kanan (dingin) */}
          <Box
            x={warungX + 12}
            y={warungY + 26}
            w={Math.round(warungW * 0.52)}
            h={18}
            bg={winGlowOuter}
            opacity={0.7}
          />
          {!isRight && era >= 2 ? (
            <>
              <Box x={256} y={422} w={16} h={16} bg="#ffd98a" radius={8} opacity={0.5} />
              <Box x={400} y={422} w={16} h={16} bg="#ffd98a" radius={8} opacity={0.5} />
            </>
          ) : null}
        </div>
      ) : null}

      {/* 16. Hujan (rain=true) — garis miring tipis turun kontinu */}
      {rain ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: HALF,
            height: H,
            zIndex: 26,
            overflow: 'hidden',
          }}
        >
          <Box x={0} y={0} w={HALF} h={H} bg="#2a3a52" opacity={0.22} />
          {RAIN_DROPS.map((drop, idx) => {
            const ry = modPos(drop.baseY + f * drop.speed, H + 60) - 30;
            const rx = modPos(drop.x - f * (drop.speed * 0.22), HALF);
            return (
              <Box
                key={`rain-${idx}`}
                x={rx}
                y={ry}
                w={2}
                h={drop.len}
                bg="#cde4fa"
                opacity={0.58}
                transform="rotate(13deg)"
              />
            );
          })}
        </div>
      ) : null}
    </SceneFrame>
  );
};

// ============================================================================
// 2. WarungScene
// ============================================================================

export interface WarungSceneProps {
  f: number;
  side: Side;
  big?: boolean;
  night?: boolean;
}

export const WarungScene: React.FC<WarungSceneProps> = ({
  f,
  side,
  big = false,
  night = false,
}) => {
  const isRight = side === 1;
  const wallBg = night ? (isRight ? '#2a3346' : '#3a342c') : isRight && big ? '#eceae4' : '#e8dcc0';
  const lowerWall = night ? '#26211c' : isRight && big ? '#6b7585' : '#9c724c';
  const floorBg = night ? '#2e2620' : isRight && big ? '#b8bcc4' : '#b89468';
  const lampGlow = isRight && big ? '#cfe8ff' : '#ffd98a';
  const lampPulse = 0.85 + 0.15 * Math.sin(f * 0.05);

  return (
    <SceneFrame bg={wallBg}>
      {/* Langit-langit & balok kayu */}
      <Box x={0} y={0} w={HALF} h={64} bg={night ? '#1c1f29' : isRight && big ? '#3c4659' : '#7a5236'} z={2} />
      <Box x={0} y={60} w={HALF} h={8} bg={night ? '#141720' : '#593a24'} z={2} />

      {/* Dinding bawah (wainscoting) */}
      <Box x={0} y={390} w={HALF} h={130} bg={lowerWall} z={2} />
      <Box x={0} y={386} w={HALF} h={6} bg={night ? '#1c1814' : '#6e4d32'} z={3} />

      {/* Lantai */}
      <Box x={0} y={520} w={HALF} h={200} bg={floorBg} z={2} />
      {[556, 604, 658].map((ly) => (
        <Box key={`fl-${ly}`} x={0} y={ly} w={HALF} h={3} bg="#000000" opacity={0.12} z={3} />
      ))}

      {/* Jendela belakang */}
      <div
        style={{
          position: 'absolute',
          left: big ? 36 : 48,
          top: 120,
          width: big ? 210 : 148,
          height: 150,
          zIndex: 4,
        }}
      >
        <Box x={0} y={0} w={big ? 210 : 148} h={150} bg={night ? '#1d2a4a' : '#8dc8eb'} border="8px solid #6b482e" />
        {!night ? (
          <Box x={8} y={96} w={(big ? 210 : 148) - 16} h={46} bg="#69a84f" />
        ) : (
          <>
            <Box x={28} y={24} w={3} h={3} bg="#eef5ff" />
            <Box x={92} y={38} w={2} h={2} bg="#eef5ff" />
            <Box x={136} y={22} w={3} h={3} bg="#eef5ff" />
          </>
        )}
        <Box x={Math.round((big ? 210 : 148) / 2) - 3} y={0} w={6} h={150} bg="#6b482e" />
        <Box x={0} y={72} w={big ? 210 : 148} h={6} bg="#6b482e" />
      </div>

      {/* Papan menu blok (tanpa teks DOM) */}
      <div style={{ position: 'absolute', left: big ? 276 : 228, top: 118, width: big ? 176 : 142, height: 112, zIndex: 4 }}>
        <Box
          x={0}
          y={0}
          w={big ? 176 : 142}
          h={112}
          bg={isRight && big ? '#222b3d' : '#2f4f38'}
          border={isRight && big ? '5px solid #35c4e8' : '5px solid #7a5236'}
        />
        <Box x={16} y={18} w={big ? 104 : 84} h={8} bg={isRight && big ? '#f05ab4' : '#ffd98a'} />
        <Box x={16} y={38} w={big ? 128 : 98} h={6} bg="#e8e2d5" opacity={0.85} />
        <Box x={16} y={54} w={big ? 116 : 86} h={6} bg="#e8e2d5" opacity={0.85} />
        <Box x={16} y={70} w={big ? 132 : 102} h={6} bg="#e8e2d5" opacity={0.85} />
        <Box x={16} y={86} w={big ? 96 : 74} h={6} bg="#e8e2d5" opacity={0.85} />
      </div>

      {/* Rak / etalase makanan & minuman */}
      <div
        style={{
          position: 'absolute',
          left: big ? 270 : 386,
          top: 280,
          width: big ? 334 : 214,
          height: 224,
          zIndex: 5,
        }}
      >
        {/* Kabinet bawah */}
        <Box x={0} y={108} w={big ? 334 : 214} h={116} bg={isRight && big ? '#465269' : '#8c5e3a'} border="4px solid #4f3521" />
        {/* Etalase kaca atas */}
        <Box
          x={6}
          y={0}
          w={(big ? 334 : 214) - 12}
          h={108}
          bg={night ? '#3a4b61' : '#c6e2f2'}
          opacity={0.75}
          border="4px solid #7a5236"
        />
        {/* Rak tengah */}
        <Box x={10} y={52} w={(big ? 334 : 214) - 20} h={5} bg="#6b482e" />
        {/* Toples / blok dagangan warna-warni */}
        {(big ? [22, 66, 114, 162, 210, 258] : [20, 66, 114, 158]).map((jx, idx) => (
          <React.Fragment key={`jar-${idx}`}>
            <Box x={jx} y={22} w={26} h={30} bg={idx % 2 === 0 ? '#e3a656' : '#d66853'} />
            <Box x={jx + 4} y={18} w={18} h={5} bg="#593a24" />
            <Box x={jx + 4} y={70} w={24} h={28} bg={idx % 2 === 0 ? '#69a84f' : '#35c4e8'} />
          </React.Fragment>
        ))}
      </div>

      {/* Meja & bangku kayu */}
      {(big
        ? [
            { x: 26, y: 470, w: 170 },
            { x: 230, y: 528, w: 176 },
            { x: 438, y: 528, w: 176 },
          ]
        : [
            { x: 48, y: 486, w: 224 },
            { x: 342, y: 544, w: 236 },
          ]
      ).map((tbl, idx) => (
        <div
          key={`tbl-${idx}`}
          style={{ position: 'absolute', left: tbl.x, top: tbl.y, width: tbl.w, height: 130, zIndex: 7 }}
        >
          {/* Bangku belakang */}
          <Box x={18} y={6} w={tbl.w - 36} h={16} bg="#754c2e" />
          {/* Daun meja */}
          <Box x={0} y={24} w={tbl.w} h={22} bg="#a87549" border="3px solid #6b4529" />
          {/* Kaki meja */}
          <Box x={14} y={46} w={14} h={74} bg="#6b4529" />
          <Box x={tbl.w - 28} y={46} w={14} h={74} bg="#6b4529" />
          {/* Bangku depan */}
          <Box x={14} y={84} w={tbl.w - 28} h={18} bg="#8f603a" border="2px solid #593920" />
          <Box x={24} y={102} w={10} h={26} bg="#593920" />
          <Box x={tbl.w - 34} y={102} w={10} h={26} bg="#593920" />
        </div>
      ))}

      {/* Lampu gantung */}
      {(big ? [140, 320, 500] : [200, 440]).map((lx, idx) => (
        <div key={`pendant-${idx}`} style={{ position: 'absolute', left: lx - 36, top: 60, width: 72, height: 160, zIndex: 10 }}>
          <Box x={35} y={0} w={2} h={58} bg="#2b2b2b" />
          <Box x={18} y={56} w={36} h={18} bg={isRight && big ? '#324059' : '#9c4e35'} />
          <Box x={28} y={72} w={16} h={10} bg={lampGlow} />
          {/* Sorotan cahaya lembut */}
          <Box
            x={-28}
            y={76}
            w={128}
            h={128}
            bg={lampGlow}
            radius={64}
            opacity={(night ? 0.24 : 0.1) * lampPulse}
          />
        </div>
      ))}

      {/* Lapisan gelap malam */}
      {night ? <Box x={0} y={0} w={HALF} h={H} bg="#0d1529" opacity={0.32} z={9} /> : null}
    </SceneFrame>
  );
};

// ============================================================================
// 3. KelasScene
// ============================================================================

export interface KelasSceneProps {
  f: number;
  side: Side;
}

export const KelasScene: React.FC<KelasSceneProps> = ({ f, side }) => {
  const isRight = side === 1;
  const sunShift = Math.sin(f * 0.02) * 4;

  return (
    <SceneFrame bg="#eee4cc">
      {/* Plafon & lis dinding */}
      <Box x={0} y={0} w={HALF} h={42} bg="#d9ceb4" z={1} />
      <Box x={0} y={388} w={HALF} h={6} bg="#a88156" z={2} />
      <Box x={0} y={394} w={HALF} h={86} bg="#d8c7a3" z={1} />

      {/* Lantai kayu */}
      <Box x={0} y={480} w={HALF} h={240} bg="#b88b58" z={2} />
      {[512, 548, 588, 632, 680].map((ly) => (
        <Box key={`wood-${ly}`} x={0} y={ly} w={HALF} h={3} bg="#996e40" z={3} />
      ))}

      {/* Jendela terang di sisi kiri dinding */}
      <div style={{ position: 'absolute', left: 26, top: 94, width: 120, height: 210, zIndex: 4 }}>
        <Box x={0} y={0} w={120} h={210} bg="#a8d4f0" border="8px solid #8a603d" />
        <Box x={8} y={142} w={104} h={60} bg="#7fbc5f" />
        <Box x={57} y={0} w={6} h={210} bg="#8a603d" />
        <Box x={0} y={102} w={120} h={6} bg="#8a603d" />
      </div>

      {/* Berkas cahaya matahari lembut dari jendela */}
      <Box
        x={44 + sunShift}
        y={104}
        w={180}
        h={360}
        bg="#fff8dc"
        opacity={0.14}
        transform="skewX(16deg)"
        z={5}
      />

      {/* Papan tulis hijau besar */}
      <div style={{ position: 'absolute', left: 176, top: 88, width: 356, height: 196, zIndex: 4 }}>
        <Box x={0} y={0} w={356} h={196} bg="#2d5c3e" border="10px solid #855836" />
        {/* Coretan kapur blok abstrak (tanpa teks DOM) */}
        <Box x={28} y={34} w={118} h={6} bg="#eef2eb" opacity={0.75} />
        <Box x={28} y={52} w={172} h={5} bg="#eef2eb" opacity={0.55} />
        <Box x={28} y={68} w={140} h={5} bg="#eef2eb" opacity={0.55} />
        <Box x={228} y={36} w={88} h={54} bg="transparent" border="3px solid #ffd98a" opacity={0.65} />
        <Box x={28} y={106} w={210} h={5} bg="#eef2eb" opacity={0.45} />
        {/* Rak kapur */}
        <Box x={18} y={186} w={320} h={10} bg="#6e472b" />
        <Box x={52} y={181} w={22} h={5} bg="#f2f2ee" />
        <Box x={96} y={180} w={30} h={6} bg="#d98e54" />
      </div>

      {/* Jam dinding / aksen sisi kanan papan */}
      <Box
        x={556}
        y={104}
        w={48}
        h={48}
        bg="#f7f4eb"
        border={isRight ? '4px solid #35c4e8' : '4px solid #58a05a'}
        radius={24}
        z={4}
      />
      <Box x={578} y={114} w={3} h={14} bg="#2d333b" z={5} />
      <Box x={578} y={126} w={12} h={3} bg="#2d333b" z={5} />

      {/* Meja guru depan kiri */}
      <div style={{ position: 'absolute', left: 26, top: 382, width: 112, height: 96, zIndex: 6 }}>
        <Box x={0} y={0} w={112} h={16} bg="#9c6c42" border="2px solid #6b4728" />
        <Box x={8} y={16} w={96} h={76} bg="#805633" />
      </div>

      {/* Deretan meja-kursi blok untuk murid (2 baris x 3 kolom) */}
      {[
        { rowY: 468, scale: 0.92, z: 7 },
        { rowY: 572, scale: 1.04, z: 9 },
      ].map((row, rIdx) => (
        <React.Fragment key={`row-${rIdx}`}>
          {[68, 246, 424].map((dx, cIdx) => {
            const dw = Math.round(146 * row.scale);
            const dh = Math.round(112 * row.scale);
            return (
              <div
                key={`desk-${rIdx}-${cIdx}`}
                style={{ position: 'absolute', left: dx, top: row.rowY, width: dw, height: dh, zIndex: row.z }}
              >
                {/* Sandaran kursi belakang */}
                <Box x={Math.round(dw * 0.22)} y={-14} w={Math.round(dw * 0.56)} h={18} bg="#7a5132" />
                {/* Permukaan meja */}
                <Box x={0} y={10} w={dw} h={20} bg="#c4935e" border="3px solid #754e2e" />
                {/* Panel depan meja */}
                <Box x={10} y={30} w={dw - 20} h={Math.round(dh * 0.42)} bg="#a37343" />
                {/* Kaki meja */}
                <Box x={10} y={30} w={12} h={dh - 30} bg="#6b4628" />
                <Box x={dw - 22} y={30} w={12} h={dh - 30} bg="#6b4628" />
              </div>
            );
          })}
        </React.Fragment>
      ))}
    </SceneFrame>
  );
};

// ============================================================================
// 4. KamarScene
// ============================================================================

export interface KamarSceneProps {
  f: number;
  side: Side;
}

export const KamarScene: React.FC<KamarSceneProps> = ({ f, side }) => {
  const isRight = side === 1;
  const lampPulse = 0.8 + 0.2 * Math.sin(f * 0.055);
  const lampColor = isRight ? '#35c4e8' : '#ffd98a';

  return (
    <SceneFrame bg="#1f2c4a">
      {/* Dinding kamar malam */}
      <Box x={0} y={0} w={HALF} h={490} bg="#223152" z={1} />
      <Box x={0} y={0} w={HALF} h={36} bg="#18223b" z={2} />
      <Box x={0} y={482} w={HALF} h={10} bg="#161e33" z={2} />

      {/* Lantai kayu gelap */}
      <Box x={0} y={492} w={HALF} h={228} bg="#3a302d" z={1} />
      {[536, 588, 646].map((ly) => (
        <Box key={`kfl-${ly}`} x={0} y={ly} w={HALF} h={3} bg="#29211f" z={2} />
      ))}

      {/* Jendela malam dengan tirai */}
      <div style={{ position: 'absolute', left: 214, top: 96, width: 212, height: 184, zIndex: 3 }}>
        {/* Langit malam di luar jendela */}
        <Box x={24} y={10} w={164} h={164} bg="#131c33" border="6px solid #445373" />
        {/* Bintang & bulan di jendela */}
        <Box x={52} y={36} w={3} h={3} bg="#e8f2ff" />
        <Box x={118} y={54} w={2} h={2} bg="#e8f2ff" />
        <Box x={144} y={28} w={24} h={24} bg="#f5e9be" radius={12} />
        <Box x={151} y={26} w={20} h={20} bg="#131c33" radius={10} />
        {/* Palang jendela */}
        <Box x={104} y={10} w={4} h={164} bg="#445373" />
        <Box x={24} y={90} w={164} h={4} bg="#445373" />
        {/* Batang tirai */}
        <Box x={0} y={0} w={212} h={8} bg="#6b5648" />
        {/* Tirai kiri & kanan */}
        <Box x={6} y={8} w={38} h={176} bg={isRight ? '#3b4a70' : '#634848'} />
        <Box x={168} y={8} w={38} h={176} bg={isRight ? '#3b4a70' : '#634848'} />
      </div>

      {/* Lemari pakaian di sisi kiri */}
      <div style={{ position: 'absolute', left: 24, top: 180, width: 146, height: 324, zIndex: 4 }}>
        <Box x={0} y={0} w={146} h={324} bg="#523b2e" border="4px solid #36251c" />
        <Box x={71} y={8} w={4} h={308} bg="#36251c" />
        <Box x={56} y={156} w={6} h={24} bg="#b89d76" />
        <Box x={84} y={156} w={6} h={24} bg="#b89d76" />
      </div>

      {/* Kasur */}
      <div style={{ position: 'absolute', left: 196, top: 410, width: 274, height: 174, zIndex: 5 }}>
        {/* Headboard */}
        <Box x={0} y={0} w={274} h={64} bg="#5e4131" border="4px solid #3d291e" />
        {/* Bantal */}
        <Box x={24} y={32} w={96} h={36} bg="#d8dce6" />
        <Box x={152} y={32} w={96} h={36} bg="#d8dce6" />
        {/* Selimut & kasur */}
        <Box x={6} y={64} w={262} h={84} bg={isRight ? '#365880' : '#4f7359'} border="4px solid #2b384d" />
        <Box x={6} y={64} w={262} h={22} bg={isRight ? '#4b76a8' : '#6e9476'} />
        {/* Rangka bawah & kaki */}
        <Box x={0} y={146} w={274} h={18} bg="#4d3426" />
        <Box x={10} y={162} w={16} h={12} bg="#362319" />
        <Box x={248} y={162} w={16} h={12} bg="#362319" />
      </div>

      {/* Meja kecil + lampu tidur di sisi kanan */}
      <div style={{ position: 'absolute', left: 492, top: 448, width: 118, height: 126, zIndex: 6 }}>
        <Box x={0} y={24} w={118} h={16} bg="#694835" />
        <Box x={8} y={40} w={102} h={68} bg="#523728" border="3px solid #382419" />
        <Box x={44} y={66} w={30} h={6} bg="#b89d76" />
        <Box x={12} y={108} w={12} h={18} bg="#382419" />
        <Box x={94} y={108} w={12} h={18} bg="#382419" />
        {/* Lampu meja */}
        <Box x={48} y={10} w={22} h={14} bg="#414b5e" />
        <Box x={36} y={-24} w={46} h={34} bg={lampColor} opacity={0.9} />
        <Box
          x={-16}
          y={-64}
          w={150}
          h={150}
          bg={lampColor}
          radius={75}
          opacity={0.18 * lampPulse}
        />
      </div>
    </SceneFrame>
  );
};

// ============================================================================
// 5. TerasScene
// ============================================================================

export interface TerasSceneProps {
  f: number;
  side: Side;
}

export const TerasScene: React.FC<TerasSceneProps> = ({ f, side }) => {
  const isRight = side === 1;

  return (
    <SceneFrame bg="#e8a56b">
      {/* Latar langit senja (y 0-310) */}
      {SKY_SENJA_BANDS.map((color, idx) => (
        <Box key={`ts-${idx}`} x={0} y={idx * 52} w={HALF} h={53} bg={color} z={1} />
      ))}

      {/* Awan senja bergerak lambat kontinu */}
      {[
        { baseX: 120, y: 84, w: 110, h: 24, speed: 0.14 },
        { baseX: 410, y: 126, w: 94, h: 22, speed: 0.18 },
      ].map((cl, idx) => {
        const span = HALF + cl.w + 40;
        const cx = modPos(cl.baseX + f * cl.speed, span) - cl.w;
        return (
          <PixelCloud
            key={`tcl-${idx}`}
            x={cx}
            y={cl.y}
            w={cl.w}
            h={cl.h}
            topColor="#fae1c0"
            shadeColor="#e8b382"
            z={2}
          />
        );
      })}

      {/* Matahari rendah */}
      <Box x={448} y={208} w={68} h={68} bg="#ffe4ad" radius={34} z={2} />

      {/* Siluet bukit & sawah jauh */}
      <Box x={0} y={272} w={HALF} h={68} bg="#5b7349" z={3} />
      <Box x={80} y={258} w={190} h={24} bg="#5b7349" z={3} />
      <Box x={350} y={262} w={210} h={22} bg="#536b43" z={3} />
      <Box x={0} y={336} w={HALF} h={108} bg="#6d8c4f" z={4} />
      <Box x={0} y={366} w={HALF} h={26} bg="#7b9c57" z={4} />
      <Box x={0} y={404} w={HALF} h={34} bg="#618046" z={4} />

      {/* Atap emperan teras di bagian atas */}
      <Box x={0} y={0} w={HALF} h={56} bg="#8f3f2b" z={8} />
      <Box x={0} y={54} w={HALF} h={12} bg="#5e3a25" z={8} />

      {/* Dinding rumah di sisi kiri teras */}
      <Box x={0} y={64} w={268} h={416} bg="#e8dcc0" z={5} />
      <Box x={0} y={416} w={268} h={64} bg="#c9b897" z={5} />

      {/* Pintu rumah */}
      <div style={{ position: 'absolute', left: 32, top: 204, width: 96, height: 274, zIndex: 6 }}>
        <Box x={0} y={0} w={96} h={274} bg="#7b5236" border="6px solid #593923" />
        <Box x={14} y={20} w={68} h={100} bg="#8c5f3f" />
        <Box x={14} y={138} w={68} h={112} bg="#8c5f3f" />
        <Box x={72} y={136} w={8} h={22} bg="#e0ba6c" />
      </div>

      {/* Jendela teras */}
      <div style={{ position: 'absolute', left: 152, top: 214, width: 88, height: 118, zIndex: 6 }}>
        <Box x={0} y={0} w={88} h={118} bg={isRight ? '#9ed8f2' : '#ffe199'} border="6px solid #6b462d" />
        <Box x={41} y={0} w={6} h={118} bg="#6b462d" />
        <Box x={0} y={56} w={88} h={6} bg="#6b462d" />
      </div>

      {/* Tiang & pagar kayu teras */}
      <Box x={262} y={64} w={18} h={418} bg="#6e482e" z={7} />
      <Box x={582} y={64} w={22} h={418} bg="#6e482e" z={7} />
      <Box x={280} y={396} w={302} h={10} bg="#7d5336" z={6} />
      <Box x={280} y={448} w={302} h={10} bg="#7d5336" z={6} />
      {[316, 364, 412, 460, 508, 556].map((px) => (
        <Box key={`bal-${px}`} x={px} y={404} w={8} h={46} bg="#6e482e" z={6} />
      ))}

      {/* Lantai teras */}
      <Box x={0} y={480} w={HALF} h={240} bg="#c4a787" z={5} />
      <Box x={0} y={480} w={HALF} h={8} bg="#9c8064" z={6} />
      {[532, 592, 656].map((ty) => (
        <Box key={`tile-${ty}`} x={0} y={ty} w={HALF} h={3} bg="#a88b6d" z={6} />
      ))}

      {/* Bangku panjang teras */}
      <div style={{ position: 'absolute', left: 294, top: 454, width: 234, height: 112, zIndex: 8 }}>
        <Box x={8} y={0} w={218} h={32} bg="#8f5d38" border="3px solid #5c3a21" />
        <Box x={0} y={44} w={234} h={22} bg="#a87046" border="3px solid #5c3a21" />
        <Box x={16} y={66} w={16} h={46} bg="#5c3a21" />
        <Box x={202} y={66} w={16} h={46} bg="#5c3a21" />
      </div>

      {/* Pot tanaman teras */}
      {[
        { x: 182, y: 458, s: 1 },
        { x: 544, y: 468, s: 1.1 },
      ].map((pot, idx) => (
        <div
          key={`pot-${idx}`}
          style={{ position: 'absolute', left: pot.x, top: pot.y, width: Math.round(56 * pot.s), height: Math.round(84 * pot.s), zIndex: 9 }}
        >
          {/* Daun tanaman */}
          <Box x={12} y={0} w={30} h={26} bg="#4d8f4a" />
          <Box x={2} y={14} w={50} h={24} bg="#5da656" />
          <Box x={16} y={24} w={24} h={18} bg="#3e783c" />
          {/* Pot terakota */}
          <Box x={6} y={40} w={42} h={10} bg="#c76448" />
          <Box x={10} y={50} w={34} h={32} bg="#b5563c" />
        </div>
      ))}
    </SceneFrame>
  );
};

// ============================================================================
// 6. BalaiScene
// ============================================================================

export interface BalaiSceneProps {
  f: number;
  side: Side;
}

export const BalaiScene: React.FC<BalaiSceneProps> = ({ f, side }) => {
  void f;
  const isRight = side === 1;
  const accent = isRight ? '#35c4e8' : '#58a05a';

  return (
    <SceneFrame bg="#efe8d8">
      {/* Plafon kayu balai */}
      <Box x={0} y={0} w={HALF} h={58} bg="#6b472d" z={2} />
      {[84, 212, 340, 468, 596].map((rx) => (
        <Box key={`raft-${rx}`} x={rx} y={0} w={16} h={58} bg="#523521" z={3} />
      ))}

      {/* Dinding putih-kayu */}
      <Box x={0} y={58} w={HALF} h={310} bg="#f2ece0" z={1} />
      <Box x={0} y={368} w={HALF} h={108} bg="#9e724a" z={1} />
      <Box x={0} y={364} w={HALF} h={8} bg="#6e4b2e" z={2} />

      {/* Lantai ubin balai */}
      <Box x={0} y={476} w={HALF} h={244} bg="#cfc2aa" z={1} />
      {[520, 568, 620, 676].map((fy) => (
        <Box key={`bfl-${fy}`} x={0} y={fy} w={HALF} h={3} bg="#b8aa91" z={2} />
      ))}

      {/* Jendela tinggi kiri & kanan */}
      {[34, 514].map((wx, idx) => (
        <div key={`bwin-${idx}`} style={{ position: 'absolute', left: wx, top: 102, width: 92, height: 184, zIndex: 3 }}>
          <Box x={0} y={0} w={92} h={184} bg="#a8d4f0" border="6px solid #754f32" />
          <Box x={6} y={124} w={80} h={54} bg="#69a84f" />
          <Box x={43} y={0} w={6} h={184} bg="#754f32" />
          <Box x={0} y={88} w={92} h={6} bg="#754f32" />
        </div>
      ))}

      {/* Papan tulis / papan pengumuman tengah */}
      <div style={{ position: 'absolute', left: 164, top: 104, width: 312, height: 174, zIndex: 3 }}>
        <Box x={0} y={0} w={312} h={174} bg="#f7f5f0" border="8px solid #7a5134" />
        <Box x={20} y={20} w={272} h={12} bg={accent} />
        <Box x={20} y={48} w={118} h={42} bg="#e0d5c0" />
        <Box x={156} y={48} w={136} h={42} bg="#d8e3eb" />
        <Box x={20} y={104} w={180} h={10} bg="#9c9385" />
        <Box x={20} y={124} w={240} h={10} bg="#9c9385" />
        <Box x={20} y={144} w={140} h={10} bg="#9c9385" />
      </div>

      {/* Podium kecil kayu */}
      <div style={{ position: 'absolute', left: 264, top: 344, width: 112, height: 144, zIndex: 5 }}>
        <Box x={0} y={0} w={112} h={18} bg="#8f5f3a" border="3px solid #593920" />
        <Box x={12} y={18} w={88} h={114} bg="#754c2e" border="3px solid #4d301b" />
        <Box x={28} y={38} w={56} h={24} bg={accent} />
        <Box x={4} y={130} w={104} h={14} bg="#593920" />
      </div>

      {/* Deretan bangku warga */}
      {[
        { y: 516, z: 7 },
        { y: 604, z: 9 },
      ].map((row, idx) => (
        <React.Fragment key={`bench-row-${idx}`}>
          <div style={{ position: 'absolute', left: 42, top: row.y, width: 244, height: 74, zIndex: row.z }}>
            <Box x={0} y={0} w={244} h={18} bg="#9e6d44" border="3px solid #5e3d23" />
            <Box x={12} y={18} w={220} h={24} bg="#825634" />
            <Box x={18} y={42} w={14} h={32} bg="#5e3d23" />
            <Box x={212} y={42} w={14} h={32} bg="#5e3d23" />
          </div>
          <div style={{ position: 'absolute', left: 354, top: row.y, width: 244, height: 74, zIndex: row.z }}>
            <Box x={0} y={0} w={244} h={18} bg="#9e6d44" border="3px solid #5e3d23" />
            <Box x={12} y={18} w={220} h={24} bg="#825634" />
            <Box x={18} y={42} w={14} h={32} bg="#5e3d23" />
            <Box x={212} y={42} w={14} h={32} bg="#5e3d23" />
          </div>
        </React.Fragment>
      ))}
    </SceneFrame>
  );
};

// ============================================================================
// 7. LapanganScene
// ============================================================================

export interface LapanganSceneProps {
  f: number;
  side: Side;
  night?: boolean;
}

export const LapanganScene: React.FC<LapanganSceneProps> = ({
  f,
  side,
  night = false,
}) => {
  const isRight = side === 1;
  const skyBands = night ? SKY_NIGHT_BANDS : SKY_DAY_BANDS;
  const lampColor = isRight ? '#cfe8ff' : '#ffd98a';

  return (
    <SceneFrame bg={skyBands[0]}>
      {/* Langit */}
      {skyBands.map((color, idx) => (
        <Box key={`lsky-${idx}`} x={0} y={idx * 48} w={HALF} h={49} bg={color} z={1} />
      ))}

      {/* Bintang malam atau awan siang */}
      {night ? (
        <>
          {STARS.slice(0, 10).map((st, idx) => {
            const tw = 0.5 + 0.5 * Math.sin(f * 0.06 + st.phase);
            return <Box key={`lst-${idx}`} x={st.x} y={st.y} w={st.s} h={st.s} bg="#eef5ff" opacity={tw} z={2} />;
          })}
          <Box x={510} y={42} w={36} h={36} bg="#f7ecc4" radius={18} z={2} />
          <Box x={519} y={40} w={30} h={30} bg="#1d2a4a" radius={15} z={2} />
        </>
      ) : (
        CLOUDS.slice(0, 3).map((cl, idx) => {
          const span = HALF + cl.w + 48;
          const cx = modPos(cl.baseX + f * cl.speed, span) - cl.w;
          return (
            <PixelCloud
              key={`lcl-${idx}`}
              x={cx}
              y={cl.y}
              w={cl.w}
              h={cl.h}
              topColor="#f5fafe"
              shadeColor="#d5e8f6"
              z={2}
            />
          );
        })
      )}

      {/* Latar pepohonan & siluet rumah jauh */}
      <Box x={0} y={248} w={HALF} h={112} bg={night ? '#223831' : '#568f51'} z={3} />
      {[18, 92, 164, 438, 514, 578].map((tx, idx) => (
        <PixelTree key={`lt-${idx}`} x={tx} y={214 + (idx % 2) * 14} scale={1.55} dark={night} z={4} />
      ))}
      {/* Rumah-rumah jauh */}
      {[232, 326].map((hx, idx) => (
        <div key={`lh-${idx}`} style={{ position: 'absolute', left: hx, top: 244, width: 82, height: 74, zIndex: 4 }}>
          <Box x={0} y={0} w={82} h={24} bg={night ? '#59332c' : '#b5563c'} />
          <Box x={8} y={24} w={66} h={46} bg={night ? '#69665f' : '#e8dcc0'} />
          <Box x={20} y={36} w={18} h={16} bg={night ? lampColor : '#4f657a'} />
          <Box x={46} y={38} w={14} h={32} bg="#593a24" />
        </div>
      ))}

      {/* Tanah lapang */}
      <Box x={0} y={348} w={HALF} h={372} bg={night ? '#47433c' : '#c9ac79'} z={5} />
      <Box x={0} y={348} w={HALF} h={24} bg={night ? '#2c4734' : '#6ea855'} z={5} />

      {/* Garis lapangan voli */}
      <Box x={48} y={404} w={544} h={254} bg={night ? '#524d44' : '#d6bc8b'} border="6px solid #f2efe6" z={6} />
      <Box x={196} y={404} w={4} h={254} bg="#f2efe6" opacity={0.85} z={7} />
      <Box x={440} y={404} w={4} h={254} bg="#f2efe6" opacity={0.85} z={7} />

      {/* Net voli di tengah sisi */}
      <div style={{ position: 'absolute', left: 310, top: 318, width: 20, height: 344, zIndex: 9 }}>
        {/* Tiang jauh & dekat */}
        <Box x={6} y={0} w={8} h={344} bg="#4b535e" />
        <Box x={8} y={6} w={4} h={332} bg="#d8dce3" />
      </div>
      {/* Bentangan net perspektif melintang di tengah */}
      <div style={{ position: 'absolute', left: 62, top: 326, width: 516, height: 102, zIndex: 8 }}>
        <Box x={0} y={0} w={10} h={204} bg="#545d69" />
        <Box x={506} y={0} w={10} h={204} bg="#545d69" />
        <Box x={10} y={4} w={496} h={8} bg="#f7f7f2" />
        <Box x={10} y={92} w={496} h={5} bg="#f7f7f2" />
        {/* Kisi-kisi jaring */}
        {Array.from({ length: 16 }, (_, idx) => (
          <Box key={`nv-${idx}`} x={26 + idx * 31} y={12} w={2} h={80} bg="#eef0eb" opacity={0.65} />
        ))}
        {[28, 48, 68].map((ny) => (
          <Box key={`nh-${ny}`} x={10} y={ny} w={496} h={2} bg="#eef0eb" opacity={0.65} />
        ))}
      </div>

      {/* Tiang lampu lapangan untuk versi malam */}
      {night ? (
        <>
          {[76, 548].map((px, idx) => (
            <div key={`pole-${idx}`} style={{ position: 'absolute', left: px, top: 150, width: 16, height: 224, zIndex: 10 }}>
              <Box x={5} y={16} w={6} h={208} bg="#4a5363" />
              <Box x={-10} y={6} w={36} h={14} bg="#303847" />
              <Box x={-6} y={18} w={28} h={8} bg={lampColor} />
              <Box x={-72} y={24} w={160} h={220} bg={lampColor} radius={80} opacity={0.14} />
            </div>
          ))}
        </>
      ) : null}
    </SceneFrame>
  );
};

// ============================================================================
// 8. FestivalScene
// ============================================================================

export interface FestivalSceneProps {
  f: number;
  side: Side;
}

export const FestivalScene: React.FC<FestivalSceneProps> = ({ f, side }) => {
  const isRight = side === 1;
  const swayLeft = Math.sin(f * 0.032) * 14;
  const swayRight = Math.sin(f * 0.032 + 1.8) * 14;

  return (
    <SceneFrame bg="#1d2a4a">
      {/* Langit malam */}
      {SKY_NIGHT_BANDS.map((color, idx) => (
        <Box key={`fsky-${idx}`} x={0} y={idx * 68} w={HALF} h={69} bg={color} z={1} />
      ))}
      {STARS.map((st, idx) => {
        const tw = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(f * 0.07 + st.phase));
        return <Box key={`fst-${idx}`} x={st.x} y={st.y} w={st.s} h={st.s} bg="#eef5ff" opacity={tw} z={2} />;
      })}

      {/* Siluet pepohonan jauh */}
      <Box x={0} y={366} w={HALF} h={108} bg="#182438" z={3} />

      {/* Tanah lapang malam */}
      <Box x={0} y={468} w={HALF} h={252} bg={isRight ? '#22283a' : '#2f2924'} z={4} />

      {isRight ? (
        <>
          {/* Sisi kanan: panggung besar + lampu sorot blok terang */}
          {/* Lampu sorot bergerak kontinu */}
          <Box
            x={110}
            y={64}
            w={84}
            h={410}
            bg="#35c4e8"
            opacity={0.18}
            transform={`rotate(${-18 + swayLeft}deg)`}
            transformOrigin="50% 100%"
            z={5}
          />
          <Box
            x={446}
            y={64}
            w={84}
            h={410}
            bg="#f05ab4"
            opacity={0.18}
            transform={`rotate(${18 + swayRight}deg)`}
            transformOrigin="50% 100%"
            z={5}
          />
          <Box
            x={278}
            y={40}
            w={84}
            h={430}
            bg="#cfe8ff"
            opacity={0.14}
            transform={`rotate(${swayLeft * 0.5}deg)`}
            transformOrigin="50% 100%"
            z={5}
          />

          {/* Rangka panggung besar */}
          <div style={{ position: 'absolute', left: 60, top: 184, width: 520, height: 320, zIndex: 6 }}>
            {/* Truss atas & tiang samping */}
            <Box x={0} y={0} w={520} h={24} bg="#2d364d" border="3px solid #596787" />
            <Box x={10} y={24} w={22} h={236} bg="#2d364d" border="2px solid #596787" />
            <Box x={488} y={24} w={22} h={236} bg="#2d364d" border="2px solid #596787" />
            {/* Layar LED terang */}
            <Box x={56} y={44} w={408} h={176} bg="#1a2442" border="6px solid #35c4e8" />
            <Box x={72} y={62} w={376} h={42} bg="#35c4e8" opacity={0.8} />
            <Box x={112} y={118} w={296} h={34} bg="#f05ab4" opacity={0.85} />
            <Box x={160} y={166} w={200} h={22} bg="#cfe8ff" opacity={0.75} />
            {/* Dek panggung */}
            <Box x={0} y={254} w={520} h={58} bg="#394259" border="4px solid #202738" />
            <Box x={0} y={254} w={520} h={8} bg="#35c4e8" />
            {/* Deret lampu panggung atas */}
            {[84, 168, 252, 336, 420].map((bx, idx) => (
              <Box key={`sl-${idx}`} x={bx} y={22} w={22} h={12} bg={idx % 2 === 0 ? '#35c4e8' : '#f05ab4'} />
            ))}
          </div>

          {/* Lampion aksen di tepi atas */}
          <Box x={0} y={82} w={HALF} h={2} bg="#36415e" z={7} />
          {[42, 178, 434, 566].map((lx, idx) => (
            <Sprite key={`rlmp-${idx}`} name="prop_lampion" x={lx} y={82} w={26} h={38} z={8} />
          ))}
        </>
      ) : (
        <>
          {/* Sisi kiri: hangat tradisional dengan deretan lampion & panggung kayu */}
          {/* Tali lampion dua lapis */}
          <Box x={0} y={114} w={HALF} h={3} bg="#3b2f2a" z={6} />
          <Box x={0} y={196} w={HALF} h={3} bg="#3b2f2a" z={6} />

          {[36, 128, 220, 312, 404, 496, 580].map((lx, idx) => (
            <React.Fragment key={`llmp1-${idx}`}>
              <Box
                x={lx - 14}
                y={104}
                w={58}
                h={58}
                bg="#ffd98a"
                radius={29}
                opacity={0.18}
                z={6}
              />
              <Sprite name="prop_lampion" x={lx} y={112} w={28} h={40} z={7} />
            </React.Fragment>
          ))}

          {[82, 186, 290, 394, 498].map((lx, idx) => (
            <React.Fragment key={`llmp2-${idx}`}>
              <Box
                x={lx - 10}
                y={188}
                w={46}
                h={46}
                bg="#ffbe5c"
                radius={23}
                opacity={0.16}
                z={6}
              />
              <Sprite name="prop_lampion" x={lx} y={194} w={24} h={35} z={7} />
            </React.Fragment>
          ))}

          {/* Panggung tradisional hangat */}
          <div style={{ position: 'absolute', left: 112, top: 274, width: 416, height: 224, zIndex: 6 }}>
            {/* Atap pelana hangat */}
            <Box x={32} y={0} w={352} h={22} bg="#8f3f2b" />
            <Box x={8} y={20} w={400} h={22} bg="#b5563c" />
            {/* Tirai latar panggung hangat */}
            <Box x={34} y={42} w={348} h={130} bg="#4d3222" />
            <Box x={56} y={56} w={304} h={102} bg="#6b442b" border="4px solid #ffd98a" />
            <Box x={96} y={76} w={224} h={56} bg="#d49344" opacity={0.7} />
            {/* Tiang kayu */}
            <Box x={24} y={42} w={16} h={134} bg="#7a5034" />
            <Box x={376} y={42} w={16} h={134} bg="#7a5034" />
            {/* Lantai panggung */}
            <Box x={0} y={172} w={416} h={46} bg="#875938" border="4px solid #573720" />
            {/* Cahaya panggung hangat */}
            <Box x={78} y={36} w={260} h={148} bg="#ffd98a" radius={90} opacity={0.16} />
          </div>
        </>
      )}

      {/* Kerumunan siluet sederhana (blok bergoyang sangat halus) */}
      {Array.from({ length: 14 }, (_, idx) => {
        const cx = 14 + idx * 45;
        const bob = Math.sin(f * 0.06 + idx * 1.1) * 3;
        const baseY = 588 + (idx % 2) * 18 + bob;
        const silColor = isRight ? '#131724' : '#1c1816';
        return (
          <div key={`cr-${idx}`} style={{ position: 'absolute', left: cx, top: baseY, width: 40, height: 140, zIndex: 10 }}>
            <Box x={10} y={0} w={20} h={20} bg={silColor} radius={4} />
            <Box x={2} y={22} w={36} h={118} bg={silColor} />
          </div>
        );
      })}
    </SceneFrame>
  );
};

// ============================================================================
// 9. StudioScene
// ============================================================================

export interface StudioSceneProps {
  f: number;
  side: Side;
}

export const StudioScene: React.FC<StudioSceneProps> = ({ f, side }) => {
  const isRight = side === 1;
  const glowPulse = 0.85 + 0.15 * Math.sin(f * 0.05);

  return (
    <SceneFrame bg={isRight ? '#23293d' : '#ded6c5'}>
      {/* Dinding belakang */}
      <Box x={0} y={0} w={HALF} h={490} bg={isRight ? '#262d42' : '#e5decb'} z={1} />
      {/* Strip lampu LED dinding untuk sisi kanan */}
      {isRight ? (
        <>
          <Box x={24} y={54} w={592} h={6} bg="#35c4e8" z={2} />
          <Box x={24} y={60} w={592} h={16} bg="#35c4e8" opacity={0.18} z={2} />
          <Box x={24} y={468} w={592} h={5} bg="#f05ab4" z={2} />
        </>
      ) : (
        <Box x={0} y={468} w={HALF} h={8} bg="#b09e82" z={2} />
      )}

      {/* Lantai studio */}
      <Box x={0} y={490} w={HALF} h={230} bg={isRight ? '#1b2030' : '#a8845c'} z={1} />

      {/* Poster-poster blok geometris di dinding (tanpa teks DOM) */}
      <div style={{ position: 'absolute', left: 38, top: 104, width: 112, height: 148, zIndex: 3 }}>
        <Box x={0} y={0} w={112} h={148} bg="#f2efe9" border="5px solid #2b3140" />
        <Box x={14} y={18} w={84} h={62} bg={isRight ? '#f05ab4' : '#58a05a'} />
        <Box x={28} y={32} w={56} h={34} bg="#ffd98a" />
        <Box x={14} y={96} w={68} h={10} bg="#394257" />
        <Box x={14} y={114} w={84} h={8} bg="#7e889c" />
      </div>

      <div style={{ position: 'absolute', left: 172, top: 124, width: 92, height: 118, zIndex: 3 }}>
        <Box x={0} y={0} w={92} h={118} bg="#1f2738" border="4px solid #35c4e8" />
        <Box x={18} y={20} w={56} h={56} bg="#35c4e8" radius={28} />
        <Box x={30} y={32} w={32} h={32} bg="#f05ab4" radius={16} />
      </div>

      {/* Rak dinding kanan */}
      <div style={{ position: 'absolute', left: 396, top: 128, width: 204, height: 196, zIndex: 3 }}>
        {/* Papan rak atas */}
        <Box x={0} y={62} w={204} h={12} bg={isRight ? '#3b455e' : '#855a38'} />
        {/* Barang di rak atas */}
        <Box x={14} y={22} w={24} h={40} bg="#e06d53" />
        <Box x={42} y={30} w={20} h={32} bg="#ffd98a" />
        <Box x={78} y={24} w={36} h={38} bg="#35c4e8" />
        <Box x={136} y={34} w={44} h={28} bg="#58a05a" />
        <Box x={144} y={14} w={28} h={22} bg="#7fbc5f" />
        {/* Papan rak bawah */}
        <Box x={0} y={156} w={204} h={12} bg={isRight ? '#3b455e' : '#855a38'} />
        {/* Barang di rak bawah */}
        <Box x={18} y={114} w={42} h={42} bg="#f05ab4" />
        <Box x={74} y={122} w={30} h={34} bg="#d8dce6" />
        <Box x={120} y={110} w={62} h={46} bg="#4b5975" />
      </div>

      {/* Ring light sebagai aksen utama (Sprite prop_ringlight) */}
      <Box
        x={448}
        y={292}
        w={150}
        h={150}
        bg={isRight ? '#cfe8ff' : '#ffeab8'}
        radius={75}
        opacity={0.22 * glowPulse}
        z={4}
      />
      <Sprite name="prop_ringlight" x={476} y={322} w={96} h={126} z={6} />

      {/* Meja kreator */}
      <div style={{ position: 'absolute', left: 56, top: 446, width: 412, height: 190, zIndex: 7 }}>
        {/* Monitor di atas meja */}
        <Box x={122} y={-92} w={164} h={96} bg="#1a202e" border="6px solid #444f66" />
        <Box x={132} y={-82} w={144} h={74} bg={isRight ? '#2a4a6e' : '#4a6b5d'} />
        <Box x={144} y={-70} w={64} h={16} bg="#35c4e8" />
        <Box x={144} y={-46} w={108} h={10} bg="#f05ab4" opacity={0.8} />
        <Box x={194} y={4} w={20} h={18} bg="#384152" />
        <Box x={168} y={18} w={72} h={8} bg="#4b5569" />
        {/* Keyboard & mouse */}
        <Box x={146} y={24} w={116} h={12} bg="#333c4d" />
        <Box x={282} y={24} w={24} h={12} bg="#495469" />
        {/* Daun meja */}
        <Box x={0} y={32} w={412} h={24} bg={isRight ? '#454f66' : '#9c6e45'} border="3px solid #282e3d" />
        {/* Kaki meja */}
        <Box x={18} y={56} w={20} h={134} bg={isRight ? '#2c3345' : '#6b472b'} />
        <Box x={374} y={56} w={20} h={134} bg={isRight ? '#2c3345' : '#6b472b'} />
      </div>
    </SceneFrame>
  );
};

// ============================================================================
// 10. PanelNadia
// ============================================================================

export interface PanelNadiaProps {
  f: number;
  side: Side;
}

const PANEL_WARM_BANDS = [
  '#f4ebd9',
  '#efe3cc',
  '#eadbbf',
  '#e4d3b3',
  '#decba7',
  '#d8c29b',
] as const;

const PANEL_COOL_BANDS = [
  '#e1ecf5',
  '#d7e5f2',
  '#cdddee',
  '#c3d5ea',
  '#b9cde6',
  '#aec5e1',
] as const;

export const PanelNadia: React.FC<PanelNadiaProps> = ({ f, side }) => {
  const isRight = side === 1;
  const bands = isRight ? PANEL_COOL_BANDS : PANEL_WARM_BANDS;
  const lineCol = isRight ? '#7a9ec2' : '#baa37d';
  const accentCol = isRight ? '#35c4e8' : '#58a05a';
  const dotPulse = 0.7 + 0.3 * Math.sin(f * 0.05);

  return (
    <SceneFrame bg={bands[0]}>
      {/* Gradasi blok netral sesuai suhu sisi */}
      {bands.map((color, idx) => (
        <Box key={`pn-${idx}`} x={0} y={idx * 120} w={HALF} h={121} bg={color} z={1} />
      ))}

      {/* Bingkai & garis pemisah panel tipis di dalam sisi (tanpa teks) */}
      <Box x={24} y={76} w={592} h={608} bg="transparent" border={`2px solid ${lineCol}`} opacity={0.55} z={2} />
      <Box x={24} y={276} w={592} h={2} bg={lineCol} opacity={0.45} z={2} />
      <Box x={24} y={480} w={592} h={2} bg={lineCol} opacity={0.45} z={2} />

      {/* Rel linimasa vertikal tipis */}
      <Box x={64} y={108} w={3} h={544} bg={accentCol} opacity={0.4} z={3} />
      {[176, 378, 578].map((ny, idx) => (
        <Box
          key={`node-${idx}`}
          x={57}
          y={ny}
          w={17}
          h={17}
          bg={accentCol}
          radius={9}
          opacity={0.75 * dotPulse}
          z={4}
        />
      ))}

      {/* Strip aksen tipis di bawah */}
      <Box x={24} y={692} w={592} h={4} bg={accentCol} opacity={0.65} z={3} />
    </SceneFrame>
  );
};

// ============================================================================
// 11. GridScene
// ============================================================================

export interface GridSceneProps {
  f: number;
  side: Side;
  fill: number;
  tone?: GridTone | ((index: number) => GridTone);
  colOffset?: number;
  cols?: number;
}

const GRID_TOTAL_COLS = 10;
const GRID_TOTAL_ROWS = 10;
const GRID_TOTAL_TILES = GRID_TOTAL_COLS * GRID_TOTAL_ROWS;

// Distribusi deterministik 100 simulasi berdasarkan peringkat hash indeks global:
// 61 hangat (Sukatenang), 27 cerah (Sukaramai), 12 netral (Seri).
function globalSimulationTone(globalIndex: number): GridTone {
  const idx = modPos(Math.floor(globalIndex), GRID_TOTAL_TILES);
  const rank = (idx * 37) % GRID_TOTAL_TILES;
  if (rank < 61) {
    return 'hangat';
  }
  if (rank < 88) {
    return 'cerah';
  }
  return 'netral';
}

const HANGAT_COLORS = [
  '#58a05a',
  '#69a84f',
  '#7fbc5f',
  '#ffd98a',
  '#f0c265',
  '#87b863',
] as const;

const CERAH_COLORS = [
  '#35c4e8',
  '#59d4f2',
  '#f05ab4',
  '#f77ac4',
  '#7f8ef5',
  '#cfe8ff',
] as const;

const NETRAL_COLORS = [
  '#8b95a3',
  '#9fa9b5',
  '#78828f',
  '#b3ac9e',
  '#8e8a80',
] as const;

function tileHash(index: number): number {
  const x = (index * 73 + 29) ^ (index * 19 + 7);
  return Math.abs(x * 31 + 17);
}

function resolveTileColor(index: number, tone: GridTone): string {
  const h = tileHash(index);
  if (tone === 'hangat') {
    return HANGAT_COLORS[h % HANGAT_COLORS.length];
  }
  if (tone === 'cerah') {
    return CERAH_COLORS[h % CERAH_COLORS.length];
  }
  return NETRAL_COLORS[h % NETRAL_COLORS.length];
}

export const GridScene: React.FC<GridSceneProps> = ({
  f,
  side,
  fill,
  tone,
  colOffset,
  cols,
}) => {
  const isRight = side === 1;
  const clampedFill = clamp01(fill);
  const filledCount = clampedFill * GRID_TOTAL_TILES;
  const isSliced = colOffset !== undefined;
  const startCol = colOffset ?? 0;
  const visibleCols = cols ?? (isSliced ? 5 : GRID_TOTAL_COLS);
  const defaultTone: GridTone = isRight ? 'cerah' : 'hangat';

  const bgMain = isRight ? '#151c29' : '#1b201b';
  const frameBg = isRight ? '#1d2638' : '#232a22';
  const unfilledBg = '#2b313d';
  const unfilledBorder = '#202630';

  const cellStep = 52;
  const tileSize = 46;
  const originX = Math.round((HALF - visibleCols * cellStep) / 2);
  const originY = 110;

  return (
    <SceneFrame bg={bgMain}>
      {/* Latar panel grid */}
      <Box
        x={originX - 14}
        y={originY - 14}
        w={cellStep * visibleCols + 22}
        h={cellStep * GRID_TOTAL_ROWS + 22}
        bg={frameBg}
        border={isRight ? '3px solid #2b3c57' : '3px solid #354233'}
        z={1}
      />

      {Array.from({ length: GRID_TOTAL_ROWS * visibleCols }, (_, localIdx) => {
        const localCol = localIdx % visibleCols;
        const row = Math.floor(localIdx / visibleCols);
        const globalCol = startCol + localCol;
        const globalIndex = row * GRID_TOTAL_COLS + globalCol;
        const tx = originX + localCol * cellStep;
        const ty = originY + row * cellStep;

        const isFilled = globalIndex < filledCount;
        const tileTone: GridTone =
          typeof tone === 'function'
            ? tone(globalIndex)
            : (tone ?? (isSliced ? globalSimulationTone(globalIndex) : defaultTone));
        const color = resolveTileColor(globalIndex, tileTone);

        const fillProgress = clamp01(filledCount - globalIndex);
        const timeProgress = fadeIn(f, globalIndex * 0.4, 8);
        const popT = isFilled ? Math.min(fillProgress, timeProgress) : 0;
        const easedPop = EZ(popT);
        const scale = cam(easedPop, 0, 1, 0.4, 1);

        return (
          <div
            key={`cell-${globalIndex}`}
            style={{
              position: 'absolute',
              left: tx,
              top: ty,
              width: tileSize,
              height: tileSize,
              zIndex: 2,
            }}
          >
            {/* Ubin dasar belum terisi (abu gelap redup) */}
            <Box
              x={0}
              y={0}
              w={tileSize}
              h={tileSize}
              bg={unfilledBg}
              border={`2px solid ${unfilledBorder}`}
            />

            {/* Ubin terisi dengan pop kontinu */}
            {popT > 0.001 ? (
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: tileSize,
                  height: tileSize,
                  backgroundColor: color,
                  opacity: popT,
                  transform: `scale(${scale})`,
                  transformOrigin: '50% 50%',
                  boxSizing: 'border-box',
                }}
              >
                {/* Highlight pixel atas-kiri */}
                <Box x={2} y={2} w={tileSize - 4} h={4} bg="#ffffff" opacity={0.28} />
                <Box x={2} y={tileSize - 5} w={tileSize - 4} h={3} bg="#000000" opacity={0.2} />
              </div>
            ) : null}
          </div>
        );
      })}
    </SceneFrame>
  );
};
