import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { windowHeight, windowWidth } from "../components/Dimensions";
import Entypo from "react-native-vector-icons/Entypo";
import axios from "axios";

const Booking = ({ route }) => {
  const { id, schedule } = route.params;
  const [token, setToken] = useState();
  const [openModal, setOpenModel] = useState(false);
  const [scheduleId, setScheduleId] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
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
  }, []);

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const handleBook = () => {
    axios
      .post(
        "http://192.168.100.22:5000/api/v1/bookings/new",
        { date: date, doctor: id, schedule: scheduleId },
        config
      )
      .then((response) => {
        console.log(response.data);
        setDate("");
        setOpenModel(false);
        setScheduleId("");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  };
  return (
    <View style={{ flex: 1 }}>
      {schedule.map((row, index) => (
        <View
          style={{
            backgroundColor: "pink",
            margin: 10,
            padding: 10,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          key={index}>
          <View>
            <Text>{row.day}</Text>
            <Text>{row.startTime}</Text>
            <Text>{row.endTime}</Text>
          </View>
          <View>
            <TouchableOpacity
              style={{ backgroundColor: "white" }}
              onPress={() => {
                setOpenModel(true);
                setScheduleId(row._id);
              }}>
              <Text style={{ textAlign: "center", padding: 10 }}>Book</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
      {openModal ? (
        <View
          style={{
            position: "absolute",
            width: windowWidth,
            height: windowHeight,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.3)",
          }}>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              width: windowWidth - 100,
              height: windowHeight - 400,
              backgroundColor: "white",
            }}>
            <Entypo
              name="cross"
              style={{ position: "absolute", right: 10, top: 10, zIndex: 1 }}
              size={15}
              onPress={() => {
                setOpenModel(false);
                setScheduleId("");
              }}
            />
            <Text>Enter date</Text>
            <TextInput
              value={date}
              onChangeText={setDate}
              style={styles.input}
            />
            <Button title="Book" onPress={() => handleBook()} />
          </View>
        </View>
      ) : (
        ""
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    width: "80%",
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});

export default Booking;
