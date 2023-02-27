import { ViewStyle } from 'react-native';
import { RootAnimationType } from './RootViewAnimations';

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
