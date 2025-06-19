import React from 'react';
import  { Line, Path } from 'react-native-svg';
import { 
  CENTER_X,
  CENTER_Y,
  BLUE_RING_RADIUS
} from '../../../utils';



const ArcBlueBackground = () => (
  <Path
    d={`M${CENTER_X - BLUE_RING_RADIUS - 10},${CENTER_Y} A${BLUE_RING_RADIUS + 10},${BLUE_RING_RADIUS + 10} 0 0 1 ${CENTER_X + BLUE_RING_RADIUS + 10},${CENTER_Y}`}
    stroke="url(#ringBg)"
    strokeWidth={40}
    fill="none"
  />
);

const ArcBlueRing = () => (
  <>
    <ArcBlueBackground/>
    <Path
      d={`M${CENTER_X - BLUE_RING_RADIUS},${CENTER_Y} A${BLUE_RING_RADIUS},${BLUE_RING_RADIUS} 0 0 1 ${CENTER_X + BLUE_RING_RADIUS},${CENTER_Y}`}
      stroke="url(#blueRing)"
      strokeWidth={20}
      fill="none"
      strokeLinecap="round"
    />
    {Array.from({ length: 81 }).map((_, i) => {
      const angle = (-180 + i * (180 / 80)) * (Math.PI / 180);
      const inner = BLUE_RING_RADIUS + 10;
      const outer = BLUE_RING_RADIUS + 14;
      const x1 = CENTER_X + inner * Math.cos(angle);
      const y1 = CENTER_Y + inner * Math.sin(angle);
      const x2 = CENTER_X + outer * Math.cos(angle);
      const y2 = CENTER_Y + outer * Math.sin(angle);
      const isRed = i >= 65;
      return (
        <Line
          key={`tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isRed ? '#8B0000' : 'white'}
          strokeWidth={1}
          strokeOpacity={0.9}
        />
      );
    })}
    {Array.from({ length: 9 }).map((_, i) => {
      const angle = (-180 + (i * 180) / 8) * (Math.PI / 180);
      const inner = BLUE_RING_RADIUS + 10;
      const outer = BLUE_RING_RADIUS + 22;
      const x1 = CENTER_X + inner * Math.cos(angle);
      const y1 = CENTER_Y + inner * Math.sin(angle);
      const x2 = CENTER_X + outer * Math.cos(angle);
      const y2 = CENTER_Y + outer * Math.sin(angle);
      const isRed = i >= 7;
      return (
        <Line
          key={`major-tick-${i}`}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={isRed ? '#8B0000' : 'white'}
          strokeWidth={2}
          strokeOpacity={0.95}
        />
      );
    })}
  </>
);

export default ArcBlueRing;