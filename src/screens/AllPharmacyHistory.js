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

const ItemPast = ({ item }) => {
  return (
    <View style={styles.item}>
      {item.medicineNames.length > 0 ? (
        <View>
          {item.medicineNames.map((row, index) => (
            <Text key={index}>{row}</Text>
          ))}
        </View>
      ) : (
        ""
      )}
      <Text>{item.paymentMethod}</Text>

      <Text>
        {item.address.street} , {item.address.city} , {item.address.state} ,{" "}
        {item.address.zip}
      </Text>
    </View>
  );
};

const AllPharmacyHistory = () => {
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState();
  const [pharmacyOrders, setpharmacyOrders] = useState([]);
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
        `http://192.168.100.22:5000/api/v1/pharmacy-orders/pending/${patientId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(async (response) => {
        setpharmacyOrders(response.data);
      })
      .catch((error) => {
        if (error.response.data) {
          console.log(error.response.data);
        } else {
          console.log(error);
        }
      });
  }, [patientId, token, pharmacyOrders]);

  const ItemUpcoming = ({ item }) => {
    const handleCancel = (id) => {
      axios
        .patch(
          `http://192.168.100.22:5000/api/v1/pharmacy-orders/cancel/${id}/user/${patientId}`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        )

        .then((response) => {
          console.log(response.data);
          setMessage(true);
          setTimeout(() => {
            setMessage(false);
          }, 2000);
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response.data);
            window.alert(error.response.data.message);
          } else {
            console.log(error);
          }
        });
    };
    return (
      <View style={styles.item}>
        <View>
          <Text>{item.medicineNames}</Text>
        </View>

        <Text>{item.paymentMethod}</Text>

        <Text>
          {item.address.street} , {item.address.city} , {item.address.state} ,{" "}
          {item.address.zip}
        </Text>
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
        data={pharmacyOrders}
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

export default AllPharmacyHistory;
