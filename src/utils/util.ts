import React from 'react';
import { ViewStyle, ImageStyle, TextStyle, StatusBar } from 'react-native';
import { AnimateStyle } from 'react-native-reanimated';
import { DefaultModalConfig, ModalConfig, modalRef } from './type';

interface ModalListener {
  eventName: string;
  key: number;
}

export const ModalUtil = {
  add: (children: React.ReactNode, key?: string) =>
    modalRef.current?.add(children, key) || '',
  remove: (key?: string) => modalRef.current?.remove(key),
  removeAll: () => modalRef.current?.removeAll(),
  isExist: (key: string) => modalRef.current?.isExist(key),
  listener: new Map(),
  index: 0,
  addListener: (eventName: string, callback: Function): ModalListener => {
    if (!ModalUtil.listener.has(eventName)) {
      ModalUtil.listener.set(eventName, new Map());
    }
    ModalUtil.listener.get(eventName).set(++ModalUtil.index, callback);
    return { eventName, key: ModalUtil.index };
  },
  emit(eventName: string, params?: { [key: string]: any }) {
    if (ModalUtil.listener.has(eventName)) {
      const eveMap = ModalUtil.listener.get(eventName);
      eveMap.forEach((map: Function) => map(params));
    }
  },
  removeListener(event: ModalListener) {
    const { eventName, key } = event;
    ModalUtil.listener.get(eventName).delete(key);
  },
  removeAllListener() {
    ModalUtil.listener.clear();
  },
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
 * 合并两个动画样式，把style合并到mainStyle中
 */
export const mergeStyle = (
  mainStyle: AnimateStyle<ViewStyle | ImageStyle | TextStyle>,
  style: AnimateStyle<ViewStyle | ImageStyle | TextStyle>
) => {
  'worklet';
  if (style.transform) {
    mainStyle.transform = mainStyle.transform
      ? mainStyle.transform.concat(style.transform)
      : style.transform;
  }
  return Object.assign(style, mainStyle);
};

/**
 * 在安卓平台上，需要处理StatusBar高度
 * @param from 底部或者顶部
 * @returns number
 */
export const regulateStatusBarHeight = (from: string): number => {
  'worklet';
  let diff = 0;
  if (from === 'bottom') {
    diff += StatusBar.currentHeight || 0;
  }
  if (from === 'top') {
    diff -= StatusBar.currentHeight || 0;
  }

  return diff;
};

/**
 * 处理默认的全局参数
 * @param config ModalConfig | undefined
 * @returns ModalConfig
 */
export const handleConfig = (config: ModalConfig | undefined): ModalConfig => {
  if (config) {
    config.duration = config.duration || DefaultModalConfig.duration;
    config.maskColor = config.maskColor || DefaultModalConfig.maskColor;
    config.maskOpacity = config.maskOpacity || DefaultModalConfig.maskOpacity;
  } else {
    config = DefaultModalConfig;
  }
  return config;
};
