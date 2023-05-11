import {
  View,
  Text,
  Button,
  Image,
  Switch,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import SearchableDropdown from "react-native-searchable-dropdown";
import axios from "axios";

const Pharmacy = () => {
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState();
  const [message, SetMessage] = useState(false);
  const [images, setImages] = useState([]);
  const [medicineNames, setmedicineNames] = useState("");
  const [paymentMethod, setpaymentMethod] = useState("COD");

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
      "Content-Type": "multipart/form-data",
    },
  };

  const pickImages = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry we need  media permission");
    }

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
        setImages([...images, imageData]);
      }
    }
  };

  const handleSubmit = () => {
    const formData = new FormData();
    images.forEach((image) => {
      formData.append("images", {
        uri: image.uri,
        type: image.type,
        name: image.name,
      });
    });
    formData.append("paymentMethod", paymentMethod);
    formData.append("medicineNames", medicineNames);

    if (medicineNames !== "" || images.length > 0) {
      axios
        .post(
          "http://192.168.100.22:5000/api/v1/pharmacy-orders/new",
          formData,
          config
        )
        .then((response) => {
          console.log("success");
          console.log(response.data);
          setImages([]);
          setmedicineNames("");
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
    } else {
      console.log("Images or test is required");
    }
  };

  return (
    <SafeAreaView style={{ marginHorizontal: 20 }}>
      <ScrollView>
        <Text>Upload images or select test (1 is compulsory)</Text>

        <Button title="Pick an image from camera roll" onPress={pickImages} />
        {images.length > 0 ? (
          <View>
            {images.map((row, index) => (
              <Image
                key={index}
                source={{ uri: row.uri }}
                style={{ width: 50, height: 40 }}
              />
            ))}
          </View>
        ) : (
          ""
        )}
        <Text>Medicine Names</Text>
        <TextInput
          style={styles.input}
          onChangeText={setmedicineNames}
          value={medicineNames}
        />
        <Text>Payment Method</Text>
        <TextInput
          style={styles.input}
          onChangeText={setpaymentMethod}
          value={paymentMethod}
          editable={false}
        />
        <Button title="Place order" onPress={handleSubmit} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Pharmacy;
