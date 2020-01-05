import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createBrowserApp } from '@react-navigation/web';
import MainScreen from '../screens/MainScreen';
import Sidebar from '../components/Sidebar';

// TODO: Use Stack Navigation for Web instead
// FIXME: Fix issue with opening Drawer in Web
const DrawerNavigator = createDrawerNavigator(
  {
    Main: MainScreen
  },
  {
    contentComponent: props => <Sidebar {...props} />
  }
);

export default createBrowserApp(DrawerNavigator);
