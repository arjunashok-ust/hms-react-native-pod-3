import { useContext, useMemo } from "react";
import { AuthenticationContext } from "../context/authenticationContext";
import { AuthenticationStylesType } from "../context/authenticationStyles";
import { AuthenticationContent } from "../content/content";

type ScreenKey = keyof AuthenticationStylesType & keyof AuthenticationContent;

export function useAuthenticationContext<K extends ScreenKey>(screen: K) {
  const value = useContext(AuthenticationContext);
  if (!value) {
    throw new Error(
      "useAuthenticationContext must only be called inside Authentication Provider",
    );
  }
  const factory = value.styles[screen];
  const styles = useMemo(
    () => factory() as ReturnType<AuthenticationStylesType[K]>,
    [factory],
  );
  const componentName = String(screen).replace(/Content$/, "");
  const testId = useMemo(
    () => value.testId(componentName),
    [value, componentName],
  );
  return { styles, content: value.content[screen], testId };
}
