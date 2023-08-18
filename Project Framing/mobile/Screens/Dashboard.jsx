import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View, FlatList, Image, ImageBackground } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../Components/Loading';
import Navbar from '../Components/Navbar';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import Url from '../Components/Url';
import { EvilIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import * as Location from 'expo-location';
import welcomefarmer from './../assets/old-farmer-scar-on-face-straw-helmet-hat-line-art-mascot-logo-beautiful-vector-art-design-its-422500902.png'
import farmerbackground from './../assets/green-field-tree-blue-skygreat-as-backgroundweb-banner-generative-ai.jpg'
// import adminbackground from './../'
const Dashboard = ({navigation}) => {
  
  const [AddOrder, setAddOrder] = useState(false);
  const [CurrentWarehouse, setCurrentWarehouse] = useState([]);
  
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
      
      const [TransporterAvailableOrders, setTransporterAvailableOrders] = useState([])
    async function get_orders(){
      const token = await AsyncStorage.getItem('Token');
      const resp = await fetch(`${Url()}/transport_view`,{
        method:'GET',
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'  
        },
      })
      const data = await resp.json()
      setTransporterAvailableOrders(data.available_orders)
      setisLoading(false)
    }
    useEffect(()=>{
      if(UserType === "transporter"){
        setisLoading(true)
        get_orders()
      }
    },[UserType])


    const [District, setDistrict] = useState(null);
    const [Latitude, setLatitude] = useState('');
    const [Longitude, setLongitude] = useState('');
    const [WarehouseDetails, setWarehouseDetails] = useState([]);

    async function get_location(){
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      };
      let location = await Location.getCurrentPositionAsync({});
      let coords = location['coords'];
      setLatitude(coords['latitude']);
      setLongitude(coords['longitude']);
      const response = await fetch(`https://geocode.maps.co/reverse?lat=${coords['latitude']}&lon=${coords['longitude']}`)
      const data = await response.json();
      setDistrict(data.address.state_district);
    };

      async function get_warehouse(District){
        const response = await fetch(`${Url()}/get_warehouse/${District}`)
        const data = await response.json();
        setWarehouseDetails(data.warehouses);
      }  

    useEffect(() => {
      if (District === null) {
        // console.log('No location set')
      }
      else{
        get_warehouse(District);
      }
    }, [District]);

    

    useFocusEffect(
      React.useCallback(() => {
        setShowNavbar(false);
        return () => {
        };
      }, [])
    );

    if(isLoading){
      return(
        <Loading/>
      )
    }
    // const [CurrentWarehouse, setCurrentWarehouse] = useState([])
    // const [AddOrder, setAddOrder] = useState(false);
    function add_order(details){
      setCurrentWarehouse(details);
      setAddOrder(true);
    }

  return (
    // <ImageBackground 
    // source={farmerbackground}
    // style={{ flex: 1, resizeMode: 'cover' }}
    // >
    <View style={{flex:1}}>
      <View style={styles.dashboard_view}>
        <View style={styles.page_heading}>
          <Text onPress={()=>setShowNavbar(true)} style={{paddingLeft:10}}><Entypo name="menu" size={24} color="black" /></Text>
          <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>DASHBOARD</Text>
          <Text></Text>
        </View>
        <View style={{borderWidth:1}}></View>
        <View style={{height:'100%'}}>
          <View style={{flexDirection:'row', justifyContent:'center', alignItems:'center', height:'30%', paddingTop:30, paddingHorizontal:30}}>
          { UserType === 'farmer' &&
             <Image source={welcomefarmer} style={{width:'100%', height:'100%'}}/>
          }{
            UserType === 'admin' && 
              <Image source={{uri: 'https://www.turbotech-aero.com/wp-content/uploads/2019/07/team-guerlin.jpg'}} style={{width:'60%', height:'100%'}}/>
          }
          </View>
          <View>
            <Text style={{textAlign:'center', fontSize:30, textTransform:'capitalize', fontFamily:'sans-serif-medium'}}>Welcome {UserType}</Text>
            <View>
              {UserType === 'warehouse' && 
              <View>
                <Text>Hello warehouse</Text>
                <View id='requirement_form' style={{ paddingVertical:4, paddingHorizontal:'2%', borderWidth:1, marginHorizontal:'5%'}}>
                    <View style={{justifyContent:'center', flexDirection:'row'}}><Text style={{fontWeight:'bold'}}>Enter Your Requirements Here</Text></View>
                    <View style={{flexDirection:'row', gap:3}}>
                      <Text>Product</Text>
                      <TextInput type="text" style={{borderWidth:1, width:'55%'}}/>
                      <Text>Quantity</Text>
                      <TextInput type="number"  style={{borderWidth:1, width:'10%'}}/>
                    </View>
                    <TouchableOpacity style={{marginTop:'1%', marginHorizontal:'10%', borderRadius:10}}>
                      <Button style={{}} title='Place Requirement' />
                    </TouchableOpacity>
                </View>
              </View>
              }


              {UserType === 'farmer' && 
              <View style={{}}>              
                <View id='Form_box' style={{ paddingHorizontal:10, paddingVertical:5, marginBottom:'1%'}}>
                  <Text id='Form_box_title' style={{fontSize:18, fontWeight:'bold', marginBottom:'5%'}}>Enter Location to Find Nearby Warehouses</Text>
                  <View id='Enter_district' style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:'10%'}}>
                    <Text>Select District</Text>
                    <TextInput value={District} style={{borderWidth:1, width:'50%', fontSize:18, padding:3}}/>
                    {/* <Dropdown/> */}
                    <EvilIcons onPress={()=>get_location()} name="location" size={40} color="black"/>
                  </View>
                </View>
                {/* <View>
                  <View style={{paddingHorizontal:20, paddingTop:20}}>
                    {WarehouseDetails.map((warehouse, index) => (
                      <Warehousedetails key={index} details={warehouse}/>
                    ))}
                  </View>
                </View> */}
                <Text style={{paddingHorizontal:10, fontSize:20, textDecorationLine:'underline'}}>Available Warehouses</Text>
                <View style={{height:'60%'}}>
                  <FlatList
                    style={{}}
                    data={WarehouseDetails} // Pass the data array
                    keyExtractor={(item, index) => index.toString()} // Provide a unique key for each item
                    renderItem={({ item }) => <Warehousedetails details={item} latitude={Latitude} longitude={Longitude} add_order={add_order}/>} // Render each item using Warehousedetails component
                  />
                </View>
              </View>
              }


              {UserType === 'transporter' && 
              <View><Text>Hello transporter</Text></View>
              }
              <Text style={{fontSize:28}}>Some messages</Text>
              <FlatList
              style = {{borderWidth:1, height:'50%', borderBottomWidth:0,marginHorizontal:10, borderLeftWidth:0, borderRightWidth:0, marginTop:30}}
              data={TransporterAvailableOrders}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => <Waiting_orders details={item}/>}
              />
            </View>
          </View>
        </View>
      </View>
      
      <Modal style={{}} visible={ShowNavbar} transparent={true}>
      <View style={{ flex:1,width:200,}}>
        {ShowNavbar && <Navbar navigation={navigation} path={'dashboard'} setShowNavbar={setShowNavbar}/>}
      </View>
      </Modal>

      <Modal visible={AddOrder} transparent={true}>
              <Placeorder warehouse_details={CurrentWarehouse} setAddOrder={setAddOrder}/>
      </Modal>
    </View>
    // </ImageBackground>
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
      backgroundColor:'green',
      alignItems:'center',
      height:'5%'
    }
})


