import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import HomeScreen from "../screens/homeScreen";
import AppointmentScreen from "../screens/appointmentScreen";
import ProfileScreen from "../screens/profileScreen";

const Tab = createBottomTabNavigator();
const BottomTabs = () => {
  return (
    
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Appointments"
        component={AppointmentScreen}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
      />
    </Tab.Navigator>
  );
};

export default BottomTabs;