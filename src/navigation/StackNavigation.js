import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Categories from "../screens/Categories";
import Products from "../screens/Products";
import Product1 from "../screens/Product1";
import Category1 from "../screens/Category1";
import Login from "../screens/Login";
import Signup from "../screens/SignUp";
import Account from "../screens/Account";
import Terms from "../screens/Terms";
import Otp from "../screens/Otp.js";
import MyDrawer from "./Drawer";
import Password from "../screens/Password";
import Notification from "../screens/Notification";
import Genre1 from "../screens/Genre1";

const Stack = createNativeStackNavigator();

// Navigation function
const StackNavigation = () => {
  const [tokenAvailable, setTokenAvailable] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  React.useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token !== null) {
          setTokenAvailable(true);
        } else {
          console.log("Token not found");
          setTokenAvailable(false);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    checkToken();
  }, []);

  if (isLoading) {
    return null; // or render a loading indicator
  }

  return (
    <Stack.Navigator
      initialRouteName={tokenAvailable === true ? "MyDrawer" : "Login"}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyDrawer" component={MyDrawer} />
      {/*   <Stack.Screen name="Notification" component={Notification} /> */}
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Products" component={Products} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="Product1" component={Product1} />
      <Stack.Screen name="Category1" component={Category1} />
      <Stack.Screen name="Genre1" component={Genre1} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Terms" component={Terms} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
