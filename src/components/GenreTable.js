import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import React, { useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import axios from "axios";

const GenreTable = ({ navigation, visible }) => {
  const [genreData, setGenreData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [activity, setActivity] = useState(true);

  useEffect(() => {
    axios
      .get(`http://192.168.100.22:5000/genres`)
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
          data={genreData}
        />
      ) : (
        ""
      )}
      <FlatList
        data={filteredData}
        keyExtractor={(item) => item._id}
        style={{ height: 70 }}
        horizontal
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={visible}
        renderItem={({ item }) => {
          return (
            <View style={styles.categoryItems} key={item._id}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate("Genre1", {
                    genre: item.name,
                  });
                }}>
                <ImageBackground
                  source={{
                    uri: `http://192.168.100.22:5000/genres/${item.image}`,
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
    width: 100,
    margin: 2,
    alignItems: "center",
  },

  title: {
    fontSize: 11,
    textAlign: "center",
  },
  imageBackground: {
    width: 50,
    height: 50,
  },
  imageStyle: {
    resizeMode: "cover",
    borderRadius: 100,
  },
});
export default GenreTable;
