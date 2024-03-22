import { StyleSheet, Text, View } from 'react-native';
import { useEffect } from 'react';
//To initialize a connection for Firestore import initializeApp() and getFirestore()
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  disableNetwork,
  enableNetwork,
} from 'firebase/firestore';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Shoppinglists
import ShoppingLists from './components/ShoppingLists';
//import Welcome
import Welcome from './components/Welcome';
//import and use Logbox to prevent warning message from appearing
import { LogBox, Alert } from 'react-native';
LogBox.ignoreLogs(['AsyncStorage has been extracted from']);
//import useNetInfo for network connection state
import { useNetInfo } from '@react-native-community/netinfo';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
  //define state that represents the network connectivity status
  const connectionStatus = useNetInfo();

  //use useEffect() to display an alert popup if network connection is lost
  useEffect(() => {
    if (connectionStatus.isConnected === false) {
      Alert.alert('Connection Lost!');
      //Firebase will keep attempting to reconnect to the Firestore Database.
      //disable these attempts by calling the Firestore function disableNetwork(db)
      disableNetwork(db);
    } else if (connectionStatus.isConnected === true) {
      //re-enable by calling Firestore function enableNetwork(db)
      enableNetwork(db);
    }
  }, [connectionStatus.isConnected]);

  //Firebase configuration
  const firebaseConfig = {
    apiKey: 'AIzaSyCSHiJcNpDgX6Me6n0rFV-LgK4TwbmKo0U',
    authDomain: 'shopping-list-demo-37a23.firebaseapp.com',
    projectId: 'shopping-list-demo-37a23',
    storageBucket: 'shopping-list-demo-37a23.appspot.com',
    messagingSenderId: '756067040239',
    appId: '1:756067040239:web:84ef7846ee7ee92146541a',
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Cloud Firestore and get a reference to the service
  const db = getFirestore(app);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="ShoppingLists">
          {/* pass db props to the ShoppingLists component */}
          {/* pass the boolean value of connectionStatus.isConnected to the ShoppingLists component as a prop called isConnected */}
          {(props) => (
            <ShoppingLists
              db={db}
              isConnected={connectionStatus.isConnected}
              {...props}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
