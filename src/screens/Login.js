import * as React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  Button,
  TextInput,
  StyleSheet,
  View
} from 'react-native';
// import { View, Text, Button, TextInput, ActivityIndicator, StyleSheet, AsyncStorage } from 'react-native';
// {this.state.failed && <Text>ログインに失敗しました。</Text>}
// {this.loginButton()}
import { connect } from 'react-redux';

function Login(props, { navigation }){
  return (
    <View style={styles.container}>

      <TextInput
        style={styles.textInput}
        placeholder="メールアドレス"
        onChangeText={(email) => props.onChangeEmail(email)}
      />

      <TextInput
        secureTextEntry={true}
        style={styles.textInput}
        placeholder="パスワード"
        onChangeText={(password) => props.onChangePassword(password)}
      />

      <LoginButton
        loading={props.loading}
        onSubmit={props.onSubmit}
        email={props.email}
        password={props.password}
        navigate={navigation}
      />
    </View>
  );
}

function LoginButton(props){
  if(props.loading){
    return <ActivityIndicator size="small" />
  }
  return <Button title="ログイン" onPress={() => props.onSubmit(props.email, props.password, props.navigation)} />
}

function mapStateToProps(state){
  return {
    email: state.email.email,
    password: state.password.password,
    loading: state.loading.loading,
  };
}

function mapDispatchToProps(dispatch){
  return {
    onSubmit: (email, password, { navigation }) => {
      dispatch({ type: 'SET_LOADING' });
      fetch(`https://gopicture-docker-stg.herokuapp.com/api/login`,{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: email, password: password})
      }).then((response) => response.json())
        .then((jsonData) => {
          dispatch({ type: 'UNSET_LOADING' });
          if (jsonData.token) {
            AsyncStorage.setItem('api_token', jsonData.token);
            navigation.navigate('Home');
          }
          else {
            this.setState({ failed: true })
          }
        })
        .catch((error) => console.error(error))
    },
    onChangeEmail: (email) => dispatch({ type: 'CHANGE_EMAIL', email: email }),
    onChangePassword: (password) => dispatch({ type: 'CHANGE_PASSWORD', password: password }),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login);
// export default class Login extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = { accountId: '', password: '', loading: false, failed: false };
//   }
//
//   async componentDidMount() {
//     if (await AsyncStorage.getItem('api_token')) {
//       this.props.navigation.navigate('main');
//     }
//   }
//
//
//
//   render() {
//     return (
//       <View>
//         {this.state.failed && <Text>ログインに失敗しました。</Text>}
//
//         <TextInput
//           style={styles.textInput}
//           placeholder="アカウントID"
//           onChangeText={(accountId) => this.setState({accountId})}
//         />
//
//         <TextInput
//           secureTextEntry={true}
//           style={styles.textInput}
//           placeholder="パスワード"
//           onChangeText={(password) => this.setState({password})}
//         />
//
//         {this.loginButton()}
//       </View>
//     );
//   }
// }
//
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
});
