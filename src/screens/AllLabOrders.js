import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  Button,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AllLabOrders = () => {
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState();
  const [labOrders, setLabOrders] = useState([]);
  const [message, setMessage] = useState(false);

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

  useEffect(() => {
    axios
      .get(
        `http://192.168.100.22:5000/api/v1/lab-orders/ordered/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        setLabOrders(response.data);
      })
      .catch((error) => {
        if (error.response.data) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  }, [patientId, token, labOrders]);

  const ItemUpcoming = ({ item }) => {
    const handleCancel = (id) => {
      axios
        .patch(
          `http://192.168.100.22:5000/api/v1/lab-orders/cancel/${id}/user/${patientId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )

        .then((response) => {
          setMessage(true);
          setTimeout(() => {
            setMessage(false);
          }, 2000);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            window.alert(error.response.data);
          } else {
            console.log(error);
          }
        });
    };
    return (
      <View style={styles.item}>
        {item.isHomeVisit ? <Text>True</Text> : <Text>False</Text>}
        <Text>{item.totalPrice}</Text>

        {item.tests.length > 0 ? (
          <View>
            {item.tests.map((row, index) => {
              return (
                <View key={index}>
                  <Text>{row.test.testName}</Text>
                  <Text>{row.quantity}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          ""
        )}
        <TouchableOpacity
          style={{ width: 100, backgroundColor: "red", padding: 10 }}
          onPress={() => {
            handleCancel(item._id);
            console.log(item._id);
          }}>
          <Text style={{ color: "white", textAlign: "center" }}>Cancel</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {message ? <Text style={{ color: "red" }}>Order cancelled</Text> : ""}
      <FlatList
        data={labOrders}
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

export default AllLabOrders;
