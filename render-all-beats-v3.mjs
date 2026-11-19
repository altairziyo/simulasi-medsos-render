import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const projectDir = path.resolve(process.cwd());
const outDir = path.resolve(projectDir, '../preview-render2');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(projectDir, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Full'});
console.log('composition ok:', composition.id, composition.durationInFrames);

const chunks = [
  {name: 'beat-b01', range: [0, 678]},
  {name: 'beat-b02', range: [679, 1196]},
  {name: 'beat-b03', range: [1197, 1540]},
  {name: 'beat-b04', range: [1541, 1773]},
  {name: 'beat-b05', range: [1774, 2498]},
  {name: 'beat-b06', range: [2499, 2766]},
  {name: 'beat-b07', range: [2767, 3081]},
  {name: 'beat-b08', range: [3082, 3365]},
  {name: 'beat-b09', range: [3366, 3733]},
  {name: 'beat-b10', range: [3734, 3877]},
  {name: 'beat-b11', range: [3878, 4392]},
  {name: 'beat-b12', range: [4393, 4760]},
  {name: 'beat-b13', range: [4761, 5128]},
];
for (const c of chunks) {
  const output = path.join(outDir, `${c.name}.mp4`);
  if (fs.existsSync(output)) { console.log('skip existing', c.name); continue; }
  await renderMedia({
    composition, serveUrl, codec: 'h264', outputLocation: output,
    frameRange: c.range, concurrency: 1,
  });
  console.log('rendered', c.name, c.range);
}
console.log('DONE');
