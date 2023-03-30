import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar";
import { windowHeight } from "../components/Dimensions";
import AntDesign from "react-native-vector-icons/AntDesign";
import axios from "axios";

const Item = ({ data, navigation }) => {
  console.log(data.symptoms);
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
          {data.symptoms.map((row) => (
            <Text style={styles.categoryName}>{row.name}</Text>
          ))}
        </View>
      </View>
      <View style={{ alignItems: "center", justifyContent: "center" }}></View>
    </View>
  );
};

const Genre1 = ({ navigation, route }) => {
  const [medicineData, setMedicineData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [searchCategory, setSearchCategory] = useState("name");
  console.log(medicineData);
  useEffect(() => {
    axios
      .get(`http://192.168.100.22:5000/medicines`)
      .then((response) => {
        const filteredProducts = response.data.filter(
          (product) => product.genre === route.params.genre
        );
        setMedicineData(filteredProducts);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    const filtered = medicineData.filter((item) => {
      if (searchQuery.length > 0) {
        const symptomsMatch = item.symptoms.some((symptom) =>
          symptom.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const nameMatch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        const categoryMatch = item.category
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return symptomsMatch || nameMatch || categoryMatch;
      } else {
        return true;
      }
    });
    setFilteredData(filtered);
  }, [medicineData, searchQuery, searchCategory]);

  return (
    <View style={styles.container}>
      <View style={{ marginTop: 20 }}>
        <View style={styles.heading}>
          <TouchableOpacity
            style={{ marginRight: 20, justifyContent: "center" }}
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name="arrowleft" size={25} color="#787878" />
          </TouchableOpacity>
          <View style={styles.categories}>
            <Text style={{ fontSize: 30 }}>{route.params.genre}</Text>
          </View>
        </View>
        {medicineData.length > 0 ? (
          <View>
            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              setFilteredData={setFilteredData}
              data={medicineData}
              onFocus={false}
            />

            <FlatList
              data={filteredData}
              renderItem={(item) => {
                return <Item data={item.item} navigation={navigation} />;
              }}
              keyExtractor={(item) => item.id}
              numColumns={1}
            />
          </View>
        ) : (
          <View style={styles.emptyText}>
            <Text>No medicine in this genre</Text>
          </View>
        )}
      </View>
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
  heading: {
    flexDirection: "row",
  },
  title: {
    fontSize: 15,
    textAlign: "center",
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

  image: {
    width: 100,
    height: 100,
  },
  emptyText: {
    height: windowHeight - 100,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Genre1;
