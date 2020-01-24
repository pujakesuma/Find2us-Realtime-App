import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {EditProfile, Loading, Login, Register} from '../../Screen/Index';
import navigationRouter from './navigationRouter';

const Authentication = createStackNavigator(
  {
    Login,
    Register,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Login',
  },
);

const AppStack = createStackNavigator(
  {
    App: navigationRouter,
    EditProfile, //masukkan menu edit dll di stack ini
  },
  {
    headerMode: 'none',
    initialRouteName: 'App',
  },
);

const Router = createSwitchNavigator(
  {
    Loading: Loading,
    Auth: Authentication,
    App: AppStack,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Loading',
  },
);

export default createAppContainer(Router);
