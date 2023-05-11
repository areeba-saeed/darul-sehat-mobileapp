import {
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import { windowWidth } from "../components/Dimensions";
const SearchDoctor = () => {
  const [patientId, setPatientId] = useState("");
  const [token, setToken] = useState();
  const [doctors, setDoctors] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const navigation = useNavigation();
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
    }, [])
  );

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    if (token) {
      axios
        .get("http://192.168.100.22:5000/api/v1/doctors", config)
        .then(async (response) => {
          setDoctors(response.data);
        })
        .catch((error) => {
          if (error.response.data) {
            console.log(error.response.data);
          } else {
            console.log(error);
          }
        });
    }
  }, [patientId, doctors]);

  useEffect(() => {
    const filtered = doctors.filter((item) => {
      if (searchQuery.length > 0) {
        const specialityMatch = item.specialities.some((specialty) =>
          specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
        const nameMatch = item.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase());
        return nameMatch || specialityMatch;
      } else {
        return true;
      }
    });
    setFilteredData(filtered);
  }, [doctors, searchQuery]);

  return (
    <View>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        setFilteredData={setFilteredData}
        data={doctors}
      />
      <ScrollView>
        {filteredData.map((row, index) => {
          const image = `http://192.168.100.22:5000/api/v1/doctors/images/${row.photo}`;
          return (
            <View
              key={index}
              style={{
                padding: 10,
                flexDirection: "row",
                justifyContent: "space-between",
                width: windowWidth,
              }}>
              <View style={{ flexDirection: "row" }}>
                <View style={styles.imageView}>
                  <Image
                    style={styles.doctorImage}
                    source={{
                      uri: image,
                    }}
                  />
                </View>
                <View>
                  <Text style={{ width: "100%" }}>{row.name}</Text>
                  {row.specialities.map((data, index) => (
                    <Text key={index} style={{ color: "red", width: "80%" }}>
                      {data}
                    </Text>
                  ))}
                </View>
              </View>
              <View style={{ width: 100 }}>
                <TouchableOpacity
                  style={{ height: 20, backgroundColor: "#7393B3", margin: 5 }}
                  onPress={() =>
                    navigation.navigate("Booking", {
                      id: row._id,
                      schedule: row.schedule,
                    })
                  }>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 13,
                      textAlign: "center",
                    }}>
                    Book
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ height: 20, backgroundColor: "#7393B3", margin: 5 }}>
                  <Text
                    style={{
                      color: "white",
                      fontSize: 13,
                      textAlign: "center",
                    }}>
                    Details
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  doctorImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
  imageView: {
    width: 100,
  },
});

export default SearchDoctor;
