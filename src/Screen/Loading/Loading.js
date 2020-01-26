import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  StatusBar,
} from 'react-native';
import {Database, Auth} from '../../config/Firebase/firebase';
import bg from '../../Assets/image/find2us-bg.png';

class Loading extends Component {
  componentDidMount() {
    setTimeout(() => {
      Auth.onAuthStateChanged(user => {
        this.props.navigation.navigate(user ? 'App' : 'Auth');
      });
    }, 2500);
  }

  render() {
    return (
      <>
        <StatusBar backgroundColor="#541C2C" barStyle="light-content" />
        <ImageBackground
          source={bg}
          style={{
            width: '100%',
            height: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: '#DCDCDC',
              fontSize: 20,
              fontFamily: 'AirbnbCerealBold',
              top: '18%'
            }}>
            Find your Friend!
          </Text>
          <ActivityIndicator size="large" style={{top: '23%'}} />
        </ImageBackground>
      </>
    );
  }
}

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
