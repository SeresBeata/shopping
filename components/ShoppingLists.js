import { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
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
          <Text>
            {/* use array function join() that converts an array into a string and adds a separator string between each element from the array once concatenated */}
            {item.name}: {item.items.join(', ')}
          </Text>
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
});

export default ShoppingLists;
