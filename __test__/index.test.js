import React from 'react';
import { View } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';
import { withReanimatedTimer } from 'react-native-reanimated/src/reanimated2/jestUtils';
import { ModalProvider, modalRef, ModalUtil } from '../src';

test('Test ModalUtil', () => {
  withReanimatedTimer(async () => {
    expect(modalRef.current).toBeNull();
    const mockOnReady = jest.fn();
    ModalUtil.addListener('onReady', mockOnReady);

    const { findByTestId } = render(
      <ModalProvider ref={modalRef}>
        <View />
      </ModalProvider>
    );

    let testAddKey, testAddKey2, testAddKey3, testAddKey4;

    await waitFor(() => {
      testAddKey = ModalUtil.add(<View testID="test-add" />);
      testAddKey2 = ModalUtil.add(<View testID="test-add-2" />);
      testAddKey3 = ModalUtil.add(<View testID="test-add-3" />);
      testAddKey4 = ModalUtil.add(<View testID="test-add-4" />);
    });

    // modalRef has been set
    expect(modalRef.current).not.toBeNull();

    // onReady listener
    expect(mockOnReady).toHaveBeenCalled();

    // add modal correctly
    const element1 = findByTestId('test-add');
    expect(element1).not.toBeNull();

    // add Modal will return key
    expect(testAddKey).toEqual('Modal1');

    // isExist correctly
    expect(ModalUtil.isExist(testAddKey)).toEqual(true);

    // add more modal correctly
    expect(ModalUtil.isExist(testAddKey)).toEqual(true);
    expect(ModalUtil.isExist(testAddKey2)).toEqual(true);
    expect(ModalUtil.isExist(testAddKey3)).toEqual(true);
    expect(ModalUtil.isExist(testAddKey4)).toEqual(true);

    // remove the most recently added view
    ModalUtil.remove();
    expect(ModalUtil.isExist(testAddKey)).toEqual(true);
    expect(ModalUtil.isExist(testAddKey2)).toEqual(true);
    expect(ModalUtil.isExist(testAddKey3)).toEqual(true);
    expect(ModalUtil.isExist(testAddKey4)).toEqual(false);

    // remove view by key
    ModalUtil.remove(testAddKey2);
    expect(ModalUtil.isExist(testAddKey)).toEqual(true);
    expect(ModalUtil.isExist(testAddKey2)).toEqual(false);
    expect(ModalUtil.isExist(testAddKey3)).toEqual(true);
    expect(ModalUtil.isExist(testAddKey4)).toEqual(false);

    // remove all
    ModalUtil.removeAll();
    expect(ModalUtil.isExist(testAddKey)).toEqual(false);
    expect(ModalUtil.isExist(testAddKey2)).toEqual(false);
    expect(ModalUtil.isExist(testAddKey3)).toEqual(false);
    expect(ModalUtil.isExist(testAddKey4)).toEqual(false);
  });
});
