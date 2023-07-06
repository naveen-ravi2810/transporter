import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../Components/Loading';
import Navbar from '../Components/Navbar';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';

const Dashboard = ({navigation}) => {

  const [isLoading, setisLoading] = useState(true);
  const [UserType, setUserType] = useState('')
  const [ShowNavbar, setShowNavbar] = useState(false);
    useEffect(()=>{
        async function fetchdata(){
        const user_type = await AsyncStorage.getItem('role');
        setUserType(user_type);
        setisLoading(false);
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

    useFocusEffect(
      React.useCallback(() => {
        setShowNavbar(false); // Update the shownavbar state when the screen regains focus
        return () => {
          // Cleanup function when screen loses focus
        };
      }, [])
    );

    if(isLoading){
      return(
        <Loading/>
      )
    }

  return (
    <View style={{flex:1,backgroundColor:'lightgreen', paddingVertical:20, paddingHorizontal:10}}>
      <View style={styles.dashboard_view}>
        <View style={styles.page_heading}>
          <Text onPress={()=>setShowNavbar(true)} style={{paddingLeft:10}}><Entypo name="menu" size={24} color="black" /></Text>
          <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>DASHBOARD</Text>
          <Text></Text>
        </View>
        <View style={{borderWidth:1, borderColor:'white'}}></View>
        <View style={{padding:10}}>
        <Text>Move to approve user and some useless text that to cover the space</Text>
        <Text>            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, voluptate!.",</Text>
        <Text>Move to approve user and some useless text that to cover the space</Text>          
        <Text>            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Expedita, voluptate!.",</Text>
        </View>
      </View>
      
      <Modal style={{}} visible={ShowNavbar} transparent={true}>
      <View style={{ flex:1,width:200,}}>
        {ShowNavbar && <Navbar navigation={navigation} path={'dashboard'} setShowNavbar={setShowNavbar}/>}
      </View>
      </Modal>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({
    dashboard_view:{
      flex:1
    },
    page_heading:{
      flexDirection:'row',
      justifyContent:'space-between',
      paddingVertical:10,
      backgroundColor:'green'
    }
})