import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { RpmGauge } from './components/RpmGauge';
import { SpeedDisplay } from './components/SpeedDisplay';
import { GearDisplay } from './components/GearDisplay';
import { RpmBar } from './components/RpmBar';




export default function BasicRpmDashboard() {
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
});