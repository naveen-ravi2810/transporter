import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Dashboard from './Screens/Dashboard';
import Approveuser from './Screens/Approveuser';
import Popup from './Screens/Popup';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} /> 
        <Stack.Screen name="ApproveUser" component={Approveuser} options={{ headerShown: false }} /> 
        <Stack.Screen name='popup' component={Popup} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

