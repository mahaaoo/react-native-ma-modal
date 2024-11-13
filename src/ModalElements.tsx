/**
 * Modal实际添加在此组件内，多次添加Modal会重叠加载
 */
import React, { forwardRef, useImperativeHandle } from 'react';
import { View } from 'react-native';
import { useForceUpdate } from './utils/hooks';
import { styles } from './utils/styles';
import { ModalElementsRef, ModalElementsProps } from './utils/type';

export const ModalElements = forwardRef<ModalElementsRef, ModalElementsProps>(
  (props, ref) => {
    const { elements } = props;
    const { forceUpdate } = useForceUpdate();

    useImperativeHandle(
      ref,
      () => ({
        updateModal: forceUpdate,
      }),
      []
    );

    return (
      <>
        {elements?.current.map((node: any) => {
          const pointerEvents = node.element.props.pointerEvents || 'auto';
          let extraStyle = {};
          // DrawerContainer's View will below the MainView
          // 在新版RN76中，似乎zIndex: -10不生效。目前尚不清楚是expo的问题还是RN本身的问题
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
      </>
    );
  }
);
