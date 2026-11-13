import { doctorCardStyles } from "../components/doctorCard/doctorCard.styles";
import { selectHolderStyles } from "../components/selectHolder/selectHolder.styles";
import { statCardStyles } from "../components/statCard/statCard.styles";
import { homeScreenStyles } from "../screens/home/homeStyles";

export const HomeStyles = {
  homeContent: homeScreenStyles,
  doctorCardContent: doctorCardStyles,
  selectHolderContent: selectHolderStyles,
  statCardContent: statCardStyles,
};

export type HomeStyles = typeof HomeStyles;
