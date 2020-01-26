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
  ToastAndroid
} from 'react-native';
import {Icon} from 'react-native-elements';
import {Database, Auth} from '../../config/Firebase/firebase';

import AsyncStorage from '@react-native-community/async-storage';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idUser: null,
    };
  }

  

  componentDidMount = async () => {
    const idUser = await AsyncStorage.getItem('userid');
    const fullName = await AsyncStorage.getItem('user.name');
    const address = await AsyncStorage.getItem('user.address');
    const avatar = await AsyncStorage.getItem('user.photo');
    console.log('huboo', await idUser);
    this.setState({idUser, fullName, address, avatar});
  };
  
  handleLogout = async () => {
    await AsyncStorage.getItem('userid')
      .then(async userid => {
        Database.ref('user/' + userid).update({status: 'Offline'});
        await AsyncStorage.clear();
        Auth.signOut();
        ToastAndroid.show('Logout Success! See you ...', ToastAndroid.LONG);
      })
      .catch(error =>
        this.setState({
          errorMessage: error.message,
        }),
      );
    console.log('logut', this.handleLogout);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#029C9C" barStyle="light-content" />
        <View style={styles.header}>
          <View style={styles.photo}>
            <Image
              source={{uri: this.state.avatar}}
              style={{height: 130, aspectRatio: 1 / 1, borderRadius: 130 / 2}}
            />
          </View>
          <View style={styles.name}>
            <Text
              style={{
                fontSize: 28,
                color: 'white',
                fontFamily: 'AirbnbCerealExtraBold',
              }}>
              {this.state.fullName}
            </Text>
            {/* </View>
          <View style={styles.address}> */}
            <Text
              style={{
                fontSize: 20,
                color: 'white',
                fontFamily: 'AirbnbCerealLight',
              }}>
              {this.state.address}
            </Text>
          </View>
        </View>
        <View style={styles.btnSection}>
          <View style={styles.btn}>
            <TouchableOpacity
              style={styles.touchBtn}
              onPress={() => this.props.navigation.navigate('EditProfile')}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'AirbnbCerealBold',
                }}>
                Edit Profile
              </Text>
              <Icon name="chevron-right" size={16} type="font-awesome" />
            </TouchableOpacity>
          </View>
          <View style={styles.btn}>
            <TouchableOpacity style={styles.touchBtn}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'AirbnbCerealBold',
                }}>
                About us
              </Text>
              <Icon name="chevron-right" size={16} type="font-awesome" />
            </TouchableOpacity>
          </View>
          <View style={styles.btn}>
            <TouchableOpacity style={styles.touchBtn} onPress={this.handleLogout}>
              <Text
                style={{
                  fontSize: 16,
                  color: 'black',
                  fontFamily: 'AirbnbCerealBold',
                }}>
                Log Out
              </Text>
              <Icon name="chevron-right" size={16} type="font-awesome" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: '50%',
    backgroundColor: '#00A8A8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  photo: {
    height: 130,
    aspectRatio: 1 / 1,
    borderRadius: 130 / 2,
    backgroundColor: 'gray',
    justifyContent: 'center',
  },
  name: {
    height: 50,
    width: '75%',
    marginTop: 10,
    backgroundColor: '#00A8A8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  address: {
    height: 50,
    width: '60%',
    backgroundColor: '#00A8A8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnSection: {
    height: '30%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    width: '90%',
    height: '25%',
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
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
});
