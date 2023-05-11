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

const LabTestBook = () => {
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState();
  const [images, setImages] = useState([]);
  const [testData, setTestData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [tests, setTests] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [age, setAge] = useState();
  const [gender, setGender] = useState("");
  const [zip, setZip] = useState("");
  const [state, setState] = useState("");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [other, setSelf] = useState(false);

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
        setImages([...images, imageData]);
      }
    }
  };

  useEffect(() => {
    axios
      .get("http://192.168.100.22:5000/api/v1/labtest")
      .then((response) => {
        const modifiedData = response.data.map((test, index) => {
          return {
            id: index,
            name: test.testName,
            ...test,
          };
        });
        setTestData(modifiedData);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const toggleSwitchSelf = () => {
    setSelf(!other);
  };

  const handleSelection = (item) => {
    setSelectedItems([item]);
  };

  const handleAdd = () => {
    if (selectedItems.length > 0) {
      setTests([...tests, { test: selectedItems[0]._id, quantity: quantity }]);
      setQuantity("");
      setSelectedItems([]);
    }
  };

  const handleTextChange = (text) => {
    // console.log(text);
    // Do something with the text input value
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
    formData.append("name", name);
    formData.append("other", other);
    formData.append("phoneNo", phoneNo);
    formData.append("age", age);
    formData.append("gender", gender);
    formData.append("zip", zip);
    formData.append("street", street);
    formData.append("state", state);
    formData.append("city", city);

    if (tests.length > 0) {
      tests.forEach((testing, index) => {
        formData.append(`tests[${index}][test]`, testing.test);
        formData.append(`tests[${index}][quantity]`, testing.quantity);
      });
    }
    if (tests.length > 0 || images.length > 0) {
      axios
        .post(
          "http://192.168.100.22:5000/api/v1/lab-orders/new",
          formData,
          config
        )
        .then((response) => {
          console.log("success");
          console.log(response.data);
          setImages([]);
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
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Other person?</Text>
          <Switch
            value={other}
            thumbColor={other ? "#7393B3" : "#f4f3f4"}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            onValueChange={toggleSwitchSelf}
          />
        </View>
        {other ? (
          <View>
            <Text>Name</Text>
            <TextInput
              style={styles.input}
              onChangeText={setName}
              value={name}
            />
            <Text>Age</Text>
            <TextInput style={styles.input} onChangeText={setAge} value={age} />
            <Text>Phone No.</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPhoneNo}
              value={phoneNo}
            />
            <Text>Gender</Text>
            <TextInput
              style={styles.input}
              onChangeText={setGender}
              value={gender}
            />
            <Text style={{ fontSize: 20 }}>Address</Text>
            <Text>City</Text>
            <TextInput
              style={styles.input}
              onChangeText={setCity}
              value={city}
            />
            <Text>Street</Text>
            <TextInput
              style={styles.input}
              onChangeText={setStreet}
              value={street}
            />
            <Text>State</Text>
            <TextInput
              style={styles.input}
              onChangeText={setState}
              value={state}
            />
            <Text>Zip</Text>
            <TextInput style={styles.input} onChangeText={setZip} value={zip} />
          </View>
        ) : (
          ""
        )}
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
        <Text>Select test (optional)</Text>
        <SearchableDropdown
          onItemSelect={handleSelection}
          containerStyle={{ padding: 5 }}
          textInputStyle={{
            padding: 12,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
          }}
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: "#ddd",
            borderColor: "#bbb",
            borderWidth: 1,
            borderRadius: 5,
          }}
          itemTextStyle={{ color: "#222" }}
          items={testData}
          placeholder="Select a test"
          resetValue={false}
          textInputProps={{
            onTextChange: handleTextChange,
          }}
          underlineColorAndroid="transparent"
        />
        <Text>Selected items: {JSON.stringify(selectedItems)}</Text>
        <TextInput
          style={styles.input}
          onChangeText={setQuantity}
          value={quantity}
        />
        <Button title="Add" onPress={handleAdd} />
        <Text>Tests: {JSON.stringify(tests)}</Text>
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

export default LabTestBook;
