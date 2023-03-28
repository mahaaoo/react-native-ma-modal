import * as React from 'react';
import { useState } from 'react';
import { StyleSheet, View, Text, Dimensions, ScrollView } from 'react-native';
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
import { Extrapolate, interpolate } from 'react-native-reanimated';
import Button from './Button';
import Section from './Section';

const { width, height } = Dimensions.get('window');

export default function OverlayExample() {
  const { add, remove, removeAll } = useModal();
  const elementIndex = React.useRef(0);
  const [isVisible, setVisible] = useState(false);

  React.useEffect(() => {
    console.log('刷新Home');
    const listener = ModalUtil.addListener('onReady', (res: any) => {
      console.log('onReadyonReady', res);
      setTimeout(() => {
        Loading.hide?.();
      }, 2000);
    });
    Loading.show();
    return () => {
      ModalUtil.removeListener(listener);
    };
  }, []);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.paddingBottom}
    >
      <Section title="Close Modal">
        <Button
          onPress={() => {
            remove();
          }}
        >
          <Text>Delete Modal</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            removeAll();
          }}
        >
          <Text>Delete All Modal</Text>
        </Button>
      </Section>

      <Section title="Self Modal">
        <Button
          onPress={() => {
            const index = add(
              <View style={styles.marginTop}>
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </View>
            );
            elementIndex.current++;
          }}
        >
          <Text>sub-modal-hook</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = ModalUtil.add(
              <View style={styles.marginTop}>
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </View>
            );
            elementIndex.current++;
          }}
        >
          <Text>sub-modal-function</Text>
        </Button>
      </Section>

      <Section title="NormalContainer">
        <Button
          onPress={() => {
            add(
              <NormalContainer
                pointerEvents="none"
                onAppear={() => {
                  console.log('子视图已弹出');
                }}
                onDisappear={() => {
                  console.log('子视图已消失');
                }}
              >
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
              </NormalContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>pointerEvents='none'</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = add(
              <NormalContainer
                onAppear={() => {
                  console.log('子视图已弹出');
                }}
                onDisappear={() => {
                  console.log('子视图已消失');
                }}
              >
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </NormalContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>pointerEvents='auto'</Text>
        </Button>
      </Section>

      <Section title="OpacityContainer">
        <Button
          onPress={() => {
            add(
              <OpacityContainer
                onAppear={() => {
                  console.log('子视图已弹出');
                }}
                onDisappear={() => {
                  console.log('子视图已消失');
                }}
              >
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
              </OpacityContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>mask-close</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = add(
              <OpacityContainer
                modal={true}
                onAppear={() => {
                  console.log('子视图已弹出');
                }}
                onDisappear={() => {
                  console.log('子视图已消失');
                }}
              >
                <Text style={styles.childText}>
                  子视图{elementIndex.current}
                </Text>
                <Text
                  onPress={() => {
                    remove(index);
                  }}
                  style={styles.close}
                >
                  关闭
                </Text>
              </OpacityContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>mask-no-close</Text>
        </Button>
      </Section>
      <Section title="TranslateContainer" style={styles.section}>
        <View style={styles.row}>
          <Button
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer>
                  <View style={[styles.bottom, { height: 330 }]}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer
                  containerStyle={{ alignItems: 'center', marginLeft: 100 }}
                  from="top"
                  offset={(height - 200) / 2}
                >
                  <View style={styles.top}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Top</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer from="left">
                  <View style={styles.left}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>,
                'pop-view-left'
              );
              elementIndex.current++;
            }}
          >
            <Text>Left</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer
                  containerStyle={{ justifyContent: 'center', marginTop: 200 }}
                  from="right"
                  offset={-(width - 200) / 2}
                >
                  <View style={styles.tRight}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Right</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer gesture={true}>
                  <View style={styles.bottom}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-Gesture</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer from="left" gesture={true}>
                  <View style={styles.left}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>,
                'pop-view-left'
              );
              elementIndex.current++;
            }}
          >
            <Text>Left-Gesture</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              const index = ModalUtil.add(
                <TranslateContainer modal={true}>
                  <View style={[styles.bottom, { height: 432 }]}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                    <Text
                      onPress={() => {
                        remove(index);
                      }}
                      style={styles.close}
                    >
                      关闭
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-Modal</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer mask={false}>
                  <View style={styles.bottom}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-NoMask</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer rootAnimation={'scale'} gesture={true}>
                  <View
                    style={[
                      styles.bottom,
                      {
                        height: height - 88,
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                      },
                    ]}
                  >
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-Scale</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer
                  rootAnimation={['scale', 'borderRadius']}
                  gesture={true}
                >
                  <View
                    style={[
                      styles.bottom,
                      {
                        height: height - 88,
                        borderTopRightRadius: 10,
                        borderTopLeftRadius: 10,
                      },
                    ]}
                  >
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-Scale-Border</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer rootAnimation={'rotateX'} gesture={true}>
                  <View style={styles.bottom}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Bottom-RotateX</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer
                  from="left"
                  gesture={true}
                  rootAnimation={'scale'}
                >
                  <View style={styles.left2}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Left-Scale</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer
                  from="left"
                  gesture={true}
                  rootAnimation={'translateX'}
                >
                  <View style={styles.left2}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Left-Translate</Text>
          </Button>
          <Button
            style={styles.marginLeft}
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer
                  from="right"
                  gesture={true}
                  rootAnimation={'translateX'}
                >
                  <View style={styles.left2}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Right-Translate</Text>
          </Button>
        </View>
        <View style={styles.viewContainer}>
          <Button
            onPress={() => {
              ModalUtil.add(
                <TranslateContainer
                  from="left"
                  gesture={true}
                  rootAnimation={['scale', 'translateX']}
                >
                  <View style={styles.left2}>
                    <Text style={styles.childText}>
                      Funtion子视图{elementIndex.current}
                    </Text>
                  </View>
                </TranslateContainer>
              );
              elementIndex.current++;
            }}
          >
            <Text>Left-Translate-Scale</Text>
          </Button>
        </View>
      </Section>

      <Section title="DrawerContainer">
        <Button
          onPress={() => {
            const index = ModalUtil.add(
              <DrawerContainer rootAnimation={['translateX']} position="left">
                <View style={styles.left2}>
                  <Text style={styles.childText}>
                    Funtion子视图{elementIndex.current}
                  </Text>
                  <Text
                    onPress={() => {
                      remove(index);
                    }}
                    style={styles.close}
                  >
                    关闭
                  </Text>
                </View>
              </DrawerContainer>,
              'draw-view-left'
            );
            elementIndex.current++;
          }}
        >
          <Text>Left</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = ModalUtil.add(
              <DrawerContainer rootAnimation={'translateX'} position="right">
                <View style={styles.right}>
                  <Text style={styles.childText}>
                    Funtion子视图{elementIndex.current}
                  </Text>
                  <Text
                    onPress={() => {
                      remove(index);
                    }}
                    style={styles.close}
                  >
                    关闭
                  </Text>
                </View>
              </DrawerContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>Right</Text>
        </Button>
      </Section>
      <Section title="ScaleContainer">
        <Button
          onPress={() => {
            add(
              <ScaleContainer>
                <View style={styles.scaleContainer}>
                  <Text>子视图{elementIndex.current}</Text>
                </View>
              </ScaleContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>Scale</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            const index = add(
              <ScaleContainer modal={true}>
                <View style={styles.scaleContainer}>
                  <Text>子视图{elementIndex.current}</Text>
                  <Text
                    onPress={() => {
                      remove(index);
                    }}
                    style={styles.close}
                  >
                    关闭
                  </Text>
                </View>
              </ScaleContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>Scale-Close</Text>
        </Button>
      </Section>
      <Section title="Modal-Component">
        <Modal isVisible={isVisible}>
          <ScaleContainer modal={true}>
            <View style={styles.scaleContainer}>
              <Text>子视图{elementIndex.current}</Text>
              <Text
                onPress={() => {
                  setVisible(false);
                }}
                style={styles.close}
              >
                关闭
              </Text>
            </View>
          </ScaleContainer>
        </Modal>
        <Button
          onPress={() => {
            setVisible(true);
            elementIndex.current++;
          }}
        >
          <Text>Modal-Component</Text>
        </Button>
      </Section>
      <Section title="User-Define-MainView-Animation">
        <Button
          onPress={() => {
            ModalUtil.add(
              <TranslateContainer
                gesture={true}
                doAnimation={(progress) => {
                  'worklet';
                  return {
                    overflow: 'hidden',
                    borderRadius: interpolate(
                      progress.value,
                      [0, 1],
                      [0, 50],
                      Extrapolate.CLAMP
                    ),
                    transform: [
                      {
                        scale: interpolate(
                          progress.value,
                          [0, 1],
                          [1, 0.7],
                          Extrapolate.CLAMP
                        ),
                      },
                    ],
                  };
                }}
              >
                <View
                  style={[
                    styles.bottom,
                    {
                      height: 500,
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                    },
                  ]}
                >
                  <Text style={styles.childText}>
                    Funtion子视图{elementIndex.current}
                  </Text>
                </View>
              </TranslateContainer>
            );
            elementIndex.current++;
          }}
        >
          <Text>Bottom-Scale</Text>
        </Button>
      </Section>
      <Section title="Loading&Toast">
        <Button
          onPress={() => {
            Loading.show();
          }}
        >
          <Text>Loading</Text>
        </Button>
        <Button
          style={styles.marginLeft}
          onPress={() => {
            Toast.show('alert');
          }}
        >
          <Text>Toast</Text>
        </Button>
      </Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  paddingBottom: {
    paddingBottom: 50,
  },
  marginTop: {
    marginTop: 100,
  },
  marginLeft: {
    marginLeft: 15,
  },
  childText: {
    marginTop: 100,
    fontSize: 24,
  },
  close: {
    marginTop: 20,
    fontSize: 24,
  },
  bottom: {
    height: 500,
    width,
    backgroundColor: '#fff',
  },
  top: {
    height: 200,
    width: 200,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  left: {
    height,
    width: 200,
    flex: 1,
    backgroundColor: '#fff',
  },
  tRight: {
    width: 200,
    height: 200,
    // flex: 1,
    backgroundColor: '#fff',
  },
  viewContainer: {
    flexDirection: 'row',
    marginTop: 15,
  },
  left2: {
    height,
    width: 300,
    flex: 1,
    backgroundColor: '#fff',
  },
  right: {
    width: 220,
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  row: {
    flexDirection: 'row',
  },
  scaleContainer: {
    width: 150,
    height: 150,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignContent: 'center',
  },
});
