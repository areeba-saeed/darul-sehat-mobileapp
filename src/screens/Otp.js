import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AntDesign from "react-native-vector-icons/AntDesign";

const Otp = ({ navigation, route }) => {
  const [otp, setotp] = useState();
  const [errorMessageshow, setErrorMessageShow] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const phoneNo = route.params.phoneNo;
  const userId = route.params.userId;
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(true);
  const [sign, setSign] = useState(route.params.sign);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds < 600) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    const formattedMinutes = minutes.toString().padStart(2, "0");
    const formattedSeconds = seconds.toString().padStart(2, "0");
    return `${formattedMinutes}:${formattedSeconds}`;
  };
  const handleVerify = () => {
    if (otp === "") {
      setErrorMessage("Otp field is required");
      setErrorMessageShow(true);
    }
    axios
      .post(`http://192.168.100.22:5000/user1/verify`, {
        phoneNo: phoneNo,
        otp: parseInt(otp),
      })
      .then((response) => {
        console.log(response.data[0]);
        setErrorMessageShow(false);
        navigation.navigate("MyDrawer", { userId: userId });
      })
      .catch((error) => {
        if (error.response.data === "Otp invalid") {
          setErrorMessage("Otp invalid");
          setErrorMessageShow(true);
        }
        if (error.response.data === "Otp expired" && otp !== "") {
          setErrorMessage("Otp expired");
          setErrorMessageShow(true);
        }
        console.log(error.response.data);
      });
  };
  const handleResend = () => {
    axios
      .post(`http://192.168.100.22:5000/user1/resend`, {
        phoneNo: phoneNo,
      })
      .then((response) => {
        console.log(response.data);
        setSeconds(0);
        setErrorMessage(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <View style={styles.container}>
      {errorMessageshow && <Text style={{ color: "red" }}>{errorMessage}</Text>}
      {sign ? "" : <Text>{formatTime(seconds)} / 10:00</Text>}
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 100,
          left: 20,
        }}
        onPress={() => {
          navigation.goBack();
        }}>
        <AntDesign name="arrowleft" size={45} color="#787878" />
      </TouchableOpacity>
      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholderTextColor="#808080"
          editable={false}
          value={phoneNo}
        />
      </View>

      <View style={styles.inputView}>
        <TextInput
          style={styles.TextInput}
          placeholder="Enter otp code"
          value={otp}
          placeholderTextColor="#003f5c"
          onChangeText={(otp) => setotp(otp)}
        />
      </View>
      <TouchableOpacity onPress={handleResend}>
        {sign ? (
          <Text
            onPress={() => {
              setSign(false);
            }}>
            Send
          </Text>
        ) : (
          <Text>Resend</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.OTPBtn} onPress={handleVerify}>
        <Text style={styles.OTPText}>Confirm</Text>
      </TouchableOpacity>
    </View>
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
    width: "80%",
    backgroundColor: "#C5C5C5",
    borderRadius: 30,
    height: 45,
    marginBottom: 10,
    alignItems: "center",
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
  OTPBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "black",
  },
  sendBtn: {
    width: "50%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: "black",
    marginBottom: 20,
  },
  OTPText: {
    color: "white",
  },

  login: {
    color: "blue",
    marginLeft: 20,
  },
});
export default Otp;
