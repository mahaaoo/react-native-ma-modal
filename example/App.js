import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Modal, modalRef } from 'react-native-ma-modal';

import { navigationRef } from './src/navigate';
import Index from './src/app';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <Modal ref={modalRef}>
        <NavigationContainer ref={navigationRef}>
          <Index />
        </NavigationContainer>
      </Modal>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
