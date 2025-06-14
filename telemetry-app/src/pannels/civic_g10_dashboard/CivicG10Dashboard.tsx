// src/components/RpmDashboard.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line);

function RpmGauge({ rpm, speed }: { rpm: number; speed: number }) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    const clamped = Math.min(speed, 250);
    const angle = (clamped / 250) * 180 - 180;
    rotation.value = withTiming(angle, { duration: 300 });
  }, [speed]);

  const animatedProps = useAnimatedProps(() => {
    const rad = (rotation.value * Math.PI) / 180;
    const x = 140 + 100 * Math.cos(rad);
    const y = 140 + 100 * Math.sin(rad);
    return {
      x2: x,
      y2: y,
    };
  });

  const totalSegments = 10;
  const activeSegments = Math.round((rpm / 8000) * totalSegments);

  const arcSegments = Array.from({ length: totalSegments }).map((_, i) => {
    const angleStep = 180 / totalSegments;
    const startAngle = -180 + i * angleStep;
    const endAngle = startAngle + angleStep;
    const largeArc = angleStep > 180 ? 1 : 0;
    const r = 120;
    const x1 = 140 + r * Math.cos((Math.PI * startAngle) / 180);
    const y1 = 140 + r * Math.sin((Math.PI * startAngle) / 180);
    const x2 = 140 + r * Math.cos((Math.PI * endAngle) / 180);
    const y2 = 140 + r * Math.sin((Math.PI * endAngle) / 180);
    const color = i < activeSegments ? (i > 7 ? 'red' : 'lime') : '#333';
    return (
      <Path
        key={i}
        d={`M${x1},${y1} A${r},${r} 0 ${largeArc} 1 ${x2},${y2}`}
        stroke={color}
        strokeWidth={6}
        fill="none"
      />
    );
  });

  return (
    <Svg width={280} height={280}>
      <Circle cx={140} cy={140} r={120} stroke="gray" strokeWidth={14} fill="black" />
      {arcSegments}
      <AnimatedLine
        x1={140}
        y1={140}
        animatedProps={animatedProps}
        stroke="red"
        strokeWidth={4}
      />
      <SvgText x={140} y={150} fill="white" fontSize={28} textAnchor="middle">
        {speed} km/h
      </SvgText>
    </Svg>
  );
}

function GearDisplay({ gear }: { gear: number }) {
  return (
    <View style={styles.gearBox}>
      <Text style={styles.gearText}>⚙️ {gear === 0 ? 'N' : gear}</Text>
    </View>
  );
}

export default function RpmDashboard() {
  const [rpm, setRpm] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [gear, setGear] = useState(1);

  const bgColor = useSharedValue('#111');

  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedRpm = Math.floor(Math.random() * 8000);
      const simulatedSpeed = Math.floor(Math.random() * 250);
      const simulatedGear = Math.floor(Math.random() * 6);
      setRpm(simulatedRpm);
      setSpeed(simulatedSpeed);
      setGear(simulatedGear);
      bgColor.value = withTiming(simulatedRpm > 7000 ? '#330000' : '#111', { duration: 300 });
    }, 800);
    return () => clearInterval(interval);
  }, []);

  const animatedBg = useAnimatedStyle(() => {
    return {
      backgroundColor: bgColor.value,
    };
  });

  return (
    <Animated.View style={[styles.container, animatedBg]}>
      <RpmGauge rpm={rpm} speed={speed} />
      <GearDisplay gear={gear} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  gearBox: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#222',
    borderRadius: 10,
  },
  gearText: {
    color: 'white',
    fontSize: 24,
  },
});
