import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const projectDir = path.resolve(process.cwd());
const serveUrl = await bundle({entryPoint: path.join(projectDir, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Full'});
await renderMedia({
  composition, serveUrl, codec: 'h264',
  outputLocation: path.resolve(projectDir, '../preview-render/test-b01.mp4'),
  frameRange: [0, 678], concurrency: 1,
});
console.log('DONE');
