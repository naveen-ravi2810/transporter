import { FlatList, Image, ImageBackground, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Entypo } from '@expo/vector-icons';
import Navbar from '../Components/Navbar';
import Url from './../Components/Url'
import AsyncStorage from '@react-native-async-storage/async-storage';
import trackorderslogo from './../assets/pin-location-with-box-for-shipment-tracker-tracking-track-order-concept-illustration-flat-design-icon-sign-symbol-button-logo-stock-eps10-vector.jpg'
import confirmed_orders_logo from './../assets/food-delivery-1-1024x576.png'
import tractorders_bg from './../assets/pngtree-3d-illustration-of-a-warehouse-for-distribution-picture-image_3758152.jpg'

const TrackOrders = ({navigation}) => {
    const [ShowNavbar, setShowNavbar] = useState(false);

    const [unconfirmed_orders, setunconfirmed_orders] = useState([])
    const [confirmed_orders, setconfirmed_orders] = useState([])
    const [Orderdisplay, setOrderdisplay] = useState('confirmed');
    
    async function fetchfarmerorders(){
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
   
    async function fetchusertype(){
      const UserType = await AsyncStorage.getItem('role')
      return UserType
    }

    useEffect(()=>{
      const type = fetchusertype()
      if (type == "farmer"){
        fetchfarmerorders()
      }
    },[])

  return (
    <ImageBackground 
    source={tractorders_bg}
    style={{width:'100%', height:'100%'}}
    >
    <View style={{flex:1,backgroundColor:'white', paddingVertical:20, paddingHorizontal:10}}>
        <View>
            <View style={styles.page_heading}>
            <Text onPress={()=>setShowNavbar(true)} style={{paddingLeft:10}}><Entypo name="menu" size={24} color="black" /></Text>
            <View style={{flexDirection:'row', gap:5}}>
            <Image source={trackorderslogo} style={{width:'15%', height:'100%'}}/>
            <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>TRACK ORDERS</Text>
            </View>
            <Text></Text>
            <View>
            </View>
            </View>
            
            <View style={{marginTop:'5%', height:'45%', paddingHorizontal:'10%'}}>
            <Text style={{ color:'#28BA13', textAlign:'center', fontSize:18, textTransform:'uppercase', paddingBottom:10}}>ConfirmedOrdered List</Text>
            <ImageBackground
            source={confirmed_orders_logo}
            style={{width:'100%', height:'95%', flexDirection:'row', justifyContent:'center'}}
            >
            {confirmed_orders.length != 0 ? 
            <FlatList
            style={{}}
            data={confirmed_orders} // Pass the data array
            keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
            renderItem={({ item }) => <Confirmed_orders_view details={item}/>} // Render each item using Warehousedetails component
            />:
            <View style={{flex:1,flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
              <Text style={{fontSize:25, textAlign:'center', color:'red'}} >🚫No orders</Text>
            </View>
          }
          </ImageBackground>
            </View>
            <View style={{marginTop:'5%',height:'45%'}}>
              <Text style={{ color:'#28BA13', textAlign:'center', fontSize:18, textTransform:'uppercase', paddingBottom:10}}>UnConfirmedOrdered List</Text>
              {unconfirmed_orders.length != 0 ? 
              <FlatList
                      style={{marginHorizontal:'10%',}}
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
    </ImageBackground>
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
    <View style={{borderTopWidth:2, paddingTop:2, marginTop:2, backgroundColor:'white'}}>
      <Text style={{color:'#BDA17D'}}>Order No : {details.order_no}</Text>
      <View style={{flexDirection:'row', alignItems:'baseline', justifyContent:'space-between'}}>
      <Text style={{fontSize:28, textTransform:'uppercase'}}>{details.product}</Text>
      <Text>QTY : {details.quantity}</Text>
      </View>
      <Text style={{fontSize:8}}>{details.order_on}</Text>
      <Text style={{fontSize:22}}>{details.warehouse_name}</Text>
      <Text>{details.warehouse_type}</Text>
    </View>
  )
}