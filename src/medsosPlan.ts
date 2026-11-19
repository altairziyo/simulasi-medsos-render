import {interpolate} from 'remotion';
import {FPS, type BeatMeta} from './demoPlan';

export {FPS};
export type {BeatMeta};
export const MEDSOS_TOTAL_FRAMES = 23766; // 792.20s @ 30fps (narasi rev2)

export const MEDSOS_BEATS: BeatMeta[] = [
  {id: 'B01', label: 'B1 premis dua dunia', t0: 0, t1: 22.4, from: 0, durationInFrames: 672},
  {id: 'B02', label: 'B1 aturan beda', t0: 22.4, t1: 39.26, from: 672, durationInFrames: 506},
  {id: 'B03', label: 'B1 tebakan penonton', t0: 39.26, t1: 51.76, from: 1178, durationInFrames: 375},
  {id: 'B04', label: 'B1 mulai', t0: 51.76, t1: 59.56, from: 1553, durationInFrames: 234},
  {id: 'B05', label: 'B2 kunci variabel', t0: 59.56, t1: 83.6, from: 1787, durationInFrames: 721},
  {id: 'B06', label: 'B2 Wiryo', t0: 83.6, t1: 92.3, from: 2508, durationInFrames: 261},
  {id: 'B07', label: 'B2 Danu', t0: 92.3, t1: 101.68, from: 2769, durationInFrames: 281},
  {id: 'B08', label: 'B2 Nadia', t0: 101.68, t1: 112.02, from: 3050, durationInFrames: 311},
  {id: 'B09', label: 'B2 indeks', t0: 112.02, t1: 123.66, from: 3361, durationInFrames: 349},
  {id: 'B10', label: 'B2 gas', t0: 123.66, t1: 128.48, from: 3710, durationInFrames: 144},
  {id: 'B11', label: 'B3 Sukaramai meledak', t0: 128.48, t1: 145.54, from: 3854, durationInFrames: 512},
  {id: 'B12', label: 'B3 Sukatenang diam', t0: 145.54, t1: 158.04, from: 4366, durationInFrames: 375},
  {id: 'B13', label: 'B3 skor tahun 2', t0: 158.04, t1: 170.4, from: 4741, durationInFrames: 371},
  {id: 'B14', label: 'B4 Danu terkenal', t0: 170.4, t1: 185.68, from: 5112, durationInFrames: 458},
  {id: 'B15', label: 'B4 Ratna & kelas', t0: 185.68, t1: 199.64, from: 5570, durationInFrames: 419},
  {id: 'B16', label: 'B4 Nadia bosan', t0: 199.64, t1: 203.9, from: 5989, durationInFrames: 128},
  {id: 'B17', label: 'B4 skor tahun 4', t0: 203.9, t1: 213.54, from: 6117, durationInFrames: 289},
  {id: 'B18', label: 'B5 perbandingan sosial', t0: 213.54, t1: 228.92, from: 6406, durationInFrames: 462},
  {id: 'B19', label: 'B5 kartu studi Facebook', t0: 228.92, t1: 248.18, from: 6868, durationInFrames: 577},
  {id: 'B20', label: 'B5 Nadia Sukatenang', t0: 248.18, t1: 256.66, from: 7445, durationInFrames: 255},
  {id: 'B21', label: 'B5 skor tahun 6', t0: 256.66, t1: 271.7, from: 7700, durationInFrames: 451},
  {id: 'B22', label: 'B6 rahasia terbongkar', t0: 271.7, t1: 284.04, from: 8151, durationInFrames: 370},
  {id: 'B23', label: 'B6 dialog Wiryo-Nadia', t0: 284.04, t1: 303.58, from: 8521, durationInFrames: 586},
  {id: 'B24', label: 'B6 pertanyaan menggantung', t0: 303.58, t1: 311.44, from: 9107, durationInFrames: 236},
  {id: 'B25', label: 'B7 kartu studi Allcott', t0: 311.44, t1: 328.7, from: 9343, durationInFrames: 518},
  {id: 'B26', label: 'B7 jam yang kembali', t0: 328.7, t1: 342.4, from: 9861, durationInFrames: 411},
  {id: 'B27', label: 'B7 skor tahun 10 + pertanyaan 2', t0: 342.4, t1: 361, from: 10272, durationInFrames: 558},
  {id: 'B28', label: 'B8 cerita berbelok', t0: 361, t1: 369.7, from: 10830, durationInFrames: 261},
  {id: 'B29', label: 'B8 video potongan', t0: 369.7, t1: 391.34, from: 11091, durationInFrames: 649},
  {id: 'B30', label: 'B8 dialog Danu-Lastri', t0: 391.34, t1: 409.88, from: 11740, durationInFrames: 556},
  {id: 'B31', label: 'B8 Wiryo pensiun', t0: 409.88, t1: 427.46, from: 12296, durationInFrames: 528},
  {id: 'B32', label: 'B8 banjir', t0: 427.46, t1: 442.9, from: 12824, durationInFrames: 463},
  {id: 'B33', label: 'B8 jawaban pertanyaan 2', t0: 442.9, t1: 454.4, from: 13287, durationInFrames: 345},
  {id: 'B34', label: 'B9 Sukaramai pulih', t0: 454.4, t1: 468.88, from: 13632, durationInFrames: 434},
  {id: 'B35', label: 'B9 aturan kentongan', t0: 468.88, t1: 479.5, from: 14066, durationInFrames: 319},
  {id: 'B36', label: 'B9 skor tahun 14', t0: 479.5, t1: 489.98, from: 14385, durationInFrames: 314},
  {id: 'B37', label: 'B10 titik tengah', t0: 489.98, t1: 503.6, from: 14699, durationInFrames: 409},
  {id: 'B38', label: 'B10 Sukaramai ke lapangan', t0: 503.6, t1: 513.28, from: 15108, durationInFrames: 290},
  {id: 'B39', label: 'B10 Sukatenang melonggar', t0: 513.28, t1: 530.3, from: 15398, durationInFrames: 511},
  {id: 'B40', label: 'B11 Wiryo mengaku', t0: 530.3, t1: 541.12, from: 15909, durationInFrames: 325},
  {id: 'B41', label: 'B11 dialog pengakuan', t0: 541.12, t1: 554.48, from: 16234, durationInFrames: 400},
  {id: 'B42', label: 'B11 festival cermin', t0: 554.48, t1: 576.4, from: 16634, durationInFrames: 658},
  {id: 'B43', label: 'B12 skor akhir', t0: 576.4, t1: 582.46, from: 17292, durationInFrames: 182},
  {id: 'B44', label: 'B12 kenapa Sukatenang', t0: 582.46, t1: 597.78, from: 17474, durationInFrames: 459},
  {id: 'B45', label: 'B12 pengecualian jujur', t0: 597.78, t1: 626.22, from: 17933, durationInFrames: 854},
  {id: 'B46', label: 'B13 hidup Nadia dua kali', t0: 626.22, t1: 631.18, from: 18787, durationInFrames: 148},
  {id: 'B47', label: 'B13 Nadia Sukaramai', t0: 631.18, t1: 646.3, from: 18935, durationInFrames: 454},
  {id: 'B48', label: 'B13 Nadia Sukatenang', t0: 646.3, t1: 661.24, from: 19389, durationInFrames: 448},
  {id: 'B49', label: 'B13 kunci Nadia', t0: 661.24, t1: 667.56, from: 19837, durationInFrames: 190},
  {id: 'B50', label: 'B14 eksperimen balik', t0: 667.56, t1: 677.04, from: 20027, durationInFrames: 284},
  {id: 'B51', label: 'B14 hasil rerun', t0: 677.04, t1: 692.62, from: 20311, durationInFrames: 468},
  {id: 'B52', label: 'B14 skor rerun', t0: 692.62, t1: 713.08, from: 20779, durationInFrames: 613},
  {id: 'B53', label: 'B15 ulang 100 kali', t0: 713.08, t1: 724.02, from: 21392, durationInFrames: 329},
  {id: 'B54', label: 'B15 hasil 100x', t0: 724.02, t1: 732.28, from: 21721, durationInFrames: 247},
  {id: 'B55', label: 'B15 kenapa tak telak', t0: 732.28, t1: 753.62, from: 21968, durationInFrames: 641},
  {id: 'B56', label: 'B16 jawaban taruhan', t0: 753.62, t1: 775.92, from: 22609, durationInFrames: 669},
  {id: 'B57', label: 'B16 penutup & CTA', t0: 775.92, t1: 792.2, from: 23278, durationInFrames: 488},
];

