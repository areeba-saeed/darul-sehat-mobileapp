import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import React, { useState } from "react";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Password = () => {
  const [oldpassword, setCurrentpassword] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordUpdate, setPasswordUpdate] = useState(false);
  const [message, setMessage] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState();

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
  const handleChange = () => {
    axios
      .patch(
        `http://192.168.100.22:5000/api/v1/user1/update/${patientId}`,
        {
          password: password,
          oldpassword: oldpassword,
        },
        config
      )
      .then((response) => {
        console.log(response.data);
        setMessage(false);
        setpassword("");
        setCurrentpassword("");
        setPasswordUpdate(true);
        setTimeout(() => {
          setPasswordUpdate(false);
        }, 2000);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          setMessage(true);
          setErrorMessage(error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  return (
    <View style={styles.container}>
      {passwordUpdate ? (
        <Text style={{ color: "green", fontSize: 12, textAlign: "center" }}>
          Password Updated!
        </Text>
      ) : (
        ""
      )}
      <Text style={{ fontSize: 15 }}>Current Passoword</Text>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholderTextColor="#003f5c"
          value={oldpassword}
          onChangeText={(value) => {
            setCurrentpassword(value);
          }}
        />
      </View>
      <Text style={{ fontSize: 15 }}>New Passoword</Text>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholderTextColor="#003f5c"
          value={password}
          onChangeText={(value) => {
            setpassword(value);
          }}
        />
      </View>
      {message ? <Text style={{ color: "red" }}>{errorMessage}</Text> : ""}
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={() => {
          handleChange();
        }}>
        <Text style={styles.loginText}>Change</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 40,
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

  loginBtn: {
    width: "100%",
    borderRadius: 25,
    marginTop: 20,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  loginText: {
    color: "white",
  },
  addAddress: {
    position: "absolute",
    bottom: 40,
    right: 20,
  },
  centerBtn: {
    alignItems: "center",
  },
});
export default Password;
