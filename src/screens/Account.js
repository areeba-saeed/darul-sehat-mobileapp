import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import { useSelector } from "react-redux";
import { selectUserId } from "../reducer/index";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Account = () => {
  const [name, setName] = useState("");
  const [age, setAge] = useState();
  const [gender, setGender] = useState("");
  const [fees, setFees] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [token, setToken] = useState();

  useEffect(() => {
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
  }, [doctorId]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(`http://192.168.100.22:5000/api/v1/user1/find/${doctorId}`, config)
      .then((response) => {
        setName(response.data.name);
        setGender(response.data.gender);
        setFees(response.data.fees);
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
  }, [token]);

  const handleUpdate = () => {
    const data = {
      name: name,
      age: parseInt(age),
      gender: gender,
      fees: fees,
    };
    axios
      .patch(
        `http://192.168.100.22:5000/api/v1/user1/update/${doctorId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setName(response.data.name);
        setGender(response.data.gender);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <Text>Name</Text>
        <TextInput
          value={name}
          style={styles.input}
          onChangeText={(name) => setName(name)}
        />
        <Text>Age</Text>
        <TextInput value={age} style={styles.input} onChangeText={setAge} />
        <Text>Gender</Text>
        <TextInput
          value={gender}
          style={styles.input}
          onChangeText={setGender}
        />
        <Text>Fees</Text>
        <TextInput value={fees} style={styles.input} onChangeText={setFees} />
        <Button title="Update" onPress={() => handleUpdate()} />
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    marginBottom: 20,
    elevation: 3,
    backgroundColor: "#FAF9F6",
  },
  rowWrapper: {
    marginTop: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    marginBottom: 20,
    elevation: 3,
    backgroundColor: "#FAF9F6",
  },
  heading: {
    flexDirection: "row",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeBtn: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  inputView: {
    backgroundColor: "rgb(210, 210, 210)",
    width: "100%",
    height: 45,
    marginBottom: 10,
    borderRadius: 5,
    // alignItems: "center",
    marginTop: 10,
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
  },
  modalText: {
    fontSize: 15,
  },
  loginBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  loginText: {
    color: "white",
  },
  dropdown: {
    backgroundColor: "#C5C5C5",
    borderRadius: 30,
    width: "100%",
    marginBottom: 20,
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: 0,
  },
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
export default Account;
