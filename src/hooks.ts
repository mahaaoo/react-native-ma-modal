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

export const useModal = () => useContext(ModalContext);

export const useModalAnimated = () => useContext(ModalAnimatedContext);
