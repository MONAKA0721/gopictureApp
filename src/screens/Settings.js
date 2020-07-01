import React, { useContext } from 'react';
import {
  Button,
  StyleSheet,
  View
} from 'react-native';
import { AuthContext } from './Index';

export default function SettingsScreen(){

  const { signOut } = useContext(AuthContext);

  return (
    <View style={styles.container}>
      <Button title="ログアウト" onPress={() => signOut()} />
    </View>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10
  },
})
