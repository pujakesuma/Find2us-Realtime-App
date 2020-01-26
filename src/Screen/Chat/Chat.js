import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  RefreshControl,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {Database, Auth} from '../../config/Firebase/firebase';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      refreshing: false,
      uid: null,
    };
  }

  componentDidMount = async () => {
    const uid = await AsyncStorage.getItem('userid');
    console.log('asi', await uid);
    this.setState({uid: uid, refreshing: true});
    await Database.ref('/user').on('child_added', data => {
      let person = data.val();
      console.log('person', person.id);
      if (person.id != uid) {
        this.setState(prevData => {
          return {userList: [...prevData.userList, person]};
        });
        this.setState({refreshing: false});
      }
    });
  };

  renderItem = ({item}) => {
    return (
      <View style={{}}>
        <View style={{}}>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('ChatScreen', {item})
            }>
            <View style={styles.row}>
              <Image source={{uri: item.photo}} style={styles.pic} />
              <View>
                <View style={styles.nameContainer}>
                  <Text
                    style={styles.nameTxt}
                    numberOfLines={1}
                    ellipsizeMode="tail">
                    {item.name}
                  </Text>
                  {item.status == 'Offline' ? (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.off}>{item.status}</Text>
                      <Icon name={'md-text'} size={15} color={'#ff6961'} />
                    </View>
                  ) : (
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.on}>{item.status}</Text>
                      <Icon name={'md-text'} size={15} color={'#00FF7F'} />
                    </View>
                  )}
                </View>
                <View style={styles.msgContainer}>
                  <Text style={styles.status}>{item.email}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  render() {
    return (
      <>
        <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
          <StatusBar backgroundColor="#ffffff" barStyle="dark-content" />
          <View style={styles.header}>
            <Text
              style={{
                fontSize: 32,
                color: '#27242C',
                fontFamily: 'AirbnbCerealExtraBold',
              }}>Chat</Text>
          </View>
          {this.state.refreshing === true ? (
            <ActivityIndicator
              size="large"
              color="#05A0E4"
              style={{marginTop: 150}}
            />
          ) : (
            <FlatList
              data={this.state.userList}
              renderItem={this.renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          )}
          {/* <View style={styles.floatingButton}>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleLogout}>
            <Text
              style={{
                fontSize: 16,
                color: 'white',
                fontFamily: 'AirbnbCerealExtraBold',
              }}>
              Update
            </Text>
          </TouchableOpacity>
        </View> */}
        </SafeAreaView>
      </>
    );
  }
}

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  header: {
    height: 70,
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    paddingLeft: 20,
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#DCDCDC',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    height: 80,
    paddingHorizontal: 20
  },
  pic: {
    borderRadius: 30,
    width: 60,
    height: 60,
  },
  nameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 280,
  },
  nameTxt: {
    marginLeft: 15,
    fontWeight: '600',
    color: '#222',
    fontSize: 18,
    width: 170,
  },
  status: {
    fontWeight: '200',
    color: '#ccc',
    fontSize: 13,
  },
  on: {
    fontWeight: '200',
    color: 'green',
    fontSize: 13,
    paddingRight: 10,
  },
  off: {
    fontWeight: '200',
    color: '#C0392B',
    fontSize: 13,
    paddingRight: 10,
  },
  msgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  email: {
    fontWeight: '400',
    color: '#008B8B',
    fontSize: 12,
    marginLeft: 15,
  },
});
