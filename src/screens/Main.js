import React from 'react';
import { View, Button } from 'react-native';

export default class Main extends React.Component {
  render() {
    return (
      <View>
        <Button
          title="ログアウト"
          onPress={() => {this.props.navigation.navigate('login')}}>
        </Button>
      </View>
    );
  }
}
