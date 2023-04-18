import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import CategoryTable from "../components/CategoryTable";
import { windowHeight } from "../components/Dimensions";
import { SliderBox } from "react-native-image-slider-box";
import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { clearUserId, selectUserId } from "../reducer/index";
import GenreTable from "../components/GenreTable";
import ProductTableHome from "./ProductTableHome";

const Home = ({ navigation, route }) => {
  const [images, setImages] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);
  const [username, setUsername] = useState("");
  const dispatch = useDispatch();
  const [userId, setUserId] = useState();

  useEffect(() => {
    axios
      .get("http://192.168.100.22:5000/medicines")
      .then((response) => {
        const filteredMedicines = response.data.filter(
          (medicine) => medicine.featured === true
        );
        setAllMedicines(filteredMedicines);
        const bannerImages = filteredMedicines.map((medicine, index) => [
          {
            key: index,
            uri: `http://192.168.100.22:5000/images/${medicine.bannerImage}`,
          },
        ]);
        setImages(bannerImages);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const checkToken = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          if (token !== null) {
            setUserId(JSON.parse(token));
          } else {
            console.log("Token not found");
            setUserId(useSelector(selectUserId));
          }
        } catch (error) {
          console.log(error);
        }
      };
      checkToken();
      if (userId) {
        axios
          .get(`http://192.168.100.22:5000/user1/${userId}`)
          .then((response) => {
            setUsername(response.data.name);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, [userId])
  );
  const handleBannerPress = (index) => {
    const medicineData = allMedicines[index];
    navigation.navigate("Product1", { data: medicineData });
  };

  const handleLogout = () => {
    AsyncStorage.clear();
    dispatch(clearUserId());
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", height: 50 }}>
        <TouchableOpacity
          style={styles.searchBar}
          activeOpacity={1}
          onPress={() => navigation.navigate("Products", { onFocus: true })}>
          <TextInput
            placeholder="Search by name, genre, category or symptoms"
            style={styles.input}
            editable={false}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleLogout()}>
          <Text
            style={{
              color: "white",
              width: "100%",
              padding: 10,
              backgroundColor: "black",
            }}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginHorizontal: 10,
        }}>
        <Text style={{ color: "green" }}>Welcome {username}!</Text>
      </View>
      <View style={{ height: 120 }}>
        <SliderBox
          images={images}
          onCurrentImagePressed={(index) => handleBannerPress(index)}
          // currentImageEmitter={(index) => console.log(`current pos is: ${index}`)}
          dotColor="#000000"
          autoplay
          loop
        />
      </View>
      <Text style={{ fontSize: 20 }}>Genre</Text>
      <View>
        <GenreTable navigation={navigation} />
      </View>
      <View style={styles.categories}>
        <Text style={{ fontSize: 20 }}>Categories</Text>
        <Text
          style={{ color: "blue" }}
          onPress={() => {
            navigation.navigate("Categories");
          }}>
          See All
        </Text>
      </View>
      <CategoryTable
        navigation={navigation}
        visible={false}
        height={windowHeight - 600}
      />
      <View style={{ marginTop: 10 }}>
        <View style={styles.categories}>
          <Text style={{ fontSize: 20 }}>Medicines</Text>
          <Text
            style={{ color: "blue" }}
            onPress={() => {
              navigation.navigate("Products", { onFocus: false });
            }}>
            See All
          </Text>
        </View>
        <ProductTableHome navigation={navigation} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  input: {
    padding: 10,
    borderRadius: 5,
  },
  searchBar: {
    width: "80%",
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderColor: "#787878",
  },
  list: {
    marginTop: 20,
  },
  categoryItems: {
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

  categories: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignContent: "center",
  },
});

export default Home;
