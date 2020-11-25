import { combineReducers } from "redux";

import { USER_INITIAL_STATE, userReducer } from "./UserReducer";
import { THEME_INITIAL_STATE, themeReducer } from "./ThemeReducer";
import { updateUser, resetUser } from "./UserAction";
import { updateTheme } from "./ThemeAction";

import { ThemeType } from "../theme";

export const Reducer = combineReducers({
  theme: themeReducer,
  user: userReducer,
});

export type Store = {
  user: {
    user: { name: string; email: string; superUser: boolean };
    token: string;
  };
  theme: ThemeType;
};

export {
  USER_INITIAL_STATE,
  THEME_INITIAL_STATE,
  updateUser,
  resetUser,
  updateTheme,
};
