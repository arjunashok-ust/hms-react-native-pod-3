import { createContext } from "react";
import type { TestIdTag } from "@hms/shared-util";
import type { ProfileStyles } from "./profileStyles";
import { ProfileContent } from "../content/content";

export interface ProfileContextValue {
  styles: ProfileStyles;
  content: ProfileContent;
  testId: (component: string) => TestIdTag;
}

export const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);
