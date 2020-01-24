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
          <Icon name="home" size={24} color={tintColor} />
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
            size={24}
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
            size={24}
            color={tintColor}
          />
        ),
      },
    },

    Profile: {
      screen: Profile,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name="user" type="font-awesome" size={24} color={tintColor} />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#00A8A8',
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
