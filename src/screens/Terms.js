import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React from "react";
import AntDesign from "react-native-vector-icons/AntDesign";

const Terms = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.row}>
          <Text style={{ fontSize: 15, fontStyle: "italic" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
            placerat nibh eros, in egestas nisl sagittis eget. Nunc vitae
            suscipit dui. In fermentum nunc leo, nec rutrum eros accumsan sit
            amet. Duis in eleifend tortor. Nunc molestie tellus at orci dapibus,
            vel convallis tortor aliquam. Vestibulum euismod lobortis
            sollicitudin. Nam quis lacus ac ligula dignissim scelerisque a at
            ante. Ut gravida metus magna, at egestas tortor molestie semper. Ut
            auctor mi a velit auctor, quis congue nunc placerat. Morbi vel
            tincidunt dui, vel dapibus risus. Nam dolor arcu, luctus quis tortor
            et, sagittis mattis leo. Suspendisse fringilla metus ante, vel
            cursus arcu bibendum pellentesque. Aliquam scelerisque, neque ut
            facilisis dignissim, tellus lacus molestie mauris, sit amet
            scelerisque lorem lorem eu felis. Ut et purus orci.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  row: {
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 1.41,
    marginBottom: 20,
    elevation: 3,
    backgroundColor: "#FAF9F6",
  },
  heading: {
    flexDirection: "row",
    marginBottom: 20,
  },
});

export default Terms;
