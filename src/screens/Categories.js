import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React from "react";
import CategoryTable from "../components/CategoryTable";
import { windowHeight } from "../components/Dimensions";
import AntDesign from "react-native-vector-icons/AntDesign";

const Categories = ({ navigation }) => {
  

  return (
    <View style={styles.container}>
      <View style={styles.categories}>
        <TouchableOpacity
          style={{ marginRight: 20, justifyContent: "center" }}
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name="arrowleft" size={25} color="#787878" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20 }}>All Categories</Text>
      </View>
      <CategoryTable
        navigation={navigation}
        visible={true}
        height={windowHeight - 200}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    marginTop: 40,
  },
  list: {
    marginTop: 20,
  },
  item: {
    width: "33%",
    paddingHorizontal: 10,
    margin: 2,
    paddingVertical: 40,
    alignItems: "center",
    width: "33%",
    padding: 20,
    alignItems: "center",
    backgroundColor: "#C5C5C5",
  },
  title: {
    fontSize: 15,
    textAlign: "center",
  },
  itemName: {
    fontSize: 12,
    marginBottom: 10,
    textAlign: "center",
  },
  itemPrice: {
    fontSize: 10,
    textAlign: "center",
    color: "gray",
  },
  categories: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignContent: "center",
  },
  image: {
    width: 20,
    height: 100,
  },
});
export default Categories;
