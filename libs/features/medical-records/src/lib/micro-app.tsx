import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MicroAppProps } from "@hms/models";
import { ViewMedicalRecord } from "./screens/view-medical-record/view-medical-record";

const Stack = createNativeStackNavigator();

export function MedicalRecordMicroApp({host} : MicroAppProps){
    return (
        <Stack.Navigator screenOptions={{headerShown: false}}>
            <Stack.Screen name="medicalRecords">
                {() => <ViewMedicalRecord host={host} />}
            </Stack.Screen>
        </Stack.Navigator>
    );
}
