import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import Entypo from "react-native-vector-icons/Entypo";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { selectUserId, setUserId } from "../reducer/index";

const Login = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessageshow, setErrorMessageShow] = useState();
  const dispatch = useDispatch();

  const handleLogin = () => {
    const users = {
      email: email,
      password: password,
    };
    axios
      .post("http://192.168.100.22:5000/api/v1/user1/login", users, {
        withCredentials: true,
      })
      .then((response) => {
        const { token } = response.data;
        const { user } = response.data;
        const { role } = user;
        const { _id } = user;
        console.log("success");
        // // Decode JWT token to get user ID
        AsyncStorage.setItem("role", JSON.stringify(role));
        AsyncStorage.setItem("id", JSON.stringify(_id));
        setEmail("");
        setPassword("");
        AsyncStorage.setItem("token", JSON.stringify(token));
        // dispatch(setUserId(userId));
        setErrorMessage(false);
        setErrorMessageShow("");
        if (role === "patient") {
          navigation.navigate("MyDrawer");
        } else if (role === "doctor") {
          navigation.navigate("DoctorDrawer");
        } else {
          setErrorMessage("Cannot login");
          setErrorMessageShow(true);
        }

        // Handle successful login
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          setErrorMessage(true);

          setErrorMessageShow(error.response.data);
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
        console.log(error);
      });
  };

  const handleTogglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/favicon.png")}
        resizeMode="cover"
        style={styles.image}
      />
      {errorMessage ? (
        <Text style={{ color: "red", marginBottom: 10 }}>
          {errorMessageshow}
        </Text>
      ) : (
        ""
      )}

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          value={email}
          placeholder="Phone No."
          placeholderTextColor="#9FA5C0"
          autoCapitalize="none"
          autoCompleteType="email"
          textContentType="email"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          value={password}
          placeholder="Password"
          placeholderTextColor="#9FA5C0"
          autoCapitalize="none"
          autoCompleteType="password"
          secureTextEntry={!passwordVisible}
          textContentType="password"
          onChangeText={(password) => setPassword(password)}
        />
        <TouchableOpacity
          style={{ marginRight: 25, marginTop: 15 }}
          onPress={handleTogglePasswordVisibility}>
          {passwordVisible ? (
            <Entypo name="eye-with-line" size={15} />
          ) : (
            <Entypo name="eye" size={15} />
          )}
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text>Create Account</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
            setEmail("");
            setPassword("");
            setErrorMessage(false);
            setErrorMessageShow("");
          }}>
          <Text style={styles.signup}>Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.loginBtn} onPress={handleLogin}>
        <Text style={styles.loginText}>LOGIN</Text>
      </TouchableOpacity>
    </View>
  );
};
export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 40,
  },
  inputView: {
    backgroundColor: "#C5C5C5",
    borderRadius: 30,
    width: "80%",
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  loginBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "black",
  },
  loginText: {
    color: "white",
  },

  signup: {
    color: "blue",
    marginLeft: 20,
  },
});
