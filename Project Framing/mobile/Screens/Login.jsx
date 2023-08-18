import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Url from '../Components/Url';
import Loading from '../Components/Loading';
import logo from "./../assets/logo.png"
import farmerbackground from './../assets/green-field-tree-blue-skygreat-as-backgroundweb-banner-generative-ai.jpg'

const Login = () => {
    const navigation = useNavigation();
    const [ShowPassword, setShowPassword] = useState(false);

    const [userPhone, setuserPhone] = useState('');
    const [userPassword, setuserPassword] = useState('');
    const [Error, setError] = useState('');

    const [LoadingScreen, setLoadingScreen] = useState(true);
      
    async function login(event){
        event.preventDefault();
        try {
            const response = await fetch(`${Url()}/login`,{
            method : 'POST',
            headers : { 'Content-Type': 'application/json' },
            body : JSON.stringify({ 'number' : userPhone ,'password' : userPassword})
        });
        const data = await response.json();
        if ( data.status ){
        AsyncStorage.setItem('Token',data.access_token);
            AsyncStorage.setItem('role',data.role);
            AsyncStorage.setItem('name',data.name)
            AsyncStorage.setItem('IsLoggedIn','Loggedin');
            navigation.replace('Dashboard');
        } else {
            Alert.alert(data.message);
        }
        } catch  {
            console.warn('Backend error');   
        }
    }

  return (
    <ImageBackground
    source={farmerbackground}
    style={{ flex: 1, resizeMode: 'cover' }}
    >
    <View style={styles.login_page} >

        <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
        </View>
        <View style={{paddingHorizontal:"10%"}}>
            <View style={styles.mobile_number_field}>
                <Text style={styles.mobile_number}>Mobile Number</Text>
                <TextInput keyboardType='number-pad' style={styles.mobile_number_input} onChangeText={(Text)=>setuserPhone(Text)}/>
            </View>
        </View>
        <View style={{paddingHorizontal:'10%'}}>
            <Text style={styles.password}>Password</Text>
            <View style={styles.password_field}>
                <TextInput secureTextEntry= {ShowPassword ? false: true } style={styles.password_input} onChangeText={(Text)=>setuserPassword(Text)}/>
                {
                    ShowPassword ? 
                    <AntDesign name="eye" size={24} color="white" onPress={()=>setShowPassword(!ShowPassword)}/>
                    :
                    <Entypo name="eye-with-line" size={24} color="white" onPress={()=>setShowPassword(!ShowPassword)}/>
                }
            </View>
        </View>
        <View style={styles.btn_login_view}>
            <TouchableOpacity style={styles.btn_login} onPress={login}>
                <Text style={styles.login_text}>Login</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.create_account}>
            <Text style={{color:'white'}}>Need to be a vendor </Text><Text style={styles.create_account_link} onPress={()=>navigation.navigate('Register')}>Create accoiunt</Text>
        </View>
    </View>
    </ImageBackground>
  )
}

export default Login

const styles = StyleSheet.create({
    login_page:{
        paddingVertical:'25%',
        flex:1,
    },
    password_field:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        borderWidth:1,
        borderRadius:20,
        paddingHorizontal:'5%',
        borderColor:'white'
    },
    mobile_number_input:{
        borderRadius:20,
        borderWidth:1,
        borderColor:'white',
        height:50,
        paddingLeft:10,
        color:'white'
    },
    mobile_number_field:{
        paddingTop:20,
    },
    mobile_number:{
        fontSize:20,
        paddingBottom:10,
        color:'white'
    },
    password:{
        fontSize:20,
        paddingTop:20,
        paddingBottom:10,
        color:'white'
    },
    password_input:{
        height:50,
        width:'90%',
        borderColor:'white',
        color:'white'
    },
    create_account:{
        flexDirection:'row',
        justifyContent:'center'
    },
    create_account_link:{
        color:'blue'
    },
    btn_login:{
        backgroundColor:'lightgreen',
        paddingVertical:10,
        alignItems:'center',
        width:'30%',
        borderRadius:100
    },
    btn_login_view:{
        paddingVertical:20,
        flexDirection:'row',
        justifyContent:'center',
    },
    login_text:{
        fontSize:28,
        fontWeight: 'bold'
    },
    logoContainer: {
        height: 100, // Set a fixed height or adjust as needed
        justifyContent: 'center',
        alignItems: 'center',
      },
      logo: {
        flex: 1,
        resizeMode: 'contain',
      },
})