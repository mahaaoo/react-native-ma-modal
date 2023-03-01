import React, { useEffect, useRef } from 'react';
import { ModalUtil } from './ModalUtil';

interface ModalProps {
  isVisible: boolean;
}

export const Modal: React.FC<ModalProps> = (props) => {
  const { children, isVisible } = props;
  const modalKey = useRef<string>();

  useEffect(() => {
    if (isVisible) {
      modalKey.current = ModalUtil.add(children);
    } else {
      ModalUtil.remove(modalKey.current || '');
    }
  }, [isVisible]);

  return null;
};
