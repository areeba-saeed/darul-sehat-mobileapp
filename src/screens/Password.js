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
import { useSelector } from "react-redux";
import { selectUserId } from "../reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

const Password = () => {
  const [oldpassword, setOldpassword] = useState("");
  const [password, setpassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordUpdate, setPasswordUpdate] = useState(false);
  const [message, setMessage] = useState(false);
  const [userId, setUserId] = useState();

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
    }, [userId])
  );

  const handleChange = () => {
    axios
      .put(`http://192.168.100.22:5000/user1/${userId}`, {
        oldpassword: oldpassword,
        password: password,
      })
      .then((response) => {
        console.log(response.data);
        setMessage(false);
        setpassword("");
        setOldpassword("");
        setPasswordUpdate(true);
        setTimeout(() => {
          setPasswordUpdate(false);
        }, 2000);
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          setMessage(true);
          setErrorMessage(error.response.data);
          // setErrorMessage(error.response.data);
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
            setOldpassword(value);
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
