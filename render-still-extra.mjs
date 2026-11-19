import {bundle} from '@remotion/bundler';
import {renderStill, selectComposition} from '@remotion/renderer';
import path from 'node:path';

const projectDir = path.resolve(process.cwd());
const serveUrl = await bundle({entryPoint: path.join(projectDir, 'src/index.ts')});
const composition = await selectComposition({serveUrl, id: 'Full'});
await renderStill({composition, serveUrl, frame: 4350, output: path.resolve(projectDir, '../preview-qc/stills/B11-nadia-dance.png')});
console.log('DONE');
