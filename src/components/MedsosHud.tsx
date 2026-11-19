import React, {useContext} from 'react';
import {useCurrentFrame} from 'remotion';
import {W} from '../lib/tokens';
import {PIXEL_FONT} from '../pixelFont';
import {HUD_H, HudContext, PX} from './PixelUI';

export const MedsosHud: React.FC = () => {
  const globalFrame = useCurrentFrame();
  const stateFn = useContext(HudContext);
  const {year, s, t, yearLabel} = stateFn(globalFrame);
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: W,
        height: HUD_H,
        pointerEvents: 'none',
        fontFamily: PIXEL_FONT,
        zIndex: 50,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: W,
          height: 44,
          background: '#141210',
          borderBottom: '2px solid #000',
        }}
      />
      {/* Left: SUKATENANG */}
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 12,
          fontSize: 16,
          color: '#A5E075',
          textShadow: '2px 2px 0 #000',
          whiteSpace: 'nowrap',
        }}
      >
        SUKATENANG {s}
      </div>
      {/* Center: TAHUN */}
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: 12,
          translate: '-50% 0',
          fontSize: yearLabel ? 13 : 16,
          color: PX.white,
          textShadow: '2px 2px 0 #000',
          whiteSpace: 'nowrap',
        }}
      >
        {yearLabel ?? `TAHUN ${year}`}
      </div>
      {/* Right: SUKARAMAI */}
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 12,
          fontSize: 16,
          color: '#6EC6E8',
          textShadow: '2px 2px 0 #000',
          whiteSpace: 'nowrap',
        }}
      >
        SUKARAMAI {t}
      </div>
      {/* Score bars at y=44..52 */}
      <div style={{position: 'absolute', left: 0, top: 44, width: W, height: 8, background: '#000'}} />
      <div
        style={{
          position: 'absolute',
          left: 24,
          top: 44,
          width: s * 3,
          height: 6,
          background: '#A5E075',
          boxShadow: 'inset 0 2px 0 #E4F7C8',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 24,
          top: 44,
          width: t * 3,
          height: 6,
          background: '#6EC6E8',
          boxShadow: 'inset 0 2px 0 #D2F0FF',
        }}
      />
    </div>
  );
};
