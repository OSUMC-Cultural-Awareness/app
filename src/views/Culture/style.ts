import { StyleSheet, Platform } from "react-native";

export default StyleSheet.create({
  spinner: { top: "50%", position: "relative" },

  specialAddInsight: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },

  view: {
    flex: 1,
  },

  card: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },

  fab: { position: (Platform.OS === "web" ? "fixed" : undefined) as any },
});