import { StyleSheet, Image } from 'react-native'
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const OnboardingScreen = ({navigation}) => {

    function skiponboarding(){
        AsyncStorage.setItem('IsLoggedIn','NotLoggedIn');
        navigation.replace("Login");
    }

  return (
    <Onboarding
    onDone={()=>skiponboarding()}
    onSkip={()=>skiponboarding()}
    pages={[
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={{
                uri: "https://wallpaperaccess.com/full/2408569.jpg",
              }}
              style={{height:250, width:250, justifyContent:'center', borderRadius:30}}
            />
          ),
          title: "Set Your produts To see by everyone",
          subtitle:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, voluptate!.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={{
                uri: "https://cdn.dribbble.com/users/1458982/screenshots/4291206/sign-in-dribble.png?compress=1&resize=400x300&vertical=top",
              }}
              style={{height:250, width:250, justifyContent:'center', borderRadius:30}}
            />
          ),
          title: "All you need in One PLace",
          subtitle:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, voluptate!.",
        },
        {
          backgroundColor: "#fff",
          image: (
            <Image
              source={{
                uri: "https://thumbs.dreamstime.com/b/woman-shopping-sales-happy-young-holding-paper-bags-enjoying-126694001.jpg",
              }}
              style={{height:250, width:250, justifyContent:'center', borderRadius:30}}
            />
          ),
          title: "Happy Sale, Happy Customer",
          subtitle:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, voluptate!.",
        },
      ]}
/>
  )
}

export default OnboardingScreen

const styles = StyleSheet.create({})