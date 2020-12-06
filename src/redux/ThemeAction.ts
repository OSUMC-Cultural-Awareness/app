import { Store } from ".";

export const updateTheme = (
  theme: Store["theme"]
): { type: string; payload: Store["theme"] } => ({
  type: "UPDATE_THEME",
  payload: theme,
});
