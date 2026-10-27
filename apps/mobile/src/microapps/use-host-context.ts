import {
  clearSession,
  useStoredEmail,
  useStoredPatientId,
} from "@hms/data-access";
import type { HostActions, HostContext, NavigationModel } from "@hms/models";
import { trpc } from "@hms/trpc-client";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

export function useHostContext(): HostContext {
  const navigation =
    useNavigation<NativeStackNavigationProp<NavigationModel>>();
  const queryClient = useQueryClient();
  const { mutateAsync: logout } = trpc.auth.logout.useMutation();

  const patientId = useStoredPatientId();
  const email = useStoredEmail();

  // Local session is cleared even if the server call fails (the failure is already toasted).
  const signOut = useCallback(async () => {
    try {
      await logout();
    } catch {
      // handled by the global mutation error handler
    }
    await clearSession();
    queryClient.clear();
    navigation.reset({ index: 0, routes: [{ name: "login" }] });
  }, [logout, queryClient, navigation]);

  const bookAppointment = useCallback(
    (doctorId: string) => navigation.navigate("tabs", {
      screen: "appointment",
      params: {doctorId, launchId: Date.now()},
    }),
    [navigation],
  );

  const actions = useMemo<HostActions>(() => ({ signOut,bookAppointment }), [signOut,bookAppointment]);

  return useMemo(
    () => ({ patientId: patientId ?? null, email: email ?? null, actions }),
    [patientId, email, actions],
  );
}
