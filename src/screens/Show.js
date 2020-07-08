import React, { useState, useEffect } from 'react';
import {
  Button,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { WEBAPP_URL } from '../../config';

const ITEM_WIDTH = Dimensions.get('window').width;

export default function ShowScreen({ route, navigation }){
  const [ isLoading, setIsLoading ] = useState(false);
  const [ pictures, setPictures ] = useState([]);

  useEffect(() =>{
    fetchPictures();
  }, []);

  async function fetchPictures() {
    setIsLoading(true);
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
    .then((response) => response.json())
    .then((jsonData) => {
      console.log(jsonData);
      setPictures(jsonData);
    })
    .catch((error) => console.error(error));
    setIsLoading(false);
  }

  return (
    <View
      style={styles.container}
    >
      <FlatList
        data={pictures}
        numColumns={2}
        renderItem={({item}) => (
          <View>
          <TouchableOpacity
            onPress={() => navigation.navigate('Picture', { pictures })}>
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
