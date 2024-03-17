import { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
// import the getDocs and collections functions
import { collection, getDocs } from 'firebase/firestore';

//create and export ShoppingLists child component
const ShoppingLists = ({ db }) => {
  //create state variable with initial state empty array
  const [lists, setLists] = useState([]);

  //getting all documents of a collection by  creating an async function outside useEffect()
  const fetchShoppingLists = async () => {
    const listsDocuments = await getDocs(collection(db, 'shoppinglists'));
    let newLists = [];
    listsDocuments.forEach((docObject) => {
      newLists.push({ id: docObject.id, ...docObject.data() });
    });
    setLists(newLists);
  };

  //use useEffect
  // call fetchShoppingLists() async function inside useEffect()
  useEffect(() => {
    fetchShoppingLists();
  }, [`${lists}`]);

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
