import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/home";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/profile";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "rgb(255,255,255)",
        tabBarInactiveTintColor: "rgb(91, 91, 91)",
        tabBarStyle: {
          backgroundColor: "rgb(26, 26, 26)",
          height: 70,
          padding: 10,
        },
        tabBarLabelStyle: {
          fontFamily: "Sans",
          fontSize: 13,
        },
      }}
    >
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarLabel: "HOME",
        }}
      ></Tab.Screen>
      <Tab.Screen
        name="profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              color={color}
              size={size}
            />
          ),
          tabBarLabel: "PROFILE",
        }}
      ></Tab.Screen>
    </Tab.Navigator>
  );
}
