import { useDebouncedValue, useHost } from "@hms/shared-util";
import { useAppointmentContext } from "../../hooks/useAppointmentContext";
import { useCallback, useMemo, useState } from "react";
import { useAppointments } from "../../hooks/useAppointments";
import { AppointmentItem } from "@hms/trpc-client";
import { ListRenderItem } from "react-native";
import { AppointmentScreenProps } from "../../navigation/navigationTypes";

export function useAppointmentList({
  navigation,
}: Pick<AppointmentScreenProps<"appointmentList">, "navigation">) {
  const { styles, content } = useAppointmentContext("appointmentListContent");
  const { patientId } = useHost();

  const [searchText, setSearchText] = useState("");
  const debouncedSearchText = useDebouncedValue(searchText);

  const { data, isFetching, hasNextPage, fetchNextPage } = useAppointments(
    patientId,
    debouncedSearchText,
  );

  const appointments = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const goToEdit = useCallback(
    (appointment: AppointmentItem) =>
      navigation.navigate("appointmentEdit", { appointment }),
    [navigation],
  );

  const goToForm = () => {
    navigation.navigate("appointmentForm");
  };

  const onPageEnd = () => {
    if (isFetching || !hasNextPage) return;
    fetchNextPage();
  };

  return {
    styles,
    content,
    goToEdit,
    goToForm,
    setSearchText,
    appointments,
    isFetching,
    onPageEnd,
  };
}
