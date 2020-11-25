import { Admin } from "../api/admin";

export const USER_INITIAL_STATE = { user: { ...new Admin("", "") }, token: "" };

export const userReducer = (
  state = USER_INITIAL_STATE,
  action: { type: string; payload: any }
) => {
  switch (action.type) {
    case "UPDATE_USER":
      return { ...action.payload };
    default:
      return state;
  }
};
