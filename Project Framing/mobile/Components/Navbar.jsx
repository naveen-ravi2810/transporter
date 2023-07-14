import { Image, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Navbar = ({navigation, setShowNavbar, path}) => {

    const [UserType, setUserType] = useState('');
    const [UserName, setUserName] = useState('');

    useEffect(()=>{
        async function fetchdata(){
        const user_type = await AsyncStorage.getItem('role');
        const user_name = await AsyncStorage.getItem('name');
        setUserType(user_type);
        setUserName(user_name);
        }
        fetchdata();
    },[])
    function approve_user(){
      navigation.navigate('ApproveUser')
    }
    function logout(){
      AsyncStorage.removeItem('Token');
      AsyncStorage.setItem('IsLoggedIn','NotLoggedIn');
      AsyncStorage.removeItem('role');
      navigation.replace('Login');
    };

  return (
    <View style={styles.navbar}>
      <View style={{paddingBottom:20, paddingTop:20}}>
        <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:"center"}}>
          <Image style={{height:40, width:40, borderRadius:100}} source={{uri : 'https://sm.askmen.com/t/askmen_in/article/f/facebook-p/facebook-profile-picture-affects-chances-of-gettin_fr3n.1200.jpg'}}/>
          <Text onPress={()=>setShowNavbar(false)}><Ionicons name="close" size={24} color="black" /></Text>
        </View>
        <Text style={{fontSize:16,textTransform: 'uppercase'}}>{UserName}</Text>
        <Text>{UserType}</Text>
      </View>
      <View style={{}}>
        <TouchableOpacity onPress={()=>navigation.replace('Dashboard')} style={[styles.options, path == 'dashboard' && styles.activeoption]} disabled={path == 'dashboard'? true : false}>
          <Text>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>navigation.replace('TrackOrders')} style={[styles.options, path == 'trackorders' && styles.activeoption]}>
          <Text>TrackOrders</Text>
        </TouchableOpacity>
        {
          UserType == 'admin' && 
          <TouchableOpacity onPress={()=>navigation.replace('ApproveUser')} style={[styles.options, path == 'approveuser' && styles.activeoption]}>
          <Text>Approve User</Text>
        </TouchableOpacity>
        }
        <TouchableOpacity onPress={logout} style={styles.options}>
          <Text>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Navbar

const styles = StyleSheet.create({
  navbar:{
    backgroundColor:'white',
    padding:10,
    width:200,
    flex:1,
  },
  options:{
    borderWidth:1,
    marginVertical:5,
    padding:2,
    flexDirection:'row',
    justifyContent:'center'
  },
  activeoption:{
    backgroundColor:'green',
    
  }
})