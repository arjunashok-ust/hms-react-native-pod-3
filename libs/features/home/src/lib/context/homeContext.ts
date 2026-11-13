import { HomeStyles } from "./homeStyles";
import { HomeContent } from "../content/content";
import { createContext } from "react";

export interface HomeContextValues {
  styles: HomeStyles;
  content: HomeContent;
}

export const HomeContext = createContext<HomeContextValues | undefined>(
  undefined,
);
