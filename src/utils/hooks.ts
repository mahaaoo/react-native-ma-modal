import { useContext, useState } from 'react';
import { ModalAnimatedContext, ModalContext } from './type';

/**
 * refresh immediately
 * @returns () => void
 * usage:
 * const { forceUpdate } = useForceUpdate();
 * forceUpdate();
 */
export const useForceUpdate = () => {
  const [_, update] = useState(0);

  return {
    forceUpdate: () => {
      update((up) => up + 1);
    },
  };
};

/**
 * 操作modal显示/隐藏
 */
export const useModal = () => useContext(ModalContext);
/**
 * 与modal显示/隐藏动画相关参数
 */
export const useModalAnimated = () => useContext(ModalAnimatedContext);
