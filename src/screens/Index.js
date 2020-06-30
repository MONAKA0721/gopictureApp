import React, { useState, useEffect, useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  Button,
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
import AsyncStorage from '@react-native-community/async-storage';

export const AuthContext = React.createContext(null);

let data = new FormData();

export function IndexScreen({ navigation }){
  const [isLoading, setIsLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [albums, setAlbums] = useState([]);
  const [isDisplayingForm, setIsDisplayingForm] = useState(false);
  const [pictureCount, setPictureCount] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [flag, setFlag] = useState(false);

  async function fetchApiToken(){
    const token = await AsyncStorage.getItem('api_token');
    setApiToken(token);
    fetch(`https://gopicture-docker-stg.herokuapp.com/api/index`,{
      method: 'GET',
      headers: { 'Authorization': 'bearer ' + token }
    })
    .then((response) => response.json())
    .then((jsonData) => {
      setAlbums(jsonData);
    })
    .catch((error) => console.error(error));
    setIsLoading(false);
  }

  useEffect(() =>{
    setIsDisplayingForm(false);
    setIsLoading(true);
    fetchApiToken();
  }, [ flag ]);

  function openImagePicker(){
    data = new FormData();
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      multiple: true
    }).then(images => {
      images.forEach((item, index) => {
        data.append("upload-firebase", ({
          uri: item.path,
          type: "image/jpeg",
          name: item.filename || `temp_image_${index}.jpg`,
        }));
      });
      setPictureCount(images.length);
    }).catch(e => {
      console.log(e);
      setPictureCount(0);
    });
  }

  function upload(albumName){
    setIsUploading(true);
    if (pictureCount == 0){
      Alert.alert(
        "アップロード失敗",
        "写真を選択してください",
        [{ text: "OK"}],
        { cancelable: false }
      );
      setIsUploading(false);
      return 0;
    }
    if(albumName === ""){
      Alert.alert(
        "アップロード失敗",
        "ファイル名を入力してください",
        [{ text: "OK"}],
        { cancelable: false }
      );
      setIsUploading(false);
      return 0;
    }
    data.append("album", albumName)
    fetch(`https://gopicture-docker-stg.herokuapp.com/api/upload`, {
      method: "post",
      headers: {
        Authorization: 'bearer ' + apiToken,
      },
      body: data,
    })
    .then(res => res.json())
    .then(res => {
      setIsUploading(false);
      setPictureCount(0);
      data = new FormData();
      Alert.alert(
        "アップロード成功",
        "アルバムをアップロードすることに成功しました",
        [{ text: "OK" }],
        { cancelable: false }
      );
      setFlag(!flag);
    })
    .catch(err => {
      console.error("error uploading images: ", err);
    });
  }

  function moveToShow(){
    navigation.navigate("Show");
  }

  function Albums(){
    if(isLoading) return <ActivityIndicator />
    return(
      <FlatList
        contentContainerStyle={{ alignItems: 'center' }}
        showsVerticalScrollIndicator={false}
        data={albums}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => moveToShow()}
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

  function Form(){
    const [albumName, setAlbumName] = useState('');

    if(isDisplayingForm){
      return(
        <View>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsDisplayingForm(false)}
          >
            <Text style={{color: 'orange', fontSize:18}}>△ 閉じる</Text>
          </TouchableOpacity>
          <Text>アルバムに入れる写真を選択する</Text>
          <View style={{ alignItems: 'center' }}>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => openImagePicker()}
            >
              <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
            </TouchableOpacity>
            <Text>{pictureCount}個の画像が選択されています</Text>
          </View>
          <Text>アルバム名</Text>
          <TextInput
            style={styles.textInput}
            value={albumName}
            onChangeText={setAlbumName}
          />
          {isUploading ? (
            <View style={{ alignItems: 'center' }}>
              <Text>アップロード中...</Text>
              <ActivityIndicator />
            </View>
          ) : (
            <TouchableOpacity
              style={styles.uploadButton}
              onPress={() => upload(albumName)}
            >
              <Text style={{color: 'white', fontSize:18}}>写真をアップロードする</Text>
            </TouchableOpacity>
          )}
        </View>
      )
    }
    return(
      <View>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsDisplayingForm(true)}
        >
          <Text style={{color: 'white', fontSize:18}}>新しいアルバムを作成する</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return(
    <View style={styles.container}>
      <Form />
      <Albums />
    </View>
  );
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
  textInput: {
    width: 330,
    paddingLeft: 20,
    margin: 10,
    borderWidth: 1,
    borderRadius: 8,
    height: 40
  },
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
    alignItems: 'center',
    paddingTop: 10
  },
  albumName: {
    fontSize: 40,
    color: 'white',
    marginLeft: 20,
    marginTop: 140
  }
});
