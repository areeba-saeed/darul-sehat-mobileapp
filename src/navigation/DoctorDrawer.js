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
import DoctorHome from "../screens/DoctorHome";
import DoctorAllBookings from "../screens/DoctorAllBookings";
import DoctorToday from "../screens/DoctorToday";

const Drawer = createDrawerNavigator();

function DoctorDrawer() {
  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="DoctorHome" component={DoctorHome} />
      <Drawer.Screen name="DoctorAllBookings" component={DoctorAllBookings} />
      <Drawer.Screen name="DoctorToday" component={DoctorToday} />
      <Drawer.Screen name="Profile" component={Account} />
      <Drawer.Screen name="Password" component={Password} />
      <Drawer.Screen name="Terms&Conditions" component={Terms} />
    </Drawer.Navigator>
  );
}
export default DoctorDrawer;
