import ModalProvider, { useModal } from './ModalProvider';

import NormalContainer from './NormalContainer';
import OpacityContainer, {
  OpacityContainerRef,
} from './OpacityContainer';
import TranslateContainer, {
  TranslateContainerRef,
} from './TranslateContainer';
import DrawerContainer, {
  DrawerContainerRef,
} from './DrawerContainer';
import ScaleContainer from './ScaleContainer';
import { BaseContainerProps, AnimationContainerProps } from './type';
import { modalRef, ModalUtil } from './ModalUtil';
import Modal from './Modal';

export {
  ModalProvider,
  useModal,
  modalRef,
  ModalUtil,
  NormalContainer,
  OpacityContainer,
  TranslateContainer,
  DrawerContainer,
  ScaleContainer,
  TranslateContainerRef,
  OpacityContainerRef,
  BaseContainerProps,
  AnimationContainerProps,
  DrawerContainerRef,
  Modal,
};
