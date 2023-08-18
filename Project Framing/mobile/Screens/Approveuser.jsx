import { Alert, StyleSheet, Text, View, Modal, TextInput, Button, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo ,Fontisto, MaterialIcons, Ionicons, AntDesign, Feather  } from '@expo/vector-icons';
import Url from '../Components/Url';
import Loading from '../Components/Loading';
import Navbar from '../Components/Navbar';
import { Dropdown } from 'react-native-element-dropdown';
import { FA5Style } from '@expo/vector-icons/build/FontAwesome5';
import { EvilIcons } from '@expo/vector-icons';
import * as Location from 'expo-location';


const data = [
    { label : 'All', value : 'all'},
    { label : 'Farmer', value : 'farmer'},
    { label : 'Transporter', value : 'transporter'},
    { label : 'warehouse', value : 'warehouse'}
];

const Approveuser = ({navigation}) => {

    const [value, setValue] = useState('all');
    const [isFocus, setIsFocus] = useState(false);

  const [isLoading, setisLoading] = useState(true);
  const [ShowNavbar, setShowNavbar] = useState(false);

  const [FarmerDetail, setFarmerDetail] = useState(false);
  const [TransporterDetail, setTransporterDetail] = useState(false);
  const [WarehouseDetail, setWarehouseDetail] = useState(false);
  const [removetheuser, setremovetheuser] = useState(false);
  const [moreinapproved, setmoreinapproved] = useState(false);

  const [statustype, setstatustype] = useState('notapproved');
  const [Error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [EditUser, setEditUser] = useState([]);

  const [UserReloadTime, setUserReloadTime] = useState(0);
  const [LastReloadTime, setLastReloadTime] = useState('Updated Few Seconds Ago');

  const [WarehouseType, setWarehouseType] = useState('government');
  const [warehouseid, setwarehouseid] = useState();

  const [VehicleNumber, setVehicleNumber] = useState('');
  const [VehicleName, setVehicleName] = useState('');
  const [LicenseNumber, setLicenseNumber] = useState('');

  const [SearchUser, setSearchUser] = useState();
  const [moreinapproved_option, setmoreinapproved_option] = useState('');  
  // T set the farmer land type
  const [AreaType, setAreaType] = useState('Undefined');
  const [FarmerArea, setFarmerArea] = useState('');
  function setArea(){
    if (parseInt(FarmerArea) < 2){
      setAreaType('Small');
    } else if (parseInt(FarmerArea) >=2 && parseInt(FarmerArea) <5){
      setAreaType('Medium');
    } else{
      setAreaType('Large');
    }
  };
  
  // To set the Details of the users
  const fetchData = async () => {
    setisLoading(true);
    setUserReloadTime(0);
    const token = await AsyncStorage.getItem('Token');
    try {
      const response = await fetch(`${Url()}/user/${statustype}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setisLoading(false);
        setError();
        setLastReloadTime('Updated Few Seconds Ago');
      } else {
        setisLoading(false);
        setError("Unauthorized");
      }
    } catch (error) {
      setisLoading(false);
      setError("An error occurred");
    }
  }; 
  useEffect(() => {  
    
    fetchData();
    
  }, [statustype]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setUserReloadTime(UserReloadTime + 10);
    }, 10000);
    if(UserReloadTime >= 10 && UserReloadTime < 30){
      setLastReloadTime("Updated 10 seconds ago");
    } else if (UserReloadTime >= 30 && UserReloadTime <60){
      setLastReloadTime("Updated 30 Seconds ago");
    } else if (UserReloadTime >= 60) {
      const minutesAgo = Math.floor(UserReloadTime / 60);
      setLastReloadTime(`Updated ${minutesAgo} minutes Ago`);
    }
  
    return () => clearInterval(interval);
  }, [UserReloadTime]);
  
  

  // To pop up the Add_user Modal
  function add_user(user){
    setEditUser(user);
    if (user.role == 'farmer'){
      setFarmerDetail(true);
    } else if (user.role == 'transporter' ){
      setTransporterDetail(true);
    } else if (user.role == 'warehouse'){
      setWarehouseDetail(true);
    } 
  }
  
  // To get Location details by pincode
  const [ErrorMsg, setErrorMsg] = useState('')
  const [PinCode, setPinCode] = useState();
  const [address_of_new_user, setaddressofnewuser] = useState('');
  const [District, setDistrict] = useState(null);
  const [Latitude, setLatitude] = useState('');
  const [Longitude, setLongitude] = useState('');

  function show_more_option (user){
    setmoreinapproved(true);
  }
  
  // To style the view of the users
  const get_user_role = (role) => {
    switch(role){
      case 'farmer':
        return styles.farmer;
        case 'transporter':
          return styles.transporter;
      case 'warehouse':
        return styles.warehouse;
        case 'admin':
        return styles.admin;
      }
    };

    async function add_new_user(){
      try{
        const token = await AsyncStorage.getItem('Token');
        const response = await fetch(`${Url()}/approveuser/${EditUser.id}/${EditUser.role}`,{
          method:'POST',
          headers:{
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'  
          },
          body: JSON.stringify(
            // { 'username':EditUser.name, 'phone':EditUser.phone, 'address':address_of_new_user, 'pincode':PinCode, 'landarea':FarmerArea }
            edit_user_details()
          )
        });
        const data = await response.json();
        if(data.status){
          setFarmerDetail(false);
          setWarehouseDetail(false);
          setTransporterDetail(false);
          setAreaType('undefined');
          setFarmerArea('');
          setaddressofnewuser('');
          setError();
        }
        else{
          Alert.alert(data.msg);
        }
      } catch{
        console.warn("Farmer error");
      }
    }
    

    function edit_user_details (){
      if( FarmerDetail==true ){
        return ({ 'username':EditUser.name, 'phone':EditUser.phone, 'address':address_of_new_user, 'pincode':PinCode, 'landarea':FarmerArea })
      } else if (WarehouseDetail == true){
        return ({ 'username':EditUser.name, 'phone':EditUser.phone, 'address':address_of_new_user, 'warehouse_type':WarehouseType,'pincode':PinCode, 'warehouse_id':warehouseid})
      } else {
        return ({ 'username':EditUser.name, 'phone':EditUser.phone, 'address':address_of_new_user, 'pincode':PinCode, 'vehicle_number':VehicleNumber, 'vehicle_name':VehicleName, 'license_number':LicenseNumber})
      }
    }
  
  function remove_user(user){
    setEditUser(user);
    setremovetheuser(true);
  }
  
  function logout(){
    AsyncStorage.removeItem('Token');
    AsyncStorage.removeItem('IsLoggedIn');
    AsyncStorage.removeItem('role');
    navigation.replace('Login');
  };

  function new_user(){

  }
    
  return (
    <View style={{flex:1,backgroundColor:'lightgreen', paddingVertical:20, paddingHorizontal:10}}>
    <View style={styles.approveuser_view}>
        <View style={styles.page_heading}>
          <Text onPress={()=>setShowNavbar(true)} style={{paddingLeft:10}}><Entypo name="menu" size={24} color="black" /></Text>
          <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>APPROVE USER</Text>
          <Text style={{paddingRight:10}}><Ionicons onPress={()=>fetchData()} name="reload" size={24} color="black" /></Text>
        </View>
      {/* <View style={{justifyContent:'space-between', backgroundColor:'green', margin:10, flexDirection:'row', alignItems:'center', paddingHorizontal:10}}>
        <Text style={{textAlign:'center', fontSize:20, paddingVertical:10, color:'white'}}>Approveuser</Text>
        <Text onPress={logout}><MaterialIcons name="logout" size={24} color="white" /></Text>
      </View> */}
      <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:20, paddingVertical:20}}>
        <Text onPress={()=>setstatustype("approved")}>{statustype == "approved" ?
            <Fontisto name="checkbox-active" size={16} color="black" />
            :
            <Fontisto name="checkbox-passive" size={16} color="black" />
          }
          Approved
        </Text>
        <Text onPress={()=>setstatustype("notapproved")}>{statustype == "notapproved" ?
            <Fontisto name="checkbox-active" size={16} color="black" />
            :
            <Fontisto name="checkbox-passive" size={16} color="black" />
          }
          Not Approved
        </Text>
        <Text onPress={()=>setstatustype("rejected")}>{statustype == "rejected" ?
            <Fontisto name="checkbox-active" size={16} color="black" />
            :
            <Fontisto name="checkbox-passive" size={16} color="black" />
          }
          Rejected
        </Text>
      </View>

      {/* DropDown to select the View User */}
      <View style={{width:'40%', paddingLeft:10}}>
      <Dropdown
          style={{borderWidth:1, paddingLeft:10, paddingRight:10, height:25}}
          data={data}
          maxHeight={250}
          labelField="label"
          valueField="value"
          value={value}
          onFocus={() => setIsFocus(true)}
          onBlur={() => setIsFocus(false)}
          onChange={item => {
            setValue(item.value);
          }}
          
        />
      </View>

      {/* Search Box to search by Name and Phone Number */}
      <TextInput style={{margin:10, borderWidth:1, fontSize:10, paddingLeft:10, }} placeholder='Search by Phone or Name' value={SearchUser} onChangeText={(Text)=>setSearchUser(Text)} keyboardType='email-address'/>
      
          {/* Page Number */}


      <View style={styles.approveuser_content} >
        {isLoading ? <Loading/> :
        <View>
        {(users !== []) ? 
        <View>
          {users.map((user) => {
          {if ( ((user.name).toLowerCase()).includes(SearchUser) || SearchUser == null 
            // || ((user.phone).toString()).includes(SearchUser) 
             && (user.role == value || value == 'all'))
          return (
                <View style={get_user_role(user.role)} key={user.id}>
                  {Error && <Text>{Error}</Text>}
                  <View style={[styles.user_name, {paddingRight:10}]}><Text numberOfLines={1} style={{color:'black'}}>{user.name}</Text></View>
                  <View style={styles.user_role}><Text style={{color:'black'}}>{user.role}</Text></View>
                  <View style={styles.user_phone}><Text style={{color:'black'}}>{user.phone}</Text></View>
                  {statustype === 'approved' && 
                    <View><Text onPress={()=>show_more_option(user)}><Feather name="more-vertical" size={24} color="black" /></Text></View>
                  }
                  {statustype === 'notapproved' &&
                    <View style={styles.user_add}>
                      <Text onPress={()=>add_user(user)}><Entypo name="add-user" size={24} color="black" /></Text>
                      <Text>   </Text>
                      <Text onPress={()=>remove_user(user)}><Entypo name="remove-user" size={24} color="black" /></Text>
                    </View>
                  }
                </View>
              );}
            })}
        </View>
        :
        <View>
          <Text>No Users found as/to {statustype}</Text>
        </View>  
      }
            {/* {if(users == null ){
              
            }} */}
        </View>
        }
      </View>

          {/* For the Farmer Addtional data given by the Admin's */}
      <Modal visible={FarmerDetail} animationType='slide' transparent={true}>
        <View style={styles.model_container}>
          <View style={styles.model_text_container}>
            <Text>Additional Farmer Details</Text>
            <Text style={{paddingVertical:5}}>Name:  {EditUser.name}</Text>
            <Text style={{paddingVertical:5}}>Phone: {EditUser.phone}</Text>
            <View style={{flexDirection:'row', paddingBottom:10}}>
              <TextInput style={{width:'40%', borderWidth:1, height:30, paddingLeft:10, paddingBottom:-10}} placeholder='Land Area' value={FarmerArea} onChangeText={(Text)=>setFarmerArea(Text)} keyboardType='numeric'/>
              <Text>    </Text>
              <TouchableOpacity style={{height:30,}}>
                <Button style={{}} title='Set Area' onPress={setArea}/>
              </TouchableOpacity>
            </View>
            <Text>Farmer Type : {AreaType}</Text>
            <TextInput style={{width:200}} placeholder='Address' onChangeText={(Text)=>setaddressofnewuser(Text)}/>
            {/* <Text><EvilIcons onPress={()=>get_location()} name="location" size={40} color="black"/></Text> */}
            {/* <TextInput value={city} placeholder='City' editable={false}/>
            <TextInput value={district} placeholder='District' editable={false}/>
            <TextInput value={state} placeholder='State' editable={false}/> */}
            <Text></Text>
            <Button title='Save' onPress={()=>add_new_user()}/>
            <Text></Text>
            <Button title='Cancel' onPress={()=>setFarmerDetail(!FarmerDetail)}/>
          </View>
        </View>
      </Modal>

          {/* For the Transporter Additional Data given by the Admin's */}
      <Modal visible={TransporterDetail} animationType='slide' transparent={true}>
          <View style={styles.model_container}>
            <View style={styles.model_text_container}>
              <Text>Additional Transporter Details</Text>
              <Text style={{paddingVertical:5}}>Name:  {EditUser.name}</Text>
              <Text style={{paddingVertical:5}}>Phone: {EditUser.phone}</Text>
              <TextInput placeholder='Vehicle Number' onChangeText={(Text)=>setVehicleNumber(Text)} />
              <TextInput placeholder='Vehicle Name' onChangeText={(Text)=>setVehicleName(Text)} />
              <TextInput placeholder='License Number' onChangeText={(Text)=>setLicenseNumber(Text)} keyboardType='number-pad'/>
              <TextInput style={{width:200}} placeholder='Address' onChangeText={(Text)=>setaddressofnewuser(Text)}/>
              {/* <Text><EvilIcons onPress={()=>get_location()} name="location" size={40} color="black"/></Text> */}
              {/* <TextInput value={city} placeholder='City' editable={false}/>
              <TextInput value={district} placeholder='District' editable={false}/>
              <TextInput value={state} placeholder='State' editable={false}/> */}
              <Button title='Save' onPress={()=>add_new_user()}/>
              <Text></Text>
              <Button title='Cancel' onPress={()=>setTransporterDetail(!TransporterDetail)}/>
            </View>
          </View>
      </Modal>

          {/* For the Warehouse Additional Data given by the Admin's */}
      <Modal visible={WarehouseDetail} animationType='slide' transparent={true}>
        <View style={styles.model_container}>
        <View style={styles.model_text_container}>
          <Text>Additional Warehouse Details</Text>
          <Text style={{paddingVertical:5}}>Name:  {EditUser.name}</Text>
          <Text style={{paddingVertical:5}}>Phone: {EditUser.phone}</Text>
          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            <Text>{WarehouseType == "government" ?
            <Fontisto name="checkbox-active" size={16} color="black" onPress={()=>setWarehouseType("government")}/>
            :
            <Fontisto name="checkbox-passive" size={16} color="black" onPress={()=>setWarehouseType("government")}/>
          } Government</Text>
          <Text>{WarehouseType == "private" ?
            <Fontisto name="checkbox-active" size={16} color="black" onPress={()=>setWarehouseType("private")}/>
            :
            <Fontisto name="checkbox-passive" size={16} color="black" onPress={()=>setWarehouseType('private')}/>
          } Private</Text>
          </View>
          <TextInput placeholder='Warehouse ID' value={warehouseid} onChangeText={(Text)=>setwarehouseid(Text)}/>
          <TextInput style={{width:200}} placeholder='Address' onChangeText={(Text)=>setaddressofnewuser(Text)}/>
          {/* <Text><EvilIcons onPress={()=>get_location()} name="location" size={40} color="black"/></Text> */}
            {/* <TextInput value={city} placeholder='City' editable={false}/>
            <TextInput value={district} placeholder='District' editable={false}/>
            <TextInput value={state} placeholder='State' editable={false}/> */}
            <Button title='Save' onPress={()=>add_new_user()}/> 
            <Text></Text>
            <Button title='Cancel' onPress={()=>setWarehouseDetail(!WarehouseDetail)}/>
        </View>
        </View>
      </Modal>

          {/* For the Admin to remove the user */}
      <Modal visible={removetheuser} animationType='slide' transparent={true}>
        <View style={styles.model_container}>
          <View style={styles.model_text_container}>
            <Text>Reason to Remove the {EditUser.name}</Text>
            <TextInput style={{borderWidth:1, marginVertical:10, borderRadius:20, paddingLeft:10, width:300, height:40}}/>
            <Button title='Save'/>
            <Text></Text>
            <Button title='Cancel' onPress={()=>setremovetheuser(!removetheuser)}/>
          </View>
        </View>
      </Modal>


    </View>
    <Modal style={{}} visible={ShowNavbar} animationType='slide' transparent={true}>
      <View style={{ flex:1,width:200,}}>
        {ShowNavbar && <Navbar navigation={navigation} path={'approveuser'} setShowNavbar={setShowNavbar}/>}
      </View>
    </Modal>

    <Modal visible={moreinapproved} animationType='slide' transparent={true}>
      <View style={styles.model_container}>
        <View style={styles.model_text_container}>
          <Text>Select Option</Text>
          <Text onPress={()=>setmoreinapproved_option('move_to_notapproved')}>
          {moreinapproved_option == "move_to_notapproved" ?
            <Fontisto name="checkbox-active" size={16} color="black" />
            :
            <Fontisto name="checkbox-passive" size={16} color="black" />
          } Move to not approved 
          </Text>
          <Button title='Cancel' onPress={()=>setmoreinapproved(!moreinapproved)}/>
        </View>
      </View>
    </Modal>

      <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent:'flex-start', flex:1}}>
        <View style={{ backgroundColor: 'blue', height: 40, flexDirection: 'row', alignItems: 'center', paddingHorizontal: '5%' }}>
        <Text style={{ fontSize: 16, color: 'white' }}>
            {LastReloadTime}
        </Text>
      </View>
    </View>

    </View>
  )
}

export default Approveuser

const styles = StyleSheet.create({
    model_container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    page_heading:{
      flexDirection:'row',
      justifyContent:'space-between',
      paddingVertical:10,
      backgroundColor:'green'
    },
    model_text_container:{
      borderWidth:1,
      padding:20,
      borderRadius:30,
      backgroundColor: 'white',
    },
    approveuser_view:{
        // marginTop:20,
        // backgroundColor:'rgba(0, 0, 0, 0)'
    },
    approveuser_content:{
      paddingHorizontal:10,
      marginTop:10,
    },
    farmer:{
      flexDirection:'row',
      padding:10,
      backgroundColor:'green',
      borderWidth:1,
      borderColor:'black',
      marginBottom:2,
      justifyContent:'space-between',
    },
    transporter:{
      flexDirection:'row',
      padding:10,
      backgroundColor:'orange',
      borderWidth:1,
      borderColor:'black',
      marginBottom:2,
      justifyContent:'space-between',
    },
    warehouse:{
      flexDirection:'row',
      padding:10,
      backgroundColor:'brown',
      borderWidth:1,
      borderColor:'black',
      marginBottom:2,
      justifyContent:'space-between',
    },
    admin:{
      flexDirection:'row',
      justifyContent:'flex-start',
      padding:10,
      backgroundColor:'pink',
      borderWidth:1,
      borderColor:'black',
      marginBottom:2
    },
    user_name:{
      width:'25%',
    },
    user_role:{
      width:'25%',
    },
    user_phone:{
      width:'30%',
    },
    user_add:{
      flexDirection:'row'
    }
})
