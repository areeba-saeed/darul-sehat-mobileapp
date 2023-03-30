import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import ProductTable from "../components/ProductTable";
import { windowHeight } from "../components/Dimensions";
import AntDesign from "react-native-vector-icons/AntDesign";

const Products = ({ navigation, route }) => {
  const onFocus = route.params.onFocus;
  return (
    <View style={{ marginTop: 40 }}>
      <View style={styles.categories}>
        <TouchableOpacity
          style={{ marginRight: 20, justifyContent: "center" }}
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name="arrowleft" size={25} color="#787878" />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, marginLeft: 20 }}>All Products</Text>
      </View>
      <ProductTable
        navigation={navigation}
        visible={true}
        height={windowHeight - 200}
        onFocus={onFocus}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  list: {
    marginTop: 20,
  },
  item: {
    width: "33%",
    padding: 20,
    alignItems: "center",
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
export default Products;
