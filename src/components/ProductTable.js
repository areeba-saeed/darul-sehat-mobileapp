import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import SearchBar from "./SearchBar";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";

const Item = ({ data, navigation }) => {
  const image = data.images[0];
  return (
    <View style={styles.productItem}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("Product1", {
            data: data,
          });
        }}>
        <Image
          style={styles.image}
          source={{
            uri: `http://192.168.100.22:5000/images/${image}`,
          }}
        />
      </TouchableOpacity>
      <View>
        <Text style={styles.itemName}>{data.name}</Text>
        <Text style={styles.categoryName}>{data.category}</Text>
        <View>
          {data.symptoms.map((row, index) => {
            return (
              <Text style={styles.categoryName} key={index}>
                {row.name}
              </Text>
            );
          })}
        </View>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}></View>
    </View>
  );
};

const ProductTable = ({ navigation, visible, height, onFocus }) => {
  const [productData, setProductData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activity, setActivity] = useState(true);
  const [searchCategory, setSearchCategory] = useState("name");
  useEffect(() => {
    axios
      .get(`http://192.168.100.22:5000/medicines`)
      .then((response) => {
        setProductData(response.data);
        setActivity(false);
      })
      .catch((error) => {
        console.log(error);
        setActivity(true);
      });
  }, []);

  useEffect(() => {
    const filtered = productData.filter((item) => {
      if (searchQuery.length > 0) {
        const categoryMatch = item.category
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const genreMatch = item.genre
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const symptomsMatch = item.symptoms.some((symptom) =>
          symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const nameMatch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return categoryMatch || symptomsMatch || nameMatch || genreMatch;
      } else {
        return true;
      }
    });
    setFilteredData(filtered);
  }, [productData, searchQuery, searchCategory]);

  return (
    <View>
      {visible ? (
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setFilteredData={setFilteredData}
          data={productData}
          onFocus={onFocus}
        />
      ) : (
        ""
      )}

      {activity ? (
        <ActivityIndicator size="large" color="black" />
      ) : (
        <FlatList
          data={filteredData}
          renderItem={(item) => {
            return (
              <Item
                data={item.item}
                navigation={navigation}
                key={item.item._id}
              />
            );
          }}
          keyExtractor={(item) => item._id}
          numColumns={1}
          style={{ height: height }}
          scrollEnabled={visible}
          showsVerticalScrollIndicator={visible}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },

  productItem: {
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  itemName: {
    fontSize: 15,
    textAlign: "center",
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
    color: "gray",
  },
  itemPrice: {
    fontSize: 10,
    textAlign: "center",
    color: "gray",
  },

  image: {
    width: 100,
    height: 100,
  },
});

export default ProductTable;
