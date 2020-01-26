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
import {Database, Auth, Storage} from '../../config/Firebase/firebase';

import AsyncStorage from '@react-native-community/async-storage';
import RNFetchBlob from 'rn-fetch-blob';
import ImagePicker from 'react-native-image-picker';

class EditProfile extends Component {
  //Name, DOB, Address, Gender, Email, Phone

  constructor(props) {
    super(props);

    this.state = {
      userId: null,
      permissionsGranted: null,
      errorMessage: null,
      location: [],
      photo: null,
      imageUri: null,
      imgSource: '',
      city: '',

      loading: false,
      updatesEnabled: false,
      editable: true,
      uploading: false,
      dialogVisible: false,

    };

    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAddress = await AsyncStorage.getItem('user.address');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    const userEmail = await AsyncStorage.getItem('user.email');
    this.setState({userId, userName, userAvatar, userEmail, userAddress});

    Database
      .ref(`/user/${userId}`)
      .on('value', snapshot => {
        let data = snapshot.val();
        console.log('snapshot data', data);
      });
  };

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  changeImage = async type => {
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
    };

    let cameraPermission =
      (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    if (!cameraPermission) {
      console.log('camera');
      cameraPermission = await this.requestCameraPermission();
    } else {
      console.log('image');
      ImagePicker.showImagePicker(options, response => { //option
        console.log('xxx', response);
        ToastAndroid.show(
          'Please wait, your photo is being uploaded',
          ToastAndroid.LONG,
        );
        let uploadBob = null;
        const imageRef = Storage
          .ref('avatar/' + this.state.userId)
          .child('photo');
        fs.readFile(response.path, 'base64')
          .then(data => {
            return Blob.build(data, {type: `;BASE64`});
          })
          .then(blob => {
            uploadBob = blob;
            return imageRef.put(blob, {contentType: `image/jpeg`});
          })
          .then(() => {
            uploadBob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            ToastAndroid.show(
              'All set!',
              ToastAndroid.LONG,
            );
            Database
              .ref('user/' + this.state.userId)
              .update({photo: url});
            this.setState({userAvatar: url});
            AsyncStorage.setItem('user.photo', this.state.userAvatar);
          })

          .catch(err => console.log(err));
      });
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#541C2C" barStyle="light-content"/>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}>
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
                <Image
                source={{uri: this.state.userAvatar}}
                style={{height: 100, aspectRatio: 1 / 1, borderRadius: 130 / 2}}
              />
              </View>
              <View>
              <TouchableOpacity onPress={this.changeImage}>
                <Text
                  style={{
                    fontSize: 18,
                    color: '#E75A5F',
                    fontFamily: 'AirbnbCerealBold',
                    paddingLeft: 20,
                  }}>
                  Upload Your Avatar
                </Text>
                </TouchableOpacity>
              </View>
            
          </View>
          <View style={styles.btnSection}>
            <View style={styles.btn}>
              <Text>Name</Text>
              <TextInput
                placeholder="Full name"
                value={this.state.userName}
                style={{
                  borderBottomWidth: 0.5,
                  borderColor: 'gray',
                  height: 40,
                  paddingLeft: 0,
                }}
              />
            </View>
            {/* <View style={styles.btn}>
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
            </View> */}
           
            <View style={styles.btn}>
              <Text>Email</Text>
              <TextInput
                editable={false}
                value={this.state.userEmail}
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('Profile')}>
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
    backgroundColor: '#7D2941',
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
    backgroundColor: '#7D2941',
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
    backgroundColor: '#7D2941',
    width: '100%',
    height: 45,
    borderRadius: 40,
  },
});

//Name, DOB, Address, Gender, Email, Phone
