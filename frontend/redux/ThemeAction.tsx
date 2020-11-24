import { Store } from "./UserReducer";

export const updateTheme = (theme: Store["theme"]) => ({
  type: "UPDATE_THEME",
  payload: theme,
});
