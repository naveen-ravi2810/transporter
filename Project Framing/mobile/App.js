import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './Screens/Login';
import Register from './Screens/Register';
import Dashboard from './Screens/Dashboard';
import Approveuser from './Screens/Approveuser';
import Popup from './Screens/Popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import Loading from './Components/Loading';
import OnboardingScreen from './Screens/Onboarding';
import TrackOrders from './Screens/TrackOrders';
import { StatusBar } from 'react-native';
import Navbar from './Components/Navbar';

const Stack = createNativeStackNavigator();

export default function App() {

  const [LoggedInStatus, setLoggedInStatus] = useState('LoggedIn');
  const [isLoading, setisLoading] = useState(true);
  useEffect(()=>{
    async function redirect_to_dashboard(){
        const loginstatus = await AsyncStorage.getItem('IsLoggedIn');
        if (loginstatus != null){
          setLoggedInStatus(loginstatus);
          setisLoading(false);
        }
        else {
          setLoggedInStatus('onboarding');
          setisLoading(false);
        }
    }
    redirect_to_dashboard();
  },[]);

  if(isLoading){
    return(
      <Loading/>
    )
  }

  function startapp(){
    if (LoggedInStatus == 'Loggedin'){
      return "Dashboard";
    } else if (LoggedInStatus == 'NotLoggedIn'){
      return "Login";
    } else if (LoggedInStatus == 'onboarding') {
      return "Onboarding";
    }
  }

  return (
    <NavigationContainer>
        <StatusBar hidden/>
      <Stack.Navigator initialRouteName={startapp()}>
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ headerShown: false }} /> 
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ headerShown: false }} /> 
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
        <Stack.Screen name="ApproveUser" component={Approveuser} options={{ headerShown: false }} /> 
        <Stack.Screen name="TrackOrders" component={TrackOrders} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>

  );
}

