import { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
// import the getDocs, collections, addDoc, onSnapshot, query, where functions
import {
  collection,
  getDocs,
  addDoc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';

//import AsyncStorage for Local Storage
import AsyncStorage from '@react-native-async-storage/async-storage';

//create and export ShoppingLists child component
const ShoppingLists = ({ db, route, isConnected }) => {
  //use userID, extract it from route.params
  const { userID } = route.params;

  //create state variable with initial state empty array
  const [lists, setLists] = useState([]);

  //create state variables for TextInput values
  const [listName, setListName] = useState('');
  const [item1, setItem1] = useState('');
  const [item2, setItem2] = useState('');

  //create async function to add new list
  const addShoppingList = async (newList) => {
    const newListRef = await addDoc(collection(db, 'shoppinglists'), newList);
    if (newListRef.id) {
      setLists([newList, ...lists]);
      Alert.alert(`The list "${listName}" has been added.`);
    } else {
      Alert.alert('Unable to add. Please try later');
    }
  };

  // declare the variable outside useEffect
  let unsubShoppinglists;

  //use useEffect
  //use onSnapshot() that returns the listener unsubscribe function, which is referenced with unsubShoppingLists
  useEffect(() => {
    //fetch shopping lists from the Firestore Database only if there’s a network connection
    if (isConnected === true) {
      // unregister current onSnapshot() listener to avoid registering multiple listeners when useEffect code is re-executed.
      if (unsubShoppinglists) unsubShoppinglists();
      unsubShoppinglists = null;

      //use query, where functions to confirm that users can only see their own shopping lists
      //Define the query reference in a separate line to make easier to read
      const q = query(
        collection(db, 'shoppinglists'),
        where('uid', '==', userID)
      );

      // code to execute when component mounted or updated
      unsubShoppinglists = onSnapshot(q, (documentsSnapshot) => {
        let newLists = [];
        documentsSnapshot.forEach((doc) => {
          newLists.push({ id: doc.id, ...doc.data() });
        });
        cacheShoppingLists(newLists);
        setLists(newLists);
      });
    } else loadCachedLists(); //if there’s no network connection call loadCachedLists()

    //code to execute when the component will be unmounted
    //add if statement to check if the unsubShoppingLists isn't undefined. This is a protection procedure in case the onSnapshot() function call fails.
    return () => {
      if (unsubShoppinglists) unsubShoppinglists();
    };
  }, [isConnected]);

  //create a new async function called loadCachedLists()
  //call this function if the isConnected prop turns out to be false in useEffect()
  const loadCachedLists = async () => {
    const cachedLists = (await AsyncStorage.getItem('shopping_lists')) || [];
    setLists(JSON.parse(cachedLists));
  };

  //use AsyncStorage.setItem() to cach data
  const cacheShoppingLists = async (listsToCache) => {
    try {
      await AsyncStorage.setItem(
        'shopping_lists',
        JSON.stringify(listsToCache)
      );
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* use FlatList component to display list  */}
      <FlatList
        //use lists state
        data={lists}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text>
              {/* use array function join() that converts an array into a string and adds a separator string between each element from the array once concatenated */}
              {item.name}: {item.items.join(', ')}
            </Text>
          </View>
        )}
      />
      {/* use ternary-operator-based conditional that checks the isConnected state. If it’s true, the form will be rendered; otherwise, nothing (null) will be rendered */}
      {isConnected === true ? (
        <View style={styles.listForm}>
          <TextInput
            style={styles.listName}
            placeholder="List Name"
            value={listName}
            onChangeText={setListName}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #1"
            value={item1}
            onChangeText={setItem1}
          />
          <TextInput
            style={styles.item}
            placeholder="Item #2"
            value={item2}
            onChangeText={setItem2}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => {
              const newList = {
                uid: userID,
                name: listName,
                items: [item1, item2],
              };
              addShoppingList(newList);
            }}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {Platform.OS === 'android' ? (
        <KeyboardAvoidingView behavior="height" />
      ) : null}
    </View>
  );
};

//create style
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listItem: {
    height: 70,
    justifyContent: 'center',
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#AAA',
    flex: 1,
    flexGrow: 1,
  },
  listForm: {
    flexBasis: 275,
    flex: 0,
    margin: 15,
    padding: 15,
    backgroundColor: '#CCC',
  },
  listName: {
    height: 50,
    padding: 15,
    fontWeight: '600',
    marginRight: 50,
    marginBottom: 15,
    borderColor: '#555',
    borderWidth: 2,
  },
  item: {
    height: 50,
    padding: 15,
    marginLeft: 50,
    marginBottom: 15,
    borderColor: '#555',
    borderWidth: 2,
  },
  addButton: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#000',
    color: '#FFF',
  },
  addButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 20,
  },
});

export default ShoppingLists;
