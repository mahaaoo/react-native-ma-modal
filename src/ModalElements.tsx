import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import { useForceUpdate } from './hooks';
import { styles } from './styles';
import {
  ModalElementsRef,
  ModalElementsProps,
  DefaultModalConfig,
  ModalAnimatedContext,
} from './type';

export const ModalElements = forwardRef<ModalElementsRef, ModalElementsProps>(
  (props, ref) => {
    const { elements, initialValue, progress, targetValue } = props;

    let config = props.config;

    if (config) {
      config.duration = config.duration || DefaultModalConfig.duration;
      config.maskColor = config.maskColor || DefaultModalConfig.maskColor;
      config.maskOpacity = config.maskOpacity || DefaultModalConfig.maskOpacity;
    } else {
      config = DefaultModalConfig;
    }

    const { forceUpdate } = useForceUpdate();

    useImperativeHandle(
      ref,
      () => ({
        updateModal: forceUpdate,
      }),
      []
    );

    return (
      <ModalAnimatedContext.Provider
        value={{
          config,
          initialValue,
          progress,
          targetValue,
        }}
      >
        {elements.current.map((node: any) => {
          const pointerEvents = node.element.props.pointerEvents || 'auto';
          let extraStyle = {};
          // DrawerContainer's View will below the MainView
          if (node.element.type.displayName === 'DrawerContainer') {
            extraStyle = { zIndex: -10 };
          }
          return (
            <View
              key={node.key}
              pointerEvents={pointerEvents}
              style={[styles.absoluteFill, extraStyle]}
            >
              {node.element}
            </View>
          );
        })}
      </ModalAnimatedContext.Provider>
    );
  }
);
