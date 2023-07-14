import { Button, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../Components/Loading';
import Navbar from '../Components/Navbar';
import { Entypo } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';
import Url from '../Components/Url';
import { EvilIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const Dashboard = ({navigation}) => {

  const [location, setLocation] = useState(null)
  async function getLocation(){
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    };
    let location = await Location.getCurrentPositionAsync({});
    console.log("Fine da parama")
    setCurrentLocationCoord(location);
  };
  const [CurrentLocationCoord, setCurrentLocationCoord] = useState('');
  
  // Use Effect to find district name by location co-ordinates
  useEffect(()=>{
    if (!CurrentLocationCoord == ''){
      let coords = CurrentLocationCoord['coords'];
      get_district_by_lat_lon(coords['latitude'], coords['longitude'])
    }
  },[CurrentLocationCoord]);

  const [CurrentDistrictName, setCurrentDistrictName] = useState('')
  async function get_district_by_lat_lon(lat, long){
    const response = await fetch(`https://geocode.maps.co/reverse?lat=${lat}&lon=${long}`)
    const data = await response.json();
    console.log(data.address.state_district);
    setCurrentDistrictName(data.address.state_district)
  }

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
        show_district()
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

    const [District, setDistrict] = useState([]);

    async function show_district(){
      const response =await fetch('http://192.168.3.54:1000/list_all_district')
      const data = await response.json();
      setDistrict(data.district)
    }
    const [CurrentDistrictNo, setCurrentDistrictNo] = useState(1);

    // Get warehouse details
    const [Warehouse, setWarehouse] = useState([]);
    useEffect(()=>{
      getWarehouseinlocation();
    },[CurrentDistrictNo])
    async function getWarehouseinlocation(){
      const response = await fetch(`${Url()}/get_warehouse/${(CurrentDistrictNo).toString()}`);
      const data = await response.json();
      setWarehouse(data.warehouses);
    }

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
    <View style={{flex:1,backgroundColor:'lightgreen'}}>
      <View style={styles.dashboard_view}>
        <View style={styles.page_heading}>
          <Text onPress={()=>setShowNavbar(true)} style={{paddingLeft:10}}><Entypo name="menu" size={24} color="black" /></Text>
          <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>DASHBOARD</Text>
          <Text></Text>
        </View>
        <View style={{borderWidth:1, borderColor:'white'}}></View>
        <View style={{height:'30%', backgroundColor:'white'}}>
          <View>
            <Text>Welcome {UserType},</Text>
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
              <View>
                <Text>Hello farmer</Text>
                <View style={{borderWidth:1}}>
                  <Text style={{textAlign:'center', color:'orange', fontSize:28}}>Enter Location</Text>
                  <View id='availability_form'>
                    <View style={{flexDirection:'row', alignItems:'center', paddingHorizontal:5, columnGap:10}}>
                      <Text style={{fontSize:25, textDecorationLine:'underline'}}>Select District</Text>
                      <Dropdown
                        style={{borderWidth:1, paddingLeft:10, paddingRight:10, width:'40%'}}
                        data={District}    
                        search
                        searchPlaceholder="Search District"
                        placeholder={CurrentDistrictName}
                        maxHeight='80%'
                        labelField="district"
                        valueField="district"
                        value={'district'}
                        onChange={item => {
                          setCurrentDistrictNo(item.id);
                          setCurrentDistrictName(item.district);
                        // style={{borderWidth:1, paddingLeft:10, paddingRight:10, height:25}}
                        // data={District}
                        // maxHeight={250}
                        // labelField="label"
                        // valueField="value"
                        // value={'district'}
                        // onFocus={() => setIsFocus(true)}
                        // onBlur={() => setIsFocus(false)}
                        // onChange={item => {
                        //   setCurrentDistrictNo(item.id);
                        }}
                      />
                      <EvilIcons onPress={()=>getLocation()} name="location" size={40} color="black" />
                    </View>
                    <Text>{CurrentDistrictNo}</Text>
                  </View>
                </View>
              </View>
              }
              {UserType === 'transporter' && 
              <View><Text>Hello transporter</Text></View>
              }
            </View>
          </View>
        </View>
        <View style={{height:'50%', backgroundColor:'black'}}>

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
      backgroundColor:'green',
      alignItems:'center',
      height:'5%'
    }
})