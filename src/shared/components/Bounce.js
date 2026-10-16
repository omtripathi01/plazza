// Plays a quick scale "pop" whenever `trigger` changes (e.g. coupon applied). Reanimated shared value.
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';

export default function Bounce({trigger, children, style}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withSequence(
      withSpring(1.12, {damping: 6}),
      withSpring(1, {damping: 8}),
    );
  }, [trigger, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{scale: scale.value}],
  }));

  return (
    <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>
  );
}
