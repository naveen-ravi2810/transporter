import { StyleSheet, Image } from 'react-native'
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from "./../assets/logo.png"
import farmer1 from './../assets/Portraitfarmer.jpg'
import warehouse from "./../assets/storetank.jpg"
import transport from './../assets/transport.jpg'

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
              source={ logo }
              style={{
                // height:250, width:350, paddingTop:20, borderRadius:30,
                resizeMode:'contain',
              paddingHorizontal:30}}
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
              source={farmer1}
              style={{height:300, width:250, justifyContent:'center', borderRadius:30}}
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
              source={warehouse}
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
              source={transport}
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