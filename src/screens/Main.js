import React from 'react';
import { View, FlatList, TextInput, Button, AsyncStorage, ActivityIndicator, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

let data = new FormData();

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = { taskName: '', tasks: [], loading: '', apiToken: '' };
  }

  async componentDidMount() {
    this.setState({ loading: true, apiToken: await AsyncStorage.getItem('api_token') })
    fetch(`https://gopicture-docker-stg.herokuapp.com/api/index`,{
      method: 'GET',
      headers: { 'Authorization': 'bearer '+this.state.apiToken}
    })
    .then((response) => response.json())
    .then((jsonData) => this.setState({ loading: false }))
    .catch((error) => console.error(error));
  }

  openImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true
    }).then(images => {
        // images.map((item, index) => {
        //   console.log(JSON.stringify(item));
        // });
        console.log(images);
    }).catch(e => alert(e));
  }

  logout() {
    AsyncStorage.removeItem('api_token');
    this.props.navigation.navigate('login')
  }

  render() {
    return (
      <View>
        <Button title="画像を選択してください" onPress={() => this.openImagePicker()} />

        <View style={styles.logout}>
          <Button title="ログアウト" onPress={() => {this.logout()}} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  form: { margin: 40 },
  textInput: {
    height: 60,
    width: 300,
    paddingLeft: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
  },
  logout: { marginBottom: 20 }
});
