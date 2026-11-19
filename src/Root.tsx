import React from 'react';
import { Composition } from 'remotion';
import { Full } from './Full';
import { H, W } from './common';

export const Root: React.FC = () => {
  return (
    <Composition
      id="Full"
      component={Full}
      durationInFrames={23675}
      fps={30}
      width={W}
      height={H}
    />
  );
};
