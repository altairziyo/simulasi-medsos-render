import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';
import fs from 'node:fs';

const projectDir = path.resolve(process.cwd());
const outDir = path.resolve(projectDir, '../preview-render');
fs.mkdirSync(outDir, {recursive: true});

const serveUrl = await bundle({entryPoint: path.join(projectDir, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Full'});
console.log('composition ok:', composition.id, composition.durationInFrames);

const chunks = [
  {name: 'chunk1-blok01', range: [0, 1773]},
  {name: 'chunk2-blok02', range: [1774, 3877]},
  {name: 'chunk3-blok03', range: [3878, 5128]},
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
