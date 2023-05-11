import * as React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Login from "../screens/Login";
import Signup from "../screens/SignUp";
import Account from "../screens/Account";
import Terms from "../screens/Terms";
import Otp from "../screens/Otp.js";
import MyDrawer from "./Drawer";
import Password from "../screens/Password";
import Notification from "../screens/Notification";
import Doctor1 from "../screens/Doctor1";
import DoctorDrawer from "./DoctorDrawer";

const Stack = createNativeStackNavigator();

// Navigation function
const StackNavigation = () => {
  const [tokenAvailable, setTokenAvailable] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [role, setRole] = React.useState("");

  console.log(role);

  React.useEffect(() => {
    AsyncStorage.getItem("role")
      .then((role) => {
        const parsedRole = JSON.parse(role);
        setRole(parsedRole);
      })
      .catch((error) => {
        console.log(error);
      });
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

  let initialRouteName = "Login";

  if (tokenAvailable) {
    if (role === "patient") {
      initialRouteName = "MyDrawer";
    } else if (role === "doctor") {
      initialRouteName = "DoctorDrawer";
    }
  }

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MyDrawer" component={MyDrawer} />
      <Stack.Screen name="Notification" component={Notification} />
      <Stack.Screen name="DoctorDrawer" component={DoctorDrawer} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Otp" component={Otp} />
      <Stack.Screen name="Signup" component={Signup} />
      <Stack.Screen name="Doctor1" component={Doctor1} />
      <Stack.Screen name="Password" component={Password} />
      <Stack.Screen name="Account" component={Account} />
      <Stack.Screen name="Terms" component={Terms} />
    </Stack.Navigator>
  );
};

export default StackNavigation;
