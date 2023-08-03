import { FlatList, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import Navbar from '../Components/Navbar';
import Url from './../Components/Url'
import AsyncStorage from '@react-native-async-storage/async-storage';
const TrackOrders = ({navigation}) => {
    const [ShowNavbar, setShowNavbar] = useState(false);

    const [unconfirmed_orders, setunconfirmed_orders] = useState([])
    const [confirmed_orders, setconfirmed_orders] = useState([])
    const [Orderdisplay, setOrderdisplay] = useState('confirmed');
    useEffect(()=>{
      async function fetchorders(){
        const token = await AsyncStorage.getItem('Token');
        const response = await fetch(`${Url()}/placeorder`,{
          method: 'GET',
          headers:{
            'Authorization': `Bearer ${token}`  
          },
        })
        const data =await response.json()
        setunconfirmed_orders(data.unconfirmed_orders)
        setconfirmed_orders(data.confirmed_orders)
      }
      fetchorders()
    },[])

  return (
    <View style={{flex:1,backgroundColor:'lightgreen', paddingVertical:20, paddingHorizontal:10}}>
        <View>
            <View style={styles.page_heading}>
            <Text onPress={()=>setShowNavbar(true)} style={{paddingLeft:10}}><Entypo name="menu" size={24} color="black" /></Text>
            <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>TRACK ORDERS</Text>
            <Text></Text>
            <View>
            </View>
            </View>
            
            <View style={{marginTop:'5%', height:'45%', borderWidth:1}}>
            <Text style={{backgroundColor:'black', color:'white', textAlign:'center', fontSize:18}}>ConfirmedOrdered List</Text>
            {confirmed_orders.length != 0 ? 
            <FlatList
            style={{}}
            data={confirmed_orders} // Pass the data array
            keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
            renderItem={({ item }) => <Confirmed_orders_view details={item}/>} // Render each item using Warehousedetails component
          />:
          <Text style={{fontSize:15, textAlign:'center'}} >🚫No orders</Text>
        }
            </View>
            <View style={{marginTop:'5%',height:'45%', borderWidth:1}}>
              <Text style={{backgroundColor:'black', color:'white', textAlign:'center', fontSize:18}}>UnConfirmedOrdered List</Text>
              {unconfirmed_orders.length != 0 ? 
              <FlatList
                      style={{}}
                      data={unconfirmed_orders} // Pass the data array
                      keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
                      renderItem={({ item }) => <Unconfirmed_orders_view details={item}/>} // Render each item using Warehousedetails component
                      />:          
              <Text style={{fontSize:15, textAlign:'center'}} >🚫No orders</Text>
            }
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


const Confirmed_orders_view = ({}) => {
  return(
    <View>
      <Text>{details.product}</Text>
    </View>
  )
}

const Unconfirmed_orders_view = ({details}) =>{
  return(
    <View>
      <Text>{details.order_no}</Text>
      <Text>{details.product}</Text>
      <Text>{details.warehouse_name}</Text>
      <Text>{details.quantity}</Text>
      <Text>{details.warehouse_type}</Text>
    </View>
  )
}