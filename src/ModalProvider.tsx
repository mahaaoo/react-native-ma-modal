/**
 * Modal can display Component like Modal from 'react-native'
 * the Component will be push to Array, render at outermost layer
 * there are two way can use Modal:
 * in component, can use useModal() hook
 * in function, can use ModalUtil
 *
 * Modal offer WrapperComponent, some of them contains animation, like DrawerContainer、TranslateContainer
 * Modal also accepts customize component, if offer unMount function, it will be invoked before remove
 */
import React, {
  useCallback,
  useRef,
  useImperativeHandle,
  forwardRef,
  useState,
} from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { RootAnimationType, configAnimation } from './RootViewAnimations';
import { ModalElements } from './ModalElements';
import { styles } from './styles';
import {
  ElementType,
  ModalElementsRef,
  ModalRef,
  ModalProviderProps,
  ModalContext,
  ModalAnimatedContext,
  ModalMainAnimatedFunc,
} from './type';
import { handleConfig, mergeStyle } from './utils';

export const ModalProvider = forwardRef<ModalRef, ModalProviderProps>(
  (props, ref) => {
    const { children } = props;
    const config = handleConfig(props.config);

    const elements = useRef<Array<ElementType>>([]); // all componets saved here
    const elementsIndex = useRef<number>(0);
    const initialValue = useSharedValue(0);
    const progress = useSharedValue(0);
    const targetValue = useSharedValue(0);
    const mainViewAnimation = useSharedValue<RootAnimationType>('null');
    const mainViewDoAnimation = useSharedValue<Array<ModalMainAnimatedFunc>>(
      []
    );
    const modalElementsRef = useRef<ModalElementsRef | null>(null);
    const [rootPointerEvents, setRootPointerEvents] = useState<'auto' | 'none'>(
      'auto'
    );

    /**
     * When call this function with key, the component will be unique
     * Otherwise, Modal will add key automatic，key will one by one And save at elementsIndex
     */
    const addNodeToModal = useCallback(
      (node: any, key?: string) => {
        if (node.props?.rootAnimation) {
          mainViewAnimation.value = node.props?.rootAnimation;
        }
        if (node.props?.doAnimation) {
          mainViewDoAnimation.value = [node.props?.doAnimation];
        }

        setRootPointerEvents(node.props?.rootPointerEvents || 'auto');
        // If add the same key will be return
        if (typeof key === 'string') {
          let addElement;
          for (let index = 0; index < elements.current.length; index++) {
            if (elements.current[index].key === key) {
              addElement = elements.current[index];
              break;
            }
          }
          if (addElement) {
            return key;
          }
        }

        /**
         * Before add compoonet to window, there are some props must handle
         * ref: in order to call unMount animation, the component if not have, will be create
         * innerKey: in order to support componet remove itself
         * onDisappear: when componet after be removed, forceUpdate Modal to real delete
         */
        let nodeRef;
        if (!!node && !!node.ref) {
          nodeRef = node.ref;
        } else {
          nodeRef = React.createRef();
        }

        const onDisappear = node?.props?.onDisappear;
        const inner_key = key || 'Modal' + (elementsIndex.current + 1);
        elements.current.push({
          element: React.cloneElement(node, {
            ref: nodeRef,
            onDisappear: () => {
              console.log(`删除组件${inner_key}`);
              onDisappear && onDisappear();
              mainViewAnimation.value = 'null';
              setRootPointerEvents('auto');
              modalElementsRef.current &&
                modalElementsRef.current.updateModal();
              mainViewDoAnimation.value = [];
            },
            innerKey: inner_key,
          }),
          key: inner_key,
          ref: nodeRef,
        });

        elementsIndex.current++;
        modalElementsRef.current && modalElementsRef.current.updateModal();

        return inner_key;
      },
      [elements]
    );

    /**
     * Remove componet by key
     * If not set key, the function will remove the latest component
     */
    const deleteNodeFromModal = useCallback(
      (key?: string) => {
        let deleteElement;
        if (!!key && key?.length > 0) {
          for (let index = 0; index < elements.current.length; index++) {
            if (elements.current[index].key === key) {
              deleteElement = elements.current[index];
              elements.current.splice(index, 1);
              break;
            }
          }
        } else {
          deleteElement = elements.current[elements.current.length - 1];
          elements.current.splice(elements.current.length - 1, 1);
        }

        /**
         * Before the component be removed, check it has unMount function
         * it means the component has some animation must be invoke be itself be removed
         * And forceUpdate will be invoke at onDisappear function
         */
        const deleteAnimation = deleteElement?.ref.current?.unMount;
        if (!!deleteAnimation && typeof deleteAnimation === 'function') {
          deleteAnimation();
        } else {
          modalElementsRef.current && modalElementsRef.current.updateModal();
        }
      },
      [elements]
    );

    /**
     * Remove all components without Animation
     */
    const deleteAllNodeFromModal = useCallback(() => {
      elements.current = [];
      modalElementsRef.current && modalElementsRef.current.updateModal();
    }, []);

    /**
     * Check the key indexOf elements.current
     */
    const isExist = useCallback((key: string) => {
      return elements.current.some((element) => element.key === key);
    }, []);

    /**
     * Animation for MainView, support Scale,translateX
     * anywhere can use uselayout() to control the Animation
     * if set new value, animation will react
     */
    const mainViewStyle = useAnimatedStyle(() => {
      let style = configAnimation(mainViewAnimation, progress, targetValue);
      if (mainViewDoAnimation.value.length === 1) {
        const _style = mainViewDoAnimation.value[0](progress, targetValue);
        style = mergeStyle(style, _style);
      }
      return style;
    }, [mainViewAnimation]);

    useImperativeHandle(
      ref,
      () => ({
        add: addNodeToModal,
        remove: deleteNodeFromModal,
        removeAll: deleteAllNodeFromModal,
        isExist,
      }),
      []
    );

    return (
      <View style={styles.mainViewContainer}>
        <ModalContext.Provider
          value={{
            add: addNodeToModal,
            remove: deleteNodeFromModal,
            removeAll: deleteAllNodeFromModal,
            isExist,
          }}
        >
          <Animated.View
            pointerEvents={rootPointerEvents}
            style={[styles.mainView, mainViewStyle]}
          >
            {children}
          </Animated.View>
          <ModalAnimatedContext.Provider
            value={{
              config,
              initialValue,
              progress,
              targetValue,
            }}
          >
            <ModalElements ref={modalElementsRef} elements={elements} />
          </ModalAnimatedContext.Provider>
        </ModalContext.Provider>
      </View>
    );
  }
);