/** Convert absolute video seconds to local beat frames for any beat B01..B57. */
export const medsosLocalF = (beatId: string, absSec: number): number => {
  const b = MEDSOS_BEATS.find((x) => x.id === beatId);
  if (!b) throw new Error(`Unknown beat ${beatId}`);
  return Math.round((absSec - b.t0) * FPS);
};

const YEAR_MARKERS: Array<{sec: number; year: number}> = [
  {sec: 0, year: 0},
  {sec: 51.76, year: 1},
  {sec: 158.04, year: 2},
  {sec: 170.4, year: 3},
  {sec: 203.9, year: 4},
  {sec: 213.54, year: 5},
  {sec: 256.66, year: 6},
  {sec: 284.04, year: 7},
  {sec: 303.58, year: 8},
  {sec: 311.44, year: 9},
  {sec: 342.4, year: 10},
  {sec: 361, year: 11},
  {sec: 391.34, year: 12},
  {sec: 454.4, year: 13},
  {sec: 478.38, year: 14},
  {sec: 489.98, year: 15},
  {sec: 513.28, year: 17},
  {sec: 530.3, year: 18},
  {sec: 554.48, year: 19},
  {sec: 576.4, year: 20},
];

// Score checkpoints: [startSec, endSec, fromS, toS, fromT, toT]
const SCORE_STEPS: Array<[number, number, number, number, number, number]> = [
  [158.04, 161.88, 20, 30, 20, 38],
  [203.9, 208.54, 30, 41, 38, 45],
  [256.66, 260.14, 41, 50, 45, 48],
  [342.4, 345.86, 50, 58, 48, 52],
  [478.38, 483.04, 58, 66, 52, 55],
  [577.02, 581.38, 66, 74, 55, 63],
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

  if (sec >= 667.56 && sec < 713.08) {
    const p = interpolate(sec, [692.62, 697.7], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    s = Math.round(74 + (74 - 74) * p);
    t = Math.round(63 + (71 - 63) * p);
    return {year: 20, s, t, yearLabel: 'EKSPERIMEN BALIK'};
  }

  if (sec >= 713.08 && sec < 753.62) {
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
