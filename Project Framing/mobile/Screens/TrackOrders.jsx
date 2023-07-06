import { Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import Navbar from '../Components/Navbar';

const TrackOrders = ({navigation}) => {
    const [ShowNavbar, setShowNavbar] = useState(false);
  return (
    <View style={{flex:1,backgroundColor:'lightgreen', paddingVertical:20, paddingHorizontal:10}}>
        <View>
            <View style={styles.page_heading}>
            <Text onPress={()=>setShowNavbar(true)} style={{paddingLeft:10}}><Entypo name="menu" size={24} color="black" /></Text>
            <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>TRACK ORDERS</Text>
            <Text></Text>
            </View>
        </View>
        <Modal style={{}} visible={ShowNavbar} transparent={true}>
            <View style={{ flex:1,width:200,}}>
                {ShowNavbar && <Navbar navigation={navigation} path={'trackorders'} setShowNavbar={setShowNavbar}/>}
            </View>
      </Modal>
    </View>
  )
}

export default TrackOrders

const styles = StyleSheet.create({
    page_heading:{
        flexDirection:'row',
      justifyContent:'space-between',
      paddingVertical:10,
      backgroundColor:'green'
    }
})