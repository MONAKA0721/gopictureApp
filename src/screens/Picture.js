import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';
import { WEBAPP_URL } from '../../config'

const { width, height, scale } = Dimensions.get('window');

export default function PictureScreen({ route, navigation }){
  return (
      <Swiper index={ route.params.index }>
        {
          route.params.pictures.map((picture) =>(
            <>
              <Image
                source={{ uri: picture.picture_url }}
                style={ styles.imageStyle }
              />
              <View style={{flex: 1, flexDirection: 'row'}}>
                { picture.favorite.isFavored ? (
                  <UnlikeButton favorite_id={picture.favorite.favorite_id}/>
                ) : (
                  <LikeButton picture_id={picture.picture_id} />
                )}
                <DownloadButton />
              </View>
            </>
          ))
        }
      </Swiper>
    )
}

async function like(picture_id){
  const token = await AsyncStorage.getItem('api_token');
  const client = await AsyncStorage.getItem('client');
  const uid = await AsyncStorage.getItem('uid');
  fetch( WEBAPP_URL + `api/v1/favorites`,{
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'access-token': token,
      'client': client,
      'uid': uid
    },
    body: JSON.stringify({picture_id: picture_id}),
  })
  .then((response) => response.json())
  .then((favorite_id) => {
    console.log(favorite_id);
  })
  .catch((error) => console.error(error));
}

async function unlike(favorite_id){
  const token = await AsyncStorage.getItem('api_token');
  const client = await AsyncStorage.getItem('client');
  const uid = await AsyncStorage.getItem('uid');
  fetch( WEBAPP_URL + `api/v1/favorites/${favorite_id}`,{
    method: 'DELETE',
    headers: {
      'access-token': token,
      'client': client,
      'uid': uid
    },
  })
  .catch((error) => console.error(error));
}

function LikeButton(props){
  return(
    <TouchableOpacity
      style={ styles.likeButton }
      onPress={() => like(props.picture_id)}
    >
      <Icon name="heart-o" size={40}/>
    </TouchableOpacity>
  )
}

function UnlikeButton(props){
  return(
    <TouchableOpacity
      style={ styles.likeButton }
      onPress={() => unlike(props.favorite_id)}
    >
      <Icon name="heart" size={40}/>
    </TouchableOpacity>
  )
}

function DownloadButton(){
  return(
    <TouchableOpacity style={ styles.downloadButton }>
      <Icon name="download" size={40}/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  imageStyle: {
    flex: 6,
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  likeButton: {
    marginLeft: 20,
  },
  downloadButton: {
    marginLeft: 'auto',
    marginRight: 20,
  }
})
