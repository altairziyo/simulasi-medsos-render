import React from 'react';
import { Easing, interpolate } from 'remotion';
import { Cam, Half, Portrait, Sprite, cam, fadeIn } from './common';
import { PanelNadia } from './scenes';

export interface Blok13Props {
  f: number;
}

const PANEL_W = 192;
const PANEL_H = 532;
const PANEL_Y = 112;
const PANEL_XS: readonly [number, number, number] = [20, 224, 428];
const PORTRAIT_W = 170;
const PORTRAIT_H = 212;

const SOFT_EASE = Easing.bezier(0.45, 0, 0.2, 1);

function highlightPanelX(
  f: number,
  t0: number,
  t1: number,
  t2: number,
): number {
  const moveDur = 30;
  if (f < t1) {
    return cam(f, t1 - moveDur, t1, PANEL_XS[0], PANEL_XS[1]);
  }
  if (f < t2) {
    return cam(f, t2 - moveDur, t2, PANEL_XS[1], PANEL_XS[2]);
  }
  return PANEL_XS[2];
}

function panelFocusWeight(
  f: number,
  t0: number,
  t1: number,
  t2: number,
  t3: number,
  idx: 0 | 1 | 2,
): number {
  const pad = 16;
  if (idx === 0) {
    const enter = interpolate(f, [t0, t0 + pad], [0.4, 1], {
      easing: SOFT_EASE,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const exit = interpolate(f, [t1 - pad, t1 + pad], [1, 0.45], {
      easing: SOFT_EASE,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return Math.min(enter, exit);
  }
  if (idx === 1) {
    const enter = interpolate(f, [t1 - pad, t1 + pad], [0.45, 1], {
      easing: SOFT_EASE,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const exit = interpolate(f, [t2 - pad, t2 + pad], [1, 0.45], {
      easing: SOFT_EASE,
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    return Math.min(enter, exit);
  }
  const enter = interpolate(f, [t2 - pad, t2 + pad], [0.45, 1], {
    easing: SOFT_EASE,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const hold = f <= t3 ? 1 : 0.45;
  return Math.min(enter, hold);
}

// Penanda fase umur dengan titik blok pixel (tanpa teks DOM)
const AgeDots: React.FC<{ count: 1 | 2 | 3; color: string }> = ({
  count,
  color,
}) => {
  const dotSize = 10;
  const gap = 8;
  const totalW = count * dotSize + (count - 1) * gap;
  const startX = (PANEL_W - totalW) / 2;
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={`dot-${i}`}
          style={{
            position: 'absolute',
            left: startX + i * (dotSize + gap),
            top: 14,
            width: dotSize,
            height: dotSize,
            backgroundColor: color,
            border: '2px solid rgba(0, 0, 0, 0.25)',
            boxSizing: 'border-box',
            zIndex: 8,
          }}
        />
      ))}
    </>
  );
};

// Tiga panel umur sisi kiri (Sukatenang): 16 (jalan desa), 20 (voli), 35 (balai + tanda tanya akhir B48)
const LeftThreePanels: React.FC<{
  f: number;
  panelsOpacity: number;
  highlightX: number | null;
  activeWeights: readonly [number, number, number];
  showQuestion: number;
}> = ({ f, panelsOpacity, highlightX, activeWeights, showQuestion }) => {
  if (panelsOpacity <= 0.005) {
    return null;
  }
  const qBob = Math.sin(f * 0.09) * 3;
  const ballBob = Math.sin(f * 0.07) * 2.5;

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 640,
        height: 720,
        opacity: panelsOpacity,
        zIndex: 10,
      }}
    >
      {/* Panel 16: Jalan desa polos */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_XS[0],
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          backgroundColor: '#a8d4f0',
          border: '3px solid #7d9b6e',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Latar jalan desa polos */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL_W, height: 190, backgroundColor: '#8ec6ea' }} />
        <div style={{ position: 'absolute', left: 0, top: 170, width: PANEL_W, height: 54, backgroundColor: '#619c58' }} />
        <div style={{ position: 'absolute', left: 0, top: 224, width: PANEL_W, height: 156, backgroundColor: '#7fbc5f' }} />
        <div style={{ position: 'absolute', left: 0, top: 380, width: PANEL_W, height: 74, backgroundColor: '#b99a68' }} />
        <div style={{ position: 'absolute', left: 0, top: 454, width: PANEL_W, height: 78, backgroundColor: '#69a84f' }} />
        <AgeDots count={1} color="#58a05a" />

        <Portrait
          name="nadia_remaja_kiri_portrait_happy"
          x={(PANEL_W - PORTRAIT_W) / 2 - 3}
          y={162}
          w={PORTRAIT_W}
          h={PORTRAIT_H}
        />

        {/* Lapisan redup lembut bila panel lain sedang disorot */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PANEL_W,
            height: PANEL_H,
            backgroundColor: '#121812',
            opacity: (1 - activeWeights[0]) * 0.42,
            pointerEvents: 'none',
            zIndex: 9,
          }}
        />
      </div>

      {/* Panel 20: Lapangan voli sore + prop_bola_voli */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_XS[1],
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          backgroundColor: '#edb87c',
          border: '3px solid #9e7d52',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL_W, height: 196, backgroundColor: '#e8a56b' }} />
        <div style={{ position: 'absolute', left: 0, top: 150, width: PANEL_W, height: 64, backgroundColor: '#f2c184' }} />
        <div style={{ position: 'absolute', left: 0, top: 214, width: PANEL_W, height: 120, backgroundColor: '#6ca358' }} />
        <div style={{ position: 'absolute', left: 0, top: 334, width: PANEL_W, height: 198, backgroundColor: '#c9ad78' }} />
        {/* Garis net voli tipis */}
        <div style={{ position: 'absolute', left: 10, top: 318, width: PANEL_W - 20, height: 4, backgroundColor: '#f4f1e6', opacity: 0.7 }} />
        <AgeDots count={2} color="#ffd98a" />

        <Portrait
          name="nadia_muda_kiri_portrait_neutral"
          x={(PANEL_W - PORTRAIT_W) / 2 - 3}
          y={162}
          w={PORTRAIT_W}
          h={PORTRAIT_H}
        />

        <Sprite
          name="prop_bola_voli"
          x={118}
          y={386 + ballBob}
          w={48}
          h={48}
          z={6}
        />

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PANEL_W,
            height: PANEL_H,
            backgroundColor: '#121812',
            opacity: (1 - activeWeights[1]) * 0.42,
            pointerEvents: 'none',
            zIndex: 9,
          }}
        />
      </div>

      {/* Panel 35: Balai desa + icon_tanda_tanya kecil di akhir B48 */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_XS[2],
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          backgroundColor: '#e8dcc0',
          border: '3px solid #8a6442',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Interior balai hangat */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL_W, height: 118, backgroundColor: '#9c4832' }} />
        <div style={{ position: 'absolute', left: 0, top: 118, width: PANEL_W, height: 274, backgroundColor: '#e8dcc0' }} />
        <div style={{ position: 'absolute', left: 16, top: 118, width: 12, height: 274, backgroundColor: '#7b5236' }} />
        <div style={{ position: 'absolute', left: PANEL_W - 34, top: 118, width: 12, height: 274, backgroundColor: '#7b5236' }} />
        <div style={{ position: 'absolute', left: 0, top: 392, width: PANEL_W, height: 140, backgroundColor: '#b59d78' }} />
        <AgeDots count={3} color="#ffd98a" />

        <Portrait
          name="nadia_dewasa_kiri_portrait_happy"
          x={(PANEL_W - PORTRAIT_W) / 2 - 3}
          y={162}
          w={PORTRAIT_W}
          h={PORTRAIT_H}
        />

        {/* Tanda tanya kecil di atas potret 35 di akhir B48 */}
        {showQuestion > 0.005 ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: 66,
                top: 86 + qBob,
                width: 54,
                height: 54,
                borderRadius: '50%',
                backgroundColor: '#ffd98a',
                opacity: 0.28 * showQuestion,
                zIndex: 7,
              }}
            />
            <Sprite
              name="icon_tanda_tanya"
              x={75}
              y={94 + qBob}
              w={36}
              h={36}
              opacity={showQuestion}
              z={8}
            />
          </>
        ) : null}

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PANEL_W,
            height: PANEL_H,
            backgroundColor: '#121812',
            opacity: (1 - activeWeights[2]) * 0.42,
            pointerEvents: 'none',
            zIndex: 9,
          }}
        />
      </div>

      {/* Penanda sorot bingkai terang kontinu */}
      {highlightX !== null ? (
        <div
          style={{
            position: 'absolute',
            left: highlightX - 4,
            top: PANEL_Y - 4,
            width: PANEL_W + 8,
            height: PANEL_H + 8,
            border: '5px solid #ffd98a',
            boxShadow: '0 0 18px rgba(255, 217, 138, 0.72)',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      ) : null}
    </div>
  );
};

