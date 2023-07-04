import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign, Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {

    const navigation = useNavigation();
    const [ShowPassword, setShowPassword] = useState(false);

    const [userPhone, setuserPhone] = useState('');
    const [userPassword, setuserPassword] = useState('');
    const [Error, setError] = useState('');
      
    async function login(event){
        event.preventDefault();
        try {
            const response = await fetch('http://192.168.66.54:5000/login',{
            method : 'POST',
            headers : { 'Content-Type': 'application/json' },
            body : JSON.stringify({ 'number' : userPhone ,'password' : userPassword})
        });
        const data = await response.json();
        if ( data.status ){
        AsyncStorage.setItem('Token',data.access_token);
            AsyncStorage.setItem('role',data.role);
            AsyncStorage.setItem('IsLoggedIn','true');
            navigation.replace('Dashboard');
        } else {
            Alert.alert(data.message);
        }
        } catch  {
            console.warn('Backend error');   
        }
    }

  return (
    <View style={styles.login_page}>
        <View style={styles.logo}>
            <Text>Logo</Text>
        </View>
        <View style={styles.mobile_number_field}>
            <Text style={styles.mobile_number}>Mobile Number</Text>
            <TextInput keyboardType='number-pad' style={styles.mobile_number_input} onChangeText={(Text)=>setuserPhone(Text)}/>
        </View>
        <View>
            <Text style={styles.password}>Password</Text>
            <View style={styles.password_field}>
                <TextInput secureTextEntry= {ShowPassword ? false: true } style={styles.password_input} onChangeText={(Text)=>setuserPassword(Text)}/>
                {
                    ShowPassword ? 
                    <AntDesign name="eye" size={24} color="black" onPress={()=>setShowPassword(!ShowPassword)}/>
                    :
                    <Entypo name="eye-with-line" size={24} color="black" onPress={()=>setShowPassword(!ShowPassword)}/>
                }
            </View>
        </View>
        <View style={styles.btn_login_view}>
            <TouchableOpacity style={styles.btn_login} onPress={login}>
                <Text style={styles.login_text}>Login</Text>
            </TouchableOpacity>
        </View>
        <View style={styles.create_account}>
            <Text>Need to be a vendor </Text><Text style={styles.create_account_link} onPress={()=>navigation.navigate('Register')}>Create accoiunt</Text>
        </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
    login_page:{
        marginTop:30,
        paddingHorizontal:10,
        flex:1
    },
    logo:{
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:20,
        backgroundColor:'green'
    },
    password_field:{
        flexDirection:'row',
        alignItems:'center',
        columnGap:10,
        borderWidth:1,
        borderRadius:20,
        alignItems:'center'
    },
    mobile_number_input:{
        borderRadius:20,
        borderWidth:1,
        borderColor:'black',
        height:50,
        paddingLeft:10
    },
    mobile_number_field:{
        paddingTop:20,
    },
    mobile_number:{
        fontSize:20,
        paddingBottom:10
    },
    password:{
        fontSize:20,
        paddingTop:20,
        paddingBottom:10
    },
    password_input:{
        height:50,
        width:330,
        paddingLeft:10
    },
    create_account:{
        flexDirection:'row'
    },
    create_account_link:{
        color:'blue'
    },
    btn_login:{
        backgroundColor:'lightgreen',
        paddingVertical:10,
        alignItems:'center',
    },
    btn_login_view:{
        paddingVertical:20
    },
    login_text:{
        fontSize:28,
        fontWeight: 'bold'
    }
})