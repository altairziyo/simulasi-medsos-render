import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const projectDir = path.resolve(process.cwd());
const outDir = path.resolve(projectDir, '../preview-qc/stills');
fs.mkdirSync(outDir, {recursive: true});

const jobs = [
  ['B01-title', 120], ['B01-chips', 470], ['B01-icons', 600],
  ['B02-board', 850], ['B02-feed', 1100],
  ['B03-mid', 1330], ['B04-stamp', 1680],
  ['B05-lock', 2100], ['B05-panels', 2380],
  ['B06-mid', 2620], ['B07-mid', 2930], ['B08-mid', 3220],
  ['B09-icons', 3520], ['B09-badge', 3680], ['B10-gas', 3820],
  ['B11-viral', 4100], ['B11-dance', 4420],
  ['B12-senja', 4620],
  ['B13-count', 4900], ['B13-verdict', 5060],
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
