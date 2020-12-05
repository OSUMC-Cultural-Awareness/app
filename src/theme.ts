import { DefaultTheme, DarkTheme } from "react-native-paper";

export const lightTheme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    primary: "#1e88e5",
    accent: "#1e88e5",
  },
};

export const darkTheme = {
  ...DarkTheme,
  roundness: 2,
  colors: {
    ...DarkTheme.colors,
    primary: "#1e88e5",
    accent: "#1e88e5",
  },
};

export type ThemeType = "Dark" | "Light";
