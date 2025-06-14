import React, { useEffect } from 'react';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import Animated, {
    useSharedValue,
    useAnimatedProps,
    withTiming,
  } from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line);


export const RpmGauge = ({ rpm }: { rpm: number }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.min(rpm, 8000);
    const angle = (clamped / 8000) * 180 - 90;
    rotation.value = withTiming(angle, { duration: 300 });
  }, [rpm]);

  const animatedProps = useAnimatedProps(() => {
    const rad = (rotation.value * Math.PI) / 180;
    const x = 100 + 60 * Math.cos(rad);
    const y = 100 + 60 * Math.sin(rad);
    return {
      x2: x,
      y2: y,
    };
  });

  return (
    <Svg width={200} height={200}>
      <Circle cx={100} cy={100} r={90} stroke="gray" strokeWidth={10} fill="black" />
      <AnimatedLine
        x1={100}
        y1={100}
        animatedProps={animatedProps}
        stroke="red"
        strokeWidth={4}
      />
      <SvgText x={100} y={190} fill="white" fontSize={16} textAnchor="middle">
        {rpm} RPM
      </SvgText>
    </Svg>
  );
}
