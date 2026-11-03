import { profileEditContentStyles } from "../screens/profileEdit/profileEditContent.styles";
import { profileViewContentStyles } from "../screens/profileView/profileViewContent.styles";

export const profileStyles = {
  profileViewContent: profileViewContentStyles,
  profileEditContent: profileEditContentStyles,
};

export type ProfileStyles = typeof profileStyles;