const Warehousedetails = ({details, latitude, longitude, add_order}) => {
  return(
  <View style={{ borderWidth:2, paddingHorizontal:10, marginBottom:1 }}>
  <Text>Id:{details.id}</Text>
  <Text>Name:{details.name}</Text>
  <Text>Phone:{details.phone}</Text>
  <Text>Type:{details.warehouse_type}</Text>
  <Text>Id:{details.warehouse_global_id}</Text>
  <Text>District:{details.district}</Text>
  <Text>{details.latitude} {latitude} {details.longitude} {longitude}</Text>
  <View style={{flexDirection:'row', alignItems:'center',}}>
    <Text style={{}}><AntDesign name="pluscircle" size={24} color="black" onPress={()=>add_order(details)}/> Book the place to store the Product</Text>
  </View>
  </View>
  )
}

const Placeorder = ({warehouse_details, setAddOrder}) => {
  const product = [
    {label : '🍅 Tomato', value: 'tomato'},
    {label : '🥔 potato', value: 'potato'},
    {label : '🥒 cucumber', value: 'cucumber'},
    {label : '🥕 carrot', value: 'carrot'},
    {label : '🍌 banana', value: 'banana'},
    {label : '🍆 brinjal', value: 'brinjal'}
  ]

  const [value, setValue] = useState('')
  const [Quantity, setQuantity] = useState()

  // async function PlaceOrder(){
  //   const response = await fetch('')
  // }

  async function Bookspace(){
    const token = await AsyncStorage.getItem('Token');
    try{
      const response = await fetch(`${Url()}/placeorder`,{
        method : 'POST',
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'  
        },
        body: JSON.stringify({'product' : value, 'quantity':Quantity, 'warehouse_id': warehouse_details.id})
      })
      const data = await response.json()
      if (data.status){
        setAddOrder(false)
      }
    }
    catch (error){
      console.warn(error)
    }
  }

  return(
    <View style={{flex:1,  justifyContent:'center', alignItems:'center'}}>
      <View style={{backgroundColor:'white', padding:20, borderWidth:1, borderRadius:20}}>
        <Text style={{fontSize:20, fontWeight:'bold'}}>{warehouse_details.name}</Text>
        <Text>Contact Us:{warehouse_details.phone}</Text>
        <View style={{width:'100%'}}>
        <Dropdown 
          style={{borderWidth:1, paddingLeft:10, paddingRight:10, height:25, width:200}}
          data={product}
          maxHeight={250}
          labelField="label"
          valueField="value"
          value={value}
          onChange={item => {
            setValue(item.value);
          }}
          />
          </View>
        <TextInput placeholder='Quantity' keyboardType='decimal-pad' value={Quantity} onChangeText={(Text)=>setQuantity(Text)}/>
        <Button title='Book Space' onPress={()=>Bookspace()}/>
        <Button title='Close' onPress={()=>setAddOrder(false)}/> 
      </View>
    </View>
  )
}

const Waiting_orders = ({details}) => {
  return(
    <View style={{paddingHorizontal:10, borderTopWidth:2}}>
      <Text>{details.order_no}</Text>
      <Text>{details.product}</Text>
      <Text></Text>
    </View>
  )
}