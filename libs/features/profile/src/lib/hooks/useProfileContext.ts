import { useContext, useMemo } from "react";
import { ProfileContext } from "../context/profileContext";
import { ProfileStyles} from "../context/profileStyles";
import { ProfileContent } from "../content/content";

type ScreenKey = keyof ProfileStyles & keyof ProfileContent;

export function useProfileContext<K extends ScreenKey>(screen: K) {
  const value = useContext(ProfileContext);
  if (!value) {
    throw new Error("useProfileContext must be used within ProfileProvider");
  }
  const factory = value.styles[screen];
  const styles = useMemo(
    () => factory() as ReturnType<ProfileStyles[K]>,
    [factory],
  );
  return { styles, content: value.content[screen] };
}
