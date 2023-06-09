import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Home from "../screens/Home";
import Terms from "../screens/Terms";
import Account from "../screens/Account";
import Password from "../screens/Password";
import LabTestBook from "../screens/LabTestBook";
import BookAppointment from "../screens/BookAppointment";
import SearchDoctor from "../screens/SearchDoctor";
import Pharmacy from "../screens/Pharmacy";
import Doctor1 from "../screens/Doctor1";
import AllAppointments from "../screens/AllAppointments";
import AllLabOrders from "../screens/AllLabOrders";
import AllPharmacyHistory from "../screens/AllPharmacyHistory";
import Booking from "../screens/Booking";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Profile" component={Account} />
      <Drawer.Screen name="Password" component={Password} />
      <Drawer.Screen name="Terms&Conditions" component={Terms} />
      <Drawer.Screen name="LabTestBook" component={LabTestBook} />
      <Drawer.Screen name="BookAppointment" component={BookAppointment} />
      <Drawer.Screen name="Booking" component={Booking} />
      <Drawer.Screen name="SearchDoctor" component={SearchDoctor} />
      <Drawer.Screen name="Pharmacy" component={Pharmacy} />
      <Drawer.Screen name="AllAppointments" component={AllAppointments} />
      <Drawer.Screen name="AllLabOrders" component={AllLabOrders} />
      <Drawer.Screen name="AllPharmacyHistory" component={AllPharmacyHistory} />
    </Drawer.Navigator>
  );
}
export default MyDrawer;
