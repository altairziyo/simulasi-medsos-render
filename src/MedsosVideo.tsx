import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import './pixelFont';
import {PaperDefs} from './lib/paper/kit';
import {CutSeries, type CutScene, type CutSpec} from './lib/paper/transitions';
import {MEDSOS_BEATS, MEDSOS_TOTAL_FRAMES, medsosHudStateAt} from './medsosPlan';
import {HudContext, PX} from './components/PixelUI';
import {MedsosHud} from './components/MedsosHud';
import {SplitLine} from './components/TwinMapBg';
import {B01_Premis} from './scenesM/B01_Premis';
import {B02_AturanBeda} from './scenesM/B02_AturanBeda';
import {B03_Tebakan} from './scenesM/B03_Tebakan';
import {B04_Mulai} from './scenesM/B04_Mulai';
import {B05_Kunci} from './scenesM/B05_Kunci';
import {B06_Wiryo} from './scenesM/B06_Wiryo';
import {B07_Danu} from './scenesM/B07_Danu';
import {B08_Nadia} from './scenesM/B08_Nadia';
import {B09_Indeks} from './scenesM/B09_Indeks';
import {B10_Gas} from './scenesM/B10_Gas';
import {B11_RamaiMeledak} from './scenesM/B11_RamaiMeledak';
import {B12_TenangDiam} from './scenesM/B12_TenangDiam';
import {B13_Skor2} from './scenesM/B13_Skor2';

const COMP_BY_ID: Record<string, React.ComponentType> = {
  B01: B01_Premis,
  B02: B02_AturanBeda,
  B03: B03_Tebakan,
  B04: B04_Mulai,
  B05: B05_Kunci,
  B06: B06_Wiryo,
  B07: B07_Danu,
  B08: B08_Nadia,
  B09: B09_Indeks,
  B10: B10_Gas,
  B11: B11_RamaiMeledak,
  B12: B12_TenangDiam,
  B13: B13_Skor2,
};

const SCENES: CutScene[] = MEDSOS_BEATS.slice(0, 13).map((b) => ({
  id: b.id,
  component: COMP_BY_ID[b.id],
  durationInFrames: b.durationInFrames,
}));

const CUTS: Record<string, CutSpec> = {
  B02: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B03: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B04: {kind: 'stampCut', x: 640, y: 360, frames: 8, align: 'mid'},
  B05: {kind: 'tapePull', y: 160, frames: 10, align: 'mid'},
  B06: {kind: 'pageTurn', style: 'fold', frames: 10, align: 'after'},
  B07: {kind: 'whip', blur: 28, frames: 7, align: 'after'},
  B08: {kind: 'whip', blur: 28, frames: 7, align: 'after'},
  B09: {kind: 'pageTurn', style: 'curl', frames: 10, align: 'mid'},
  B10: {kind: 'zoomThrough', x: 640, y: 360, scale: 3, frames: 8, align: 'mid'},
  B11: {kind: 'zoomThrough', x: 960, y: 330, scale: 3, frames: 8, align: 'mid'},
  B12: {kind: 'whip', blur: 28, frames: 8, align: 'mid'},
  B13: {kind: 'zoomThrough', x: 640, y: 360, scale: 3, frames: 8, align: 'mid'},
};

export const MedsosVideo: React.FC = () => {
  const f = useCurrentFrame();
  const fadeBlack = interpolate(f, [MEDSOS_TOTAL_FRAMES - 24, MEDSOS_TOTAL_FRAMES - 1], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const activeBeat = MEDSOS_BEATS.find(
    (b) => f >= b.from && f < b.from + b.durationInFrames,
  );
  const fullscreenBeat = activeBeat?.id === 'B09'; // segmen penjelas netral 1 layar: tanpa garis pemisah

  return (
    <HudContext.Provider value={medsosHudStateAt}>
      <AbsoluteFill style={{backgroundColor: PX.bgDark}}>
        <PaperDefs />
        <CutSeries scenes={SCENES} cuts={CUTS} />
        {fullscreenBeat ? null : <SplitLine />}
        <MedsosHud />
        {fadeBlack > 0 ? (
          <AbsoluteFill style={{backgroundColor: '#000', opacity: fadeBlack, zIndex: 90}} />
        ) : null}
      </AbsoluteFill>
    </HudContext.Provider>
  );
};
