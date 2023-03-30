import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { windowWidth, windowHeight } from "../components/Dimensions";
import AntDesign from "react-native-vector-icons/AntDesign";
import RenderHtml from "react-native-render-html";

const Product1 = ({ route, navigation }) => {
  const data = route.params.data;
  const [show, setShow] = useState("Ingredients");
  const [renderImages, setRenderImage] = useState(data.images[0]);
  const ingredients = data.ingredients;

  // Description
  const textWithoutQuotesDescription = data.description.replace(/"/g, "");
  const sourceDescription = {
    html: `
  ${textWithoutQuotesDescription}`,
  };

  // Benefits
  const textWithoutQuotesBenefits = data.benefits.replace(/"/g, "");

  const sourceBenefits = {
    html: `
  ${textWithoutQuotesBenefits}`,
  };
  // Side Effects
  const textWithoutQuotesSideEffects = data.sideeffects.replace(/"/g, "");

  const sourceSideEffects = {
    html: `
  ${textWithoutQuotesSideEffects}`,
  };
  // Direction
  const textWithoutQuotesDirections = data.directions.replace(/"/g, "");

  const sourceDirections = {
    html: `
  ${textWithoutQuotesDirections}`,
  };
  // Instructions
  const textWithoutQuotesInstructions = data.instructions.replace(/"/g, "");

  const sourceInstructions = {
    html: `
  ${textWithoutQuotesInstructions}`,
  };

  const allStyles = StyleSheet.create({
    p: {
      lineHeight: 20,
      color: "black",
      margin: 0,
    },
    h3: {
      margin: 0,
    },
    ul: {
      margin: 0,
      marginBottom: 0,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.heading}>
          <TouchableOpacity
            style={{ marginRight: 20, justifyContent: "center" }}
            onPress={() => {
              navigation.goBack();
            }}>
            <AntDesign name="arrowleft" size={25} color="#787878" />
          </TouchableOpacity>
        </View>
        <View
          style={{
            width: "100%",
            borderColor: "black",
            marginVertical: 20,
            marginHorizontal: 2,
            flexDirection: "row",
            justifyContent: "center",
          }}>
          <Image
            source={{
              uri: `http://192.168.100.22:5000/images/${renderImages}`,
            }}
            style={styles.image}
          />
        </View>
        <View>
          <View
            style={{
              borderColor: "black",
              flexDirection: "row",
              justifyContent: "center",
            }}>
            {data.images.map((image, index) => {
              return (
                <TouchableOpacity
                  onPress={() => setRenderImage(data.images[index])}
                  key={index}>
                  <Image
                    source={{
                      uri: `http://192.168.100.22:5000/images/${image}`,
                    }}
                    style={[
                      styles.allImages,
                      renderImages !== data.images[index]
                        ? { opacity: 0.5 }
                        : null,
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.details}>
          <Text style={{ fontSize: 20, marginBottom: 10 }}>{data.name}</Text>
        </View>
        <View style={{ paddingHorizontal: 10 }}>
          <Text style={styles.headings}>Description:</Text>
          <RenderHtml
            contentWidth={windowWidth}
            source={sourceDescription}
            tagsStyles={allStyles}
          />
          <Text style={styles.headings}>Benefits:</Text>
          <RenderHtml
            contentWidth={windowWidth}
            source={sourceBenefits}
            tagsStyles={allStyles}
          />
          <Text style={styles.headings}>Side Effects:</Text>
          <RenderHtml
            contentWidth={windowWidth}
            source={sourceSideEffects}
            tagsStyles={allStyles}
          />
          <Text style={styles.headings}>Directions:</Text>
          <RenderHtml
            contentWidth={windowWidth}
            source={sourceDirections}
            tagsStyles={allStyles}
          />

          <View style={{ borderWidth: 1, marginBottom: 20 }}>
            <View
              style={{
                flexDirection: "row",
                borderBottomWidth: 1,
              }}>
              <TouchableOpacity
                style={[
                  { width: "50%" },
                  show === "Ingredients" ? { backgroundColor: "black" } : null,
                ]}
                onPress={() => setShow("Ingredients")}>
                <Text
                  style={[
                    { marginVertical: 20, textAlign: "center" },
                    show === "Ingredients" ? { color: "white" } : null,
                  ]}>
                  Ingredients
                </Text>
              </TouchableOpacity>
              <View style={{ borderWidth: 1 }}></View>
              <TouchableOpacity
                style={[
                  { width: "50%" },
                  show === "Instructions" ? { backgroundColor: "black" } : null,
                ]}
                onPress={() => setShow("Instructions")}>
                <Text
                  style={[
                    { marginVertical: 20, textAlign: "center" },
                    show === "Instructions" ? { color: "white" } : null,
                  ]}>
                  Instructions
                </Text>
              </TouchableOpacity>
            </View>
            {show === "Instructions" ? (
              <RenderHtml
                contentWidth={windowWidth}
                source={sourceInstructions}
                tagsStyles={allStyles}
              />
            ) : (
              ""
            )}
            {show === "Ingredients" ? (
              <View>
                {ingredients.map((row, index) => (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      padding: 20,
                    }}
                    key={index}>
                    <Text>{row.ingredientName}</Text>
                    <View
                      style={{
                        flexDirection: "row",
                      }}>
                      <Text>{row.weightage} </Text>
                      <Text>{row.measurement}</Text>
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              ""
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // padding: 5,
    marginTop: 20,
  },
  heading: {
    marginTop: 10,
    flexDirection: "row",
  },
  details: {
    alignItems: "center",
  },
  image: {
    width: "80%",
    height: windowHeight - 500,
    resizeMode: "contain",
  },
  addToCart: {
    width: windowWidth - 50,
    position: "absolute",
    height: 40,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "black",
    bottom: 20,
  },
  headings: {
    fontSize: 20,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
  allImages: {
    width: 50,
    height: 50,
    marginHorizontal: 10,
  },
  active: {
    opacity: 0.5,
  },
});

export default Product1;
