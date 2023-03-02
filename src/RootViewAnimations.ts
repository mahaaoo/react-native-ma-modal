import { Dimensions, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  AnimateStyle,
  AnimatableValue,
} from 'react-native-reanimated';
const { height } = Dimensions.get('window');

const addDeg = (deg: number): string => {
  'worklet';
  return `${deg}deg`;
};

export const scaleAnimation = (
  progress: Animated.SharedValue<number>
): AnimateStyle<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  return {
    transform: [
      {
        scale: interpolate(
          progress.value,
          [0, 1],
          [1, 0.94],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export const translateXAnimation = (
  progress: Animated.SharedValue<number>,
  targetValue: Animated.SharedValue<number>
): AnimateStyle<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  return {
    transform: [
      {
        translateX: interpolate(
          progress.value,
          [0, 1],
          [0, targetValue.value],
          Extrapolate.CLAMP
        ),
      },
    ],
  };
};

export const rotateXAnimation = (
  progress: Animated.SharedValue<number>
): AnimateStyle<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  return {
    transform: [
      {
        perspective: 600,
      },
      {
        translateY: height / 2,
      },
      {
        rotateX: addDeg(
          interpolate(progress.value, [0, 0.5], [0, 4], Extrapolate.CLAMP)
        ),
      },
      {
        translateY: -height,
      },
      {
        rotateX: addDeg(
          interpolate(progress.value, [0.5, 1], [0, -4], Extrapolate.CLAMP)
        ),
      },
      {
        translateY: height / 2,
      },
    ],
  };
};

export const borderRadiusAnimation = (
  progress: Animated.SharedValue<number>
): AnimateStyle<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  return {
    overflow: 'hidden',
    borderRadius: interpolate(
      progress.value,
      [0, 1],
      [0, 20],
      Extrapolate.CLAMP
    ),
  };
};

export type RootAnimationType =
  | 'null'
  | 'translateX'
  | 'scale'
  | 'rotateX'
  | 'borderRadius';

const TypeToAnimation: {
  [key in RootAnimationType]: (
    progress: Animated.SharedValue<number>,
    targetValue: Animated.SharedValue<number>
  ) => AnimateStyle<ViewStyle | ImageStyle | TextStyle>;
} = {
  'null': () => {
    'worklet';
    return {};
  },
  'scale': (progress: Animated.SharedValue<number>) => {
    'worklet';
    return scaleAnimation(progress);
  },
  'translateX': (
    progress: Animated.SharedValue<number>,
    targetValue: Animated.SharedValue<number>
  ) => {
    'worklet';
    return translateXAnimation(progress, targetValue);
  },
  'rotateX': (progress: Animated.SharedValue<number>) => {
    'worklet';
    return rotateXAnimation(progress);
  },
  'borderRadius': (progress: Animated.SharedValue<number>) => {
    'worklet';
    return borderRadiusAnimation(progress);
  },
};

export const configAnimation = (
  mainViewAnimation: Animated.SharedValue<
    RootAnimationType | Array<RootAnimationType>
  >,
  progress: Animated.SharedValue<number>,
  targetValue: Animated.SharedValue<number>
): AnimateStyle<ViewStyle | ImageStyle | TextStyle> => {
  'worklet';
  let style: AnimateStyle<ViewStyle | ImageStyle | TextStyle> = {
    transform: [],
  };
  const type = mainViewAnimation.value;
  if (Array.isArray(type)) {
    if (type.length > 1) {
      type.forEach((t) => {
        const animation = TypeToAnimation[t];
        const _style = animation(progress, targetValue) || {};
        if (_style.transform) {
          style.transform = style.transform
            ? style.transform.concat(_style.transform)
            : _style.transform;
        }
        style = Object.assign(_style, style);
      });
    } else {
      const animation = TypeToAnimation[type[0]];
      style = animation(progress, targetValue);
    }
  } else {
    const animation = TypeToAnimation[type];
    style = animation(progress, targetValue);
  }

  return style;
};
