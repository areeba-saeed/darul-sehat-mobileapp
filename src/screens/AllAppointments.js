import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Button,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { windowHeight, windowWidth } from "../components/Dimensions";

const AllAppointments = () => {
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState();
  const [bookings, setBookings] = useState([]);
  const [message, setMessage] = useState(false);
  const [slotId, setSlotId] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
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
  }, [patientId]);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      axios
        .get(
          `http://192.168.100.22:5000/api/v1/bookings/booked/${patientId}`,
          config
        )
        .then(async (response) => {
          setBookings(response.data);
        })
        .catch((error) => {
          if (error.response.data) {
            console.log(error.response.data);
          } else {
            console.log(error);
          }
        });
    }
  }, [bookings, patientId, token]);

  const handleCancel = () => {
    axios
      .patch(
        `http://192.168.100.22:5000/api/v1/bookings/cancel/${slotId}/user/${patientId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response.data);
        setModalVisible(false);
        setMessage(true);
        setTimeout(() => {
          setMessage(false);
        }, 2000);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  const ItemUpcoming = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text>{item.doctorName}</Text>
        <Text>{item.date}</Text>
        <Text>{item.startTime}</Text>
        <Text>{item.endTime}</Text>
        <TouchableOpacity
          style={{ width: 100, backgroundColor: "red", padding: 10 }}
          onPress={() => {
            setModalVisible(true);
            setSlotId(item._id);
          }}>
          <Text style={{ color: "white", textAlign: "center" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {message ? <Text style={{ color: "red" }}>Booking cancelled</Text> : ""}
      <FlatList
        data={bookings}
        renderItem={({ item }) => <ItemUpcoming item={item} />}
        keyExtractor={(item) => item.id}
      />

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType={"fade"}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modal}>
            <Text>Confirmed?</Text>
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                onPress={() => handleCancel()}
                style={{
                  backgroundColor: "red",
                  borderRadius: 5,
                  width: 70,
                  margin: 20,
                  paddingVertical: 5,
                }}>
                <Text style={{ color: "white", textAlign: "center" }}>
                  Confirm
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  backgroundColor: "grey",
                  borderRadius: 5,
                  width: 70,
                  margin: 20,
                  paddingVertical: 5,
                }}>
                <Text style={{ color: "white", textAlign: "center" }}>
                  Close
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  item: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  modalBackground: {
    flex: 1,

    backgroundColor: "rgba(0, 0, 0, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    backgroundColor: "#fff",
    padding: 20,
    width: windowWidth - 100,
    padding: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 32,
  },
});

export default AllAppointments;
