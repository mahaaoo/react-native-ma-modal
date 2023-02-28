import React, { createContext, forwardRef, MutableRefObject, useContext, useImperativeHandle } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated from 'react-native-reanimated';
import { useForceUpdate } from './ModalUtil';

export interface ModalConfig {
  duration: number,

  maskColor: string,
  maskOpacity: number,
}

export interface ElementType {
  element: React.ReactNode;
  key: string;
  ref: any;
}

const DefaultModalConfig = {
  duration: 250,
  maskColor: '#000',
  maskOpacity: 0.3
}

export interface ModalAnimatedContextProps {
  initialValue: Animated.SharedValue<number>;
  progress: Animated.SharedValue<number>;
  targetValue: Animated.SharedValue<number>;
  config: ModalConfig;
}

export const ModalAnimatedContext = createContext({} as ModalAnimatedContextProps);
export const useModalAnimated = () => useContext(ModalAnimatedContext);

export interface ModalElementsRef {
  updateModal: () => void;
}

interface ModalElementsProps {
  elements: MutableRefObject<Array<ElementType>>;
  initialValue: Animated.SharedValue<number>;
  progress: Animated.SharedValue<number>;
  targetValue: Animated.SharedValue<number>;
  config?: ModalConfig;
}

export const ModalElements = forwardRef<ModalElementsRef, ModalElementsProps>((props, ref) => {
  const { elements, 
      initialValue,
      progress,
      targetValue,  
  } = props;

  let config = props.config;

  if (!!config) {
    config.duration = config.duration || DefaultModalConfig.duration;
    config.maskColor = config.maskColor || DefaultModalConfig.maskColor
    config.maskOpacity = config.maskOpacity || DefaultModalConfig.maskOpacity
  } else {
    config = DefaultModalConfig
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
    <ModalAnimatedContext.Provider value={{
      config,
      initialValue,
      progress,
      targetValue,
    }}>
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
            style={[styles.modal, extraStyle]}
          >
            {node.element}
          </View>
        );
      })}
    </ModalAnimatedContext.Provider>
);
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modal: {
    ...StyleSheet.absoluteFillObject,
  },
});
