import React, { Component } from 'react';
import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import {Database, Auth} from '../../config/Firebase/firebase'

class Loading extends Component{
  componentDidMount() {

    setTimeout(() => {
      Auth.onAuthStateChanged(user => {
        this.props.navigation.navigate(user ? 'App' : 'Auth');
      });
    }, 2500);
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

export default Loading

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
