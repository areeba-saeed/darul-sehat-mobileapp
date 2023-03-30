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
  const [phoneNo, setPhoneNo] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [errorMessageshow, setErrorMessageShow] = useState();
  const [userId, setuserId] = useState();
  const dispatch = useDispatch();

  const handleLogin = () => {
    const users = {
      phoneNo: phoneNo,
      password: password,
    };
    axios
      .post("http://192.168.100.22:5000/user1/login", users)
      .then((response) => {
        const { token } = response.data;
        // Decode JWT token to get user ID
        const decoded = jwtDecode(token);
        const userId = decoded.userId;

        setPhoneNo("");
        setPassword("");
        AsyncStorage.setItem("token", JSON.stringify(userId));
        dispatch(setUserId(userId));
        setErrorMessage(false);
        setErrorMessageShow("");
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        navigation.navigate("MyDrawer");
        // Pass user ID to next screen
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
          value={phoneNo}
          placeholder="Phone No."
          placeholderTextColor="#9FA5C0"
          autoCapitalize="none"
          autoCompleteType="phoneNo"
          textContentType="phoneNo"
          onChangeText={(phoneNo) => setPhoneNo(phoneNo)}
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
      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>
      <View style={{ flexDirection: "row" }}>
        <Text>Create Account</Text>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("Signup");
            setPhoneNo("");
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
