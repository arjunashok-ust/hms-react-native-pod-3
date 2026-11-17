import { HomeStyles } from "./homeStyles";
import { HomeContent } from "../content/content";
import { createContext } from "react";
import type { TestIdTag } from "@hms/shared-util";

export interface HomeContextValues {
  styles: HomeStyles;
  content: HomeContent;
  testId: (component: string) => TestIdTag;
}

export const HomeContext = createContext<HomeContextValues | undefined>(
  undefined,
);
