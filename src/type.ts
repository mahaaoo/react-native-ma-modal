import { createContext, createRef, MutableRefObject, useContext } from 'react';
import { ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { RootAnimationType } from './RootViewAnimations';

export interface ModalProps {
  isVisible: boolean;
}

export type ModalConfig = {
  duration: number;
  maskColor: string;
  maskOpacity: number;
};

export type ElementType = {
  element: React.ReactNode;
  key: string;
  ref: any;
};

export const DefaultModalConfig = {
  duration: 250,
  maskColor: '#000',
  maskOpacity: 0.3,
};

export interface ModalAnimatedContextProps {
  initialValue: Animated.SharedValue<number>;
  progress: Animated.SharedValue<number>;
  targetValue: Animated.SharedValue<number>;
  config: ModalConfig;
}

export const ModalAnimatedContext = createContext(
  {} as ModalAnimatedContextProps
);
export const useModalAnimated = () => useContext(ModalAnimatedContext);

export interface ModalElementsRef {
  updateModal: () => void;
}

export interface ModalElementsProps {
  elements: MutableRefObject<Array<ElementType>>;
  initialValue: Animated.SharedValue<number>;
  progress: Animated.SharedValue<number>;
  targetValue: Animated.SharedValue<number>;
  config?: ModalConfig;
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
export const useModal = () => useContext(ModalContext);

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
  rootAnimation?: RootAnimationType;
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
