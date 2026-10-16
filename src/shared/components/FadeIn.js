// Fades and slides children up when they mount (Reanimated entering animation). Used for list rows.
import React from 'react';
import Animated, {
  FadeInUp,
  FadeOutLeft,
  LinearTransition,
} from 'react-native-reanimated';

export default function FadeIn({children, delay = 0, style}) {
  return (
    <Animated.View
      entering={FadeInUp.duration(320).delay(delay)}
      exiting={FadeOutLeft.duration(200)}
      layout={LinearTransition.duration(200)}
      style={style}>
      {children}
    </Animated.View>
  );
}
