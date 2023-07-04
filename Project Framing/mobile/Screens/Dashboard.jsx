import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'

const Dashboard = ({navigation}) => {

    // useEffect(()=>{
    //     await
    // },[])
    function approve_user(){
      navigation.navigate('ApproveUser')
    }
    function logout(){
      navigation.replace('Login')
    }
  return (
    <View>
      <Text>Dashboard</Text>
      <Text onPress={approve_user}>Move to approve user</Text>
      <Text onPress={logout}>Logout</Text>
    </View>
  )
}

export default Dashboard

const styles = StyleSheet.create({})