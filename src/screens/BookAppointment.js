import { View, Text, ScrollView, Button } from "react-native";
import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const BookAppointment = () => {
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState();
  const [slots, setSlots] = useState([]);
  const [message, SetMessage] = useState(false);

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
  useEffect(() => {
    axios
      .get("http://192.168.100.22:5000/api/v1/slots/allSlotsUsers", config)
      .then(async (response) => {
        setSlots(response.data);
      })
      .catch((error) => {
        if (error.response.data) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  }, [patientId, token, slots]);

  const onPressBook = (id) => {
    axios
      .patch(
        `http://192.168.100.22:5000/api/v1/slots/bookslot/${id}`,
        {},
        config
      )
      .then(async (response) => {
        SetMessage(true);
        setTimeout(() => {
          SetMessage(false);
        }, 1000);
      })
      .catch((error) => {
        if (error.response.data) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  };

  return (
    <ScrollView>
      <View>
        {message ? (
          <Text style={{ textAlign: "center", margin: 10, color: "green" }}>
            Slot booked
          </Text>
        ) : (
          ""
        )}
        {slots.map((row, index) => {
          const utcDate = new Date(row.date);
          const pktDate = utcDate.toLocaleDateString("en-US", {
            timeZone: "Asia/Karachi",
          });
          const utcstartTime = new Date(row.startTime);
          const pkstartTime = utcstartTime.toLocaleTimeString("en-PK", {
            timeZone: "Asia/Karachi",
          });
          const utcendTime = new Date(row.endTime);
          const pkendTime = utcendTime.toLocaleTimeString("en-PK", {
            timeZone: "Asia/Karachi",
          });

          return (
            <View key={index} style={{ margin: 20 }}>
              <Text>{row.doctorName}</Text>
              <Text>{pktDate}</Text>
              <Text>{pkstartTime}</Text>
              <Text>{pkendTime}</Text>
              <Button
                onPress={() => onPressBook(row._id)}
                title="Book"
                color="#7393B3"
                accessibilityLabel="Book an appointment"
              />
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default BookAppointment;