// Tiga panel umur sisi kanan (Sukaramai): 16 (tripod + icon_pengikut), 20 (kamar gelap + garis turun merah), 35 (calm + ponsel redup)
const RightThreePanels: React.FC<{
  f: number;
  panelsOpacity: number;
  highlightX: number | null;
  activeWeights: readonly [number, number, number];
  pengikutOp: number;
  redDropProgress: number;
  phoneDim: number;
}> = ({
  f,
  panelsOpacity,
  highlightX,
  activeWeights,
  pengikutOp,
  redDropProgress,
  phoneDim,
}) => {
  if (panelsOpacity <= 0.005) {
    return null;
  }
  const followerBob = Math.sin(f * 0.1) * 2.5;
  const redPulse = 0.78 + 0.22 * Math.sin(f * 0.13);

  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width: 640,
        height: 720,
        opacity: panelsOpacity,
        zIndex: 10,
      }}
    >
      {/* Panel 16: Sawah & tripod + icon_pengikut */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_XS[0],
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          backgroundColor: '#8dc6eb',
          border: '3px solid #35c4e8',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL_W, height: 210, backgroundColor: '#79b5e0' }} />
        <div style={{ position: 'absolute', left: 0, top: 210, width: PANEL_W, height: 150, backgroundColor: '#69a84f' }} />
        <div style={{ position: 'absolute', left: 0, top: 360, width: PANEL_W, height: 172, backgroundColor: '#7fbc5f' }} />
        <AgeDots count={1} color="#35c4e8" />

        <Portrait
          name="nadia_remaja_kanan_portrait_happy"
          x={(PANEL_W - PORTRAIT_W) / 2 - 3}
          y={162}
          w={PORTRAIT_W}
          h={PORTRAIT_H}
        />

        <Sprite
          name="prop_tripod"
          x={124}
          y={378}
          w={42}
          h={64}
          z={6}
        />

        {pengikutOp > 0.005 ? (
          <>
            <div
              style={{
                position: 'absolute',
                left: 62,
                top: 72 + followerBob,
                width: 64,
                height: 64,
                borderRadius: '50%',
                backgroundColor: '#35c4e8',
                opacity: 0.26 * pengikutOp,
                zIndex: 6,
              }}
            />
            <Sprite
              name="icon_pengikut"
              x={72}
              y={82 + followerBob}
              w={44}
              h={44}
              opacity={pengikutOp}
              z={7}
            />
          </>
        ) : null}

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PANEL_W,
            height: PANEL_H,
            backgroundColor: '#0e1424',
            opacity: (1 - activeWeights[0]) * 0.44,
            pointerEvents: 'none',
            zIndex: 9,
          }}
        />
      </div>

      {/* Panel 20: Kamar malam gelap + garis turun merah (blok) */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_XS[1],
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          backgroundColor: '#192238',
          border: '3px solid #495a80',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/* Latar kamar gelap + jendela malam + pendar layar biru dingin */}
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL_W, height: 390, backgroundColor: '#1d2740' }} />
        <div
          style={{
            position: 'absolute',
            left: 24,
            top: 52,
            width: 62,
            height: 76,
            backgroundColor: '#111829',
            border: '3px solid #354566',
          }}
        />
        <div style={{ position: 'absolute', left: 0, top: 390, width: PANEL_W, height: 142, backgroundColor: '#141a2b' }} />
        <div
          style={{
            position: 'absolute',
            left: 28,
            top: 220,
            width: 136,
            height: 150,
            borderRadius: '50%',
            backgroundColor: '#35c4e8',
            opacity: 0.16,
          }}
        />
        <AgeDots count={2} color="#f05ab4" />

        <Portrait
          name="nadia_muda_kanan_portrait_worried"
          x={(PANEL_W - PORTRAIT_W) / 2 - 3}
          y={162}
          w={PORTRAIT_W}
          h={PORTRAIT_H}
        />

        {/* Garis turun merah (blok tangga pixel + ujung panah turun) */}
        {redDropProgress > 0.005 ? (
          <div
            style={{
              position: 'absolute',
              left: 22,
              top: 396,
              width: 146,
              height: 98,
              opacity: redDropProgress * redPulse,
              zIndex: 7,
            }}
          >
            {/* Segmen tangga turun merah */}
            <div style={{ position: 'absolute', left: 6, top: 8, width: 26, height: 10, backgroundColor: '#ef4444' }} />
            <div style={{ position: 'absolute', left: 30, top: 22, width: 28, height: 10, backgroundColor: '#ef4444' }} />
            <div style={{ position: 'absolute', left: 56, top: 38, width: 28, height: 10, backgroundColor: '#ef4444' }} />
            <div style={{ position: 'absolute', left: 82, top: 54, width: 28, height: 10, backgroundColor: '#ef4444' }} />
            <div style={{ position: 'absolute', left: 108, top: 68, width: 22, height: 10, backgroundColor: '#ef4444' }} />
            {/* Ujung panah merah menunjuk ke bawah */}
            <div style={{ position: 'absolute', left: 108, top: 76, width: 28, height: 8, backgroundColor: '#ff6b6b' }} />
            <div style={{ position: 'absolute', left: 114, top: 84, width: 16, height: 8, backgroundColor: '#ff6b6b' }} />
            <div style={{ position: 'absolute', left: 118, top: 92, width: 8, height: 6, backgroundColor: '#ff6b6b' }} />
          </div>
        ) : null}

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PANEL_W,
            height: PANEL_H,
            backgroundColor: '#0e1424',
            opacity: (1 - activeWeights[1]) * 0.44,
            pointerEvents: 'none',
            zIndex: 9,
          }}
        />
      </div>

      {/* Panel 35: Ruangan kreator rapi + menutup ponsel (prop_ponsel_chat redup) */}
      <div
        style={{
          position: 'absolute',
          left: PANEL_XS[2],
          top: PANEL_Y,
          width: PANEL_W,
          height: PANEL_H,
          backgroundColor: '#273248',
          border: '3px solid #728fb8',
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        <div style={{ position: 'absolute', left: 0, top: 0, width: PANEL_W, height: 384, backgroundColor: '#2c3952' }} />
        <div style={{ position: 'absolute', left: 16, top: 44, width: 154, height: 6, backgroundColor: '#35c4e8', opacity: 0.45 }} />
        <div style={{ position: 'absolute', left: 0, top: 384, width: PANEL_W, height: 148, backgroundColor: '#3d4c66' }} />
        <AgeDots count={3} color="#cfe8ff" />

        <Portrait
          name="nadia_dewasa_kanan_portrait_calm"
          x={(PANEL_W - PORTRAIT_W) / 2 - 3}
          y={162}
          w={PORTRAIT_W}
          h={PORTRAIT_H}
        />

        {/* Ponsel redup (layar dimatikan) */}
        <Sprite
          name="prop_ponsel_chat"
          x={74}
          y={404}
          w={42}
          h={66}
          opacity={phoneDim}
          z={6}
        />

        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: PANEL_W,
            height: PANEL_H,
            backgroundColor: '#0e1424',
            opacity: (1 - activeWeights[2]) * 0.44,
            pointerEvents: 'none',
            zIndex: 9,
          }}
        />
      </div>

      {/* Penanda sorot bingkai terang kontinu */}
      {highlightX !== null ? (
        <div
          style={{
            position: 'absolute',
            left: highlightX - 4,
            top: PANEL_Y - 4,
            width: PANEL_W + 8,
            height: PANEL_H + 8,
            border: '5px solid #35c4e8',
            boxShadow: '0 0 18px rgba(53, 196, 232, 0.78)',
            boxSizing: 'border-box',
            pointerEvents: 'none',
            zIndex: 20,
          }}
        />
      ) : null}
    </div>
  );
};

