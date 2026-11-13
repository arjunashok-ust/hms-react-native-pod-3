import { useStoredPatientId } from "@hms/data-access";
import { useMedicalRecordContext } from "../../hooks/useMedicalRecordContext";
import { useCallback, useMemo, useState } from "react";
import { useMedicalRecords } from "../../hooks/useMedicalRecords";

export function useViewMedicalRecord() {
  const { styles, content } = useMedicalRecordContext(
    "viewMedicalRecordContent",
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const patientId = useStoredPatientId();
  const { data, isFetching, hasNextPage, fetchNextPage } =
    useMedicalRecords(patientId);

  const records = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data],
  );

  const loadMore = () => {
    if (isFetching || !hasNextPage) return;
    fetchNextPage();
  };

  const handleToggle = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  return {
    styles,
    content,
    expandedId,
    isFetching,
    records,
    loadMore,
    handleToggle,
  };
}
