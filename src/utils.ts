import React from 'react';
import { ViewStyle, ImageStyle, TextStyle } from 'react-native';
import { AnimateStyle } from 'react-native-reanimated';
import { modalRef } from './type';

export const ModalUtil = {
  add: (children: React.ReactNode, key?: string) =>
    modalRef.current?.add(children, key),
  remove: (key: string) => modalRef.current?.remove(key),
  removeAll: () => modalRef.current?.removeAll(),
  isExist: (key: string) => modalRef.current?.isExist(key),
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

/**
 * 合并两个动画样式，把style2合并到style1中
 */
export const mergeStyle = (
  style1: AnimateStyle<ViewStyle | ImageStyle | TextStyle>,
  style2: AnimateStyle<ViewStyle | ImageStyle | TextStyle>
) => {
  'worklet';
  if (style2.transform) {
    style1.transform = style1.transform
      ? style1.transform.concat(style2.transform)
      : style2.transform;
  }
  return Object.assign(style2, style1);
};
