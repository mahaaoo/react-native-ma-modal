import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ModalProvider, modalRef } from 'react-native-ma-modal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { navigationRef } from './src/navigate';
import Index from './src/app';

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ModalProvider
        ref={modalRef}
        config={{
          duration: 250,
        }}
      >
        <NavigationContainer ref={navigationRef}>
          <Index />
        </NavigationContainer>
      </ModalProvider>
    </GestureHandlerRootView>
  );
}
