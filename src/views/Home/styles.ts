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

  fab: {
    // TODO: Emulate Fixed for the Floating Action Button
  },

  div: {
    margin: "5px",
  },

  deleteButton: {
    backgroundColor: "red",
  },
});
