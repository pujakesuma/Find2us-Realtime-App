import React, {Component, Fragment} from 'react';
import {AsyncStorage} from 'react-native';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
  TouchableHighlight,
} from 'react-native';

import firebase from 'firebase';
import {Database} from '../../config/Firebase/firebase';

import {GiftedChat, Bubble, Composer, Send} from 'react-native-gifted-chat';
import Icon from 'react-native-vector-icons/Ionicons';

class ChatScreen extends Component {
  state = {
    message: '',
    messageList: [],
    person: this.props.navigation.getParam('item'),
    status: '',
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    this.setState({userId, userName, userAvatar});

    console.log('person', this.state.person);

    Database.ref('messages')
      .child(this.state.userId)
      .child(this.state.person.id)
      .on('child_added', val => {
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, val.val()),
        }));
      });
  };

  //connect firebase when send message
  onSend = async () => {
      if (this.state.message.length > 0) {
          let messageId = Database
            .ref('messages')
            .child(this.state.userId)
            .child(this.state.person.id)
            .push().key;
        let updates = {};
        let message = {
            _id: messageId,
            text: this.state.message,
            createdAt: firebase.database.ServerValue.TIMESTAMP,
            user: {
                _id: this.state.userId,
                name: this.state.userName,
                avatar: this.state.userAvatar,
            },
        };
        console.log('message nya', message)
        console.log('isi user message', message.user)

        updates[
            'messages/' +
                this.state.userId +
                '/' +
                this.state.person.id +
                '/' +
                messageId
        ] = message;

        updates[
            'messages/' +
            this.state.person.id +
            '/' +
            this.state.userId +
            '/' +
            messageId
        ] = message;

        Database
            .ref()
            .update(updates);
        this.setState({message: ''});
      }
  };

  renderSend(props) {
    return (
      <Send {...props} textStyle={{fontFamily: 'AirbnbCerealLight'}}>
        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 44/2,
            backgroundColor:'#05A0E4',
            justifyContent:'center',
            alignItems:'center',
          }}>
          <Icon name={'ios-send'} size={24} color={'white'}/>
        </View>
      </Send>
    );
  }

  render() {
    return (
      <Fragment>
          <StatusBar backgroundColor="#0487C0" barStyle="light-content" />
        <View style={styles.header}>
          <>
            <View style={styles.img}>
              <Image source={{uri: this.state.person.photo}} style={styles.photo} />
            </View>
            <View style={{marginLeft: 10}}>
              <Text style={styles.heading}>{this.state.person.name}</Text>
              {this.state.person.status == 'Online' ? (
                <View style={{flexDirection:'row', alignItems:'center'}}>
                  <Icon name={'ios-disc'} size={10} color={'green'}/>
                  <Text style={styles.off}>{this.state.person.status}</Text>
                </View>
              ) : (
                <View style={{flexDirection:'row',  alignItems:'center'}}>
                  <Icon name={'ios-disc'} size={10} color={'#C0392B'}/>
                  <Text style={styles.off}>{this.state.person.status}</Text>
                </View>
              )}
            </View>
          </>
        </View>

        <GiftedChat
          renderBubble={this.renderBubble}
          renderSend={this.renderSend}
          text={this.state.message}
          
          onInputTextChanged={val => {
            this.setState({message: val});
          }}
          messagesContainerStyle={{backgroundColor: '#ffffff'}}
          messages={this.state.messageList}
          onSend={() => this.onSend()}
          user={{
            _id: this.state.userId,
          }}
        />
      </Fragment>
    );
  }
}

export default ChatScreen;


const styles = StyleSheet.create({
    photo: {
      flex: 1,
      width: '100%',
      resizeMode: 'cover',
    },
    img: {
      backgroundColor: 'silver',
      width: 41,
      height: 41,
      borderRadius: 50,
      marginHorizontal: 5,
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'hidden',
    },
    heading: {
      color: 'white',
      fontSize: 22,
      width: 'auto',
      fontFamily: 'AirbnbCerealExtraBold'
    },
    header: {
      backgroundColor: '#05A0E4',
      height: 80,
      width: '100%',
      paddingHorizontal: 12,
      flexDirection: 'row',
      alignItems: 'center',
    },
    off:{
      fontWeight: '200',
      color: 'whitesmoke',
      fontSize: 13,
      paddingLeft: 5
    },
  });
