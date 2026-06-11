import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";

// Screen Imports
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import ViewAppointmentsScreen from "../screens/ViewAppointmentsScreen";
import EditAppointmentScreen from "../screens/EditAppointmentScreens";

// Type Imports
import { AppointmentStackParamList } from "../types/navigation";

const Tab = createBottomTabNavigator();
const AppointmentStack =
  createNativeStackNavigator<AppointmentStackParamList>();

// At the top of MainTabNavigator.tsx


// Further down, inside AppointmentNavigator():
function AppointmentNavigator() {
  return (
    <AppointmentStack.Navigator screenOptions={{ headerShown: false }}>
      <AppointmentStack.Screen 
        name="ViewAppointments" 
        component={ViewAppointmentsScreen} 
      />
      <AppointmentStack.Screen 
        name="BookAppointment" 
        component={BookAppointmentScreen} 
      />
      {/* 🟢 Add this new route */}
      <AppointmentStack.Screen 
        name="EditAppointment" 
        component={EditAppointmentScreen} 
      />
    </AppointmentStack.Navigator>
  );
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#6C4EDB", // The purple accent
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          height: 60,
          paddingBottom: 10,
          backgroundColor: "#FFFFFF",
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>🏠</Text>,
        }}
      />

      {/* 2. Swapped placeholder out for the nested stack navigator */}
      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentNavigator}
        options={{
          tabBarLabel: "Appointment",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>📅</Text>,
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: () => <Text style={{ fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
}
