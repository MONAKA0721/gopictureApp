import React from 'react';
import {
  FlatList,
  Image,
  View, Text, Button, TextInput,
  TouchableOpacity,ActivityIndicator, StyleSheet, AsyncStorage,
  Dimensions} from 'react-native';
import Swiper from 'react-native-swiper';
import Icon from 'react-native-vector-icons/FontAwesome';

let { width, height, scale } = Dimensions.get('window');

const data=[
  1, 2, 3, 4, 5
]

export default function PictureScreen(){
  return (
      <Swiper style={styles.wrapper}>
        {
          data.map((l) =>(
            <>
              <Image
                source={{ uri: 'https://source.unsplash.com/random' }}
                style={styles.imageStyle}
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
    <TouchableOpacity style={styles.likeButton}>
      <Icon name="heart-o" size={40}/>
    </TouchableOpacity>
  )
}
function DownloadButton(){
  return(
    <TouchableOpacity style={styles.downloadButton}>
      <Icon name="download" size={40}/>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  wrapper: {
  },
  viewStyle: {
  },
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
