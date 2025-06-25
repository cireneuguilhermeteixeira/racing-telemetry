import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { 
  MAX_RPM_VALUE,
} from '../../utils';
import RpmGauge from './components/RPMGauce';
import GearDisplay from './components/GearDisplay';
import { useWebsocket } from '../../contexts/WebsocketContext';



export default function RpmDashboard() {
  const { rpm, speed, gear } = useWebsocket();

  const bgColor = useSharedValue('#111');
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
  }, []);

  useEffect(() => {
    bgColor.value = withTiming(rpm > 7000 ? '#330000' : '#111', { duration: 300 });
  }, [rpm]);

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
});