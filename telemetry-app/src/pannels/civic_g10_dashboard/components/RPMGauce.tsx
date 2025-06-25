import React, { useEffect } from 'react';
import Svg, { Circle, Line, Text as SvgText, Defs, LinearGradient, Stop, RadialGradient, Mask, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import { 
  CENTER_X,
  CENTER_Y,
  EXTENDED_LENGTH,
  MAX_RPM_VALUE,
  RADIUS,
  SPEED_TEXT_Y
} from '../../../utils';

import ArcBlueRing from '../components/ArcBlueRing';
import ReflectionEffect from '../components/ReflectionEffects';
import ArcSegmentsAndLabels from '../components/ArcSegmentsAndLabels';

const AnimatedLine = Animated.createAnimatedComponent(Line);





const RpmGauge = ({ rpm, speed }: { rpm: number; speed: number }) => {
  const rotation = useSharedValue(-180);

  useEffect(() => {
    const clamped = Math.min(rpm, MAX_RPM_VALUE);
    const angle = (clamped / MAX_RPM_VALUE) * 180 - 180;
    rotation.value = withTiming(angle, { duration: 300 });
  }, [rpm]);

  const animatedProps = useAnimatedProps(() => {
    const rad = (rotation.value * Math.PI) / 180;
    const x = CENTER_X + EXTENDED_LENGTH * Math.cos(rad);
    const y = CENTER_Y + EXTENDED_LENGTH * Math.sin(rad);
    return {
      x2: x,
      y2: y,
    };
  });

  return (
    <Svg width={CENTER_X * 2} height={CENTER_Y * 1.2}>
      <Defs>
        <LinearGradient id="blueRing" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#00BFFF" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#008CFF" stopOpacity="0.8" />
        </LinearGradient>
        <LinearGradient id="ringBg" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="40%" stopColor="#EEEEE" stopOpacity="0.25" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.5" />
        </LinearGradient>
        <RadialGradient id="reflectionGradient" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        <Mask id="pointerMask">
          <Rect x="0" y="0" width={CENTER_X * 2} height={CENTER_Y * 1.2} fill="white" />
          <Circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS - 40} fill="black" />
        </Mask>
      </Defs>
      <Circle cx={CENTER_X} cy={CENTER_Y} r={RADIUS} stroke="#1E1E1E" strokeWidth={14} fill="#000" />
      <ReflectionEffect/>
      <ArcBlueRing/>
      <ArcSegmentsAndLabels rpm={rpm}/>
      <AnimatedLine
        x1={CENTER_X}
        y1={CENTER_Y}
        animatedProps={animatedProps}
        stroke="#FF3B30"
        strokeWidth={5}
        strokeLinecap="round"
        mask="url(#pointerMask)"
      />
      <SvgText
        x={CENTER_X}
        y={SPEED_TEXT_Y - 50}
        fill="white"
        fontSize={32}
        fontWeight="600"
        fontFamily="Helvetica Neue"
        textAnchor="middle"
      >
        {speed}
      </SvgText>
      <SvgText
        x={CENTER_X + 26}
        y={SPEED_TEXT_Y - 56}
        fill="white"
        fontSize={10}
        fontWeight="normal"
        fontFamily="Helvetica Neue"
        textAnchor="start"
      >
        km/h
      </SvgText>
      <SvgText x={CENTER_X - 100} y={CENTER_Y} fill="white" fontSize={12} fontFamily="Helvetica Neue"> 25.3 ºC</SvgText>
      <SvgText x={CENTER_X} y={CENTER_Y} fill="white" fontSize={12} fontFamily="Helvetica Neue" textAnchor="middle">87.211 km</SvgText>
      <SvgText x={CENTER_X + 100} y={CENTER_Y} fill="white" fontSize={12} fontFamily="Helvetica Neue" textAnchor="end">13:42</SvgText>
    </Svg>
  );
}

export default RpmGauge;