import AsyncStorage from '@react-native-community/async-storage';
import React, {Component} from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {Auth, Database} from '../../config/Firebase/firebase';
import Geolocation from 'react-native-geolocation-service';

class Login extends Component {
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
    };
  }

  componentDidMount = async () => {
    this._isMounted = true;
    await this.getLocation();
  };

  UNSAFE_componentWillMount() {
    this._isMounted = false;
    Geolocation.clearWatch();
    Geolocation.stopObserving();
  }

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
        'Location Permission Denied By User.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked By User.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  // SET LOCATION //
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
        },
        error => {
          this.setState({errorMessage: error});
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

  handleInput = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  handleLogin = async () => {
    const {email, password} = this.state;
    if (email.length < 6) {
      ToastAndroid.show(
        'Please input a valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 6) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.LONG,
      );
    } else {
      Database.ref('user/')
        .orderByChild('/email')
        .equalTo(email)
        .once('value', result => {
          let data = result.val();
          console.log('dataa1235', data);
          if (data !== null) {
            let user = Object.values(data);
            console.log('mimim', user);

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

      Auth.signInWithEmailAndPassword(email, password)
        .then(async response => {
          Database.ref('/user/' + response.user.uid).update({
            status: 'Online',
            latitude: this.state.latitude || null,
            longitude: this.state.longitude || null,
            //place your longitude
          });

          ToastAndroid.show('Login success', ToastAndroid.LONG);
          await AsyncStorage.setItem('userid', response.user.uid);
          await AsyncStorage.setItem('user', JSON.stringify(response.user));

          console.log('latitude', response);
        })
        .catch(error => {
          console.warn(error);
          this.setState({
            errorMessage: error.message,
            email: '',
            password: '',
          });
          ToastAndroid.show(this.state.errorMessage, ToastAndroid.LONG);
        });
    }
    console.log('handlelogin', this.handleLogin);
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
            Welcome back !
          </Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.labelInput}>Email</Text>
          <TextInput
            placeholder="Email"
            na
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={this.handleChange('email')}
          />
          <Text style={styles.labelInput}>Password</Text>
          <TextInput
            secureTextEntry
            placeholder="Password"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={this.handleChange('password')}
            value={this.state.password}
          />
          <TouchableOpacity onPress={this.handleLogin}>
            <View style={styles.button}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 15,
                  fontFamily: 'AirbnbCerealBold',
                }}>
                Login
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.buttonNext}>
            <View>
              <Text style={styles.btnAlready}>No account yet?</Text>
            </View>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Register')}>
              <View>
                <Text style={styles.btnLogin}>Register</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

export default Login;

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
    fontSize: 15,
    fontFamily: 'AirbnbCerealBold',
  },
  btnAlready: {
    fontSize: 14,
    fontFamily: 'AirbnbCerealBold',
  },
});
