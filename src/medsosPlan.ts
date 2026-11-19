import {interpolate} from 'remotion';
import {FPS, type BeatMeta} from './demoPlan';

export {FPS};
export type {BeatMeta};
export const MEDSOS_TOTAL_FRAMES = 23675; // 789.16s @ 30fps

export const MEDSOS_BEATS: BeatMeta[] = [
  {id: 'B01', label: 'B1 premis dua dunia', t0: 0.0, t1: 22.64, from: 0, durationInFrames: 679},
  {id: 'B02', label: 'B1 aturan beda', t0: 22.64, t1: 39.9, from: 679, durationInFrames: 518},
  {id: 'B03', label: 'B1 tebakan penonton', t0: 39.9, t1: 51.38, from: 1197, durationInFrames: 344},
  {id: 'B04', label: 'B1 mulai', t0: 51.38, t1: 59.12, from: 1541, durationInFrames: 233},
  {id: 'B05', label: 'B2 kunci variabel', t0: 59.12, t1: 83.3, from: 1774, durationInFrames: 725},
  {id: 'B06', label: 'B2 Wiryo', t0: 83.3, t1: 92.24, from: 2499, durationInFrames: 268},
  {id: 'B07', label: 'B2 Danu', t0: 92.24, t1: 102.74, from: 2767, durationInFrames: 315},
  {id: 'B08', label: 'B2 Nadia', t0: 102.74, t1: 112.2, from: 3082, durationInFrames: 284},
  {id: 'B09', label: 'B2 indeks', t0: 112.2, t1: 124.48, from: 3366, durationInFrames: 368},
  {id: 'B10', label: 'B2 gas', t0: 124.48, t1: 129.26, from: 3734, durationInFrames: 144},
  {id: 'B11', label: 'B3 Sukaramai meledak', t0: 129.26, t1: 146.42, from: 3878, durationInFrames: 515},
  {id: 'B12', label: 'B3 Sukatenang diam', t0: 146.42, t1: 158.7, from: 4393, durationInFrames: 368},
  {id: 'B13', label: 'B3 skor tahun 2', t0: 158.7, t1: 170.96, from: 4761, durationInFrames: 368},
  {id: 'B14', label: 'B4 Danu terkenal', t0: 170.96, t1: 185.14, from: 5129, durationInFrames: 425},
  {id: 'B15', label: 'B4 Ratna & kelas', t0: 185.14, t1: 200.96, from: 5554, durationInFrames: 475},
  {id: 'B16', label: 'B4 Nadia bosan', t0: 200.96, t1: 204.58, from: 6029, durationInFrames: 108},
  {id: 'B17', label: 'B4 skor tahun 4', t0: 204.58, t1: 213.8, from: 6137, durationInFrames: 277},
  {id: 'B18', label: 'B5 perbandingan sosial', t0: 213.8, t1: 228.32, from: 6414, durationInFrames: 436},
  {id: 'B19', label: 'B5 kartu studi Facebook', t0: 228.32, t1: 247.76, from: 6850, durationInFrames: 583},
  {id: 'B20', label: 'B5 Nadia Sukatenang', t0: 247.76, t1: 255.7, from: 7433, durationInFrames: 238},
  {id: 'B21', label: 'B5 skor tahun 6', t0: 255.7, t1: 271.26, from: 7671, durationInFrames: 467},
  {id: 'B22', label: 'B6 rahasia terbongkar', t0: 271.26, t1: 284.42, from: 8138, durationInFrames: 395},
  {id: 'B23', label: 'B6 dialog Wiryo-Nadia', t0: 284.42, t1: 302.94, from: 8533, durationInFrames: 555},
  {id: 'B24', label: 'B6 pertanyaan menggantung', t0: 302.94, t1: 310.68, from: 9088, durationInFrames: 232},
  {id: 'B25', label: 'B7 kartu studi Allcott', t0: 310.68, t1: 328.9, from: 9320, durationInFrames: 547},
  {id: 'B26', label: 'B7 jam yang kembali', t0: 328.9, t1: 342.06, from: 9867, durationInFrames: 395},
  {id: 'B27', label: 'B7 skor tahun 10 + pertanyaan 2', t0: 342.06, t1: 360.12, from: 10262, durationInFrames: 542},
  {id: 'B28', label: 'B8 cerita berbelok', t0: 360.12, t1: 368.8, from: 10804, durationInFrames: 260},
  {id: 'B29', label: 'B8 video potongan', t0: 368.8, t1: 390.98, from: 11064, durationInFrames: 665},
  {id: 'B30', label: 'B8 dialog Danu-Lastri', t0: 390.98, t1: 408.38, from: 11729, durationInFrames: 522},
  {id: 'B31', label: 'B8 Wiryo pensiun', t0: 408.38, t1: 425.88, from: 12251, durationInFrames: 525},
  {id: 'B32', label: 'B8 banjir', t0: 425.88, t1: 441.86, from: 12776, durationInFrames: 480},
  {id: 'B33', label: 'B8 jawaban pertanyaan 2', t0: 441.86, t1: 452.98, from: 13256, durationInFrames: 333},
  {id: 'B34', label: 'B9 Sukaramai pulih', t0: 452.98, t1: 467.44, from: 13589, durationInFrames: 434},
  {id: 'B35', label: 'B9 aturan kentongan', t0: 467.44, t1: 478.32, from: 14023, durationInFrames: 327},
  {id: 'B36', label: 'B9 skor tahun 14', t0: 478.32, t1: 488.36, from: 14350, durationInFrames: 301},
  {id: 'B37', label: 'B10 titik tengah', t0: 488.36, t1: 501.26, from: 14651, durationInFrames: 387},
  {id: 'B38', label: 'B10 Sukaramai ke lapangan', t0: 501.26, t1: 512.54, from: 15038, durationInFrames: 338},
  {id: 'B39', label: 'B10 Sukatenang melonggar', t0: 512.54, t1: 529.16, from: 15376, durationInFrames: 499},
  {id: 'B40', label: 'B11 Wiryo mengaku', t0: 529.16, t1: 540.0, from: 15875, durationInFrames: 325},
  {id: 'B41', label: 'B11 dialog pengakuan', t0: 540.0, t1: 553.1, from: 16200, durationInFrames: 393},
  {id: 'B42', label: 'B11 festival cermin', t0: 553.1, t1: 575.06, from: 16593, durationInFrames: 659},
  {id: 'B43', label: 'B12 skor akhir', t0: 575.06, t1: 581.4, from: 17252, durationInFrames: 190},
  {id: 'B44', label: 'B12 kenapa Sukatenang', t0: 581.4, t1: 596.62, from: 17442, durationInFrames: 457},
  {id: 'B45', label: 'B12 pengecualian jujur', t0: 596.62, t1: 625.46, from: 17899, durationInFrames: 865},
  {id: 'B46', label: 'B13 hidup Nadia dua kali', t0: 625.46, t1: 630.38, from: 18764, durationInFrames: 147},
  {id: 'B47', label: 'B13 Nadia Sukaramai', t0: 630.38, t1: 646.4, from: 18911, durationInFrames: 481},
  {id: 'B48', label: 'B13 Nadia Sukatenang', t0: 646.4, t1: 661.28, from: 19392, durationInFrames: 446},
  {id: 'B49', label: 'B13 kunci Nadia', t0: 661.28, t1: 667.9, from: 19838, durationInFrames: 199},
  {id: 'B50', label: 'B14 eksperimen balik', t0: 667.9, t1: 677.62, from: 20037, durationInFrames: 292},
  {id: 'B51', label: 'B14 hasil rerun', t0: 677.62, t1: 692.3, from: 20329, durationInFrames: 440},
  {id: 'B52', label: 'B14 skor rerun', t0: 692.3, t1: 712.72, from: 20769, durationInFrames: 613},
  {id: 'B53', label: 'B15 ulang 100 kali', t0: 712.72, t1: 723.5, from: 21382, durationInFrames: 323},
  {id: 'B54', label: 'B15 hasil 100x', t0: 723.5, t1: 731.3, from: 21705, durationInFrames: 234},
  {id: 'B55', label: 'B15 kenapa tak telak', t0: 731.3, t1: 752.28, from: 21939, durationInFrames: 629},
  {id: 'B56', label: 'B16 jawaban taruhan', t0: 752.28, t1: 775.68, from: 22568, durationInFrames: 702},
  {id: 'B57', label: 'B16 penutup & CTA', t0: 775.68, t1: 789.16, from: 23270, durationInFrames: 405},
];

