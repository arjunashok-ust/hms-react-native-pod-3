import { useContext, useMemo } from "react";
import { defaultContent, HomeContent } from "../content/content";
import { HomeStyles } from "../context/homeStyles";
import { HomeContext } from "../context/homeContext";

type ScreenKey = keyof HomeStyles & keyof HomeContent;
export function useHomeContext<K extends ScreenKey>(screen: K) {
  const value = useContext(HomeContext);
  if (!value) {
    throw new Error("useHome must be used within the HomeContextProvider!");
  }
  const factory = value.styles[screen];
  const styles = useMemo(() => factory(), [factory]);

  return { styles, content: value.content[screen] };
}
