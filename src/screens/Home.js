import React from 'react';
import { IndexScreen } from './Index';
import SettingsScreen from './Settings';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function Home(){
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Index" component={IndexScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  )
}
