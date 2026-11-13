import { coverImage } from "@hms/shared-ui";
import {
  ImageBackground,
  View,
  Text,
  FlatList,
  ListRenderItem,
  ActivityIndicator,
} from "react-native";
import { WelcomeTextContainer } from "@hms/shared-ui";
import { useCallback } from "react";
import { AppointmentItem } from "@hms/trpc-client";
import { ProfileButton } from "@hms/shared-ui";
import { FormHeader } from "@hms/shared-ui";
import { SearchBox } from "@hms/shared-ui";
import { AppointmentCard } from "../../components/appointmentCard/appointmentCard";
import { AppointmentScreenProps } from "../../navigation/navigationTypes";
import { useAppointmentList } from "./useAppointmentList";

export type AppointmentListContentPropsType = Pick<
  AppointmentScreenProps<"appointmentList">,
  "navigation"
>;

export default function AppointmentListContent({
  navigation,
}: AppointmentListContentPropsType) {
  const {
    styles,
    content,
    goToEdit,
    goToForm,
    setSearchText,
    appointments,
    isFetching,
    onPageEnd,
  } = useAppointmentList({ navigation });

  const renderItem: ListRenderItem<AppointmentItem> = useCallback(
    ({ item }) => <AppointmentCard appointment={item} onEdit={goToEdit} />,
    [goToEdit],
  );

  return (
    <ImageBackground
      source={coverImage}
      resizeMode="cover"
      style={styles.wrapper}
    >
      <View style={styles.overlay}>
        <WelcomeTextContainer
          text1={content.welcome.text1}
          text2={content.welcome.text2}
          text3={content.welcome.text3}
          isHome={true}
        ></WelcomeTextContainer>

        <ProfileButton
          title={content.profileButton.title.goBack}
          iconName="arrow-back-outline"
          onAction={goToForm}
        />

        <SearchBox
          placeholder={content.searchBox.placeHolder.searchAppointment}
          onChangeText={setSearchText}
        />

        <View style={styles.container}>
          <FormHeader
            title={content.formHeader.title}
            value={content.formHeader.value.yourAppointments}
          />

          {appointments.length === 0 && !isFetching && (
            <Text style={[styles.noAppointmentsText, styles.text]}>
              {content.errors.noAppointmentsScheduled}
            </Text>
          )}

          <FlatList
            data={appointments}
            keyExtractor={(item) => item.appointmentId}
            renderItem={renderItem}
            initialNumToRender={1}
            maxToRenderPerBatch={3}
            windowSize={3}
            onEndReached={onPageEnd}
            onEndReachedThreshold={0.3}
            ListFooterComponent={
              isFetching ? (
                <ActivityIndicator size="small" color="rgb(108, 19, 109)" />
              ) : null
            }
          ></FlatList>
        </View>
      </View>
    </ImageBackground>
  );
}
