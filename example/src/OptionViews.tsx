import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

const confirmColor = '#1677FF';

interface OptionsProps {
  options: string[];
  current: string;
  onSelect: (value: string) => void;
}

const Options: React.FC<OptionsProps> = (props) => {
  const { options, current, onSelect } = props;

  return (
    <View style={{ flexDirection: 'row' }}>
      {options.map((value, index) => {
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onSelect(value)}
            style={{
              backgroundColor: current === value ? confirmColor : '#fff',
              padding: 10,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: current === value ? '#fff' : '#333',
              }}
            >
              {value}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

interface NumberCountProps {
  minus: () => void;
  plus: () => void;
  current: number;
}

const NumberCount: React.FC<NumberCountProps> = (props) => {
  const { minus, plus, current } = props;

  return (
    <View style={{ flexDirection: 'row' }}>
      <Text
        onPress={minus}
        style={{ lineHeight: 30, fontSize: 30, fontWeight: 'bold' }}
      >
        -
      </Text>
      <Text style={{ lineHeight: 30, fontSize: 20, marginHorizontal: 8 }}>
        {current}
      </Text>
      <Text
        onPress={plus}
        style={{ lineHeight: 30, fontSize: 30, fontWeight: 'bold' }}
      >
        +
      </Text>
    </View>
  );
};

export { Options, NumberCount };
