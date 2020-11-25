import { Store } from ".";

export const updateUser = (user: Store["user"]) => ({
  type: "UPDATE_USER",
  payload: user,
});

export const resetUser = () => ({
  type: "RESET_USER",
  payload: {},
});
