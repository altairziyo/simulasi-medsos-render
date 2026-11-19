import {interpolate} from 'remotion';
import {FPS, type BeatMeta} from './demoPlan';

export {FPS};
export type {BeatMeta};
export const MEDSOS_TOTAL_FRAMES = 23909; // 796.96s @ 30fps (narasi rev3)

export const MEDSOS_BEATS: BeatMeta[] = [
  {id: 'B01', label: 'B1 premis dua dunia', t0: 0, t1: 24.42, from: 0, durationInFrames: 733},
  {id: 'B02', label: 'B1 aturan beda', t0: 24.42, t1: 42.36, from: 733, durationInFrames: 538},
  {id: 'B03', label: 'B1 tebakan penonton', t0: 42.36, t1: 54.6, from: 1271, durationInFrames: 367},
  {id: 'B04', label: 'B1 mulai', t0: 54.6, t1: 62.62, from: 1638, durationInFrames: 241},
  {id: 'B05', label: 'B2 kunci variabel', t0: 62.62, t1: 89.42, from: 1879, durationInFrames: 804},
  {id: 'B06', label: 'B2 Wiryo', t0: 89.42, t1: 98.86, from: 2683, durationInFrames: 283},
  {id: 'B07', label: 'B2 Danu', t0: 98.86, t1: 109.6, from: 2966, durationInFrames: 322},
  {id: 'B08', label: 'B2 Nadia', t0: 109.6, t1: 118.62, from: 3288, durationInFrames: 271},
  {id: 'B09', label: 'B2 indeks', t0: 118.62, t1: 130.52, from: 3559, durationInFrames: 357},
  {id: 'B10', label: 'B2 gas', t0: 130.52, t1: 136.1, from: 3916, durationInFrames: 167},
  {id: 'B11', label: 'B3 Sukaramai meledak', t0: 136.1, t1: 152.74, from: 4083, durationInFrames: 499},
  {id: 'B12', label: 'B3 Sukatenang diam', t0: 152.74, t1: 166.1, from: 4582, durationInFrames: 401},
  {id: 'B13', label: 'B3 skor tahun 2', t0: 166.1, t1: 177.06, from: 4983, durationInFrames: 329},
  {id: 'B14', label: 'B4 Danu terkenal', t0: 177.06, t1: 192.58, from: 5312, durationInFrames: 465},
  {id: 'B15', label: 'B4 Ratna & kelas', t0: 192.58, t1: 207.18, from: 5777, durationInFrames: 438},
  {id: 'B16', label: 'B4 Nadia bosan', t0: 207.18, t1: 211.08, from: 6215, durationInFrames: 117},
  {id: 'B17', label: 'B4 skor tahun 4', t0: 211.08, t1: 220.06, from: 6332, durationInFrames: 270},
  {id: 'B18', label: 'B5 perbandingan sosial', t0: 220.06, t1: 235.7, from: 6602, durationInFrames: 469},
  {id: 'B19', label: 'B5 kartu studi Facebook', t0: 235.7, t1: 253.48, from: 7071, durationInFrames: 533},
  {id: 'B20', label: 'B5 Nadia Sukatenang', t0: 253.48, t1: 261.8, from: 7604, durationInFrames: 250},
  {id: 'B21', label: 'B5 skor tahun 6', t0: 261.8, t1: 275.94, from: 7854, durationInFrames: 424},
  {id: 'B22', label: 'B6 rahasia terbongkar', t0: 275.94, t1: 287.88, from: 8278, durationInFrames: 358},
  {id: 'B23', label: 'B6 dialog Wiryo-Nadia', t0: 287.88, t1: 306.98, from: 8636, durationInFrames: 573},
  {id: 'B24', label: 'B6 pertanyaan menggantung', t0: 306.98, t1: 315.06, from: 9209, durationInFrames: 243},
  {id: 'B25', label: 'B7 kartu studi Allcott', t0: 315.06, t1: 333.02, from: 9452, durationInFrames: 539},
  {id: 'B26', label: 'B7 jam yang kembali', t0: 333.02, t1: 347.2, from: 9991, durationInFrames: 425},
  {id: 'B27', label: 'B7 skor tahun 10 + pertanyaan 2', t0: 347.2, t1: 365.3, from: 10416, durationInFrames: 543},
  {id: 'B28', label: 'B8 cerita berbelok', t0: 365.3, t1: 374.46, from: 10959, durationInFrames: 275},
  {id: 'B29', label: 'B8 video potongan', t0: 374.46, t1: 396.1, from: 11234, durationInFrames: 649},
  {id: 'B30', label: 'B8 dialog Danu-Lastri', t0: 396.1, t1: 414.64, from: 11883, durationInFrames: 556},
  {id: 'B31', label: 'B8 Wiryo pensiun', t0: 414.64, t1: 432.22, from: 12439, durationInFrames: 528},
  {id: 'B32', label: 'B8 banjir', t0: 432.22, t1: 447.66, from: 12967, durationInFrames: 463},
  {id: 'B33', label: 'B8 jawaban pertanyaan 2', t0: 447.66, t1: 459.16, from: 13430, durationInFrames: 345},
  {id: 'B34', label: 'B9 Sukaramai pulih', t0: 459.16, t1: 473.64, from: 13775, durationInFrames: 434},
  {id: 'B35', label: 'B9 aturan kentongan', t0: 473.64, t1: 484.26, from: 14209, durationInFrames: 319},
  {id: 'B36', label: 'B9 skor tahun 14', t0: 484.26, t1: 494.74, from: 14528, durationInFrames: 314},
  {id: 'B37', label: 'B10 titik tengah', t0: 494.74, t1: 508.36, from: 14842, durationInFrames: 409},
  {id: 'B38', label: 'B10 Sukaramai ke lapangan', t0: 508.36, t1: 518.04, from: 15251, durationInFrames: 290},
  {id: 'B39', label: 'B10 Sukatenang melonggar', t0: 518.04, t1: 535.06, from: 15541, durationInFrames: 511},
  {id: 'B40', label: 'B11 Wiryo mengaku', t0: 535.06, t1: 545.88, from: 16052, durationInFrames: 324},
  {id: 'B41', label: 'B11 dialog pengakuan', t0: 545.88, t1: 559.24, from: 16376, durationInFrames: 401},
  {id: 'B42', label: 'B11 festival cermin', t0: 559.24, t1: 581.16, from: 16777, durationInFrames: 658},
  {id: 'B43', label: 'B12 skor akhir', t0: 581.16, t1: 587.22, from: 17435, durationInFrames: 182},
  {id: 'B44', label: 'B12 kenapa Sukatenang', t0: 587.22, t1: 602.54, from: 17617, durationInFrames: 459},
  {id: 'B45', label: 'B12 pengecualian jujur', t0: 602.54, t1: 630.98, from: 18076, durationInFrames: 853},
  {id: 'B46', label: 'B13 hidup Nadia dua kali', t0: 630.98, t1: 635.94, from: 18929, durationInFrames: 149},
  {id: 'B47', label: 'B13 Nadia Sukaramai', t0: 635.94, t1: 651.06, from: 19078, durationInFrames: 454},
  {id: 'B48', label: 'B13 Nadia Sukatenang', t0: 651.06, t1: 666, from: 19532, durationInFrames: 448},
  {id: 'B49', label: 'B13 kunci Nadia', t0: 666, t1: 672.32, from: 19980, durationInFrames: 190},
  {id: 'B50', label: 'B14 eksperimen balik', t0: 672.32, t1: 681.8, from: 20170, durationInFrames: 284},
  {id: 'B51', label: 'B14 hasil rerun', t0: 681.8, t1: 697.38, from: 20454, durationInFrames: 467},
  {id: 'B52', label: 'B14 skor rerun', t0: 697.38, t1: 717.84, from: 20921, durationInFrames: 614},
  {id: 'B53', label: 'B15 ulang 100 kali', t0: 717.84, t1: 728.78, from: 21535, durationInFrames: 328},
  {id: 'B54', label: 'B15 hasil 100x', t0: 728.78, t1: 737.04, from: 21863, durationInFrames: 248},
  {id: 'B55', label: 'B15 kenapa tak telak', t0: 737.04, t1: 758.38, from: 22111, durationInFrames: 640},
  {id: 'B56', label: 'B16 jawaban taruhan', t0: 758.38, t1: 780.68, from: 22751, durationInFrames: 669},
  {id: 'B57', label: 'B16 penutup & CTA', t0: 780.68, t1: 796.96, from: 23420, durationInFrames: 489},
];

