import { View, Text, TextInput, StyleSheet, Keyboard } from "react-native";
import React, { useEffect, useRef } from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

const SearchBar = (props) => {
  useEffect(() => {
    const newData = props.data.filter((item) => {
      const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
      const textData = props.searchQuery.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    props.setFilteredData(newData);
  }, [props.searchQuery]);

  const textInputRef = useRef(null);

  useEffect(() => {
    if (props.onFocus) {
      textInputRef.current.focus();
      console.log("hi");
    }
    // Set focus on text input element when the screen is loaded
  }, []);
  return (
    <View style={styles.container}>
      <TextInput
        autoFocus={false}
        ref={textInputRef}
        placeholder="Search by name or speciality"
        onChangeText={(text) => props.setSearchQuery(text)}
        value={props.searchQuery}
        style={styles.input}
      />
      <View style={{ marginRight: 20 }}>
        <AntDesign name="search1" size={15} color="#787878" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 20,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#787878",
  },
  input: {
    padding: 10,
    borderRadius: 5,
  },
});

export default SearchBar;
