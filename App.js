import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-community/async-storage';

import SignInScreen from './src/screens/Signin';
import SignUpScreen from './src/screens/SignUp';
import Home from './src/screens/Home';
import { AuthContext } from './src/screens/Index';
import ShowScreen from './src/screens/Show';
import PictureScreen from './src/screens/Picture';
import SplashScreen from './src/screens/Splash';
import { WEBAPP_URL } from './config';

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
        failed: false,
        invalid_email: false,
        invalid_pass: false,
        mismatch_pass: false,
        isUsedEmail: false,
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
        invalid_email: false,
        invalid_pass: false,
        mismatch_pass: false,
      };
    case 'INVALID_EMAIL':
      return {
        ...prevState,
        invalid_email: true,
      };
    case 'INVALID_PASS':
      return {
        ...prevState,
        invalid_pass: true,
      };
    case 'MISMATCH_PASS':
      return {
        ...prevState,
        mismatch_pass: true,
      }
    case 'SET_EMAIL':
      return {
        ...prevState,
        email: action.email,
      };
    case 'SET_USEDEMAIL':
      return {
        ...prevState,
        isUsedEmail: true,
      };
    case 'FRESH_ALL_ERROR':
      return {
        ...prevState,
        failed: false,
        invalid_email: false,
        invalid_pass: false,
        mismatch_pass: false,
        isUsedEmail: false,
      }
    case 'USED_EMAIL':
      return {
        ...prevState,
        isUsedEmail: true,
      }
  }
}

export default function App() {

  const [state, dispatch] = React.useReducer(reducer,
    {
      isLoading: false,
      isSignout: false,
      userToken: null,
      failed: false,
      invalid_email: false,
      invalid_pass: false,
      mismatch_pass: false,
      isUsedEmail: false,
      email: '',
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
      dispatch({ type: 'FRESH_ALL_ERROR' });
      dispatch({ type: 'SET_EMAIL', email: data.email });
      if ( data.email == '' ){
        dispatch({ type: 'INVALID_EMAIL' });
        if ( data.password == '' ){
          dispatch({ type: 'INVALID_PASS' });
        }
        return 0;
      }
      if ( data.password == '' ){
        return dispatch({ type: 'INVALID_PASS' });
      }
      dispatch({ type: 'SET_LOADING' });
      fetch( WEBAPP_URL + `api/v1/auth/sign_in`,{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({email: data.email, password: data.password})
      }).then((response) => {
        if (response.ok){
          const response_headers = {
            accessToken: response.headers.get("access-token"),
            client: response.headers.get("client"),
            uid:  response.headers.get("uid")
          }
          return response_headers;
        }
        throw new Error('Signin failed')
      }).then((headers) => {
          if (headers["accessToken"]) {
            AsyncStorage.setItem('api_token', headers["accessToken"]);
            AsyncStorage.setItem('client', headers["client"]);
            AsyncStorage.setItem('uid', headers["uid"]);
            dispatch({ type: 'SIGN_IN', token: headers["accessToken"]});
            dispatch({ type: 'UNSET_LOADING' });
          }
          else {
            dispatch({ type: 'FAIL' });
            dispatch({ type: 'UNSET_LOADING' });
          }
        })
        .catch((error) => {
          dispatch({ type: 'FAIL' });
          dispatch({ type: 'UNSET_LOADING' });
        });
    },
    signOut: () => {
      AsyncStorage.removeItem('api_token');
      dispatch({ type: 'SIGN_OUT' });
    },
    signUp: async data => {
      dispatch({ type: 'FRESH_ALL_ERROR' });
      dispatch({ type: 'SET_EMAIL', email: data.email });
      if ( data.email == '' ){
        dispatch({ type: 'INVALID_EMAIL' });
        if ( data.password == '' ){
          dispatch({ type: 'INVALID_PASS' });
        }
        return 0;
      }
      if ( data.password.length < 6 ){
        return dispatch({ type: 'INVALID_PASS' });
      }
      if ( data.password != data.password_confirmation ){
        return dispatch({ type: 'MISMATCH_PASS' });
      }
      dispatch({ type: 'SET_LOADING' });
      fetch( WEBAPP_URL + `api/v1/auth`,{
        method:'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password })
      }).then((response) => {
        if (response.ok){
          const response_headers = {
            accessToken: response.headers.get("access-token"),
            client: response.headers.get("client"),
            uid:  response.headers.get("uid")
          }
          return response_headers;
        }
        throw new Error('SignUp failed')
      }).then((headers) => {
        console.log("headers");
        if (headers["accessToken"]) {
          AsyncStorage.setItem('api_token', headers["accessToken"]);
          AsyncStorage.setItem('client', headers["client"]);
          AsyncStorage.setItem('uid', headers["uid"]);
          dispatch({ type: 'SIGN_IN', token: headers["accessToken"] });
          dispatch({ type: 'UNSET_LOADING' });
        }
        else {
          dispatch({ type: 'FAIL' });
          dispatch({ type: 'UNSET_LOADING' });
        }
      })
      .catch((error) => {
        dispatch({ type: 'USED_EMAIL' });
        dispatch({ type: 'UNSET_LOADING' });
      });      
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
          <>
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{
                title: 'ログイン',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{
                title: '新規登録',
                // When logging out, a pop animation feels intuitive
                animationTypeForReplace: state.isSignout ? 'pop' : 'push',
              }}
            />
          </>
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
