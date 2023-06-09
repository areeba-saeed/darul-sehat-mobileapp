import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import React, { useEffect, useState } from "react";

import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { clearUserId, selectUserId } from "../reducer/index";

const Home = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState();
  const [patientId, setPatientId] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("id")
        .then((id) => {
          const parsedId = JSON.parse(id);
          setPatientId(parsedId);
        })
        .catch((error) => {
          console.log(error);
        });
      const getToken = async () => {
        try {
          const token = await AsyncStorage.getItem("token");
          const parseToken = JSON.parse(token);
          setToken(parseToken);
        } catch (error) {
          console.log(error);
        }
      };

      getToken();
    }, [patientId, token])
  );

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(`http://192.168.100.22:5000/api/v1/user1/find/${patientId}`, config)
        .then((response) => {
          setUsername(response.data.name);
          setImage(response.data.photo);
        })
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            console.log(error.response.data);
            // that falls out of the range of 2xx
          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log("Error", error.message);
          }
        });
    }, [patientId, token])
  );

  const handleLogout = () => {
    AsyncStorage.clear();
    dispatch(clearUserId());
    navigation.navigate("Login");
  };
  const currentDate = new Date();
  const dateString = currentDate.toISOString().slice(0, 10);

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row", height: 50 }}>
        <Text>{dateString}</Text>
      </View>

      <View
        style={{
          marginHorizontal: 10,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Image
          style={styles.tinyLogo}
          source={{
            uri: `http://192.168.100.22:5000/api/v1/user1/images/${image}`,
          }}
        />
        <Text style={{ fontSize: 20 }}>Welcome, {username}!</Text>
      </View>
      <View style={{ margin: 10, width: "90%" }}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("SearchDoctor")}>
            <Text>Search doctor</Text>
          </TouchableOpacity>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("LabTestBook")}>
            <Text>Book lab test</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("Pharmacy")}>
            <Text>Pharmacy</Text>
          </TouchableOpacity>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("AllAppointments")}>
            <Text>Appointment history</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("AllLabOrders")}>
            <Text>Lab orders</Text>
          </TouchableOpacity>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("AllPharmacyHistory")}>
            <Text>Pharmacy history </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.item} onPress={() => handleLogout()}>
            <Text>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  item: {
    backgroundColor: "#7393B3",
    padding: 10,
    margin: 5,
    width: "50%",
    flex: 1,
    alignItems: "center",
  },
  input: {
    padding: 10,
    borderRadius: 5,
  },

  tinyLogo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  list: {
    marginTop: 20,
  },
});

export default Home;
