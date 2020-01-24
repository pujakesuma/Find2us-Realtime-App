import React, {Component} from 'react';
import {StyleSheet, Platform, Image, Text, View, Button} from 'react-native';

class Find extends Component {
  render() {
      return (
        <View style={styles.container}>
            <Text>map SCREEN</Text>
        </View>
      );
  }
}

export default Find;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
