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
import { ScaleContainerRef, ScaleContainerProps } from './type';
import { useModalAnimated, useModal } from './hooks';
import { styles } from './styles';

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
  } = props;
  const { remove, isExist } = useModal();
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.5);

  useEffect(() => {
    mount();
  }, []);

  const mount = useCallback(() => {
    opacity.value = withTiming(mask ? config.maskOpacity : 0, { duration });
    scale.value = withTiming(1, { duration }, () => {
      onAppear && runOnJS(onAppear)();
    });
  }, [onAppear]);

  const unMount = useCallback(() => {
    opacity.value = withTiming(0, { duration });
    scale.value = withTiming(0.5, { duration }, () => {
      onDisappear && runOnJS(onDisappear)();
    });
  }, [onDisappear]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: config.maskColor,
      opacity: opacity.value,
    };
  });

  const scaleStyle = useAnimatedStyle(() => {
    return {
      opacity: interpolate(scale.value, [0.5, 1], [0, 1], Extrapolate.CLAMP),
      transform: [
        {
          scale: scale.value,
        },
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
        {children}
      </Animated.View>
    </View>
  );
});

ScaleContainer.displayName = 'ScaleContainer';
