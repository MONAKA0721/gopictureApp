import React, { useState, useEffect, useContext } from 'react';
import {
  ActivityIndicator,
  Alert,
  Animated,
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
import AsyncStorage from '@react-native-community/async-storage';

let data = new FormData();

export const AuthContext = React.createContext(null);

export function IndexScreen(){
  const [isLoading, setIsLoading] = useState(false);
  const [apiToken, setApiToken] = useState('');
  const [albums, setAlbums] = useState([]);
  const [isDisplayingForm, setIsDisplayingForm] = useState(false);
  const [albumName, setAlbumName] = useState('');
  const [isPhoto, setIsPhoto] = useState(false);

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
    setIsLoading(true);
    fetchApiToken();
  }, []);

  function openImagePicker(){
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
      setIsPhoto(true)
    }).catch(e => alert(e));
  }

  function upload(){
    if(albumName === "" || !isPhoto){
      Alert.alert(
        "アップロード失敗",
        "ファイル名を入力してください",
        [{ text: "OK"}],
        { cancelable: false }
      );
    }else{
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
  const { signOut } = useContext(AuthContext);

  function moveToShow(){
    this.props.navigation.navigate('Show');
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
          </View>
          <Text>アルバム名</Text>
          <TextInput
            style={styles.textInput}
            onChangeText={(albumName) => setAlbumName(albumName)}
          />
          <TouchableOpacity
            style={styles.uploadButton}
            onPress={() => upload()}
          >
            <Text style={{color: 'white', fontSize:18}}>写真をアップロードする</Text>
          </TouchableOpacity>
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
      <View style={styles.logout}>
        <Button title="ログアウト" onPress={() => signOut()} />
      </View>
    </View>
  );
}

// export default class Main extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: false,
//       apiToken: '',
//       albums: [],
//       formDisplay: false,
//       albumName: '',
//       is_photo: false
//     };
//   }
//
//   async componentDidMount() {
//     this.setState({ loading: true, apiToken: await AsyncStorage.getItem('api_token') })
//     fetch(`https://gopicture-docker-stg.herokuapp.com/api/index`,{
//       method: 'GET',
//       headers: { 'Authorization': 'bearer '+this.state.apiToken}
//     })
//     .then((response) => response.json())
//     .then((jsonData) => {
//       this.setState({ albums: jsonData });
//       this.setState({ loading: false });
//     })
//     .catch((error) => console.error(error));
//   }
//
//   openImagePicker = () => {
//     ImagePicker.openPicker({
//       width: 300,
//       height: 400,
//       multiple: true
//     }).then(images => {
//       images.map((item, index) => {
//         data.append("upload-firebase", ({
//           uri: item.path,
//           type: "image/jpeg",
//           name: item.filename || `temp_image_${index}.jpg`,
//         }));
//       })
//       this.setState({is_photo: true})
//     }).catch(e => alert(e));
//   }
//
//   upload = () => {
//     if(this.state.albumName === "" || !this.state.is_photo){
//       Alert.alert(
//         "アップロード失敗",
//         "ファイル名を入力してください",
//         [{ text: "OK"}],
//         { cancelable: false }
//       );
//     }else{
//       data.append("album", this.state.albumName)
//       fetch(`https://gopicture-docker-stg.herokuapp.com/api/upload`, {
//         method: "post",
//         headers: {
//           Authorization: 'bearer ' + this.state.apiToken,
//         },
//         body: data,
//       })
//       .then(res => res.json())
//       .then(res => {
//         Alert.alert(
//           "アップロード成功",
//           "アルバムをアップロードすることに成功しました",
//           [{ text: "OK"}],
//           { cancelable: false }
//         );
//       })
//       .catch(err => {
//         console.error("error uploading images: ", err);
//       });
//     }
//   }
//
//   renderAlbums(){
//     if(this.state.loading) return <FlatList />
//     else{
//       return(
//         <FlatList
//           contentContainerStyle={{ alignItems: 'center' }}
//           showsVerticalScrollIndicator={false}
//           data={this.state.albums}
//           keyExtractor={(item, index) => index.toString()}
//           renderItem={({item}) => (
//             <TouchableOpacity
//               onPress={() => this.moveToShow()}
//             >
//               <ImageBackground
//                 style={styles.image}
//                 imageStyle={{ borderRadius: 15, opacity: 0.8 }}
//                 source={{uri: `https://storage.googleapis.com/go-pictures.appspot.com/${item.Hash}/${item.TopPicName}`}}
//               >
//                 <Text style={styles.albumName}>{item.Name}</Text>
//               </ImageBackground>
//             </TouchableOpacity>
//           )}
//         />
//       )
//     }
//   }
//
//   logout() {
//     AsyncStorage.removeItem('api_token');
//     dispatch({ type: 'SIGN_OUT' })
//   }
//
//   renderForm(){
//     if(this.state.formDisplay){
//       return(
//         <View>
//           <TouchableOpacity
//             style={styles.closeButton}
//             onPress={() => this.setState({ formDisplay: false })}
//           >
//             <Text style={{color: 'orange', fontSize:18}}>△ 閉じる</Text>
//           </TouchableOpacity>
//           <Text>アルバムに入れる写真を選択する</Text>
//           <View style={{ alignItems: 'center' }}>
//             <TouchableOpacity
//               style={styles.addButton}
//               onPress={() => this.openImagePicker()}
//             >
//               <Text style={{ color: 'white', fontSize: 24 }}>+</Text>
//             </TouchableOpacity>
//           </View>
//           <Text>アルバム名</Text>
//           <TextInput
//             style={styles.textInput}
//             onChangeText={(albumName) => this.setState({albumName})}
//           />
//           <TouchableOpacity
//             style={styles.uploadButton}
//             onPress={() => this.upload()}
//           >
//             <Text style={{color: 'white', fontSize:18}}>写真をアップロードする</Text>
//           </TouchableOpacity>
//         </View>
//       )
//     }else{
//       return(
//         <View>
//           <TouchableOpacity
//             style={styles.toggleButton}
//             onPress={() => this.setState({ formDisplay: true })}
//           >
//             <Text style={{color: 'white', fontSize:18}}>新しいアルバムを作成する</Text>
//           </TouchableOpacity>
//         </View>
//       )
//     }
//   }
//
//   moveToShow(){
//     this.props.navigation.navigate('Show');
//   }
//
//   render() {
//     return (
//       <View style={styles.container}>
//         {this.renderForm()}
//         {this.renderAlbums()}
//         <View style={styles.logout}>
//           <Button title="ログアウト" onPress={() => {this.logout()}} />
//         </View>
//       </View>
//     );
//   }
// }

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
