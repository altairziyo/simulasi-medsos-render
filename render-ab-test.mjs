import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const projectDir = path.resolve(process.cwd());
const serveUrl = await bundle({entryPoint: path.join(projectDir, 'src/index.ts')});

for (const [id, name, range] of [['PemimpinFull', 'ab-pemimpin', [0, 59]], ['Full', 'ab-medsos', [0, 59]]]) {
  const composition = await selectComposition({serveUrl, id});
  const t0 = Date.now();
  await renderMedia({
    composition, serveUrl, codec: 'h264',
    outputLocation: path.resolve(projectDir, `../preview-render/${name}.mp4`),
    frameRange: range, concurrency: 1,
  });
  console.log(name, 'done in', ((Date.now() - t0) / 1000).toFixed(1), 's');
}
console.log('DONE');
