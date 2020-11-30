import { ThemeType } from "../theme";

export const THEME_INITIAL_STATE = "Dark";

export const themeReducer = (
  state = THEME_INITIAL_STATE,
  action: { type: string; payload: ThemeType }
) => {
  switch (action.type) {
    case "UPDATE_THEME":
      return action.payload;
    default:
      return state;
  }
};
