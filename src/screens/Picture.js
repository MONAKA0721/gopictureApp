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

const { width, height, scale } = Dimensions.get('window');

export default function PictureScreen({ route, navigation }){
  return (
      <Swiper>
        {
          route.params.pictures.map((picture) =>(
            <>
              <Image
                source={{ uri: picture.picture_name.url }}
                style={ styles.imageStyle }
              />
              <View style={{flex: 1, flexDirection: 'row'}}>
                <LikeButton />
                <DownloadButton />
              </View>
            </>
          ))
        }
      </Swiper>
    )
}

function LikeButton(){
  return(
    <TouchableOpacity style={ styles.likeButton }>
      <Icon name="heart-o" size={40}/>
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
