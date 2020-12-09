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
    // HACK: Any here so that FABs are Fixed on web, but use the default styling on Mobile.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    position: (Platform.OS === "web" ? "fixed" : "absolute") as any,
    margin: 16,
    right: 0,
    bottom: 0,
  },

  ListActions: {
    flexDirection: "row",
  },

  editModalInput: {
    paddingBottom: 10,
  },

  cultureListActions: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  dialogButton: {
    margin: 5,
  },
});
