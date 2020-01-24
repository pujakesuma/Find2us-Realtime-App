import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Image,
  ActivityIndicator,
  TextInput,
  ImageBackground,
  Picker,
  StatusBar,
  ScrollView,
  ToastAndroid,
  PermissionsAndroid,
  BackHandler,
} from 'react-native';
import {Icon} from 'react-native-elements';
import DatePicker from 'react-native-datepicker';
import firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'react-native-fetch-blob';
import ImagePicker from 'react-native-image-picker'

class EditProfile extends Component {
//Name, DOB, Address, Gender, Email, Phone

  constructor(props){
    super(props);

    this.state = {
      uri: '',
      editable: true,
      data: {},

      name: '',
      dob: '',
      address: '',
      gender: 'Male',
      phone: '',
    };
  }

  addData = async () => {
    const {name, dob, address, gender, phone} = this.state
    const uid = firebase.auth().currentUser.uid
    const ref = firebase.database().ref(`/users/${uid}`)
    await ref.set({
      uid,
      name,
      dob,
      address,
      gender,
      phone,
      date: new Date().getTime()
    })
  }

  async componentDidMount(){
    let data = await firebase.auth().currentUser
    await this.setState({
      data: data
    })
    console.log('data asli', this.state.data)
  }

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#029C9C" barStyle="light-content" />
        <View style={styles.header}>
          <TouchableOpacity>
            <Icon
              name="arrow-left"
              size={18}
              type="font-awesome"
              color="white"
            />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              color: 'white',
              fontFamily: 'AirbnbCerealBold',
              paddingLeft: 20,
            }}>
            Edit Profile
          </Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.photoSection}>
            <View style={styles.photo}>
              <Text
                style={{
                  fontSize: 10,
                  color: 'white',
                  fontFamily: 'AirbnbCerealLight',
                }}>
                Your photo
              </Text>
            </View>
            <Text
              style={{
                fontSize: 18,
                color: '#FD866E',
                fontFamily: 'AirbnbCerealBold',
                paddingLeft: 20,
              }}>
              Upload Your Avatar
            </Text>
          </View>
          <View style={styles.btnSection}>
            <View style={styles.btn}>
              <Text>Name</Text>
              <TextInput
                placeholder="Full name"
                onChangeText={(value, index) => {
                  this.setState({name: value})
                }}
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: 'gray',
                  height: 40,
                  paddingLeft: 0,
                }}
              />
            </View>
            <View style={styles.btn}>
              <Text>Date of Birth</Text>
              <DatePicker
                style={{width: 150}}
                date={this.state.dob}
                mode="date"
                placeholder="Select date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                
                showIcon={false}
                onDateChange={date => {
                  this.setState({dob: date});
                }}
              />
            </View>
            <View style={styles.btn}>
              <Text>Address</Text>
              <TextInput
                placeholder="Address"
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: 'gray',
                  height: 40,
                  paddingLeft: 0,
                }}
              />
            </View>
            <View style={styles.btn}>
              <Text>Gender</Text>
              <TextInput
                placeholder="Gender"
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: 'gray',
                  height: 40,
                  paddingLeft: 0,
                }}
              />
            </View>
            <View style={styles.btn}>
              <Text>Email</Text>
              <TextInput
                editable={false}
                value={this.state.data.email}
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: 'gray',
                  height: 40,
                  paddingLeft: 0,
                }}
              />
            </View>
            <View style={styles.btn}>
              <Text>Phone</Text>
              <TextInput
                placeholder="Phone"
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: 'gray',
                  height: 40,
                  paddingLeft: 0,
                }}
              />
            </View>
          </View>
        </ScrollView>
        <View style={styles.floatingButton}>
          <TouchableOpacity style={styles.button} onPress={() => this.addData()}>
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontFamily: 'AirbnbCerealExtraBold',
              }}>
              Update
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 55,
    backgroundColor: '#00A8A8',
    flexDirection: 'row',
    paddingLeft: '6%',
    alignItems: 'center',
  },
  photoSection: {
    height: 130,
    backgroundColor: 'white',
    flexDirection: 'row',
    paddingLeft: '6%',
    alignItems: 'center',
  },
  photo: {
    height: 90,
    aspectRatio: 1 / 1,
    borderRadius: 90 / 2,
    backgroundColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSection: {
    height: 500,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  btn: {
    width: '90%',
    height: 55,
    backgroundColor: 'white',
    marginVertical: 5,
  },
  touchBtn: {
    width: '90%',
    height: '25%',
    borderRadius: 25,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
  floatingButton: {
    position: 'absolute',
    width: '90%',
    height: 45,
    borderRadius: 40,
    backgroundColor: '#FD866E',
    alignSelf: 'center',
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 22,
    elevation: 2,
  },
  button: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD866E',
    width: '100%',
    height: 45,
    borderRadius: 40,
  },
});

//Name, DOB, Address, Gender, Email, Phone
