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

  // HACK: Any here so that FABs are Fixed on web, but use the default styling on Mobile.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fab: { position: (Platform.OS === "web" ? "fixed" : undefined) as any },
});