/** Convert absolute video seconds to local beat frames for any beat B01..B57. */
export const medsosLocalF = (beatId: string, absSec: number): number => {
  const b = MEDSOS_BEATS.find((x) => x.id === beatId);
  if (!b) throw new Error(`Unknown beat ${beatId}`);
  return Math.round((absSec - b.t0) * FPS);
};

const YEAR_MARKERS: Array<{sec: number; year: number}> = [
  {sec: 0, year: 0},
  {sec: 54.6, year: 1},
  {sec: 166.1, year: 2},
  {sec: 177.06, year: 3},
  {sec: 211.08, year: 4},
  {sec: 220.06, year: 5},
  {sec: 261.8, year: 6},
  {sec: 287.88, year: 7},
  {sec: 306.98, year: 8},
  {sec: 315.06, year: 9},
  {sec: 347.2, year: 10},
  {sec: 365.3, year: 11},
  {sec: 396.1, year: 12},
  {sec: 459.16, year: 13},
  {sec: 483.14, year: 14},
  {sec: 494.74, year: 15},
  {sec: 518.04, year: 17},
  {sec: 535.06, year: 18},
  {sec: 559.24, year: 19},
  {sec: 581.16, year: 20},
];

// Score checkpoints: [startSec, endSec, fromS, toS, fromT, toT]
const SCORE_STEPS: Array<[number, number, number, number, number, number]> = [
  [166.1, 168.82, 20, 30, 20, 38],
  [211.08, 215.82, 30, 41, 38, 45],
  [261.8, 265.04, 41, 50, 45, 48],
  [347.2, 350.18, 50, 58, 48, 52],
  [483.14, 487.8, 58, 66, 52, 55],
  [581.78, 586.14, 66, 74, 55, 63],
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

  if (sec >= 672.32 && sec < 717.84) {
    const p = interpolate(sec, [697.38, 702.46], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    s = Math.round(74 + (74 - 74) * p);
    t = Math.round(63 + (71 - 63) * p);
    return {year: 20, s, t, yearLabel: 'EKSPERIMEN BALIK'};
  }

  if (sec >= 717.84 && sec < 758.38) {
    const p = interpolate(sec, [727.06, 733.26], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    s = Math.round(74 + (61 - 74) * p);
    t = Math.round(71 + (27 - 71) * p);
    return {year: 20, s, t, yearLabel: 'DIULANG 100 KALI'};
  }

  return {year, s, t};
};
