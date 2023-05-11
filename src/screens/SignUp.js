import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { uid } from "uid";
import Entypo from "react-native-vector-icons/Entypo";
import Checkbox from "expo-checkbox";
import axios from "axios";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useDispatch } from "react-redux";
import { setUserId } from "../reducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AntDesign from "react-native-vector-icons/AntDesign";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    // alert("Must use physical device for Push Notifications");
  }

  return token;
}

const Signup = ({ navigation }) => {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [name, setName] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phoneNo, setPhoneNo] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [street, setStreet] = useState("");
  const [state, setState] = useState("");
  const [errorShow, setErrorShow] = useState(false);
  const [deviceToken, setDeviceToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setDeviceToken(token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log(response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const randomString1 = uid();
  const randomString2 = uid();

  const randomUserId = randomString1
    .replace(/[^0-9]/g, "") // remove non-digits
    .substring(0, 7); // extract first 5 digits
  const randomDoctorId = randomString2
    .replace(/[^0-9]/g, "") // remove non-digits
    .substring(0, 5); // extract first 5 digits

  const userId = randomUserId;

  const handleResgistration = () => {
    const user = {
      name: name,
      password: password,
      password2: password2,
      age: parseInt(age),
      email: email,
      phoneNo: phoneNo,
      zip: zip,
      deviceToken: deviceToken,
      city: city,
      street: street,
      state: state,
      gender: gender,
    };
    axios
      .post(`http://192.168.100.22:5000/api/v1/user1/register`, user, {
        withCredentials: true,
      })
      .then((response) => {
        console.log(response.data);
        const { token } = response.data;
        const { user } = response.data;
        const id = user._id;

        // // Decode JWT token to get user ID
        AsyncStorage.setItem("role", "patient");
        AsyncStorage.setItem("id", JSON.stringify(id));
        AsyncStorage.setItem("token", JSON.stringify(token));
        setName("");
        setAge("");
        setGender("");
        setEmail("");
        setPhoneNo("");
        setZip("");
        setStreet("");
        setState("");
        setCity("");
        setPassword("");
        setPassword2("");
        // dispatch(setUserId(userId));
        setErrorMessage("");
        setErrorShow(false);

        navigation.navigate("MyDrawer");
      })
      .catch((error) => {
        if (error.response) {
          // The request was made and the server responded with a status code
          console.log(error.response.data);
          setErrorShow(true);
          setErrorMessage(error.response.data);
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
    <ScrollView nestedScrollEnabled={true}>
      <View style={styles.container}>
        <Image
          source={require("../assets/favicon.png")}
          resizeMode="cover"
          style={styles.image}
        />
        <View style={{ flexDirection: "row" }}>
          <Text>Already have an account?</Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
            }}>
            <Text style={styles.login}>Login</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Name"
            placeholderTextColor="#003f5c"
            value={name}
            onChangeText={(name) => setName(name)}
          />
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="PhoneNo."
            value={phoneNo}
            placeholderTextColor="#003f5c"
            onChangeText={(phoneNo) => setPhoneNo(phoneNo)}
          />
        </View>
        <View style={{ width: "80%" }}>
          <View style={styles.inputDoctor}>
            <TextInput
              style={styles.TextInput}
              placeholder="Email"
              value={email}
              placeholderTextColor="#003f5c"
              onChangeText={(email) => setEmail(email)}
            />
          </View>
        </View>
        <View style={{ width: "80%" }}>
          <View style={styles.inputDoctor}>
            <TextInput
              style={styles.TextInput}
              placeholder="Age"
              value={age}
              placeholderTextColor="#003f5c"
              onChangeText={(age) => setAge(age)}
            />
          </View>
        </View>
        <View style={{ width: "80%" }}>
          <View style={styles.inputDoctor}>
            <TextInput
              style={styles.TextInput}
              placeholder="Gender"
              value={gender}
              placeholderTextColor="#003f5c"
              onChangeText={(gender) => setGender(gender)}
            />
          </View>
        </View>
        <Text style={{ fontSize: 25 }}>Address</Text>
        <View style={{ width: "80%" }}>
          <View style={styles.inputDoctor}>
            <TextInput
              style={styles.TextInput}
              placeholder="Zip"
              value={zip}
              placeholderTextColor="#003f5c"
              onChangeText={(zip) => setZip(zip)}
            />
          </View>
        </View>
        <View style={{ width: "80%" }}>
          <View style={styles.inputDoctor}>
            <TextInput
              style={styles.TextInput}
              placeholder="Street"
              value={street}
              placeholderTextColor="#003f5c"
              onChangeText={(street) => setStreet(street)}
            />
          </View>
        </View>
        <View style={{ width: "80%" }}>
          <View style={styles.inputDoctor}>
            <TextInput
              style={styles.TextInput}
              placeholder="City"
              value={city}
              placeholderTextColor="#003f5c"
              onChangeText={(city) => setCity(city)}
            />
          </View>
        </View>
        <View style={{ width: "80%" }}>
          <View style={styles.inputDoctor}>
            <TextInput
              style={styles.TextInput}
              placeholder="State"
              value={state}
              placeholderTextColor="#003f5c"
              onChangeText={(state) => setState(state)}
            />
          </View>
        </View>
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Password"
            placeholderTextColor="#003f5c"
            value={password}
            secureTextEntry={!passwordVisible}
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
        <View style={styles.inputView}>
          <TextInput
            style={styles.TextInput}
            placeholder="Confirm Password"
            placeholderTextColor="#003f5c"
            value={password2}
            secureTextEntry={!passwordVisible}
            onChangeText={(password2) => setPassword2(password2)}
          />
        </View>
        {errorShow ? (
          <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
        ) : (
          ""
        )}
        <TouchableOpacity
          style={styles.SignupBtn}
          onPress={handleResgistration}>
          <Text style={styles.SignupText}>Signup</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

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
  inputDoctor: {
    backgroundColor: "#C5C5C5",
    borderRadius: 30,
    width: "100%",
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: 0,
  },
  dropdown: {
    backgroundColor: "#C5C5C5",
    borderRadius: 30,
    width: "100%",
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: 0,
    justifyContent: "space-between",
  },
  opendropdown: {
    width: "100%",
    marginBottom: 20,
    borderBottomEndRadius: 5,
    borderBottomLeftRadius: 5,
    borderWidth: 1,
    height: 150,
    zIndex: 20,
    position: "absolute",
    backgroundColor: "white",
    top: 30,
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
  SignupBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  SignupText: {
    color: "white",
  },

  login: {
    color: "blue",
    marginLeft: 20,
  },
  checkbox: {
    margin: 8,
  },
});
export default Signup;
