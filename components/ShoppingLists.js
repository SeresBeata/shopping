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
// import the getDocs, collections, addDoc and onSnapshot functions
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';

//create and export ShoppingLists child component
const ShoppingLists = ({ db }) => {
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

  //use useEffect
  //use onSnapshot() that returns the listener unsubscribe function, which is referenced with unsubShoppingLists
  useEffect(() => {
    // code to execute when component mounted or updated
    const unsubShoppinglists = onSnapshot(
      collection(db, 'shoppinglists'),
      (documentsSnapshot) => {
        let newLists = [];
        documentsSnapshot.forEach((doc) => {
          newLists.push({ id: doc.id, ...doc.data() });
        });
        setLists(newLists);
      }
    );

    //code to execute when the component will be unmounted
    //add if statement to check if the unsubShoppingLists isn't undefined. This is a protection procedure in case the onSnapshot() function call fails.
    return () => {
      if (unsubShoppinglists) unsubShoppinglists();
    };
  }, []);

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
              name: listName,
              items: [item1, item2],
            };
            addShoppingList(newList);
          }}
        >
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
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
