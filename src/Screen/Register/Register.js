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
  StatusBar
} from 'react-native';
import {Database, Auth} from '../../config/Firebase/firebase';
import AsyncStorage from '@react-native-community/async-storage'

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      name: '',
      address: '',
      email: '',
      password: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
    };
  }

  inputHandler = (name, value) => {
    this.setState(() => ({[name]: value}));
  };

  handleRegister = () => {
    const {email, name, password, address} = this.state;
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
      Auth.createUserWithEmailAndPassword(email, password).then(response => {
        console.log('responsee', response)
        response.user.updateProfile({
          displayName: this.state.name,
        });
        Database.ref('/user/' + response.user.uid)
          .set({
            name: this.state.name,
            address: this.state.address,
            status: 'Offline',
            email: this.state.email,
            photo:
              'https://atasouthport.com/wp-content/uploads/2017/04/default-image.jpg',
            id: response.user.uid,
          })
          .catch(error => {
            ToastAndroid.show(error.message, ToastAndroid.LONG);
            this.setState({
              name: '',
              address: '',
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
            console.log('dataa', data)
            if (data !== null) {
              let user = Object.values(data);

              AsyncStorage.setItem('user.email', user[0].email);
              AsyncStorage.setItem('user.name', user[0].name);
              AsyncStorage.setItem('user.address', user[0].address);
              AsyncStorage.setItem('user.photo', user[0].photo);
            }
          });
        AsyncStorage.setItem('userid', response.user.uid);
        AsyncStorage.setItem('user', JSON.stringify(response.user));
      })
      .catch(error => {
        this.setState({
          errorMessage: error.message,
          name: '',
          address: '',
          email: '',
          password: '',
        });
        ToastAndroid.show(this.state.errorMessage.message, ToastAndroid.LONG)
      });
    }
    console.log('tessss handle', this.handleRegister)
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.form}>
        <Text>Full Name</Text>
          <TextInput
            placeholder="Name"
            na
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={txt => this.inputHandler('name', txt)}
          />
          <Text>Address</Text>
          <TextInput
            placeholder="Address"
            na
            autoCapitalize="words"
            style={styles.textInput}
            onChangeText={txt => this.inputHandler('address', txt)}
          />
          <Text>Email</Text>
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
              <Text style={{color: 'white', fontSize: 15}}>Register</Text>
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
    width: 250,
    justifyContent: 'center',
  },
  labelInput: {
    marginTop: 16,
  },
  button: {
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00A8A8',
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
    color: '#00A8A8',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: 'bold',
  },
  btnAlready: {
    fontSize: 14,
  },
});
