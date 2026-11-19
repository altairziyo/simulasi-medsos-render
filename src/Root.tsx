import './index.css';
import {Composition} from 'remotion';
import {DemoVideo} from './DemoVideo';
import {FullVideo} from './FullVideo';
import {MedsosVideo} from './MedsosVideo';
import {FPS, TOTAL_FRAMES} from './demoPlan';
import {FULL_TOTAL_FRAMES} from './fullPlan';
import {MEDSOS_TOTAL_FRAMES} from './medsosPlan';
import {W, H} from './lib/tokens';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Full"
      component={MedsosVideo}
      durationInFrames={MEDSOS_TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="PemimpinFull"
      component={FullVideo}
      durationInFrames={FULL_TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
    <Composition
      id="Demo"
      component={DemoVideo}
      durationInFrames={TOTAL_FRAMES}
      fps={FPS}
      width={W}
      height={H}
    />
  </>
);
