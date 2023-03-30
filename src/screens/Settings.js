import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Material from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { windowHeight, windowWidth } from "../components/Dimensions";

import AsyncStorage from "@react-native-async-storage/async-storage";

const Settings = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate("Account");
        }}>
        <Material name="account" size={25} />
        <Text style={styles.rowTitle}>Profile</Text>
      </TouchableOpacity>

      <View
        style={{
          height: 1,
          backgroundColor: "#C5C5C5",
          width: windowWidth,
        }}
      />
      <TouchableOpacity
        style={styles.row}
        onPress={() => {
          navigation.navigate("Terms");
        }}>
        <Material name="playlist-check" size={25} />
        <Text style={styles.rowTitle}>Terms & Conditions</Text>
      </TouchableOpacity>

      <View
        style={{
          height: 1,
          backgroundColor: "#C5C5C5",
          width: windowWidth,
        }}
      />

      <TouchableOpacity
        style={styles.row}
        onPress={async () => {
          navigation.navigate("Login");
        }}>
        <Material name="logout" size={25} />
        <Text style={styles.rowTitle}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  rowTitle: {
    fontSize: 25,
    marginLeft: 20,
  },
  heading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
});

export default Settings;
