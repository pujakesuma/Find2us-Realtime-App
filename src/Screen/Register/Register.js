import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {Database, Auth} from '../../config/Firebase/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {error} from 'react-native-gifted-chat/lib/utils';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      name: '',
      email: '',
      password: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
    };
  }

  //get permissions
  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied by User',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked by User',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  //get location
  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
          console.warn(position);
        },
        error => {
          this.setState({errorMessage: error, loading: false});
          console.warn(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 8000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };

  componentDidMount = async () => {
    await this.getLocation();
  };

  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

  handleRegister = () => {
    const {email, name, password} = this.state;
    //Validation
    if (name.length < 1) {
      ToastAndroid.show('Please input your fullname', ToastAndroid.LONG);
    } else if (email.length < 5) {
      ToastAndroid.show(
        'Please input your valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 8) {
      ToastAndroid.show(
        'Password must be at least 8 characters',
        ToastAndroid.LONG,
      );
    } else {
      Auth.createUserWithEmailAndPassword(email, password)
        .then(response => {
          console.log('responsee', response);
          response.user.updateProfile({
            displayName: this.state.name,
          });
          Database.ref('/user/' + response.user.uid)
            .set({
              name: this.state.name,
              status: 'Offline',
              email: this.state.email,
              photo:
                'https://www.brettlarkin.com/wp-content/uploads/2017/12/Profile01-RoundedBlack-512-300x300.png',
              latitude: this.state.latitude,
              longitude: this.state.longitude,
              id: response.user.uid,
            })
            .catch(error => {
              ToastAndroid.show(error.message, ToastAndroid.LONG);
              this.setState({
                name: '',
                email: '',
                password: '',
              });
            });
          ToastAndroid.show('Successfully Registered!', ToastAndroid.LONG);
          Database.ref('user/')
            .orderByChild('/email')
            .equalTo(email)
            .once('value', result => {
              let data = result.val();
              console.log('dataa', data);
              if (data !== null) {
                let user = Object.values(data);
                console.log('data yg mau k', user);
                AsyncStorage.setItem('user.email', user[0].email);
                AsyncStorage.setItem('user.name', user[0].name);
                AsyncStorage.setItem('user.photo', user[0].photo);
                AsyncStorage.setItem(
                  'user.latitude',
                  JSON.stringify(user[0].latitude),
                );
                AsyncStorage.setItem(
                  'user.longitude',
                  JSON.stringify(user[0].longitude),
                );
              }
            });
          AsyncStorage.setItem('userid', response.user.uid);
          AsyncStorage.setItem('user', JSON.stringify(response.user));
        })
        .catch(error => {
          this.setState({
            errorMessage: error.message,
            name: '',
            email: '',
            password: '',
          });
          ToastAndroid.show(this.state.errorMessage.message, ToastAndroid.LONG);
        });
    }
    console.log('tessss handle', this.handleRegister);
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View
          style={{
            height: 30,
            flexWrap: 'wrap',
            alignSelf: 'baseline',
            marginLeft: 16,
            marginBottom: 24
          }}>
          <Text
            style={{
              color: '#7D2941',
              fontSize: 34,
              fontFamily: 'AirbnbCerealBold',
            }}>
            Getting Started
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.labelInput}>Full Name</Text>
          <TextInput
            placeholder="Name"
            na
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={txt => this.inputHandler('name', txt)}
          />
          <Text style={styles.labelInput}>Email</Text>
          <TextInput
            placeholder="Email"
            na
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={txt => this.inputHandler('email', txt)}
          />
          <Text style={styles.labelInput}>Password</Text>
          <TextInput
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={txt => this.inputHandler('password', txt)}
            value={this.state.password}
          />
          <TouchableOpacity onPress={this.handleRegister}>
            <View style={styles.button}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'AirbnbCerealBold',
                }}>
                Register
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.buttonNext}>
            <View>
              <Text style={styles.btnAlready}>Already have an account?</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Login')}>
              <View>
                <Text style={styles.btnLogin}>Login</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textInput: {
    height: 50,
    borderColor: 'gray',
    borderBottomWidth: 1,
  },
  form: {
    width: '90%',
    justifyContent: 'center',
  },
  labelInput: {
    marginTop: 16,
    fontFamily: 'AirbnbCerealBold'
  },
  button: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7D2941',
    height: 48,
    borderRadius: 10,
  },
  buttonNext: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderRadius: 10,
  },
  btnLogin: {
    color: '#7D2941',
    marginLeft: 6,
    fontSize: 14,
    fontFamily: 'AirbnbCerealBold',
  },
  btnAlready: {
    fontSize: 14,
    fontFamily: 'AirbnbCerealBold',
  },
});
