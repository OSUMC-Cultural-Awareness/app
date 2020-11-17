import { combineReducers } from "redux";
import { Admin } from "../api/admin";

const defaultAdmin = new Admin("", "");
const INITIAL_STATE = { user: { ...defaultAdmin }, token: "" };

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
