import { View, Text, StyleSheet, SafeAreaView, FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const DoctorAllBookings = () => {
  const [doctorId, setDoctorId] = useState("");
  const [token, setToken] = useState();
  const [bookings, setBookings] = useState([]);

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
    if (token) {
      axios
        .get(
          `http://192.168.100.22:5000/api/v1/doctors/allBookings/${doctorId}`,
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
  }, [bookings]);

  const ItemUpcoming = ({ item }) => {
    return (
      <View style={styles.item}>
        <Text>{item.doctorName}</Text>
        <Text>{item.date}</Text>
        <Text>{item.startTime}</Text>
        <Text>{item.endTime}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={bookings}
        renderItem={({ item }) => <ItemUpcoming item={item} />}
        keyExtractor={(item) => item.id}
      />
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
  title: {
    fontSize: 32,
  },
});
export default DoctorAllBookings;
