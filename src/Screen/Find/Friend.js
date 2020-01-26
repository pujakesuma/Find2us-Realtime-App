import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  BackHandler,
  Image,
  StatusBar,
} from 'react-native';

import * as firebase from 'firebase';
import Icon from 'react-native-vector-icons/Ionicons';
import iconChat from '../../Assets/image/chat-tele.jpg';

export default class Friend extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      person: props.navigation.getParam('item'),
      userId: null,
      city: '',
    };
    // this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
  }

  componentDidMount() {
    fetch(
      'https://us1.locationiq.com/v1/reverse.php?key=d17151587b1e23&lat=' +
        this.state.person.latitude +
        '&lon=' +
        this.state.person.longitude +
        '&format=json',
    )
      .then(response => response.json())
      .then(responseJson => {
        this.setState({city: responseJson.address.state_district});
      });
    console.log('coba', this.state.person);
  }

  //   // {/* BACK HANDLER */}
  //     componentWillMount() {
  //       BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
  //     }

  //     componentWillUnmount() {
  //       BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
  //     }

  //     handleBackButtonClick() {
  //       this.props.navigation.goBack(null);
  //       return true;
  // }

  render() {
    return (
      <>
        <View>
          <StatusBar backgroundColor="#541C2C" barStyle="light-content" />
          <View style={{height: 270}}>
            <Image
              source={{uri: this.state.person.photo}}
              style={{height: 270}}
            />
          </View>
          <View style={{}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginTop: 25,
                borderBottomWidth: 1,
                borderColor: 'gray',
                height: 60,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#7D2941',
                    letterSpacing: 2,
                    fontFamily: 'AirbnbCerealExtraBold',
                  }}>
                  Full Name
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '500',
                    letterSpacing: 1,
                    color: '#404040',
                    fontFamily: 'AirbnbCerealLight',
                  }}>
                  {this.state.person.name}
                </Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Icon name={'ios-person'} size={24} color={'#404040'} />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginTop: 25,
                borderBottomWidth: 1,
                borderColor: 'gray',
                height: 60,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#7D2941',
                    letterSpacing: 2,
                    fontFamily: 'AirbnbCerealExtraBold',
                  }}>
                  Email
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '500',
                    letterSpacing: 1,
                    color: '#404040',
                    fontFamily: 'AirbnbCerealLight',
                  }}>
                  {this.state.person.email}
                </Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Icon name={'ios-mail-unread'} size={24} color={'#404040'} />
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginHorizontal: 20,
                marginTop: 25,
                borderBottomWidth: 1,
                borderColor: 'gray',
                height: 60,
              }}>
              <View>
                <Text
                  style={{
                    fontSize: 16,
                    color: '#7D2941',
                    letterSpacing: 2,
                    fontFamily: 'AirbnbCerealExtraBold',
                  }}>
                  Location
                </Text>
                <Text
                  style={{
                    fontSize: 22,
                    fontWeight: '500',
                    letterSpacing: 1,
                    color: '#404040',
                    fontFamily: 'AirbnbCerealLight',
                  }}>
                  {this.state.city}
                </Text>
              </View>
              <View style={{justifyContent: 'center'}}>
                <Icon name={'md-locate'} size={24} color={'#404040'} />
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            width: 75,
            height: 75,
            borderRadius: 75 / 2,
            position: 'absolute',
            right: '5%',
            bottom: '5%',
            backgroundColor: '#7D2941',
            elevation: 4,
          }}>
          <TouchableOpacity
            style={{
              width: 75,
              height: 75,
              borderRadius: 75 / 2,
              position: 'absolute',
              justifyContent: 'center',
            }}
            onPress={() =>
              this.props.navigation.navigate('ChatScreen', {
                item: this.state.person,
              })
            }>
            <Icon
              name={'ios-chatboxes'}
              size={28}
              style={{alignSelf: 'center'}}
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>
        {this.state.person.status == 'Online' ? (
          <View
            style={{
              backgroundColor: 'rgb(255,255,255, 1.0)',
              opacity: 0.8,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 10,
              marginLeft: 9,
              position: 'absolute',
              right: '64%',
              top: '35%',
            }}>
            <Icon
              style={{paddingLeft: 10}}
              name={'ios-disc'}
              size={12}
              color={'#00FF7F'}
            />
            <Text
              style={{
                paddingLeft: 5,
                paddingRight: 10,
                color: 'white',
                fontSize: 16,
                fontFamily: 'AirbnbCerealExtraBold',
              }}>
              Status : {this.state.person.status}
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: 'rgb(255,255,255, 1.0)',
              opacity: 1,
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 10,
              marginLeft: 9,
              position: 'absolute',
              right: '64%',
              top: '35%',
            }}>
            <Icon
              style={{paddingLeft: 10}}
              name={'ios-disc'}
              size={12}
              color={'#ff6961'}
            />
            <Text
              style={{
                paddingLeft: 5,
                paddingRight: 10,
                color: 'white',
                fontSize: 16,
                fontFamily: 'AirbnbCerealExtraBold',
              }}>
              Status : {this.state.person.status}
            </Text>
          </View>
        )}
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
