import React, { useState, useEffect, useContext } from 'react';
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { WEBAPP_URL } from '../../config';
import { AuthContext } from './Index';

const ITEM_WIDTH = Dimensions.get('window').width;

export default function ShowScreen({ route, navigation }){
  const [ pictures, setPictures ] = useState([]);
  const { resetToken } = useContext(AuthContext);
  useEffect(() =>{
    const focus = navigation.addListener('focus', () => fetchPictures());
    return focus;
  }, []);

  async function fetchPictures() {
    const token = await AsyncStorage.getItem('api_token');
    const client = await AsyncStorage.getItem('client');
    const uid = await AsyncStorage.getItem('uid');
    fetch( WEBAPP_URL + `api/v1/albums/${route.params.album_hash}`,{
      method: 'GET',
      headers: {
        'access-token': token,
        'client': client,
        'uid': uid
      }
    })
    .then((response) => {
      if(response.ok){
        return response.json();
      }else{
        resetToken();
      }
    })
    .then((jsonData) => {
      setPictures(jsonData);
    })
    .catch((error) => console.error(error));
  }

  return (
    <View
      style={styles.container}
    >
      <FlatList
        data={pictures}
        numColumns={2}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => (
          <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Picture', { pictures, index })}>
            <Image
              source={{ uri: item.picture_url }}
              style={styles.imageStyle}
            />
          </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imageStyle: {
    width: ITEM_WIDTH / 2,
    height: ITEM_WIDTH / 2,
    margin: 1,
    resizeMode: 'cover',
  },
  container: {
  }
});
