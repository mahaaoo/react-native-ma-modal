import React from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { ModalUtil } from '../utils/util';
import { OpacityContainer } from '../container/OpacityContainer';
import { UniqueModal } from '../utils//type';

export const Loading: UniqueModal = {
  key: 'global-loading',
  template: () => {
    // before add
    return (
      <OpacityContainer
        mask={false}
        modal={true}
        containerStyle={styles.container}
      >
        <View style={styles.loadingContainer}>
          <ActivityIndicator color={'white'} />
        </View>
      </OpacityContainer>
    );
  },
  show: () => {
    ModalUtil.add(Loading.template(), Loading.key);
  },
  hide: () => ModalUtil.remove(Loading.key || ''),
  isExist: () => ModalUtil.isExist(Loading.key || '') || false,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    width: 80,
    height: 80,
    backgroundColor: 'black',
    opacity: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
