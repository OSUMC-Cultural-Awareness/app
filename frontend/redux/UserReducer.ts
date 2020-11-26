import { Admin } from "../lib";
import { Store } from ".";

export const USER_INITIAL_STATE = { user: { ...new Admin("", "") }, token: "" };

export const userReducer = (
  state = USER_INITIAL_STATE,
  action: { type: string; payload: Store["user"] }
) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { ...action.payload };
    case "RESET_USER":
      return { ...USER_INITIAL_STATE };
    default:
      return state;
  }
};
