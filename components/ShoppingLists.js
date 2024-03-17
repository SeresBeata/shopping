import { useState } from 'react';
import { View, FlatList } from 'react-native';

//create and export ShoppingLists child component
const ShoppingLists = ({ db }) => {
  //create state variable with initial state empty array
  const [lists, setLists] = useState([]);

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
