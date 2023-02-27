import * as React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Home from './Home';

const Stack = createNativeStackNavigator();

const App: React.FC<{}> = () => {
  const headerOptions = React.useMemo(() => {
    return {
      headerTitleStyle: {
        color: 'black',
      },
      headerBackTitle: 'Back',
    };
  }, []);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerTitle: 'Home', ...headerOptions }}
      />
    </Stack.Navigator>
  );
};

export default App;
