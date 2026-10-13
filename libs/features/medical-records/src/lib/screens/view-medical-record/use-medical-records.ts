import { useInfiniteQuery } from "@tanstack/react-query";
import { trpc } from "@hms/trpc-client";

const PAGE_SIZE = 5;

export function useMedicalRecords(patientId: string | null | undefined) {
  const utils = trpc.useUtils();

  return useInfiniteQuery({
    queryKey: ["medicalRecords", patientId],
    queryFn: ({ pageParam }) =>
      utils.client.medicalRecord.getMedicalRecords.query({
        patientId: patientId ?? "",
        page: pageParam,
        limit: PAGE_SIZE,
        isClientApp: true,
      }),
    initialPageParam: 1,
    getNextPageParam: ({ page, totalPages }) =>
      page < totalPages ? page + 1 : undefined,
    enabled: !!patientId,
  });
}
