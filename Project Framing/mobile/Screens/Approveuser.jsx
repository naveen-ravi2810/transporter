import { Alert, StyleSheet, Text, View, Modal, TextInput, Button, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Entypo ,Fontisto } from '@expo/vector-icons';

const Approveuser = ({navigation}) => {

  const [FarmerDetail, setFarmerDetail] = useState(false);
  const [TransporterDetail, setTransporterDetail] = useState(false);
  const [WarehouseDetail, setWarehouseDetail] = useState(false);
  const [removetheuser, setremovetheuser] = useState(false);
  const [message, setMessage] = useState(null);
  const [statustype, setstatustype] = useState('notapproved');
  const [Error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const [EditUser, setEditUser] = useState([]);

  const [PinCode, setPinCode] = useState();
  const [address_of_new_user, setaddressofnewuser] = useState('');

  const [city, setcity] = useState('');
  const [district, setdistrict] = useState('');
  const [state, setstate] = useState('');

  const [AreaType, setAreaType] = useState('Undefined');
  const [FarmerArea, setFarmerArea] = useState(0);

  const [WarehouseType, setWarehouseType] = useState('government');
  const [warehouseid, setwarehouseid] = useState();

  function setArea(){
    if (FarmerArea < 2){
      setAreaType('Small');
    } else if (FarmerArea >=2 && FarmerArea <5){
      setAreaType('Medium');
    } else{
      setAreaType('Large');
    }
  };





  useEffect(() => {
    const fetchData = async () => {
      const token = await AsyncStorage.getItem('Token');
      try {
        const response = await fetch(`http://192.168.66.54:5000/user/${statustype}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data.users);
        } else {
          setError("Unauthorized");
        }
      } catch (error) {
        setError("An error occurred");
      }
    };
  
    fetchData();
  }, [statustype]);
  

  function logout(){
    navigation.replace('Login')
  };

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
      console.log(EditUser, address_of_new_user, PinCode, FarmerArea);
      const token = await AsyncStorage.getItem('Token');
      const response = await fetch(`http://192.168.66.54:5000/approveuser/${EditUser.id}/${EditUser.role}`,{
        method:'POST',
        headers:{
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({ 'username':EditUser.name, 'phone':EditUser.phone, 'address':address_of_new_user, 'pincode':PinCode, 'landarea':FarmerArea })
      });
      const data = await response.json();
      console.log(data);
    } catch{
      console.warn("Farmer error");
    }
  }

  async function get_location_by_pincode() {
    try {
      console.log(PinCode);
      const response = await fetch(`https://api.postalpincode.in/pincode/${PinCode}`);
      const data = await response.json();
  
      if (data[0].Status === 'Success') {
        const postOfficeDetails = data[0].PostOffice;
        const final_location_details = postOfficeDetails[0]
        setcity(final_location_details.Block);
        setdistrict(final_location_details.District);
        setstate(final_location_details.State)
      } else {
        console.log('Location details not found.');
      }
    } catch (error) {
      console.log('An error occurred while fetching location details:', error);
    }
  }

  // async function add_farmer(){
  //   try{
  //     response = await fetch('')
  //   } catch {
  //     Alert.alert("Backend Error :)")
  //   }
  // }

  function remove_user(user){
    setEditUser(user);
    setremovetheuser(true);
  }


  return (
    <View style={styles.approveuser_view}>
      <Text>Approveuser</Text>
      <View style={{flexDirection:'row', justifyContent:'space-between', paddingHorizontal:20}}>
        <Text>{statustype == "approved" ?
            <Fontisto name="checkbox-active" size={16} color="black" onPress={()=>setstatustype("approved")}/>
            :
            <Fontisto name="checkbox-passive" size={16} color="black" onPress={()=>setstatustype('approved')}/>
          }
          Approved
        </Text>
        <Text>{statustype == "notapproved" ?
            <Fontisto name="checkbox-active" size={16} color="black" onPress={()=>setstatustype("notapproved")}/>
            :
            <Fontisto name="checkbox-passive" size={16} color="black" onPress={()=>setstatustype('notapproved')}/>
          }
          Not Approved
        </Text>
        <Text>{statustype == "rejected" ?
            <Fontisto name="checkbox-active" size={16} color="black" onPress={()=>setstatustype("rejected")}/>
            :
            <Fontisto name="checkbox-passive" size={16} color="black" onPress={()=>setstatustype('rejected')}/>
          }
          Rejected
        </Text>
      </View>
      <TextInput/>
      <View style={styles.approveuser_content}>
      {users.map((user) => {
            return (
              <View style={get_user_role(user.role)} key={user.id}>
                <View style={styles.user_name}><Text style={{color:'black'}}>{user.name}</Text></View>
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
            );
          })}
      </View>
      <Text onPress={logout}>Logout</Text>

          {/* For the Farmer Addtional data given by the Admin's */}
      <Modal visible={FarmerDetail} animationType='slide' transparent={true}>
        <View style={styles.model_container}>
          <View style={styles.model_text_container}>
            <Text>Additional Farmer Details</Text>
            <Text style={{paddingVertical:5}}>Name:  {EditUser.name}</Text>
            <Text style={{paddingVertical:5}}>Phone: {EditUser.phone}</Text>
            <View style={{flexDirection:'row'}}>
              <TextInput placeholder='Land Area' value={FarmerArea} onChangeText={(Text)=>setFarmerArea(Text)} keyboardType='numeric'/>
              <TouchableOpacity>
                <Button title='Set Area' onPress={setArea}/>
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
  )
}

export default Approveuser

const styles = StyleSheet.create({
    model_container:{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    model_text_container:{
      borderWidth:1,
      padding:20,
      borderRadius:30,
      backgroundColor: 'white',
    },
    approveuser_view:{
        marginTop:20,
        backgroundColor:'rgba(0, 0, 0, 0)'
    },
    approveuser_content:{
      paddingHorizontal:10,
      marginTop:10
    },
    farmer:{
      flexDirection:'row',
      padding:10,
      backgroundColor:'green',
      borderWidth:1,
      borderColor:'black'
    },
    transporter:{
      flexDirection:'row',
      padding:10,
      backgroundColor:'orange',
      borderWidth:1,
      borderColor:'black'
    },
    warehouse:{
      flexDirection:'row',
      padding:10,
      backgroundColor:'brown',
      borderWidth:1,
      borderColor:'black'
    },
    admin:{
      flexDirection:'row',
      padding:10,
      backgroundColor:'pink',
      borderWidth:1,
      borderColor:'black'
    },
    user_name:{
      width:100,
    },
    user_role:{
      width:100,
    },
    user_phone:{
      width:100,
    },
    user_add:{
      flexDirection:'row'
    }
})
