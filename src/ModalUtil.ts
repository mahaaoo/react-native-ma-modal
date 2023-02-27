import React, { useState } from 'react';
import { ModalRef } from './ModalProvider';

/**
 * Must set at top <Modal ref={ModalRef}>
 * ModalUtil is just another way to invoke useModal
 * Can be used at out of FunctionComponent
 */
export const modalRef = React.createRef<ModalRef>();

export const ModalUtil = {
  add: (children: React.ReactNode, key?: string) =>
    modalRef.current?.add(children, key),
  remove: (key: string) => modalRef.current?.remove(key),
  removeAll: () => modalRef.current?.removeAll(),
  isExist: (key: string) => modalRef.current?.isExist(key),
};

/**
 * make UI refresh immediately
 * @returns () => void
 * usage:
 * const { forceUpdate } = useForceUpdate();
 * forceUpdate();
 */
export const useForceUpdate = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, update] = useState(0);

  return {
    forceUpdate: () => {
      update((up) => up + 1);
    },
  };
};

// from [react-native-redash](https://github.com/wcandillon/react-native-redash)
export const snapPoint = (
  value: number,
  velocity: number,
  points: ReadonlyArray<number>
): number => {
  'worklet';
  const point = value + 0.2 * velocity;
  const deltas = points.map((p) => Math.abs(point - p));
  const minDelta = Math.min.apply(null, deltas);
  return points.filter((p) => Math.abs(point - p) === minDelta)[0];
};

export const clamp = (
  value: number,
  lowerBound: number,
  upperBound: number
) => {
  'worklet';
  return Math.min(Math.max(lowerBound, value), upperBound);
};
