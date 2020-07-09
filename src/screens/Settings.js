import React, { useContext } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity
} from 'react-native';
import { Divider } from 'react-native-elements';
import { AuthContext } from './Index';

export default function SettingsScreen(){

  const { signOut } = useContext(AuthContext);

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => signOut()}
        style={{height:30}}
      >
        <Text>ログアウト</Text>
      </TouchableOpacity>
      <Divider/>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    padding: 10
  },
})
