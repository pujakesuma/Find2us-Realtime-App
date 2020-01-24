import React, {Component} from 'react';
import {
  StyleSheet,
  Platform,
  Image,
  Text,
  View,
  Button,
  ToastAndroid,
} from 'react-native';
import {Database, Auth} from '../../config/Firebase/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {error} from 'react-native-gifted-chat/lib/utils';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idUser: null,
    };
  }

  componentDidMount = async () => {
    const idUser = await AsyncStorage.getItem('userid');
    const nameUser = await AsyncStorage.getItem('user.name');
    console.log('asi', await idUser)
    this.setState({idUser, nameUser});
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
      console.log('logut', this.handleLogout)
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Log Out" onPress={this.handleLogout} />
        <View></View>
        <Text>Hi {this.state.nameUser}!</Text>
      </View>
    );
  }
  // state = {currentUser: null};

  // componentDidMount() {
  //   const { currentUser } = firebase.auth()
  //   this.setState({ currentUser })
  //   console.log('current user', currentUser)
  // }

  // handleLogout = async () => {
  //   try {
  //     await firebase.auth().signOut();
  //     this.props.navigation.navigate('Login')
  //   }catch(e){
  //     console.log(e)
  //   }
  // }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
