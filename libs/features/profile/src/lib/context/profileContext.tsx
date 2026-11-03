import { createContext } from "react";
import type { ProfileStyles } from "./profileStyles";
import { ProfileContent } from "../content/content";

export interface ProfileContextValue {
  styles: ProfileStyles;
  content: ProfileContent;
}

export const ProfileContext = createContext<ProfileContextValue | undefined>(
  undefined,
);
