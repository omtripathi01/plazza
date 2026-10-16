// Responsive helpers. Scales sizes from a 375 dp baseline, clamped so tablets don't get huge text.
import {Dimensions, PixelRatio} from 'react-native';

const BASE_WIDTH = 375;

export function scale(size) {
  const {width, height} = Dimensions.get('window');
  const shortest = Math.min(width, height);
  const factor = Math.min(Math.max(shortest / BASE_WIDTH, 0.85), 1.25);
  return Math.round(PixelRatio.roundToNearestPixel(size * factor));
}

// Hook-free check used by layouts that need a landscape variant.
export function isLandscape() {
  const {width, height} = Dimensions.get('window');
  return width > height;
}
