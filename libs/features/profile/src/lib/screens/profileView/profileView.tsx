import { ProfileScreenProps } from "../../navigation/navigationTypes";
import ProfileViewContent from "./profileViewContent";

export default function ProfileViewScreen({
  navigation,
}: ProfileScreenProps<"profileView">) {
  return <ProfileViewContent navigation={navigation} />;
}
