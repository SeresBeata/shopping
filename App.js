import { StyleSheet, Text, View } from 'react-native';
//To initialize a connection for Firestore import initializeApp() and getFirestore()
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import Shoppinglists
import ShoppingLists from './components/ShoppingLists';
//import Welcome
import Welcome from './components/Welcome';

// Create the navigator
const Stack = createNativeStackNavigator();

const App = () => {
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
          {(props) => <ShoppingLists db={db} {...props} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
