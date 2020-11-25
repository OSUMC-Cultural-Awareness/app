import { combineReducers } from "redux";

import { USER_INITIAL_STATE, userReducer } from "./UserReducer";
import { THEME_INITIAL_STATE, themeReducer } from "./ThemeReducer";
import { updateUser } from "./UserAction";
import { updateTheme } from "./ThemeAction";

import { Admin } from "../api/admin";
import { ThemeType } from "../constants";

export const Reducer = combineReducers({
  theme: themeReducer,
  user: userReducer,
});

export type Store = { user: { user: Admin; token: string }; theme: ThemeType };

export { USER_INITIAL_STATE, THEME_INITIAL_STATE, updateUser, updateTheme };
