import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { windowHeight } from "../components/Dimensions";

const ProductTableHome = ({ navigation }) => {
  const [productData, setProductData] = useState([]);

  useEffect(() => {
    axios
      .get(`http://192.168.100.22:5000/medicines`)
      .then((response) => {
        setProductData(response.data);
      })
      .catch((error) => {
        console.log(error);
        setActivity(true);
      });
  }, []);
  return (
    <View>
      <FlatList
        data={productData}
        keyExtractor={(item) => item._id}
        numColumns={3}
        style={{ height: windowHeight - 570 }}
        scrollEnabled={false}
        renderItem={({ item }) => {
          return (
            <View style={styles.categoryItems} key={item._id}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Product1", {
                    data: item,
                  });
                }}>
                <Image
                  source={{
                    uri: `http://192.168.100.22:5000/images/${item.images[0]}`,
                  }}
                  style={{ width: 100, height: 100, resizeMode: "cover" }}
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
    alignItems: "center",
  },

  title: {
    fontSize: 12,
    textAlign: "center",
  },
});

export default ProductTableHome;
