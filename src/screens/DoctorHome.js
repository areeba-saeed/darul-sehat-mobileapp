import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import React, { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";

const DoctorHome = ({ navigation }) => {
  const [image, setImage] = useState("");
  const [username, setUsername] = useState("");
  const [token, setToken] = useState();
  const [doctorId, setDoctorId] = useState("");
  const [email, setEmail] = useState("");
  const [photo, setPhoto] = useState("");
  const [openImageMode, setOpenImageModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      AsyncStorage.getItem("id")
        .then((id) => {
          const parsedId = JSON.parse(id);
          setDoctorId(parsedId);
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
    }, [doctorId, token])
  );

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useFocusEffect(
    React.useCallback(() => {
      axios
        .get(
          `http://192.168.100.22:5000/api/v1/doctors/find/${doctorId}`,
          config
        )
        .then((response) => {
          setUsername(response.data.name);
          setImage(response.data.photo);
          setEmail(response.data.email);
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
    }, [doctorId, photo, username])
  );

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry we need  media permission");
    }
    const options = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 3,
    };
    if (status === "granted") {
      const response = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
      });

      if (!response.canceled) {
        const imageName = response.assets[0].uri.split("/").pop();
        const imageType = response.assets[0].uri.split(".").pop();
        const imageData = {
          name: imageName,
          uri: response.uri,
          type: `image/${imageType}`,
        };
        setOpenImageModal(true);
        setPhoto(imageData);
      }
    }
  };

  const updatePhoto = () => {
    const formData = new FormData();
    formData.append("photo", photo);
    formData.append("email", email);
    axios
      .patch(
        `http://192.168.100.22:5000/api/v1/doctors/update/${doctorId}`,
        formData,
        config
      )
      .then((response) => {
        console.log(response.data);
        setOpenImageModal(false);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log(error);
        }
      });
  };

  const handleLogout = () => {
    AsyncStorage.clear();
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
            uri: `http://192.168.100.22:5000/api/v1/doctors/images/${image}`,
          }}
        />
        <Button title="Pick an image from camera roll" onPress={pickImages} />
        {openImageMode ? (
          <View>
            <Image
              style={{ width: 50, height: 50 }}
              source={{
                uri: photo.uri,
              }}
            />
            <Button title="Update image" onPress={updatePhoto} />
          </View>
        ) : (
          ""
        )}
        <Text style={{ fontSize: 20 }}>Welcome, {username}!</Text>
      </View>
      <View style={{ margin: 10, width: "90%" }}>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("DoctorToday")}>
            <Text>Today's appointments</Text>
          </TouchableOpacity>
        </View>

        <View style={{ display: "flex", flexDirection: "row" }}>
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate("DoctorAllBookings")}>
            <Text>All Appointments </Text>
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

export default DoctorHome;
