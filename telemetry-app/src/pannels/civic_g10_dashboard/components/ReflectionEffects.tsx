import React from 'react';
import { Ellipse } from 'react-native-svg';
import { 
  CENTER_X,
  CENTER_Y,
} from '../../../utils';



  const ReflectionEffect = () => (
    <Ellipse
      cx={CENTER_X}
      cy={CENTER_Y - 70}
      rx={120}
      ry={40}
      fill="url(#reflectionGradient)"
      opacity={0.3}
    />
);

export default ReflectionEffect;