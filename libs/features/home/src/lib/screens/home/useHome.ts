import { Doctor, Specialization } from "@hms/trpc-client";
import { useHomeContext } from "../../hooks/useHomeContext";
import { useDoctorSearch } from "../../hooks/useDoctorSearch";
import { trpc } from "@hms/trpc-client";
import { useHost } from "@hms/shared-util";
import { useFilteredDoctors } from "../../hooks/useFilteredDoctors";

const NO_DOCTORS: Doctor[] = [];
const NO_SPECIALIZATIONS: Specialization[] = [];

export function useHome() {
  const { styles, content } = useHomeContext("homeContent");
  const { actions } = useHost();
  const {
    filterText,
    setFilterText,
    selectedSpecialization,
    setSelectedSpecialization,
  } = useDoctorSearch();
  const { data: doctors = NO_DOCTORS } = trpc.appointment.getDoctors.useQuery();
  const { data: specializations = NO_SPECIALIZATIONS } =
    trpc.ui.getSpecializations.useQuery();
  // Free-text search and the specialization chips share one filter, last input wins.
  const filteredDoctors = useFilteredDoctors(doctors, filterText);

  const onSelectedSpecialization = (data: string) => {
    setSelectedSpecialization(data);
  };

  const onSetFilterText = (data: string) => {
    setFilterText(data);
  };

  return {
    styles,
    content,
    actions,
    filterText,
    onSetFilterText,
    selectedSpecialization,
    onSelectedSpecialization,
    doctors,
    specializations,
    filteredDoctors,
  };
}
