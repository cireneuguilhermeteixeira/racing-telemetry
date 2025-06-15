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

// Global configuration
const CENTER_X = 200;
const CENTER_Y = 200;
const RADIUS = 160;
const EXTENDED_LENGTH = 165;
const BLUE_RING_RADIUS = 130;
const LABEL_RADIUS = 130;
const ARC_RADIUS = 160;
const SPEED_TEXT_Y = 190;
const MAX_RPM_VALUE = 8000;

function RpmGauge({ rpm, speed }: { rpm: number; speed: number }) {
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

  const totalSegments = 30;
  const activeSegments = Math.round((rpm / MAX_RPM_VALUE) * totalSegments);

  const arcSegments = Array.from({ length: totalSegments }).map((_, i) => {
    const angleStep = 180 / totalSegments;
    const startAngle = -180 + i * angleStep;
    const endAngle = startAngle + angleStep;
    const r = ARC_RADIUS;
    const x1 = CENTER_X + r * Math.cos((Math.PI * startAngle) / 180);
    const y1 = CENTER_Y + r * Math.sin((Math.PI * startAngle) / 180);
    const x2 = CENTER_X + r * Math.cos((Math.PI * endAngle) / 180);
    const y2 = CENTER_Y + r * Math.sin((Math.PI * endAngle) / 180);

    let color = '#222';
    if (i < activeSegments) {
      const ratio = i / totalSegments;
      if (ratio > 0.9) {
        color = '#a30000';
      } else if (ratio > 0.8) {
        color = '#8B0000';
      } else if (ratio > 0.6) {
        color = '#003E7E';
      } else if (ratio > 0.4) {
        color = '#0050A0';
      } else if (ratio > 0.2) {
        color = '#0066CC';
      } else {
        color = '#003366';
      }
    }

    return (
      <Path
        key={i}
        d={`M${x1},${y1} L${x2},${y2}`}
        stroke={color}
        strokeWidth={6}
        fill="none"
      />
    );
  });

  const arcLabels = Array.from({ length: 9 }).flatMap((_, i) => {
    const rpmValue = i * 1000;
    const angle = (-180 + (i * 180) / 8) * (Math.PI / 180);
    const r = LABEL_RADIUS;
    const x = CENTER_X + r * Math.cos(angle);
    const y = CENTER_Y + r * Math.sin(angle);

    const elements = [
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
    ];

    if (i === 4) {
      elements.push(
        <SvgText
          key="label-unit"
          x={x}
          y={y + 20}
          fill="white"
          fontSize={10}
          fontWeight="normal"
          textAnchor="middle"
          alignmentBaseline="hanging"
        >
          x1000r/min
        </SvgText>
      );
    }

    return elements;
  });

  const arcBlueBackground = (
    <Path
      d={`M${CENTER_X - BLUE_RING_RADIUS - 10},${CENTER_Y} A${BLUE_RING_RADIUS + 10},${BLUE_RING_RADIUS + 10} 0 0 1 ${CENTER_X + BLUE_RING_RADIUS + 10},${CENTER_Y}`}
      stroke="url(#ringBg)"
      strokeWidth={40}
      fill="none"
    />
  );

  const arcBlueRing = (
    <>
      {arcBlueBackground}
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
        const isRed = i >= 70;
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

  const reflectionEffect = (
    <Ellipse
      cx={CENTER_X}
      cy={CENTER_Y - 70}
      rx={120}
      ry={40}
      fill="url(#reflectionGradient)"
      opacity={0.3}
    />
  );

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
      {reflectionEffect}
      {arcBlueRing}
      {arcSegments}
      {arcLabels}
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
      const simulatedRpm = Math.floor(Math.random() * MAX_RPM_VALUE);
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
    paddingTop: 20,
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