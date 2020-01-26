import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ToastAndroid,
  Platform,
  PermissionsAndroid,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import MapView, {PROVIDER_GOOGLE, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {Database, Auth} from '../../config/Firebase/firebase';
import marker from '../../Assets/image/marker.jpg';
import Icon from 'react-native-vector-icons/Ionicons';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

class Find extends Component {
  state = {
    initial: 'state',
    mapRegion: null,
    latitude: 0,
    longitude: 0,
    userList: [],
    uid: null,
  };

  componentDidMount = async () => {
    await this.getUser();
    await this.getLocation();
  };

  getUser = async () => {
    const uid = await AsyncStorage.getItem('userid');
    this.setState({uid: uid});
    Database.ref('/user').on('child_added', result => {
      let data = result.val();
      console.log('data di map', data);
      if (data !== null && data.id != uid) {
        this.setState(prevData => {
          return {userList: [...prevData.userList, data]};
        });
      }
    });
  };

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

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.00922,
            longitudeDelta: 0.00421 * 1.5,
          };
          this.setState({
            mapRegion: region,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
          console.log('aaa', this.state.mapRegion);
        },
        error => {
          this.setState({errorMessage: error});
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
    console.log('sjfjs', this.getLocation);
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          showsMyLocationButton={true}
          showsIndoorLevelPicker={true}
          showsUserLocation={true}
          zoomControlEnabled={true}
          showsCompass={true}
          showsTraffic={false}
          region={this.state.mapRegion}
          initialRegion={{
            latitude: -7.755322,
            longitude: 110.381174,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}>
          {/* <Marker coordinate={{latitude: this.state.latitude, longitude: this.state.longitude}}></Marker> */}
          {this.state.userList.map(item => {
            return (
              <Marker
                key={item.id}
                title={item.name}
                description={item.status}
                draggable
                coordinate={{
                  latitude: item.latitude || 0,
                  longitude: item.longitude || 0,
                }}
                onCalloutPress={() => {
                  this.props.navigation.navigate('Friend', {
                    item,
                  });
                }}>
                <View>
                  <Image
                    source={{uri: item.photo}}
                    style={{width: 40, height: 40, borderRadius: 50}}
                  />
                  <Text>{item.name}</Text>
                </View>
              </Marker>
            );
          })}
        </MapView>
        <View
          style={{
            width: 65,
            height: 65,
            borderRadius: 65 / 2,
            position: 'absolute',
            elevation: 4,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            left: '3%',
            bottom: '6%',
          }}>
          <TouchableOpacity
            style={{
              width: 60,
              height: 60,
              borderRadius: 60 / 2,
              position: 'absolute',
              left: '3%',
              bottom: '5%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => this.getLocation()}>
            <Icon
              name={'ios-locate'}
              size={28}
              color={'#0487C0'}
              
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}
{
  /* <Icon name={'ios-send'} size={24} color={'white'}/> */
}

export default Find;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  input: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ddd6f3',
    width: '70%',
    borderRadius: 10,
    marginBottom: 15,
  },
  icon: {
    width: 200,
    height: 200,
    marginBottom: 10,
  },
  title: {
    fontSize: 30,
    textAlign: 'center',
    marginTop: 22,
    color: '#5F6D7A',
  },
  description: {
    marginTop: 10,
    textAlign: 'center',
    color: '#A9A9A9',
    fontSize: 16,
    margin: 40,
  },
  options: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    height: 35,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 160,
    borderRadius: 20,
  },
  authButton: {
    backgroundColor: '#6441A5',
  },
  loginButton: {
    backgroundColor: '#480048',
    height: 40,
    fontSize: 20,
    marginVertical: 15,
  },
  registerButton: {
    backgroundColor: '#44a08d',
    height: 40,
    fontSize: 20,
    marginVertical: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  bottomText: {
    fontSize: 16,
    color: '#ccc',
  },
  center: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bottomTextLink: {
    color: '#fff',
    fontWeight: 'bold',
  },
  menuBottom: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    margin: 5,
    borderRadius: 5,
    width: '100%',
    backgroundColor: '#694be2',
  },
});
