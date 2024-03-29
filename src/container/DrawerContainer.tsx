/**
 * Component below MainView
 * when it mount, change MainView's translateX
 * only support horizontal direction
 */
import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import { View } from 'react-native';
import Animated, { runOnJS, withTiming } from 'react-native-reanimated';
import { DrawerContainerRef, DrawerContainerProps } from '../utils/type';
import { useModalAnimated } from '../utils/hooks';
import { styles } from '../utils/styles';

export const DrawerContainer = forwardRef<
  DrawerContainerRef,
  DrawerContainerProps
>((props, ref) => {
  const { targetValue, progress, config } = useModalAnimated();
  const {
    position,
    duration = config.duration,
    onAppear,
    containerStyle,
    children,
    onDisappear,
  } = props;

  const onLayout = useCallback(
    ({
      nativeEvent: {
        layout: { width: w },
      },
    }) => {
      mount(w);
    },
    []
  );

  const mount = useCallback(
    (w: number) => {
      if (position === 'left') {
        targetValue.value = w;
      } else {
        targetValue.value = -w;
      }

      progress.value = withTiming(1, { duration }, () => {
        onAppear && runOnJS(onAppear)();
      });
    },
    [onAppear]
  );

  const unMount = useCallback(() => {
    progress.value = withTiming(0, { duration }, () => {
      onDisappear && runOnJS(onDisappear)();
    });
  }, [onDisappear, position]);

  const initialPosition = useMemo(() => {
    switch (true) {
      case position === 'left':
        return {
          top: 0,
          bottom: 0,
          left: 0,
        };
      case position === 'right':
        return {
          top: 0,
          bottom: 0,
          right: 0,
        };
    }
  }, [position]);

  useImperativeHandle(
    ref,
    () => ({
      unMount,
    }),
    []
  );

  return (
    <View style={styles.absoluteFill}>
      <Animated.View style={[styles.drawerContainer, initialPosition]}>
        <View style={[styles.container, containerStyle]} onLayout={onLayout}>
          {children}
        </View>
      </Animated.View>
    </View>
  );
});

DrawerContainer.displayName = 'DrawerContainer';