/** Convert absolute video seconds to local beat frames for any beat B01..B57. */
export const medsosLocalF = (beatId: string, absSec: number): number => {
  const b = MEDSOS_BEATS.find((x) => x.id === beatId);
  if (!b) throw new Error(`Unknown beat ${beatId}`);
  return Math.round((absSec - b.t0) * FPS);
};

const YEAR_MARKERS: Array<{sec: number; year: number}> = [
  {sec: 0, year: 0},
  {sec: 51.38, year: 1},
  {sec: 158.7, year: 2},
  {sec: 171.0, year: 3},
  {sec: 204.6, year: 4},
  {sec: 213.8, year: 5},
  {sec: 255.7, year: 6},
  {sec: 284.42, year: 7},
  {sec: 302.94, year: 8},
  {sec: 310.68, year: 9},
  {sec: 342.1, year: 10},
  {sec: 360.12, year: 11},
  {sec: 390.98, year: 12},
  {sec: 452.98, year: 13},
  {sec: 477.6, year: 14},
  {sec: 488.36, year: 15},
  {sec: 512.54, year: 17},
  {sec: 529.16, year: 18},
  {sec: 553.1, year: 19},
  {sec: 575.06, year: 20},
];

// Score checkpoints: [startSec, endSec, fromS, toS, fromT, toT]
const SCORE_STEPS: Array<[number, number, number, number, number, number]> = [
  [158.7, 163.5, 20, 30, 20, 38],
  [204.6, 209.5, 30, 41, 38, 45],
  [255.7, 260.2, 41, 50, 45, 48],
  [342.1, 346.5, 50, 58, 48, 52],
  [477.6, 482.5, 58, 66, 52, 55],
  [576.4, 580.5, 66, 74, 55, 63],
];

