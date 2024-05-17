import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ModalUtil } from '../utils/util';
import { ScaleContainer } from '../container/ScaleContainer';

import { UniqueModal } from '../utils//type';

export interface ToastOptions {
  duration?: number;
  // animation?: 'translate' | 'opacity';
  // direction?: 'top' | 'bottom' | 'left' | 'right';
}

export const Toast: UniqueModal = {
  template: (title: string) => {
    // before add
    return (
      <ScaleContainer
        pointerEvents="none"
        mask={false}
        containerStyle={styles.container}
      >
        <View style={styles.toast}>
          <View style={styles.mask} />
          <Text style={styles.title}>{title}</Text>
        </View>
      </ScaleContainer>
    );
  },
  show: (title: string, options?: ToastOptions) => {
    const duration = options?.duration || 2000;
    const key = ModalUtil.add(Toast.template(title, options));
    if (!Toast.isExist()) {
      const time = setTimeout(() => {
        ModalUtil.remove(key || '');
        clearTimeout(time);
      }, duration);
    }
  },
  hide: () => {},
  isExist: () => ModalUtil.isExist(Toast.key || '') || false,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toast: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  mask: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#000',
    opacity: 0.5,
  },
  title: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: 'white',
    fontSize: 16,
  },
});
