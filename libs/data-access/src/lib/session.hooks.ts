import { useEffect, useState } from "react";
import { getStoredEmail, getStoredPatientId } from "./session.service";

// undefined while loading, null when nothing is stored.
const useStoredValue = (read: () => Promise<string | null>) => {
  const [value, setValue] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    read().then((stored) => {
      if (!cancelled) setValue(stored);
    });
    return () => {
      cancelled = true;
    };
  }, [read]);

  return value;
};

export const useStoredEmail = () => useStoredValue(getStoredEmail);

export const useStoredPatientId = () => useStoredValue(getStoredPatientId);
