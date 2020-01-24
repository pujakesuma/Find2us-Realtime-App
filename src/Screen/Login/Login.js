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
} from 'react-native';
import {Auth, Database} from '../../config/Firebase/firebase';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
    };
  }

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
            console.log('mimim', user)

            AsyncStorage.setItem('user.email', user[0].email);
            AsyncStorage.setItem('user.name', user[0].name);
            AsyncStorage.setItem('user.address', user[0].address);
            AsyncStorage.setItem('user.photo', user[0].photo);
          }
        });

      Auth.signInWithEmailAndPassword(email, password)
        .then(async response => {
          Database.ref('/user/' + response.user.uid).update({
            status: 'Online',
            //place your longitude
          });

          ToastAndroid.show('Login success', ToastAndroid.LONG);
          await AsyncStorage.setItem('userid', response.user.uid);
          await AsyncStorage.setItem('user', JSON.stringify(response.user));
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
      //Firebase
      // console.log('handleLogin', this.handleLogin);
      // const {email, password} = await this.state;

      // firebase.auth().signInWithEmailAndPassword(email, password)
      //   .then(() => this.props.navigation.navigate('RouteUser', {email: this.state.email}))
      //   .catch(error => this.setState({errorMessage: error.message}));
    }
    console.log('handlelogin', this.handleLogin)
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <View style={styles.form}>
          <Text>Email</Text>
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
              <Text style={{color: 'white', fontSize: 15}}>Login</Text>
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
