import { Alert, Button, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react';
import { Fontisto } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import Url from '../Components/Url';
import { EvilIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { AntDesign, Entypo } from '@expo/vector-icons';

const Register = ({navigation}) => {

  const [username, setusername] = useState('');
  const [userpassword, setuserpassword] = useState('');
  const [userphone, setuserphone] = useState('');
  const [userrole, setuserrole] = useState('farmer');
  const [agreetermasandcondition, setagreetermasandcondition] = useState(false);
  const [District, setDistrict] = useState('')
  const [Latitude, setLatitude] = useState('');
  const [Longitude, setLongitude] = useState('')
  const [showpasswordstatus, setshowpasswordstatus] = useState(false);

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

  async function register(){
    const response = await fetch(`${Url()}/register`,{
      method:'POST',
      headers : { 'Content-Type': 'application/json' },
      body : JSON.stringify({ 'name' : username ,'password' : userpassword, 'phone': userphone ,'role':userrole, 'latitude':Latitude, 'longitude':Longitude, 'district':District })
    });
    const data = await response.json();
    if ( data.status ){
      // Need to display register successful message
      Alert.alert("Register Successfull, The team will contact you in two days");
      navigation.replace('Login');
    }
    Alert.alert("Register Successfull, The team will contact you in two days");
  }

  return (
    <View style={styles.register_page}>
      <View style={styles.create_account_view}>
        <Text style={styles.create_account_text}>Create Account</Text>
      </View>
      <View>
        <TextInput style={styles.users_input} placeholder='User name' onChangeText={(Text)=>setusername(Text)} />
        <View style={{flexDirection:'row', borderWidth:1, borderRadius:20, marginHorizontal:10, paddingVertical:10, borderColor:'green', justifyContent:'space-between', paddingHorizontal:10}}>
          <TextInput placeholder='Password' style={{fontSize:20}} secureTextEntry={showpasswordstatus? false : true} onChangeText={(Text)=>setuserpassword(Text)}/>
              {
                  showpasswordstatus ? 
                  <AntDesign name="eye" size={24} color="black" onPress={()=>setshowpasswordstatus(!showpasswordstatus)}/>
                  :
                  <Entypo name="eye-with-line" size={24} color="black" onPress={()=>setshowpasswordstatus(!showpasswordstatus)}/>
              }
          </View>
        <TextInput style={styles.users_input} placeholder='Phone' keyboardType='phone-pad' onChangeText={(Text)=>setuserphone(Text)}/>
      </View>
      <View>
        <Text style={styles.choose_role_text}>Choose Your Role</Text>
        <View style={styles.select_user_role}>
          <View style={styles.user_option_select}>
            { userrole === 'farmer'?
            <Ionicons name="radio-button-on-sharp" size={24} color="darkgreen" />
            :
            <Ionicons name="radio-button-off-sharp" size={24} color="lightgreen" onPress={()=>setuserrole('farmer')}/>
            }<Text> Farmer</Text>
          </View>
          <View style={styles.user_option_select}>
            { userrole === 'transporter'?
            <Ionicons name="radio-button-on-sharp" size={24} color="darkgreen" />
            :
            <Ionicons name="radio-button-off-sharp" size={24} color="lightgreen" onPress={()=>setuserrole('transporter')}/>
            }<Text> Transporter</Text>
          </View>
          <View style={styles.user_option_select}>
            { userrole === 'warehouse'?
            <Ionicons name="radio-button-on-sharp" size={24} color="darkgreen" />
            :
            <Ionicons name="radio-button-off-sharp" size={24} color="lightgreen" onPress={()=>setuserrole('warehouse')}/>
            }<Text> Warehouse</Text>
          </View>
        </View>
        {
          (userrole === "warehouse" || userrole ===  "transporter")  && 
          <View>
          <View id='Location_get' style={{marginTop:'2%',borderRadius:20,paddingLeft:10,paddingVertical:10,flexDirection:'row',marginHorizontal:10, borderWidth:1, alignItems:'center'}}>
            <Text style={{marginRight:'3%'}}><EvilIcons style={{}} onPress={()=>get_location()} name="location" size={30} color="darkgreen"/></Text>
            <TextInput style={{fontSize:20}} placeholder='District' value={District} editable={false}/>
          </View>
          <View style={{flexDirection:'row',gap:4, alignItems:'center',marginHorizontal:20,marginTop:'1%'}}>
          <Text><AntDesign name="infocirlce" size={17} color="black" /></Text><Text style={{fontSize:13, color:'red'}}>Make sure that you are in the Warehouse</Text>
          </View>
          </View>
        }
        <View>
        </View>
      </View>
      <View style={styles.terms_and_condition_view}>
          {!agreetermasandcondition ?
            <Fontisto name="checkbox-passive" size={16} color="black" onPress={()=>setagreetermasandcondition(!agreetermasandcondition)}/>
            :
            <Fontisto name="checkbox-active" size={16} color="black" onPress={()=>setagreetermasandcondition(!agreetermasandcondition)}/>
          }
        <Text>  By clicking the checkbox you can agree the </Text>
      </View>
      <Text style={styles.terms_amd_conditions} 
      // onPress={}
      >terms and conditions.</Text>
      <TouchableOpacity style={styles.btn_register} disabled={agreetermasandcondition ? false : true} onPress={register}>
        <Text style={styles.register_text}>
          Register
        </Text>
      </TouchableOpacity>
      <Text
      onPress={()=>navigation.replace("Login")}>{'<<'}back to login</Text>
    </View>
  )
}

export default Register

const styles = StyleSheet.create({
  register_page:{
    flex:1,
    flexDirection:'column',
    justifyContent:'center',
  },
  create_account_text:{
    fontSize:30,
    textAlign:'center'
  },
  create_account_view:{
    paddingVertical:20
    
  },
  show_password_view:{
    flexDirection:'row',
    marginLeft:20
  },
  users_input:{
    borderColor:'green',
    borderWidth:1,
    fontSize:20,
    margin:10,
    borderRadius:20,
    paddingLeft:10,
    paddingVertical:10
  },
  choose_role_text:{
    paddingLeft:20,
    paddingBottom:10
  },
  select_user_role:{
    flexDirection:'row',
    justifyContent:'space-between',
    paddingHorizontal:20
  },
  user_option_select:{
    flexDirection:'row'
  },
  btn_register:{
    marginTop:10,
    marginBottom:20,
    borderWidth:1,
    padding:10,
    borderRadius:20,
    marginHorizontal:10
  },
  register_text:{
    textAlign:'center',
    fontWeight:'bold',
    fontSize:18
  },
  terms_and_condition_view:{
    paddingLeft:20,
    paddingTop:20,
    flexDirection:'row',
    alignItems:'center'
  },
  terms_amd_conditions:{
    paddingLeft:20,
    color:'blue'
  }
})