import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PropTypes from "prop-types";

import { clearStorage } from "../storage/authStorage";
import { resetToLogin } from "../navigation/navigationRef";

const Header = ({ title }) => {
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await clearStorage();
          resetToLogin();
        },
      },
    ]);
  };

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{title}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#fff" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1C2143",
  },

  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#6B46C1",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  logoutText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 13,
  },
});
