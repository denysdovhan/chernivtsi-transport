import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createAppContainer } from 'react-navigation';
import MainScreen from '../screens/MainScreen';
import Sidebar from '../components/Sidebar';

const DrawerNavigator = createDrawerNavigator(
  {
    Main: MainScreen
  },
  {
    contentComponent: props => <Sidebar {...props} />
  }
);

export default createAppContainer(DrawerNavigator);
