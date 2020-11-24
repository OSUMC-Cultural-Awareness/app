import { combineReducers } from "redux";
import { ThemeType } from "../constants";
import { Admin } from "../api/admin";

const defaultAdmin = new Admin("", "");
const INITIAL_STATE = { user: { ...defaultAdmin }, token: "" };
const THEME_INITIAL_STATE = "Dark";

export type Store = { user: { user: Admin; token: string }; theme: ThemeType };

const userReducer = (
  state = INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { ...action.payload };
    default:
      return state;
  }
};

const themeReducer = (
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

export default combineReducers({
  theme: themeReducer,
  user: userReducer,
});
