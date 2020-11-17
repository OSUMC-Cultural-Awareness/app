import { DefaultTheme } from "react-native-paper";

export const API_URL = "http://localhost:5000/v1";

export const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1e88e5",
  },
};
