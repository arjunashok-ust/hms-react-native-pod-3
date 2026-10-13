import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { trpc } from "@hms/trpc-client";

const PAGE_SIZE = 5;

// Shared prefix so a mutation can invalidate every cached appointment list.
const APPOINTMENTS_QUERY_KEY = ["appointments"] as const;

export const useInvalidateAppointments = () => {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: APPOINTMENTS_QUERY_KEY });
};

export function useAppointments(patientId: string | null | undefined, searchText: string) {
  const utils = trpc.useUtils();

  return useInfiniteQuery({
    queryKey: [...APPOINTMENTS_QUERY_KEY, patientId, searchText],
    queryFn: ({ pageParam }) =>
      utils.client.appointment.getAppointmentsByPatientId.query({
        patientId: patientId ?? "",
        selectedText: searchText,
        page: pageParam,
        limit: PAGE_SIZE,
      }),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalPages }) =>
      page < totalPages ? page + 1 : undefined,
    enabled: !!patientId,
  });
}
