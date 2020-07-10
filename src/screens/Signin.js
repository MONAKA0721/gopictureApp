import React, { useState, useContext } from 'react';
import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  View,
  TouchableOpacity
} from 'react-native';
import { AuthContext } from './Index';

export default function SignInScreen({ navigation }) {
  const { signIn, state } = useContext(AuthContext);
  const [email, setEmail] = useState(state.email);
  const [password, setPassword] = useState('');

  return (
    <View style={styles.container}>
      {state.isUsedEmail && <Text style={{color:'red'}}>このメールアドレスは不正であるかすでに登録されています</Text>}
      {state.failed && <Text style={{color:'red'}}>ログインに失敗しました</Text>}
      {state.invalid_email && <Text style={{color:'red'}}>メールアドレスを入力してください</Text>}
      {state.invalid_pass && <Text style={{color:'red'}}>パスワードを入力してください</Text>}
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
      <Button title="ログイン" onPress={() => signIn({ email, password })} />
      <TouchableOpacity
        onPress={() => navigation.navigate("SignUp")} 
        style={styles.signUpLink}
      >
        <Text style={{color: '#6495ed'}}>新規登録はこちら</Text>
      </TouchableOpacity>
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
  signUpLink: {
    marginTop: 20,
  },
})
