import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Terms from "../screens/Terms";
import Account from "../screens/Account";
import Password from "../screens/Password";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Account} />
      <Drawer.Screen name="Password" component={Password} />
      <Drawer.Screen name="Terms&Conditions" component={Terms} />
    </Drawer.Navigator>
  );
}
export default MyDrawer;
