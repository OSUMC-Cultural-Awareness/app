import { Store } from ".";

export const updateUser = (
  user: Store["user"]
): { type: string; payload: Store["user"] } => ({
  type: "UPDATE_USER",
  payload: user,
});

export const resetUser = (): {
  type: string;
  payload: Record<string, unknown>;
} => ({
  type: "RESET_USER",
  payload: {},
});