export const Blok13: React.FC<Blok13Props> = ({ f }) => {
  // Rentang lokal Blok13 (Nadia Dua Kali, total 1273):
  // B46: 0..147, B47: 147..628, B48: 628..1074, B49: 1074..1273

  // --- B46: Hidup Nadia dua kali (panel tampil fadeIn, pan mulai kontinu) ---
  if (f < 147) {
    const enterOp = fadeIn(f, 0, 22);
    const panScale = cam(f, 0, 147, 1.04, 1.06);
    const panTx = cam(f, 0, 147, 10, -4);

    return (
      <>
        <Half side={0}>
          <Cam scale={panScale} tx={panTx}>
            <PanelNadia f={f} side={0} />
            <LeftThreePanels
              f={f}
              panelsOpacity={enterOp}
              highlightX={null}
              activeWeights={[1, 1, 1]}
              showQuestion={0}
            />
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={panScale} tx={panTx}>
            <PanelNadia f={f} side={1} />
            <RightThreePanels
              f={f}
              panelsOpacity={enterOp}
              highlightX={null}
              activeWeights={[1, 1, 1]}
              pengikutOp={0.5}
              redDropProgress={0}
              phoneDim={0.55}
            />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B47: Nadia Sukaramai (kanan fokus, kiri dim 0.25; sorot panel kanan 16 -> 20 -> 35 kontinu) ---
  if (f < 628) {
    const leftDim = cam(f, 147, 171, 0, 0.25);
    const panScale = 1.06;
    const panTx = cam(f, 147, 628, 12, -12);

    // Sub-rentang B47: 147..307 (16), 307..467 (20), 467..628 (35)
    const rightHighlightX = highlightPanelX(f, 147, 307, 467);
    const w0 = panelFocusWeight(f, 147, 307, 467, 628, 0);
    const w1 = panelFocusWeight(f, 147, 307, 467, 628, 1);
    const w2 = panelFocusWeight(f, 147, 307, 467, 628, 2);

    const pengikutOp = fadeIn(f, 155, 18) * (0.45 + 0.55 * w0);
    const redDropProgress = fadeIn(f, 315, 22);
    const phoneDim = cam(f, 480, 560, 0.72, 0.26);

    return (
      <>
        <Half side={0} dim={leftDim}>
          <Cam scale={panScale} tx={panTx}>
            <PanelNadia f={f} side={0} />
            <LeftThreePanels
              f={f}
              panelsOpacity={1}
              highlightX={null}
              activeWeights={[0.8, 0.8, 0.8]}
              showQuestion={0}
            />
          </Cam>
        </Half>

        <Half side={1}>
          <Cam scale={panScale} tx={panTx}>
            <PanelNadia f={f} side={1} />
            <RightThreePanels
              f={f}
              panelsOpacity={1}
              highlightX={rightHighlightX}
              activeWeights={[w0, w1, w2]}
              pengikutOp={pengikutOp}
              redDropProgress={redDropProgress}
              phoneDim={phoneDim}
            />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B48: Nadia Sukatenang (kiri fokus, kanan dim 0.25; sorot panel kiri 16 -> 20 -> 35 kontinu + tanda tanya akhir) ---
  if (f < 1074) {
    const leftDim = cam(f, 628, 652, 0.25, 0);
    const rightDim = cam(f, 628, 652, 0, 0.25);
    const panScale = 1.06;
    const panTx = cam(f, 628, 1074, 12, -12);

    // Sub-rentang B48: 628..776 (16), 776..924 (20), 924..1074 (35)
    const leftHighlightX = highlightPanelX(f, 628, 776, 924);
    const w0 = panelFocusWeight(f, 628, 776, 924, 1074, 0);
    const w1 = panelFocusWeight(f, 628, 776, 924, 1074, 1);
    const w2 = panelFocusWeight(f, 628, 776, 924, 1074, 2);

    const showQuestion = fadeIn(f, 974, 24);

    return (
      <>
        <Half side={0} dim={leftDim}>
          <Cam scale={panScale} tx={panTx}>
            <PanelNadia f={f} side={0} />
            <LeftThreePanels
              f={f}
              panelsOpacity={1}
              highlightX={leftHighlightX}
              activeWeights={[w0, w1, w2]}
              showQuestion={showQuestion}
            />
          </Cam>
        </Half>

        <Half side={1} dim={rightDim}>
          <Cam scale={panScale} tx={panTx}>
            <PanelNadia f={f} side={1} />
            <RightThreePanels
              f={f}
              panelsOpacity={1}
              highlightX={null}
              activeWeights={[0.8, 0.8, 0.8]}
              pengikutOp={0.55}
              redDropProgress={0.7}
              phoneDim={0.26}
            />
          </Cam>
        </Half>
      </>
    );
  }

  // --- B49: Kunci Nadia (dua potret 35 sejajar w bawaan 210, zoom-in pelan; panel lain memudar) ---
  const rightDim = cam(f, 1074, 1096, 0.25, 0);
  const oldPanelsOp = cam(f, 1074, 1102, 1, 0);
  const duoOp = fadeIn(f, 1084, 22);
  const zoomScale = cam(f, 1074, 1273, 1.0, 1.12);

  return (
    <>
      <Half side={0}>
        <Cam scale={zoomScale}>
          <PanelNadia f={f} side={0} />
          <LeftThreePanels
            f={f}
            panelsOpacity={oldPanelsOp}
            highlightX={null}
            activeWeights={[0.7, 0.7, 1]}
            showQuestion={oldPanelsOp}
          />
          {duoOp > 0.005 ? (
            <div
              style={{
                position: 'absolute',
                left: 195,
                top: 204,
                width: 250,
                height: 302,
                backgroundColor: 'rgba(232, 220, 192, 0.94)',
                border: '5px solid #58a05a',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
                boxSizing: 'border-box',
                opacity: duoOp,
                zIndex: 25,
              }}
            >
              <Portrait
                name="nadia_dewasa_kiri_portrait_happy"
                x={15}
                y={15}
              />
            </div>
          ) : null}
        </Cam>
      </Half>

      <Half side={1} dim={rightDim}>
        <Cam scale={zoomScale}>
          <PanelNadia f={f} side={1} />
          <RightThreePanels
            f={f}
            panelsOpacity={oldPanelsOp}
            highlightX={null}
            activeWeights={[0.7, 0.7, 1]}
            pengikutOp={0.5}
            redDropProgress={0.6}
            phoneDim={0.26}
          />
          {duoOp > 0.005 ? (
            <div
              style={{
                position: 'absolute',
                left: 195,
                top: 204,
                width: 250,
                height: 302,
                backgroundColor: 'rgba(34, 46, 70, 0.94)',
                border: '5px solid #35c4e8',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.32)',
                boxSizing: 'border-box',
                opacity: duoOp,
                zIndex: 25,
              }}
            >
              <Portrait
                name="nadia_dewasa_kanan_portrait_calm"
                x={15}
                y={15}
              />
            </div>
          ) : null}
        </Cam>
      </Half>
    </>
  );
};
