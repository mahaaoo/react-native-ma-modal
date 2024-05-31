import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import {
  ScaleContainerRef,
  ScaleContainerProps,
  ScaleAnchorType,
} from '../utils/type';
import { useModalAnimated, useModal } from '../utils/hooks';
import { styles } from '../utils/styles';

const getAnchor = (anchor: ScaleAnchorType) => {
  'worklet';
  const typeObjc = {
    'center': [0, 0],
    'left': [-1, 0],
    'right': [1, 0],
    'top': [0, 1],
    'bottom': [0, -1],
    'left-top': [-1, 1],
    'left-bottom': [-1, -1],
    'right-top': [1, 1],
    'right-bottom': [1, -1],
  };

  const acchorPoint = typeObjc[anchor];

  return {
    h_dirction: acchorPoint[0],
    v_dirction: acchorPoint[1],
  };
};

export const ScaleContainer = forwardRef<
  ScaleContainerRef,
  ScaleContainerProps
>((props, ref) => {
  const { config } = useModalAnimated();

  const {
    children,
    onClickMask,
    pointerEvents = 'auto',
    mask = true,
    duration = config.duration,
    onAppear,
    onDisappear,
    modal = false,
    innerKey,
    containerStyle,
    offsetX = 0,
    offsetY = 0,
    anchor = 'center',
  } = props;
  const { remove, isExist } = useModal();
  const { progress } = useModalAnimated();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);
  const width = useSharedValue(0);
  const height = useSharedValue(0);

  useEffect(() => {
    mount();
  }, []);

  const mount = useCallback(() => {
    opacity.value = withTiming(mask ? config.maskOpacity : 0, { duration });
    scale.value = withTiming(1, { duration }, () => {
      onAppear && runOnJS(onAppear)();
    });
    progress.value = withTiming(1, { duration });
  }, [onAppear]);

  const unMount = useCallback(() => {
    opacity.value = withTiming(0, { duration });
    scale.value = withTiming(0.5, { duration }, () => {
      onDisappear && runOnJS(onDisappear)();
    });
    progress.value = withTiming(0, { duration });
  }, [onDisappear]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: config.maskColor,
      opacity: opacity.value,
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    const { h_dirction, v_dirction } = getAnchor(anchor);

    return {
      opacity: interpolate(scale.value, [0.5, 1], [0, 1], Extrapolate.CLAMP),
      transform: [
        { translateX: (h_dirction * width.value) / 2 + offsetX },
        { translateY: (-v_dirction * height.value) / 2 + offsetY },
        {
          scale: scale.value,
        },
        { translateX: (-h_dirction * width.value) / 2 },
        { translateY: (v_dirction * height.value) / 2 },
      ],
    };
  });

  const handleClickMask = useCallback(() => {
    if (pointerEvents === 'none') return;
    if (!modal && pointerEvents === 'auto') {
      if (isExist(innerKey || '')) {
        remove(innerKey);
      }
    }
    onClickMask && onClickMask();
  }, []);

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width: w, height: h },
      },
    }) => {
      width.value = w;
      height.value = h;
    },
    []
  );

  useImperativeHandle(
    ref,
    () => ({
      mount,
      unMount,
    }),
    []
  );

  return (
    <View style={styles.absoluteFill}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.absoluteFill}
        onPress={handleClickMask}
      >
        <Animated.View
          pointerEvents={pointerEvents}
          style={[styles.absoluteFill, animationStyle]}
        />
      </TouchableOpacity>
      <Animated.View
        style={[styles.scaleContainer, scaleStyle]}
        pointerEvents={'box-none'}
      >
        <View style={containerStyle} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
});

ScaleContainer.displayName = 'ScaleContainer';
