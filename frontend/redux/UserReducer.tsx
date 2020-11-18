import { combineReducers } from "redux";
import { Admin } from "../api/admin";

const defaultAdmin = new Admin("", "");
const INITIAL_STATE = { user: { ...defaultAdmin }, token: "" };

export type Store = { user: { user: Admin; token: string } };

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { ...action.payload };
    default:
      return state;
  }
};

export default combineReducers({
  user: userReducer,
});
