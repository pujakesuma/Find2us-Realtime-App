import React, {Component} from 'react';
import {Platform, KeyboardAvoidingView, SafeAreaView} from 'react-native';
import {GiftedChat} from 'react-native-gifted-chat';

class Chat extends Component {
  state = {
    messages: [],
    currentUser: null,
  };

  get user() {
    return {
      _id: Fire.uid,
      email: Fire.email,
      // email: this.props.navigation.state.params.email,
    };
  }

  componentDidMount() {
    Fire.get(message =>
      this.setState(previous => ({
        messages: GiftedChat.append(previous.message, message),
      })),
    );

    const {currentUser} = firebase.auth();
    this.setState({currentUser});
    console.log('current userhfkjshkjhgs', currentUser);
  }

  componentWillUnmount() {
    Fire.off();
  }

  render() {
    const chat = (
      <GiftedChat
        messages={this.state.messages}
        onSend={Fire.send}
        user={this.user}
      />
    );

    if (Platform.OS === 'android') {
      return (
        <KeyboardAvoidingView
          style={{flex: 1}}
          behavior="padding"
          keyboardVerticalOffset={30}
          enabled>
          {chat}
        </KeyboardAvoidingView>
      );
    }
    return <SafeAreaView style={{flex: 1}}>{chat}</SafeAreaView>;
  }
}

export default Chat;
