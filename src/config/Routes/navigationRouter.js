import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Find, Home } from '../../Screen/Index';


const AppTabNavigator = createBottomTabNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon name={'ios-people'} size={32} color={tintColor} />
        ),
      },
    },
    Find: {
      screen: Find,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => (
          <Icon
            name={'ios-map'}
            size={32}
            color={tintColor}
          />
        ),
      },
    },
  },
  {
    initialRouteName: 'Home',
    tabBarOptions: {
      activeTintColor: '#7D2941',
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
