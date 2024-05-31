import { Dimensions, ImageStyle, TextStyle, ViewStyle } from 'react-native';
import {
  Extrapolate,
  interpolate,
  AnimateStyle,
  SharedValue,
} from 'react-native-reanimated';
import { mergeStyle } from './util';
const { height } = Dimensions.get('window');

const addDeg = (deg: number): string => {
  'worklet';
  return `${deg}deg`;
};

export const scaleAnimation = (
  progress: SharedValue<number>
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
  progress: SharedValue<number>,
  targetValue: SharedValue<number>
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
  progress: SharedValue<number>
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
  progress: SharedValue<number>
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
    progress: SharedValue<number>,
    targetValue: SharedValue<number>
  ) => AnimateStyle<ViewStyle | ImageStyle | TextStyle>;
} = {
  'null': () => {
    'worklet';
    return {};
  },
  'scale': (progress: SharedValue<number>) => {
    'worklet';
    return scaleAnimation(progress);
  },
  'translateX': (
    progress: SharedValue<number>,
    targetValue: SharedValue<number>
  ) => {
    'worklet';
    return translateXAnimation(progress, targetValue);
  },
  'rotateX': (progress: SharedValue<number>) => {
    'worklet';
    return rotateXAnimation(progress);
  },
  'borderRadius': (progress: SharedValue<number>) => {
    'worklet';
    return borderRadiusAnimation(progress);
  },
};

export const configAnimation = (
  mainViewAnimation: SharedValue<RootAnimationType | Array<RootAnimationType>>,
  progress: SharedValue<number>,
  targetValue: SharedValue<number>
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
        style = mergeStyle(style, _style);
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
