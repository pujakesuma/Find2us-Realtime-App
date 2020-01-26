import React from 'react';
import {Icon} from 'react-native-elements';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Chat, Find, Home, Profile} from '../../Screen/Index';

const AppTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="home" size={20} color={tintColor} />
        ),
      },
    },
    Find: {
      screen: Find,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="map-marker"
            type="font-awesome"
            size={20}
            color={tintColor}
          />
        ),
      },
    },
    Chat: {
      screen: Chat,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon
            name="comments"
            type="font-awesome"
            size={20}
            color={tintColor}
          />
        ),
      },
    },

    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="user" type="font-awesome" size={20} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Chat',
    tabBarOptions: {
      activeTintColor: '#18A4E0',
      style: {borderTopWidth: 0, height: 60, paddingVertical: 10}
    },
  },
);

const navigationRouter = createSwitchNavigator(
  {
    App: AppTabNavigator,
  },
  {
    initialRouteName: 'App',
  },
);

export default createAppContainer(navigationRouter);
