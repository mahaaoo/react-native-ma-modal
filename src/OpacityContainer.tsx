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
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useModal } from './ModalProvider';
import { useModalAnimated } from './ModalElements';
import { AnimationContainerProps } from './type';
import { styles } from './styles';

interface OpacityContainerProps extends AnimationContainerProps {}

export interface OpacityContainerRef {
  mount: () => void;
}

const OpacityContainer = forwardRef<OpacityContainerRef, OpacityContainerProps>(
  (props, ref) => {
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

    const opacity = useSharedValue(0);

    useEffect(() => {
      mount();
      return () => {
        onDisappear && onDisappear();
      };
    }, []);

    const mount = useCallback(() => {
      opacity.value = withTiming(
        mask ? config.maskOpacity : 0,
        { duration },
        () => {
          onAppear && runOnJS(onAppear)();
        }
      );
    }, [onAppear]);

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
  }
);

OpacityContainer.displayName = 'OpacityContainer';

export default OpacityContainer;
