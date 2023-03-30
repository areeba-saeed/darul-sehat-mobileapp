import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import { categories } from "./data";
import SearchBar from "./SearchBar";
import axios from "axios";
import { windowHeight } from "./Dimensions";

const CategoryTable = ({ navigation, visible, height }) => {
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activity, setActivity] = useState(true);

  useEffect(() => {
    axios
      .get(`http://192.168.100.22:5000/categories`)
      .then((response) => {
        setFilteredData(response.data);
      })
      .catch((error) => {
        console.log(error);
        setActivity(true);
      });
  }, []);
  return (
    <View>
      {visible ? (
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilteredData={setFilteredData}
          data={productData}
        />
      ) : (
        ""
      )}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        numColumns={3}
        style={{  height: height }}
        scrollEnabled={visible}
        showsVerticalScrollIndicator={visible}
        renderItem={({ item }) => {
          return (
            <View style={styles.categoryItems} key={item._id}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Category1", {
                    category: item.name,
                  });
                }}>
                <ImageBackground
                  source={{
                    uri: `http://192.168.100.22:5000/categories/${item.image}`,
                  }}
                  style={styles.imageBackground}
                  imageStyle={styles.imageStyle}
                />
                <Text style={styles.title}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  categoryItems: {
    width: "33%",
    margin: 2,
    height: windowHeight - 600,
    backgroundColor: "#C5C5C5",
    marginBottom: 20,
  },

  title: {
    padding: 30,
    fontSize: 15,
    zIndex: 1,
    textAlign: "center",
  },
  imageBackground: {
    width: "100%",
    height: windowHeight - 600,
    position: "absolute",
    top: 0,
    opacity: 0.4,
  },
  imageStyle: {
    resizeMode: "cover",
  },
});

export default CategoryTable;
