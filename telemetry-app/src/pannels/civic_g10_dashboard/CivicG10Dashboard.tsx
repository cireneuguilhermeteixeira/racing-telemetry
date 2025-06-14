// src/components/RpmDashboard.tsx
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Circle, Line, Rect, Text as SvgText } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

const AnimatedLine = Animated.createAnimatedComponent(Line);
const AnimatedRect = Animated.createAnimatedComponent(Rect);

function RpmGauge({ rpm }: { rpm: number }) {
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

function GearDisplay({ gear }: { gear: number }) {
  return (
    <View style={styles.gearBox}>
      <Text style={styles.gearText}>⚙️ {gear === 0 ? 'N' : gear}</Text>
    </View>
  );
}

function SpeedDisplay({ speed }: { speed: number }) {
  return (
    <View style={styles.speedBox}>
      <Text style={styles.speedText}>{speed} km/h</Text>
    </View>
  );
}

function RpmBar({ rpm }: { rpm: number }) {
  const totalBlocks = 10;
  const activeBlocks = Math.round((rpm / 8000) * totalBlocks);
  return (
    <View style={styles.rpmBar}>
      {Array.from({ length: totalBlocks }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.rpmBlock,
            {
              backgroundColor: i < activeBlocks ? (i > 7 ? 'red' : 'lime') : '#444',
            },
          ]}
        />
      ))}
    </View>
  );
}

export default function CivicG10Dashboard() {
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
      <RpmGauge rpm={rpm} />
      <SpeedDisplay speed={speed} />
      <GearDisplay gear={gear} />
      <RpmBar rpm={rpm} />
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
    color: 'blue',
    fontSize: 24,
  },
  speedBox: {
    marginTop: 20,
  },
  speedText: {
    fontSize: 32,
    color: 'white',
    fontWeight: 'bold',
  },
  rpmBar: {
    flexDirection: 'row',
    marginTop: 30,
  },
  rpmBlock: {
    width: 20,
    height: 20,
    margin: 2,
    borderRadius: 4,
  },
});