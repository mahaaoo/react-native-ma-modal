import { createContext, createRef, MutableRefObject } from 'react';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import Animated, { AnimateStyle } from 'react-native-reanimated';
import { RootAnimationType } from './RootViewAnimations';

export interface ModalProps {
  /**
   * Modal是否显示，true显示，false隐藏
   */
  isVisible: boolean;
}

/**
 * Modal全局控制配置项
 */
export type ModalConfig = {
  /**
   * Modal动画执行耗时，如果在具体的Container中未设置，则以此数值为准
   */
  duration: number;
  /**
   * Modal展示的时候，背景蒙层颜色
   */
  maskColor: string;
  /**
   * Modal展示的时候，背景蒙层透明度
   */
  maskOpacity: number;
};

/**
 * Modal全局控制默认配置项
 */
export const DefaultModalConfig: ModalConfig = {
  duration: 250,
  maskColor: '#000',
  maskOpacity: 0.3,
};

export type ElementType = {
  /**
   * 要展示的组件
   */
  element: React.ReactNode;
  /**
   * 该组件的key，如果未提供则会默认提供一个
   */
  key: string;
  /**
   * 该组件的引用
   */
  ref: any;
};

export interface ModalAnimatedContextProps {
  /**
   * 动画初始值
   */
  initialValue: Animated.SharedValue<number>;
  /**
   * 当前动画进度
   */
  progress: Animated.SharedValue<number>;
  /**
   * 目标动画值
   */
  targetValue: Animated.SharedValue<number>;
  /**
   * Modal全局控制默认配置项
   */
  config: ModalConfig;
}

export const ModalAnimatedContext = createContext(
  {} as ModalAnimatedContextProps
);

export interface ModalElementsRef {
  /**
   * 刷新ModalElements
   */
  updateModal: () => void;
}

export interface ModalElementsProps {
  /**
   * 需要Modal的组件
   */
  elements: MutableRefObject<Array<ElementType>>;
}

export interface ModalRef {
  /**
   * Add a componet to window,
   * If you set key, this components is unique,
   * If not the key assigned by the system and return, this key can used to remove itself
   */
  add: (node: React.ReactNode, key?: string) => string;
  /**
   * Remove a componet from window,
   * If you set key, this function will remove the key component
   * If not this function will remove the newest one
   * And if the component which will be removed has 'unMount' function, the unMount will be called before it be removed
   */
  remove: (key?: string) => void;
  /**
   * Remove all components without any animation
   */
  removeAll: () => void;
  /**
   * Check if the component already exists by key
   */
  isExist: (key: string) => boolean;
}

export const ModalContext = createContext({} as ModalRef);

export interface ModalProviderProps {
  children: React.ReactNode;
  config?: ModalConfig;
}

/**
 * Must set at top <Modal ref={ModalRef}>
 * ModalUtil is just another way to invoke useModal
 * Can be used at out of FunctionComponent
 */
export const modalRef = createRef<ModalRef>();

export type ModalMainAnimatedFunc = (
  progress: Animated.SharedValue<number>,
  targetValue: Animated.SharedValue<number>
) => AnimateStyle<ViewStyle | ImageStyle | TextStyle>;
/**
 * All Modal Container Must exntent this interface
 */
export interface BaseContainerProps {
  /**
   * Modal show componet
   */
  children: React.ReactNode;
  /**
   * this innerKey equals Modal.tsx's key, it ensure the Modal can remove itself
   */
  readonly innerKey?: string;
  /**
   * containerStyle is the closest to children, you can set flex to control children's position
   */
  containerStyle?: ViewStyle;

  /**
   * will be called after the Modal mount
   */
  onAppear?: () => void;
  /**
   * will be called after the Modal unmount
   */
  onDisappear?: () => void;
  /**
   * 'none': Modal can't response event, can click view under Modal
   * 'auto': Modal response evet
   */
  pointerEvents?: 'none' | 'auto';
  /**
   * config root view pointerEvents
   * 'none': Modal can't response event, can click view under Modal
   * 'auto': Modal response evet
   */
  rootPointerEvents?: 'none' | 'auto';
  /**
   * config root view animation
   */
  rootAnimation?: RootAnimationType | Array<RootAnimationType>;
  /**
   * main view use this animation
   */
  doAnimation?: ModalMainAnimatedFunc;
}

/**
 * Animation Modal Container All has below props
 */
export interface AnimationContainerProps extends BaseContainerProps {
  /**
   * need mask to cover rest of window
   */
  mask?: boolean;
  /**
   * animation duration time
   * ms
   */
  duration?: number;
  /**
   * If modal equal true, the Modal must be remove by call remove function
   * If modal equal false, the Modal can be close by click mask
   */
  modal?: boolean;
  /**
   * will be called after click mask
   */
  onClickMask?: () => void;
}

export interface DrawerContainerRef {
  unMount: (callback?: () => void) => void;
}

export interface DrawerContainerProps extends BaseContainerProps {
  /**
   * 抽屉的位置
   */
  position?: 'left' | 'right';
  duration?: number;
}

export interface NormalContainerProps extends BaseContainerProps {}
export interface NormalContainerRef {}

export interface OpacityContainerProps extends AnimationContainerProps {}
export interface OpacityContainerRef {
  mount: () => void;
}

export interface ScaleContainerRef {
  mount: (callback?: () => void) => void;
  unMount: (callback?: () => void) => void;
}
export interface ScaleContainerProps extends AnimationContainerProps {}

export interface TranslateContainerProps extends AnimationContainerProps {
  /**
   * it means the component will appear from
   * only support those four direction
   */
  from?: 'bottom' | 'top' | 'left' | 'right';
  /**
   * gesture to close
   */
  gesture?: boolean;
}
export interface TranslateContainerRef {
  // mount: (callback?: () => void) => void;
  /**
   * will be invoked before be removed
   */
  unMount: (callback?: () => void) => void;
}
