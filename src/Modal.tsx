/**
 * 使用JSX调用Modal组件，由isVisible控制是否显示
 * <Modal isVisible={ture}>
 *  <View></View>
 * </Modal>
 */
import React, { useEffect, useRef } from 'react';
import { ModalUtil } from './utils/util';
import { ModalProps } from './utils/type';

export const Modal: React.FC<ModalProps> = (props) => {
  const { children, isVisible } = props;
  const modalKey = useRef<string>('');

  useEffect(() => {
    if (isVisible) {
      modalKey.current = ModalUtil.add(children);
    } else {
      ModalUtil.remove(modalKey.current || '');
    }
  }, [isVisible]);

  return null;
};
