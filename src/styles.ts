import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  mainViewContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  mainView: {
    flex: 1,
    overflow: 'hidden',
  },
  container: {
    flex: 1,
  },
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
  },
  drawerContainer: {
    position: 'absolute',
  },
  scaleContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  translateContainer: {
    position: 'absolute',
    zIndex: 99,
  },
});
