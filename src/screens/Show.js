import React from 'react';
import {
  FlatList,
  Image,
  View, Text, Button, TextInput, ActivityIndicator, StyleSheet, AsyncStorage,
  Dimensions} from 'react-native';

const ITEM_WIDTH = Dimensions.get('window').width;

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      apiToken: '',
      loading: false,
      list: [0,1,2,3,4,5,6,7,8,9]
    };
  }

  async componentDidMount() {
    this.setState({ loading: true, apiToken: await AsyncStorage.getItem('api_token') })
    // fetch(`https://gopicture-docker-stg.herokuapp.com/api/index`,{
    //   method: 'GET',
    //   headers: { 'Authorization': 'bearer '+this.state.apiToken}
    // })
    // .then((response) => response.json())
    // .then((jsonData) => {
    //   this.setState({ albums: jsonData });
    //   this.setState({ loading: false });
    // })
    // .catch((error) => console.error(error));
    this.setState({ loading: false });
  }

  moveToIndex(){
    this.props.navigation.navigate('main');
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <FlatList
          data={this.state.list}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}

          renderItem={({item}) => (
            <View>
             <Image
              source={{ uri: 'https://source.unsplash.com/random' }}
              style={styles.imageStyle}
              />
            </View>
          )}
        />
      <Button title="indexページへ" onPress={() => {this.moveToIndex()}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  imageStyle: {
    width: ITEM_WIDTH / 2,
    height: ITEM_WIDTH / 2,
    margin: 1,
    resizeMode: 'cover',
  },
  container: {
    paddingTop: 40
  }
});
