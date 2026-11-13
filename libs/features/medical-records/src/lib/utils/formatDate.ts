import { string } from "zod";

export function formatDateAndTime() {
  type DateInput = Date | string | null | undefined;
  const formatDate = (value: DateInput) =>
    value ? new Date(value).toDateString() : "—";

  const formatDateTime = (value: DateInput) =>
    value
      ? new Date(value).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";
  return {
    formatDate,
    formatDateTime,
  };
}
