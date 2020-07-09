import React from 'react';
import { IndexScreen } from './Index';
import SettingsScreen from './Settings';
import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

export default function Home(){
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Index" options={{title:'ホーム'}} component={IndexScreen} />
      <Drawer.Screen name="Settings" options={{title:'設定'}} component={SettingsScreen} />
    </Drawer.Navigator>
  )
}
