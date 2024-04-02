import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { ModalUtil } from 'react-native-ma-modal';

const { width, height } = Dimensions.get('window');

interface SubWidthViewProps {}

const SubWidthView: React.FC<SubWidthViewProps> = (props) => {
  const {} = props;

  return (
    <View style={[styles.widthContainer]}>
      <Text style={styles.childText}>Sub View</Text>
      <Text
        style={styles.closeText}
        onPress={() => {
          ModalUtil.remove();
        }}
      >
        Close
      </Text>
    </View>
  );
};

interface SubHeightViewProps {}

const SubHeightView: React.FC<SubHeightViewProps> = (props) => {
  const {} = props;

  return (
    <View style={[styles.heightContainer]}>
      <Text style={styles.childText}>Sub View</Text>
      <Text
        style={styles.closeText}
        onPress={() => {
          ModalUtil.remove();
        }}
      >
        Close
      </Text>
    </View>
  );
};

interface SubMidViewProps {}

const SubMidView: React.FC<SubMidViewProps> = (props) => {
  const {} = props;

  return (
    <View style={[styles.midContainer]}>
      <Text style={styles.childText}>Sub View</Text>
      <Text
        style={styles.closeText}
        onPress={() => {
          ModalUtil.remove();
        }}
      >
        Close
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  widthContainer: {
    height: 400,
    width,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childText: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  heightContainer: {
    height,
    width: 300,
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  midContainer: {
    backgroundColor: '#fff',
    padding: 30,
    alignItems: 'center',
    borderRadius: 10,
  },
  closeText: {
    marginTop: 40,
    fontSize: 24,
  },
});

export { SubWidthView, SubHeightView, SubMidView };
