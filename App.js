import * as React from 'react';
import { AsyncStorage, Button, Text, TextInput, StyleSheet, View } from 'react-native';
import { Provider, connect } from 'react-redux';
import { createStore, combineReducers } from 'redux';
// import ImagePicker from 'react-native-image-crop-picker';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// import Login from './src/screens/Login'
// import Main from './src/screens/Main'
// import Show from './src/screens/Show'
import LoginContainer from './src/screens/Login'

const AuthContext = React.createContext();

function SplashScreen() {
  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}

function HomeScreen() {
  const { signOut } = React.useContext(AuthContext);

  return (
    <View>
      <Text>Signed in!</Text>
      <Button title="Sign out" onPress={signOut} />
    </View>
  );
}

let store = createStore(combineReducers({
  email: emailer,
  password: passworder,
  loading: loadinger,
}));

const Stack = createStackNavigator();

function emailer(state, action) {
  if (typeof state === 'undefined') {
    return {
      ...state,
      email: '',
    };
  }
  switch (action.type) {
    case 'CHANGE_EMAIL':
      return {
        ...state,
        email: action.email,
      };
    default:
      return state;
  }
}

function passworder(state, action) {
  if (typeof state === 'undefined') {
    return {
      ...state,
      password: '',
    };
  }
  switch (action.type) {
    case 'CHANGE_PASSWORD':
      return {
        ...state,
        password: action.password,
      };
    default:
      return state;
  }
}

function loadinger(state, action) {
  if (typeof state === 'undefined') {
    return {
      ...state,
      loading: false,
    };
  }
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: true,
      };
    case 'UNSET_LOADING':
      return {
        ...state,
        loading: false,
      }
    default:
      return state;
  }
}

function SignInScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const { signIn } = React.useContext(AuthContext);

  return (
    <View>
      <TextInput
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Sign in" onPress={() => signIn({ email, password })} />
    </View>
  );
}

export default function App() {
  // function HomeScreen({ navigation }) {
  //   return (
  //     <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  //       <Button
  //         title="Go to Login"
  //         onPress={() => navigation.navigate('Login')}
  //       />
  //     </View>
  //   );
  // }

  function ProfileScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Go to Notifications"
          onPress={() => navigation.navigate('Notifications')}
        />
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  function NotificationsScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button
          title="Go to Settings"
          onPress={() => navigation.navigate('Settings')}
        />
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  function SettingsScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button title="Go back" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const [state, dispatch] = React.useReducer(
    (prevState, action) => {
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
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
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

  const authContext = React.useMemo(
    () => ({
      signIn: async data => {
        fetch(`https://gopicture-docker-stg.herokuapp.com/api/login`,{
          method:'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({email: data.email, password: data.password})
        }).then((response) => response.json())
          .then((jsonData) => {
            if (jsonData.token) {
              AsyncStorage.setItem('api_token', jsonData.token);
              dispatch({ type: 'SIGN_IN', token: jsonData.token });
            }
            else {
              this.setState({ failed: true })
            }
          })
          .catch((error) => console.error(error));
      },
      signOut: () => dispatch({ type: 'SIGN_OUT' }),
      signUp: async data => {
        // In a production app, we need to send user data to server and get a token
        // We will also need to handle errors if sign up failed
        // After getting token, we need to persist the token using `AsyncStorage`
        // In the example, we'll use a dummy token

        dispatch({ type: 'SIGN_IN', token: 'dummy-auth-token' });
      },
    }),
    []
  );

  function MyStack() {
    return (
      <Stack.Navigator>
        {state.isLoading ? (
          // We haven't finished checking for the token yet
          <Stack.Screen name="Splash" component={SplashScreen} />
        ) : state.userToken == null ? (
          // No token found, user isn't signed in
          <Stack.Screen
            name="SignIn"
            component={SignInScreen}
            options={{
              title: 'Sign in',
              // When logging out, a pop animation feels intuitive
              animationTypeForReplace: state.isSignout ? 'pop' : 'push',
            }}
          />
        ) : (
          // User is signed in
          <Stack.Screen name="Home" component={HomeScreen} />
        )}
      </Stack.Navigator>
      // <Stack.Navigator>
      //   <Stack.Screen name="Home" component={HomeScreen} />
      //   <Stack.Screen name="Notifications" component={NotificationsScreen} />
      //   <Stack.Screen name="Profile" component={ProfileScreen} />
      //   <Stack.Screen name="Settings" component={SettingsScreen} />
      //   <Stack.Screen name="Login" component={LoginContainer} />
      // </Stack.Navigator>
    );
  }

  return (
    <AuthContext.Provider value={authContext} store={store}>
      <NavigationContainer>
        <MyStack />
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
//
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
