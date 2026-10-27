import { useState } from "react";

export function useDoctorSearch() {
    const [filterText, setFilterText] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("");
    return {filterText,setFilterText,selectedSpecialization,setSelectedSpecialization};
}
