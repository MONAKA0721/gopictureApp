import React, { useState, useContext } from 'react';
import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  View,
} from 'react-native';
import { AuthContext } from './Index';

export default function SignUpScreen() {
  const { signUp, state } = useContext(AuthContext);
  const [email, setEmail] = useState(state.email);
  const [password, setPassword] = useState('');
  const [password_confirmation, setPasswordConfirmation] = useState('');

  return (
    <View style={styles.container}>
      {state.invalid_email && <Text style={{color:'red'}}>メールアドレスを入力してください</Text>}
      {state.invalid_pass && <Text style={{color:'red'}}>パスワードは6文字以上入力してください</Text>}
      {state.mismatch_pass && <Text style={{color:'red'}}>パスワードが確認用と一致しません</Text>}
      <TextInput
        style={styles.textInput}
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.textInput}
        placeholder='パスワード'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.textInput}
        placeholder='パスワード(確認用)'
        value={password_confirmation}
        onChangeText={setPasswordConfirmation}
        secureTextEntry
      />
      <Button title="新規登録" onPress={() => signUp({ email, password, password_confirmation })} />
    </View>
  );
}

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    width: 300,
    paddingLeft: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
