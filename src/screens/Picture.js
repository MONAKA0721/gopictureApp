import React, { useState } from 'react';
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

const { width, height, _ } = Dimensions.get('window');

const zip = (...arrays) => {
  const length = Math.min(...(arrays.map(arr => arr.length)))
  return new Array(length).fill().map((_, i) => arrays.map(arr => arr[i]))
}

export default function PictureScreen({ route }){
  const pictures = route.params.pictures;
  const [ isFavoreds, setIsFavoreds ] = useState(pictures.map((picture) => picture.favorite.isFavored));
  const [ favoriteIDs, setFavoriteIDs ] = useState(pictures.map((picture) => picture.favorite.favorite_id));

  async function like(picture_id, index){
    const favoreds = isFavoreds.slice();
    favoreds[index] = true;
    setIsFavoreds(favoreds);
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
      const new_favoriteIDs = favoriteIDs.slice();
      new_favoriteIDs[index] = favorite_id;
      setFavoriteIDs(new_favoriteIDs);
    })
    .catch((error) => console.error(error));
  }
  
  async function unlike(favorite_id, index){
    const favoreds = isFavoreds.slice();
    favoreds[index] = false;
    setIsFavoreds(favoreds);
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
    .then(() => {
      const new_favoriteIDs = favoriteIDs.slice();
      new_favoriteIDs[index] = null;
      setFavoriteIDs(new_favoriteIDs);
    })
    .catch((error) => console.error(error));
  }

  function LikeButton(props){
    return(
      <TouchableOpacity
        style={ styles.likeButton }
        onPress={() => like(props.picture_id, props.index)}
      >
        <Icon name="heart-o" size={40} color='gray' />
      </TouchableOpacity>
    )
  }
  
  function UnlikeButton(props){
    return(
      <TouchableOpacity
        style={ styles.likeButton }
        onPress={() => unlike(props.favorite_id, props.index)}
      >
        <Icon name="heart" size={40} color='crimson' />
      </TouchableOpacity>
    )
  }

  return (
      <Swiper index={ route.params.index }>
        {
          zip(pictures, isFavoreds, favoriteIDs).map(([picture, isFavored, favoriteID], index) =>(
            <>
              <Image
                source={{ uri: picture.picture_url }}
                style={ styles.imageStyle }
              />
              <View style={{flex: 1, flexDirection: 'row'}}>
                { isFavored ? (
                  <UnlikeButton favorite_id={favoriteID} index={index} />
                ) : (
                  <LikeButton picture_id={picture.picture_id} index={index} />
                )}
              </View>
            </>
          ))
        }
      </Swiper>
    )
}

function DownloadButton(){
  return(
    <TouchableOpacity style={ styles.downloadButton }>
      <Icon name="download" size={40} color='dimgray'/>
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
