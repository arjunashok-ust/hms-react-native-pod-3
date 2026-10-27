import { Doctor } from "@hms/trpc-client";
import { useMemo} from "react";

export const useFilteredDoctors = (
  doctors: Doctor[],
  filterText: string,
): Doctor[] =>
  useMemo(() => {
    const query = normalize(filterText);
    if (!query) return doctors;
    return doctors.filter(
      (doctor) =>
        normalize(doctor.name).includes(query) ||
        normalize(doctor.specialization ?? "").includes(query),
    );
  }, [doctors, filterText]);

const normalize = (text: string) => text.toLowerCase().trim();


