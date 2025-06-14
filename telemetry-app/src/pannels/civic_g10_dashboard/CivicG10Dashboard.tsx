// src/components/RpmDashboard.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Path, Defs, LinearGradient, Stop, RadialGradient, Ellipse, Mask, Rect } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line);

function RpmGauge({ rpm, speed }: { rpm: number; speed: number }) {
  const rotation = useSharedValue(-180);

  useEffect(() => {
    const clamped = Math.min(speed, 250);
    const angle = (clamped / 250) * 180 - 180;
    rotation.value = withTiming(angle, { duration: 300 });
  }, [speed]);

  const animatedProps = useAnimatedProps(() => {
    const rad = (rotation.value * Math.PI) / 180;
    const extendedLength = 125; // extend 20 beyond the radius
    const x = 140 + extendedLength * Math.cos(rad);
    const y = 140 + extendedLength * Math.sin(rad);
    return {
      x2: x,
      y2: y,
    };
  });

  const totalSegments = 30;
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

    const color = i < activeSegments ? (i > totalSegments * 0.7 ? 'red' : 'lime') : '#333';
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

  const arcLabels = Array.from({ length: 9 }).map((_, i) => {
    const rpmValue = i * 1000;
    const angle = (-180 + (i * 180) / 8) * (Math.PI / 180);
    const r = 100;
    const x = 140 + r * Math.cos(angle);
    const y = 140 + r * Math.sin(angle);
    return (
      <SvgText
        key={`label-${i}`}
        x={x}
        y={y}
        fill="white"
        fontSize={12}
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {rpmValue / 1000}
      </SvgText>
    );
  });

  const arcBlueRing = (
    <Path
      d={`M${140 - 100},${140} A100,100 0 0 1 ${140 + 100},${140}`}
      stroke="url(#blueRing)"
      strokeWidth={18}
      fill="none"
      strokeLinecap="round"
    />
  );

  const reflectionEffect = (
    <Ellipse
      cx={140}
      cy={100}
      rx={100}
      ry={30}
      fill="url(#reflectionGradient)"
      opacity={0.3}
    />
  );

  return (
    <Svg width={280} height={280}>
      <Defs>
        <LinearGradient id="rpmGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#00FF00" />
          <Stop offset="50%" stopColor="#FFA500" />
          <Stop offset="100%" stopColor="#FF0000" />
        </LinearGradient>
        <LinearGradient id="blueRing" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#00BFFF" stopOpacity="0.8" />
          <Stop offset="100%" stopColor="#008CFF" stopOpacity="0.8" />
        </LinearGradient>
        <RadialGradient id="reflectionGradient" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
        <Mask id="pointerMask">
          <Rect x="0" y="0" width="280" height="280" fill="white" />
          <Circle cx={140} cy={140} r={110} fill="black" />
        </Mask>
      </Defs>
      <Circle cx={140} cy={140} r={120} stroke="#1E1E1E" strokeWidth={14} fill="#000" />
      {reflectionEffect}
      {arcBlueRing}
      {arcSegments}
      {arcLabels}
      <AnimatedLine
        x1={140}
        y1={140}
        animatedProps={animatedProps}
        stroke="#FF3B30"
        strokeWidth={5}
        strokeLinecap="round"
        mask="url(#pointerMask)"
      />
      <SvgText
        x={140}
        y={150}
        fill="white"
        fontSize={32}
        fontWeight="600"
        fontFamily="Helvetica Neue"
        textAnchor="middle"
      >
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
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

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
      opacity: opacity.value,
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
    shadowColor: '#00BFFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
  },
  gearText: {
    color: 'white',
    fontSize: 26,
    fontWeight: 'bold',
    fontFamily: 'Helvetica Neue',
  },
});