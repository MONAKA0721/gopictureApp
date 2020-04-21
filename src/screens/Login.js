import React from 'react';
import { View, Text, Button, TextInput, ActivityIndicator, StyleSheet } from 'react-native';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { accountId: '', password: '', loading: false, failed: false };
  }

  onSubmit() {
    this.setState({ loading: true })
    return (
      fetch(`https://gopicture-docker-stg.herokuapp.com/api/login`,{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: this.state.accountId, password: this.state.password})
      }).then((response) => response.json())
        .then((jsonData) => {
          this.setState({ loading: false })
          if (jsonData['token']) {
            this.props.navigation.navigate('main')
          }
          else {
            this.setState({ failed: true })
          }
        })
        .catch((error) => console.error(error))
    )
  }

  loginButton() {
    if (this.state.loading) {
      return <ActivityIndicator size="small" />
    }
    else {
      return <Button title="ログイン" onPress={() => {this.onSubmit()}} />
    }
  }

  render() {
    return (
      <View>
        {this.state.failed && <Text>ログインに失敗しました。</Text>}

        <TextInput
          style={styles.textInput}
          placeholder="アカウントID"
          onChangeText={(accountId) => this.setState({accountId})}
        />

        <TextInput
          secureTextEntry={true}
          style={styles.textInput}
          placeholder="パスワード"
          onChangeText={(password) => this.setState({password})}
        />

        {this.loginButton()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    width: 300,
    paddingLeft: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
  }
});