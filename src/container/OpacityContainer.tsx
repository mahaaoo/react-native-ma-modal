/**
 * if use this componet wrapper Modal componet
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 * when it mount, will play opacity animation
 */
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
} from 'react';
import { View, TouchableOpacity } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { OpacityContainerRef, OpacityContainerProps } from '../utils/type';
import { styles } from '../utils/styles';
import { useModalAnimated, useModal } from '../utils/hooks';

export const OpacityContainer = forwardRef<
  OpacityContainerRef,
  OpacityContainerProps
>((props, ref) => {
  const { config } = useModalAnimated();
  const {
    children,
    onAppear,
    onDisappear,
    mask = true,
    duration = config.duration,
    modal = false,
    onClickMask,
    pointerEvents = 'auto',
    innerKey,
    containerStyle,
  } = props;
  const { remove, isExist } = useModal();
  const { progress } = useModalAnimated();

  const opacity = useSharedValue(0);

  useEffect(() => {
    mount();
  }, []);

  const mount = useCallback(() => {
    opacity.value = withTiming(
      mask ? config.maskOpacity : 0,
      { duration },
      () => {
        onAppear && runOnJS(onAppear)();
      }
    );
    progress.value = withTiming(1, { duration });
  }, [onAppear]);

  const unMount = useCallback(() => {
    opacity.value = withTiming(0, { duration }, () => {
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
      <View
        style={[styles.container, containerStyle]}
        pointerEvents={'box-none'}
      >
        {children}
      </View>
    </View>
  );
});

OpacityContainer.displayName = 'OpacityContainer';
