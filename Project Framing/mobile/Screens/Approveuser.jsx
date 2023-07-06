import { Alert, StyleSheet, Text, View, Modal, TextInput, Button, TouchableOpacity, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo ,Fontisto, MaterialIcons } from '@expo/vector-icons';
import Url from '../Components/Url';
import Loading from '../Components/Loading';
import Navbar from '../Components/Navbar';

const Approveuser = ({navigation}) => {

  const [isLoading, setisLoading] = useState(true);
  const [ShowNavbar, setShowNavbar] = useState(false);

  const [FarmerDetail, setFarmerDetail] = useState(false);
  const [TransporterDetail, setTransporterDetail] = useState(false);
  const [WarehouseDetail, setWarehouseDetail] = useState(false);
  const [removetheuser, setremovetheuser] = useState(false);
  const [message, setMessage] = useState(null);
  const [statustype, setstatustype] = useState('notapproved');
  const [Error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [EditUser, setEditUser] = useState([]);

  const [WarehouseType, setWarehouseType] = useState('government');
  const [warehouseid, setwarehouseid] = useState();

  const [SearchUser, setSearchUser] = useState();
  
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
  useEffect(() => {
    const fetchData = async () => {
      setisLoading(true);
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
        } else {
          setError("Unauthorized");
        }
      } catch (error) {
        setError("An error occurred");
      }
    };   
    fetchData();
  }, [statustype]);
  
  // To pop up the Add_user Modal
  function add_user(user){
    setEditUser(user);
    if (user.role == 'farmer'){
      setFarmerDetail(true);
    } else if (user.role == 'transporter' ){
      setTransporterDetail(true);
    } else{
      setWarehouseDetail(true);
    }
  }
  
  // To get Location details by pincode
  const [PinCode, setPinCode] = useState();
  const [address_of_new_user, setaddressofnewuser] = useState('');
  const [city, setcity] = useState('');
  const [district, setdistrict] = useState('');
  const [state, setstate] = useState('');
  async function get_location_by_pincode() {
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${PinCode}`);
      const data = await response.json();
      
      if (data[0].Status === 'Success') {
        const postOfficeDetails = data[0].PostOffice;
        const final_location_details = postOfficeDetails[0]
        setcity(final_location_details.Block);
        setdistrict(final_location_details.District);
        setstate(final_location_details.State)
      } else {
        Alert.alert('Location details not found.');
      }
    } catch (error) {
      console.log('An error occurred while fetching location details:', error);
    }
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
    
    async function add_farmer(event){
      event.preventDefault();
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
          setcity('');
          setdistrict('');
          setstate('');
          setPinCode('');
          setError();
        }
        else{
          Alert.alert(data.msg);
        }
      } catch{
        console.warn("Farmer error");
      }
    };

    function edit_user_details (){
      return ({ 'username':EditUser.name, 'phone':EditUser.phone, 'address':address_of_new_user, 'pincode':PinCode, 'landarea':FarmerArea })
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
    
  return (
    <View style={{flex:1,backgroundColor:'lightgreen', paddingVertical:20, paddingHorizontal:10}}>
    <View style={styles.approveuser_view}>
        <View style={styles.page_heading}>
          <Text onPress={()=>setShowNavbar(true)} style={{paddingLeft:10}}><Entypo name="menu" size={24} color="black" /></Text>
          <Text style={{fontSize:20, color:'white', fontWeight:'bold'}}>APPROVE USER</Text>
          <Text></Text>
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

      {/* Search Box to search by Name and Phone Number */}
      <TextInput style={{margin:10, borderWidth:1, fontSize:10, paddingLeft:10, }} placeholder='Search by Phone or Name' value={SearchUser} onChangeText={(Text)=>setSearchUser(Text)} keyboardType='email-address'/>
      

      <View style={styles.approveuser_content}>
        {isLoading ? <Loading/> :
        <View >
        {(users !== []) ? 
        <View>
          {users.map((user) => {
          {if ( ((user.name).toLowerCase()).includes(SearchUser) || SearchUser == null 
            // || ((user.phone).toString()).includes(SearchUser) 
            )
          return (
                <View style={get_user_role(user.role)} key={user.id}>
                  <View style={[styles.user_name, {paddingRight:10}]}><Text numberOfLines={1} style={{color:'black'}}>{user.name}</Text></View>
                  <View style={styles.user_role}><Text style={{color:'black'}}>{user.role}</Text></View>
                  <View style={styles.user_phone}><Text style={{color:'black'}}>{user.phone}</Text></View>
                  {statustype == 'notapproved' &&
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
            <TextInput style={{width:200}} placeholder='Address' value={address_of_new_user} onChangeText={(Text)=>setaddressofnewuser(Text)}/>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <TextInput style={{marginRight:10}} onChangeText={(Text)=>setPinCode(Text)} keyboardType='phone-pad' placeholder='Pincode'/>
              <Text onPress={get_location_by_pincode}>Verify</Text>
            </View>
            <TextInput value={city} placeholder='City' editable={false}/>
            <TextInput value={district} placeholder='District' editable={false}/>
            <TextInput value={state} placeholder='State' editable={false}/>
            <Text></Text>
            <Button title='Save' onPress={add_farmer}/>
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
              <TextInput placeholder='Vehicle Number'/>
              <TextInput placeholder='Vehicle Name' />
              <TextInput placeholder='License Number' />
              <TextInput style={{width:200}} placeholder='Address'/>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <TextInput style={{marginRight:10}} onChangeText={(Text)=>setPinCode(Text)} keyboardType='phone-pad' placeholder='Pincode'/>
                <Text onPress={get_location_by_pincode}>Verify</Text>
              </View>
              <TextInput value={city} placeholder='City' editable={false}/>
              <TextInput value={district} placeholder='District' editable={false}/>
              <TextInput value={state} placeholder='State' editable={false}/>
              <Button title='Save'/>
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
          <TextInput placeholder='Warehouse ID' onChangeText={(Text)=>setwarehouseid(Text)}/>
          <TextInput style={{width:200}} placeholder='Address'/>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <TextInput style={{marginRight:10}} onChangeText={(Text)=>setPinCode(Text)} keyboardType='phone-pad' placeholder='Pincode'/>
              <Text onPress={get_location_by_pincode}>Verify</Text>
            </View>
            <TextInput value={city} placeholder='City' editable={false}/>
            <TextInput value={district} placeholder='District' editable={false}/>
            <TextInput value={state} placeholder='State' editable={false}/>
            <Button title='Save'/>
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
    <Modal style={{}} visible={ShowNavbar} transparent={true}>
      <View style={{ flex:1,width:200,}}>
        {ShowNavbar && <Navbar navigation={navigation} path={'approveuser'} setShowNavbar={setShowNavbar}/>}
      </View>
      </Modal>
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
