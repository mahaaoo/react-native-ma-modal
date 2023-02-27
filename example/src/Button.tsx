import React, { useCallback } from 'react';
import { TouchableOpacity, StyleProp, ViewStyle, StyleSheet } from 'react-native';

export interface BaseButtonProps {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  children?: React.ReactNode;
}

const BaseButton: React.FC<BaseButtonProps> = (props) => {
  const {
    onPress,
    style,
    children,
    disabled = false,
  } = props;

  const handlePress = useCallback(() => {
    if (disabled) return;
    onPress && onPress();
  }, [onPress]);

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[styles.main, style]}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  main: {
    padding: 15,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderColor: '#D9D9D9',
    borderWidth: 1,
  }
})

export default BaseButton;
