import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, View } from 'react-native';

import LoginScreen from '../screens/login';
import SignUpScreen from '../screens/signup';
import TabNavigator from '../navigation/TabNavigator';
import ViewAppointmentScreen from '../screens/view-appointment';
import EditAppointmentScreen from '../screens/edit-appointment';
import EditProfileScreen from '../screens/edit-profile';
import { NavigationModel } from "@hms/models";

const Stack = createNativeStackNavigator<NavigationModel>();

export const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in (from AsyncStorage, JWT, etc.)
    const bootstrapAsync = async () => {
      // TODO: Restore token from secure storage
      // const token = await AsyncStorage.getItem('userToken');
      // setUserToken(token);
      setIsLoading(false);
    };

    bootstrapAsync();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {userToken == null ? (
          <>
            <Stack.Screen name="login" component={LoginScreen} />
            <Stack.Screen name="signup" component={SignUpScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="tabs" component={TabNavigator} />
            <Stack.Screen
              name="viewAppointment"
              component={ViewAppointmentScreen}
            />
            <Stack.Screen
              name="editAppointment"
              component={EditAppointmentScreen}
            />
            <Stack.Screen name="editProfile" component={EditProfileScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
