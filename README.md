# react-native-ma-modal
完全使用ts实现的RN弹窗组件，支持自定义动画

<img src="./screenshot/overlay.gif" width="250" />

## 安装
在使用之前请先安装`react-native-reanimated`和`react-native-gesture-handle`
```
npm install react-native-reanimated react-native-gesture-handler
```
并正确配置项目，详情请参考：
- [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated)
- [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)

安装`react-native-ma-modal`
```
npm install react-native-ma-modal
```

## 使用
在App的入口，使用`ModalProvider`

```javascript
import { ModalProvider, modalRef } from 'react-native-ma-modal';

export default function App() {
  return (
    <ModalProvider ref={modalRef}>
      <NavigationContainer ref={navigationRef}>
        <Index />
      </NavigationContainer>
    </ModalProvider>
  );
}
```
### 组件内函数式调用
```javascript
import { useModal } from 'react-native-ma-modal';

export default function Example() {
  const { add, remove } = useModal();
  return (
    <View>
      <Button
        onPress={() => {
          add(<Text>Modal视图</Text>);
        }}
      >
        <Text>添加弹窗</Text>
      </Button>
      <Button onPress={remove}>
        <Text>删除弹窗</Text>
      </Button>
    </View>
  )  
}
```
### 在函数内使用
```javascript
import { ModalUtil } from 'react-native-ma-modal';

const show = () => {
  ModalUtil.add(<Text>Modal视图</Text>)
}
```
### Modal组件
```javascript
export default function Example() {
  const [isVisible, setVisible] = useState(false);
  
  return (
    <Modal isVisible={isVisible}>
      <Text>Modal视图</Text>
    </Modal>
  )
}
```
### Modal的弹出效果
目前有几种弹出效果
- 渐变效果：`OpacityContainer`
- 平移效果：`TranslateContainer`
- 抽屉效果：`DrawerContainer`
- 缩放效果：`ScaleContainer`

更多示例请参照[Demo](https://github.com/mahaaoo/react-native-ma-modal/blob/main/example/src/Home.tsx)

## Expo Demo
Scan the QR code with Expo Go (Android) or the Camera app

<img src="./screenshot/expo.png" width="250" />
