import { Doctor } from "@hms/trpc-client";
import { useMemo } from "react";

const normalize = (text: string) => text.toLowerCase().trim();

// Pure so it can be tested without rendering a hook.
export const filterDoctors = (
  doctors: Doctor[],
  filterText: string,
): Doctor[] => {
  const query = normalize(filterText);
  if (!query) return doctors;
  return doctors.filter(
    (doctor) =>
      normalize(doctor.name).includes(query) ||
      normalize(doctor.specialization ?? "").includes(query),
  );
};

export const useFilteredDoctors = (
  doctors: Doctor[],
  filterText: string,
): Doctor[] => useMemo(() => filterDoctors(doctors, filterText), [doctors, filterText]);
