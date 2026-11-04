import { ProfileScreenProps } from "../../navigation/navigationTypes";
import ProfileEditContent from "./profileEditContent";
export default function ProfileEditScreen({
  navigation,
}: ProfileScreenProps<"profileEdit">) {
  return <ProfileEditContent navigation={navigation} />;
}
