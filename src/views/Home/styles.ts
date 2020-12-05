import { StyleSheet, Platform } from "react-native";

import { darkTheme, lightTheme } from "../../theme";

export default StyleSheet.create({
  spinner: { top: "50%", position: "relative" },

  view: {
    flex: 1,
  },

  modalLight: {
    margin: 40,
    padding: 40,
    backgroundColor: lightTheme.colors.background,
  },

  modalDark: {
    margin: 40,
    padding: 40,
    backgroundColor: darkTheme.colors.background,
  },

  list: {
    flex: 1,
  },

  div: {
    margin: "5px",
  },

  deleteButton: {
    backgroundColor: "red",
    margin: 5,
  },

  fab: {
    position: (Platform.OS === "web" ? "fixed" : "absolute") as any,
    margin: 16,
    right: 0,
    bottom: 0,
  },

  ListActions: {
    flexDirection: "row",
  },

  dialogButton: {
    margin: 5,
  },
});
