import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBrowserApp } from '@react-navigation/web';
import MainScreen from '../screens/MainScreen';
import Sidebar from '../components/Sidebar';

// Use Stack Navigation for Web instead
const DrawerNavigator = createDrawerNavigator(
  {
    Main: { screen: MainScreen }
  },
  {
    contentComponent: props => <Sidebar {...props} />
  }
);

export default createBrowserApp(DrawerNavigator);