export const medsosHudStateAt = (
  globalFrame: number,
): {year: number; s: number; t: number; yearLabel?: string} => {
  const sec = globalFrame / FPS;

  let year = 0;
  for (const m of YEAR_MARKERS) {
    if (sec >= m.sec) year = m.year;
  }

  let s = 20;
  let t = 20;
  for (const [s0, s1, fs, ts, ft, tt] of SCORE_STEPS) {
    if (sec >= s0) {
      const p = interpolate(sec, [s0, s1], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      });
      s = Math.round(fs + (ts - fs) * p);
      t = Math.round(ft + (tt - ft) * p);
    }
  }

  if (sec >= 667.9 && sec < 712.72) {
    const p = interpolate(sec, [692.3, 697.5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    s = Math.round(74 + (74 - 74) * p);
    t = Math.round(63 + (71 - 63) * p);
    return {year: 20, s, t, yearLabel: 'EKSPERIMEN BALIK'};
  }

  if (sec >= 712.72 && sec < 752.28) {
    const p = interpolate(sec, [722.3, 728.5], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    s = Math.round(74 + (61 - 74) * p);
    t = Math.round(71 + (27 - 71) * p);
    return {year: 20, s, t, yearLabel: 'DIULANG 100 KALI'};
  }

  return {year, s, t};
};
