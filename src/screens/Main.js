import React from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
  AsyncStorage,
  Button,
  Dimensions,
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';

let data = new FormData();

export default class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      apiToken: '',
      albums: [],
      formDisplay: false,
      albumName: '',
      is_photo: false
    };
  }

  async componentDidMount() {
    this.setState({ loading: true, apiToken: await AsyncStorage.getItem('api_token') })
    fetch(`https://gopicture-docker-stg.herokuapp.com/api/index`,{
      method: 'GET',
      headers: { 'Authorization': 'bearer '+this.state.apiToken}
    })
    .then((response) => response.json())
    .then((jsonData) => {
      this.setState({ albums: jsonData });
      this.setState({ loading: false });
    })
    .catch((error) => console.error(error));
  }

  openImagePicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true
    }).then(images => {
      images.map((item, index) => {
        data.append("upload-firebase", ({
          uri: item.path,
          type: "image/jpeg",
          name: item.filename || `temp_image_${index}.jpg`,
        }));
      })
      this.setState({is_photo: true})
    }).catch(e => alert(e));
  }

  upload = () => {
    if(this.state.albumName === "" || !this.state.is_photo){
      Alert.alert(
        "アップロード失敗",
        "ファイル名を入力してください",
        [{ text: "OK"}],
        { cancelable: false }
      );
    }else{
      data.append("album", this.state.albumName)
      fetch(`https://gopicture-docker-stg.herokuapp.com/api/upload`, {
        method: "post",
        headers: {
          Authorization: 'bearer ' + this.state.apiToken,
        },
        body: data,
      })
      .then(res => res.json())
      .then(res => {
        Alert.alert(
          "アップロード成功",
          "アルバムをアップロードすることに成功しました",
          [{ text: "OK"}],
          { cancelable: false }
        );
      })
      .catch(err => {
        console.error("error uploading images: ", err);
      });
    }
  }

  renderAlbums(){
    if(this.state.loading) return <FlatList />
    else{
      return(
        <FlatList
          contentContainerStyle={{ alignItems: 'center' }}
          showsVerticalScrollIndicator={false}
          data={this.state.albums}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={() => this.moveToShow()}
            >
              <ImageBackground
                style={styles.image}
                imageStyle={{ borderRadius: 15, opacity: 0.8 }}
                source={{uri: `https://storage.googleapis.com/go-pictures.appspot.com/${item.Hash}/${item.TopPicName}`}}
              >
                <Text style={styles.albumName}>{item.Name}</Text>
              </ImageBackground>
            </TouchableOpacity>
          )}
        />
      )
    }
  }

  logout() {
    AsyncStorage.removeItem('api_token');
    this.props.navigation.navigate('login')
  }

  renderForm(){
    if(this.state.formDisplay){
      return(
        <View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => this.setState({ formDisplay: false })}
          >
            <Text style={{color: 'orange', fontSize:18}}>△ 閉じる</Text>
          </TouchableOpacity>
          <Text>アルバムに入れる写真を選択する</Text>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => this.openImagePicker()}
            >
              <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
            </TouchableOpacity>
          </View>
          <Text>アルバム名</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(albumName) => this.setState({albumName})}
          />
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => this.upload()}
          >
            <Text style={{color: 'white', fontSize:18}}>写真をアップロードする</Text>
          </TouchableOpacity>
        </View>
      )
    }else{
      return(
        <View>
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => this.setState({ formDisplay: true })}
          >
            <Text style={{color: 'white', fontSize:18}}>新しいアルバムを作成する</Text>
          </TouchableOpacity>
        </View>
      )
    }
  }

  moveToShow(){
    this.props.navigation.navigate('show');
  }

  render() {
    return (
      <View style={styles.container}>
        {this.renderForm()}
        {this.renderAlbums()}
        <View style={styles.logout}>
          <Button title="ログアウト" onPress={() => {this.logout()}} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  toggleButton:{
    backgroundColor:'orange',
    borderRadius:20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom:20,
    width:350
  },
  uploadButton:{
    backgroundColor:'orange',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom:20,
    width:350
  },
  addButton:{
    backgroundColor:'orange',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    margin: 10,
    width: 100
  },
  closeButton:{
    backgroundColor:'white',
    borderWidth: 1,
    borderColor: 'orange',
    borderRadius:20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginBottom:20,
    width: 350
  },
  form: { margin: 40 },
  textInput: {
    width: 330,
    paddingLeft: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    height: 40
  },
  logout: { marginBottom: 20 },
  image: {
    width: 350,
    height: 200,
    marginBottom: 20,
    backgroundColor: "black",
    borderRadius: 15
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 50
  },
  albumName: {
    fontSize: 40,
    color: 'white',
    marginLeft: 20,
    marginTop: 140
  }
});
