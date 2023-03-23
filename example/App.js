import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ModalProvider, modalRef } from 'react-native-ma-modal';

import { navigationRef } from './src/navigate';
import Index from './src/app';

export default function App() {
  return (
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
  );
}
