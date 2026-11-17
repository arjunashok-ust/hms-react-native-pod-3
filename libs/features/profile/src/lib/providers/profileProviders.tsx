import { useMemo, ReactNode } from "react";
import { ProfileContext } from "../context/profileContext";
import { profileStyles } from "../context/profileStyles";
import { defaultContent, ProfileLanguage } from "../content/content";
import { createTestId } from "@hms/shared-util";

const testId = createTestId("profile");

interface ProfileProviderProps {
  language?: ProfileLanguage;
  children: ReactNode;
}

export function ProfileProvider({
  language = "en",
  children,
}: ProfileProviderProps) {
  const value = useMemo(
    () => ({ styles: profileStyles, content: defaultContent[language](), testId }),
    [language],
  );
  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}
