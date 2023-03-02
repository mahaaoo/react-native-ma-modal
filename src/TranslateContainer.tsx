/**
 * if use this componet wrapper Modal componet
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 * when it mount, will play translate animation
 * when it unmount, will play translate animation reversedly
 */
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import { Dimensions, View, TouchableWithoutFeedback } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolate,
  interpolate,
  runOnJS,
  runOnUI,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { clamp, snapPoint } from './utils';
import { TranslateContainerRef, TranslateContainerProps } from './type';
import { useModalAnimated, useModal } from './hooks';
import { styles } from './styles';

const { width, height } = Dimensions.get('window');

export const TranslateContainer = forwardRef<
  TranslateContainerRef,
  TranslateContainerProps
>((props, ref) => {
  const { progress, targetValue, config } = useModalAnimated();
  const {
    from = 'bottom',
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
    gesture = false,
  } = props;
  const { remove, isExist } = useModal();
  const translateY = useSharedValue(0);
  const translateX = useSharedValue(0);
  const opacity = useSharedValue(0);
  const offset = useSharedValue(0);

  const snapPoints1 = useSharedValue<number>(0);
  const snapPoints2 = useSharedValue<number>(0);

  useAnimatedReaction(
    () => translateY.value || translateX.value,
    (value) => {
      progress.value = interpolate(
        value,
        [0, targetValue.value],
        [0, 1],
        Extrapolate.CLAMP
      );
    }
  );

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { height: h, width: w },
      },
    }) => {
      switch (true) {
        case from === 'bottom': {
          snapPoints1.value = -h;
          snapPoints2.value = 0;
          break;
        }
        case from === 'top': {
          snapPoints1.value = 0;
          snapPoints2.value = h;
          break;
        }
        case from === 'left': {
          snapPoints1.value = 0;
          snapPoints2.value = w;
          break;
        }
        case from === 'right': {
          snapPoints1.value = -w;
          snapPoints2.value = 0;
          break;
        }
      }
      runOnUI(mount)(w, h);
    },
    []
  );

  /**
   * After Component has created by Modal, this funtion will move the component to destination
   * Just a animation not created
   */
  const mount = useCallback(
    (width: number, height: number) => {
      'worklet';
      switch (true) {
        case from === 'bottom': {
          targetValue.value = -height;
          break;
        }
        case from === 'top': {
          targetValue.value = height;
          break;
        }
        case from === 'left': {
          targetValue.value = width;
          break;
        }
        case from === 'right': {
          targetValue.value = -width;
          break;
        }
      }

      opacity.value = withTiming(mask ? config.maskOpacity : 0, { duration });
      if (from === 'bottom' || from === 'top') {
        translateY.value = withTiming(targetValue.value, { duration }, () => {
          onAppear && runOnJS(onAppear)();
        });
      } else {
        translateX.value = withTiming(targetValue.value, { duration }, () => {
          onAppear && runOnJS(onAppear)();
        });
      }
    },
    [onAppear]
  );

  /**
   * Before the Component be removed, the function move the component out of the window
   * Just a animation not remove actually
   */
  const unMount = useCallback(() => {
    opacity.value = withTiming(0, { duration });
    if (from === 'bottom' || from === 'top') {
      translateY.value = withTiming(0, { duration }, () => {
        onDisappear && runOnJS(onDisappear)();
      });
    } else {
      translateX.value = withTiming(0, { duration }, () => {
        onDisappear && runOnJS(onDisappear)();
      });
    }
  }, [onDisappear]);

  const animationStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: translateX.value,
        },
        {
          translateY: translateY.value,
        },
      ],
    };
  });

  const maskAnimationStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      backgroundColor: config.maskColor,
    };
  });

  // initial position outof window, this is animation origin point
  const initialPosition = useMemo(() => {
    switch (true) {
      case from === 'bottom':
        return {
          top: height,
          left: 0,
          right: 0,
        };
      case from === 'top':
        return {
          bottom: height,
          left: 0,
          right: 0,
        };
      case from === 'left':
        return {
          top: 0,
          bottom: 0,
          right: width,
        };
      case from === 'right':
        return {
          top: 0,
          bottom: 0,
          left: width,
        };
    }
  }, [from]);

  // invoke useModal remove by key
  const removeSelf = useCallback(() => {
    if (isExist(innerKey || '')) {
      remove(innerKey);
    }
  }, [remove, innerKey, isExist]);

  const handleClickMask = useCallback(() => {
    if (pointerEvents === 'none') return;
    if (!modal && pointerEvents === 'auto') {
      removeSelf();
    }
    onClickMask && onClickMask();
  }, []);

  const panGesture = Gesture.Pan()
    .onBegin(() => {
      if (!gesture) return;
      if (from === 'bottom' || from === 'top') {
        offset.value = translateY.value;
      } else {
        offset.value = translateX.value;
      }
    })
    .onUpdate(({ translationY, translationX }) => {
      if (!gesture) return;
      if (from === 'bottom' || from === 'top') {
        translateY.value = clamp(
          offset.value + translationY,
          snapPoints1.value,
          snapPoints2.value
        );
      } else {
        translateX.value = clamp(
          offset.value + translationX,
          snapPoints1.value,
          snapPoints2.value
        );
      }
    })
    .onEnd(({ velocityY, velocityX }) => {
      if (!gesture) return;
      let dest;
      if (from === 'bottom' || from === 'top') {
        dest = snapPoint(translateY.value, velocityY, [
          snapPoints1.value,
          snapPoints2.value,
        ]);
        translateY.value = withTiming(dest, { duration });
      } else {
        dest = snapPoint(translateX.value, velocityX, [
          snapPoints1.value,
          snapPoints2.value,
        ]);
        translateX.value = withTiming(dest, { duration });
      }
      if (dest === 0) {
        runOnJS(removeSelf)();
      }
    });

  useImperativeHandle(
    ref,
    () => ({
      unMount,
    }),
    []
  );

  return (
    <View style={styles.absoluteFill}>
      <TouchableWithoutFeedback
        style={styles.translateContainer}
        onPress={handleClickMask}
      >
        <Animated.View
          pointerEvents={pointerEvents}
          style={[styles.absoluteFill, maskAnimationStyle]}
        />
      </TouchableWithoutFeedback>
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[styles.translateContainer, initialPosition, animationStyle]}
        >
          <View style={[styles.container, containerStyle]} onLayout={onLayout}>
            {children}
          </View>
        </Animated.View>
      </GestureDetector>
    </View>
  );
});

TranslateContainer.displayName = 'TranslateContainer';
