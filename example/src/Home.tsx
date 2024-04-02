import React, { useState, useMemo } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import {
  useModal,
  ModalUtil,
  TranslateContainer,
  NormalContainer,
  OpacityContainer,
  DrawerContainer,
  ScaleContainer,
  Modal,
  Loading,
  Toast,
} from 'react-native-ma-modal';
import { SubMidView, SubHeightView, SubWidthView } from './SubView';
import { Options, NumberCount } from './OptionViews';

const ContainerList = [
  'NormalContainer',
  'OpacityContainer',
  'ScaleContainer',
  'DrawerContainer',
  'TranslateContainer',
];

const confirmColor = '#1677FF';

export default function OverlayExample() {
  const { add, remove, removeAll } = useModal();
  const elementIndex = React.useRef(0);
  const [isVisible, setVisible] = useState(false);

  const [warp, setWarp] = useState(1);
  const [canModal, setCanModal] = useState(false);
  const [needMask, setNeedMask] = useState(true);
  const [pointerEvents, setPointerEvents] = useState('auto'); // false: 'none', true: 'auto'
  const [modalDuration, setModalDuration] = useState(250);

  const [drawDirection, setDrawDirection] = useState('left');

  const [gesture, setGesture] = useState(false);
  const [tranOffset, setTranOffset] = useState(0);
  const [tranDirection, setTranDirection] = useState('bottom');
  const [tranRootAni, setTranRootAni] = useState('null');

  const generalShow = useMemo(() => {
    const name = ContainerList[warp];
    const canShowList = [
      'OpacityContainer',
      'TranslateContainer',
      'ScaleContainer',
    ];
    return canShowList.indexOf(name) !== -1 ? true : false;
  }, [warp]);

  React.useEffect(() => {
    console.log('刷新Home');
    const listener = ModalUtil.addListener('onReady', (res: any) => {
      console.log('onReadyonReady', res);
    });

    return () => {
      ModalUtil.removeListener(listener);
    };
  }, []);

  const modalChildren = useMemo(() => {
    let WarpView: any = View;
    let props = {};
    const name = ContainerList[warp];

    if (name === 'NormalContainer') {
      return (
        <NormalContainer
          containerStyle={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onAppear={() => {
            console.log('onAppear');
          }}
          onDisappear={() => {
            console.log('onDisappear');
          }}
        >
          <SubMidView />
        </NormalContainer>
      );
    }

    let SubView: any = View;
    switch (true) {
      case name === 'OpacityContainer': {
        WarpView = OpacityContainer;
        SubView = SubMidView;
        props = {
          containerStyle: {
            justifyContent: 'center',
            alignItems: 'center',
          },
        };
        break;
      }
      case name === 'DrawerContainer': {
        WarpView = DrawerContainer;
        SubView = SubHeightView;
        props = {
          position: drawDirection,
          // TODO: 当DrawerContainer默认rootAnimation设置为translateX， 不需要外部传入，不允许更改
          rootAnimation: 'translateX',
        };
        break;
      }
      case name === 'TranslateContainer': {
        WarpView = TranslateContainer;
        SubView = SubWidthView;
        if (tranDirection === 'left' || tranDirection === 'right') {
          SubView = SubHeightView;
        }
        props = {
          gesture: gesture,
          offset: tranOffset,
          from: tranDirection,
          rootAnimation: tranRootAni,
        };
        break;
      }
      case name === 'ScaleContainer': {
        WarpView = ScaleContainer;
        SubView = SubMidView;
        props = {};
        break;
      }
    }

    return (
      <WarpView
        modal={canModal}
        mask={needMask}
        duration={modalDuration}
        pointerEvents={pointerEvents}
        {...props}
        onAppear={() => {
          console.log('onAppear');
        }}
        onDisappear={() => {
          console.log('onDisappear');
        }}
        onClickMask={() => {
          console.log('onClickMask');
        }}
      >
        <SubView />
      </WarpView>
    );
  }, [
    warp,
    canModal,
    needMask,
    modalDuration,
    pointerEvents,
    drawDirection,
    gesture,
    tranOffset,
    tranDirection,
    tranRootAni,
  ]);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', paddingVertical: 20 }}>
            {ContainerList.map((name, index) => {
              const bgColor = index === warp ? confirmColor : '#fff';
              const textColor = index === warp ? '#fff' : '#333';
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.containerOption, { backgroundColor: bgColor }]}
                  onPress={() => setWarp(index)}
                >
                  <Text
                    style={[styles.containerOptionText, { color: textColor }]}
                  >
                    {name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
        {generalShow ? (
          <View>
            <View style={styles.switchContainer}>
              <Text style={{ fontSize: 16 }}>Need Mask</Text>
              <Switch
                value={needMask}
                trackColor={{ true: confirmColor }}
                onValueChange={() => setNeedMask((e) => !e)}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={{ fontSize: 16 }}>Can't Click Mask Close</Text>
              <Switch
                value={canModal}
                trackColor={{ true: confirmColor }}
                onValueChange={() => setCanModal((e) => !e)}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={{ fontSize: 16 }}>Modal View Can Response</Text>
              <Options
                options={['auto', 'none']}
                current={pointerEvents}
                onSelect={setPointerEvents}
              />
            </View>
          </View>
        ) : null}
        {ContainerList[warp] !== 'NormalContainer' ? (
          <View style={styles.switchContainer}>
            <Text style={{ fontSize: 16 }}>Duration(ms)</Text>
            <NumberCount
              minus={() => {
                setModalDuration((e) => {
                  if (e - 200 > 0) {
                    return e - 200;
                  }
                  return e;
                });
              }}
              plus={() => setModalDuration((e) => e + 200)}
              current={modalDuration}
            />
          </View>
        ) : null}
        {ContainerList[warp] === 'DrawerContainer' ? (
          <View style={styles.switchContainer}>
            <Text style={{ fontSize: 16 }}>Drawer Direction</Text>
            <Options
              options={['left', 'right']}
              current={drawDirection}
              onSelect={setDrawDirection}
            />
          </View>
        ) : null}
        {ContainerList[warp] === 'TranslateContainer' ? (
          <>
            <View style={styles.switchContainer}>
              <Text style={{ fontSize: 16 }}>Gesture Close</Text>
              <Switch
                value={gesture}
                trackColor={{ true: confirmColor }}
                onValueChange={() => setGesture((e) => !e)}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={{ fontSize: 16 }}>Modal View Offset</Text>
              <NumberCount
                minus={() => setTranOffset((e) => e - 100)}
                plus={() => setTranOffset((e) => e + 100)}
                current={tranOffset}
              />
            </View>
            <View style={styles.switchContainer}>
              <Text style={{ fontSize: 16 }}>Translate From</Text>
              <Options
                options={['bottom', 'left', 'top', 'right']}
                current={tranDirection}
                onSelect={setTranDirection}
              />
            </View>
            <View
              style={{
                paddingHorizontal: 10,
                marginVertical: 10,
              }}
            >
              <Text style={{ fontSize: 16 }}>RootAnimation</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 10 }}
              >
                <Options
                  options={[
                    'null',
                    'translateX',
                    'scale',
                    'rotateX',
                    'borderRadius',
                  ]}
                  current={tranRootAni}
                  onSelect={setTranRootAni}
                />
              </ScrollView>
            </View>
          </>
        ) : null}
      </ScrollView>
      <TouchableOpacity
        onPress={() => {
          add(modalChildren);
        }}
        style={styles.showModalButton}
      >
        <Text style={styles.showModalText}>Show Modal</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerOption: {
    backgroundColor: '#fff',
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 15,
  },
  containerOptionText: {
    fontSize: 16,
    color: '#333',
  },
  showModalButton: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    bottom: 0,
    right: 0,
    height: 80,
    paddingBottom: 20,
    backgroundColor: confirmColor,
  },
  showModalText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  switchContainer: {
    paddingHorizontal: 10,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
