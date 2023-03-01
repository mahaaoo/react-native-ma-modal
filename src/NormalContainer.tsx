/**
 * if use this componet wrapper Modal componet
 * onAppear will be called when it mount,
 * onDisappear will be called when it unMount
 */
import React, { forwardRef, useEffect } from 'react';
import { View } from 'react-native';
import { NormalContainerRef, NormalContainerProps } from './type';
import { styles } from './styles';

export const NormalContainer = forwardRef<
  NormalContainerRef,
  NormalContainerProps
>((props, ref) => {
  const { children, containerStyle, onAppear, onDisappear } = props;

  useEffect(() => {
    onAppear && onAppear();
    return () => {
      onDisappear && onDisappear();
    };
  }, [onAppear, onDisappear]);

  return (
    <View style={styles.absoluteFill}>
      <View style={[styles.container, containerStyle]}>{children}</View>
    </View>
  );
});

NormalContainer.displayName = 'NormalContainer';
