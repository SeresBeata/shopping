import { StyleSheet, Text, View } from 'react-native';
//To initialize a connection for Firestore import initializeApp() and getFirestore()
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
    <View style={styles.container}>
      <Text>Hello World!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
