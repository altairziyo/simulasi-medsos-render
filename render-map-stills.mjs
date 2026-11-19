import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const projectDir = path.resolve(process.cwd());
const outDir = path.resolve(projectDir, '../preview-qc/stills');
fs.mkdirSync(outDir, {recursive: true});

const jobs = [
  ['map-modern-1', 1330],
  ['map-modern-2', 470],
  ['map-qc-b11', 4420],
  ['map-qc-b12', 4620],
];

console.log('bundling...');
const serveUrl = await bundle({entryPoint: path.join(projectDir, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Full'});
console.log('composition ok:', composition.id, composition.durationInFrames);

for (const [name, frame] of jobs) {
  const output = path.join(outDir, `${name}.png`);
  await renderStill({composition, serveUrl, frame, output});
  console.log('rendered', name, frame);
}
console.log('DONE');
