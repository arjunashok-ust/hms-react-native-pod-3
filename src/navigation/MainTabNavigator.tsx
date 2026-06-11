import React, { useEffect, useRef } from "react";
import { Animated, View, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Feather } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import BookAppointmentScreen from "../screens/BookAppointmentScreen";
import ViewAppointmentsScreen from "../screens/ViewAppointmentsScreen";
import EditAppointmentScreen from "../screens/EditAppointmentScreens";

import { AppointmentStackParamList } from "../types/navigation";

const Tab = createBottomTabNavigator();
const AppointmentStack =
  createNativeStackNavigator<AppointmentStackParamList>();

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
      <AppointmentStack.Screen
        name="EditAppointment"
        component={EditAppointmentScreen}
      />
    </AppointmentStack.Navigator>
  );
}

// 🟢 Custom Animated Icon Component
const AnimatedTabIcon = ({
  focused,
  iconName,
}: {
  focused: boolean;
  iconName: keyof typeof Feather.glyphMap;
}) => {
  const scaleValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (focused) {
      // Spring animation when selected
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 5,
        tension: 50,
        useNativeDriver: true,
      }).start();
    } else {
      // Smooth fade out when unselected
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  }, [focused]);

  return (
    <View style={styles.iconContainer}>
      <Animated.View
        style={[
          styles.circleBackground,
          {
            transform: [{ scale: scaleValue }],
            opacity: scaleValue,
          },
        ]}
      />
      {/* 🟢 Removed the <Text> wrapper and applied dynamic colors */}
      <Feather
        name={iconName}
        size={24}
        color={focused ? "#6C4EDB" : "#9CA3AF"}
        style={{ zIndex: 1 }}
      />
    </View>
  );
};

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // 🟢 Hidden labels so the circles look clean
        tabBarStyle: {
          borderTopWidth: 0,
          elevation: 10,
          height: 90, // 🟢 Taller to accommodate the circles comfortably
          backgroundColor: "#FFFFFF",
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: -5 },
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} iconName="home" />
          ),
        }}
      />

      <Tab.Screen
        name="AppointmentsTab"
        component={AppointmentNavigator}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} iconName="calendar" />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <AnimatedTabIcon focused={focused} iconName="user" />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: 80,  // 🟢 Increased width of the active highlight
    height: 60, // 🟢 Gave the container more height to fit the new shape
  },
  circleBackground: {
    position: "absolute",
    // top: -10, // Uncomment this line if you want the shape to stick flush to the top ceiling of the tab bar
    width: 200,   // Matches container width
    height: 35,  // Controls how far down the semicircle hangs
    backgroundColor: "rgba(108, 78, 219, 0.15)",
    
    // 🟢 Upside-down semicircle geometry
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    borderBottomLeftRadius: 100,  // Exactly half of the width (80 / 2)
    borderBottomRightRadius: 100, // Exactly half of the width (80 / 2)
  },
});