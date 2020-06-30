import * as React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import SignInScreen from './src/screens/Signin';
import Home from './src/screens/Home';
import { AuthContext } from './src/screens/Index';
import ShowScreen from './src/screens/Show';
import PictureScreen from './src/screens/Picture';
import SplashScreen from './src/screens/Splash';

const Stack = createStackNavigator();

function reducer(prevState, action){
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
        isLoading: false,
        failed: false,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
      };
    case 'SET_LOADING':
      return {
        ...prevState,
        isLoading: true,
      };
    case 'UNSET_LOADING':
      return {
        ...prevState,
        isLoading: false,
      };
    case 'FAIL':
      return {
        ...prevState,
        failed: true,
        isLoading: false,
      }
  }
}

export default function App() {

  const [state, dispatch] = React.useReducer(reducer,
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
      failed: false,
    }
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('api_token');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      dispatch({ type: 'RESTORE_TOKEN', token: userToken });
    };

    bootstrapAsync();
  }, []);

  const authContext = {
    signIn: async data => {
      dispatch({ type: 'SET_LOADING' });
      fetch(`https://gopicture-docker-stg.herokuapp.com/api/login`,{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: data.email, password: data.password})
      }).then((response) => {
        if (response.ok){
          return response.json()
        }
        throw new Error('Signin failed')
      }).then((jsonData) => {
          if (jsonData.token) {
            AsyncStorage.setItem('api_token', jsonData.token);
            dispatch({ type: 'SIGN_IN', token: jsonData.token });
          }
          else {
            dispatch({ type: 'FAIL' });
          }
        })
        .catch((error) => {
          dispatch({type: 'FAIL' });
        });
    },
    signOut: () => {
      AsyncStorage.removeItem('api_token');
      dispatch({ type: 'SIGN_OUT' });
    },
    signUp: async data => {
      // In a production app, we need to send user data to server and get a token
      // We will also need to handle errors if sign up failed
      // After getting token, we need to persist the token using `AsyncStorage`
      // In the example, we'll use a dummy token

      dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
    },
    state: state
  }

  function MyStack() {
    return (
      <Stack.Navigator>
        {state.isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen
            name="Splash"
            component={SplashScreen}
            options={{
              title: 'ログイン中',
            }}
          />
        ) : state.userToken == null ? (
          // No token found, user isn't signed in
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'ログイン',
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          <>
            <Stack.Screen name="Memopic" component={Home} />
            <Stack.Screen name="Show" component={ShowScreen} />
            <Stack.Screen name="Picture" component={PictureScreen} />
          </>
        )}

      </Stack.Navigator>
    );
  }

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
