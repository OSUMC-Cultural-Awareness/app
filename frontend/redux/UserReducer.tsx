import { combineReducers } from "redux";

const INITIAL_STATE = {
  _id: "",
  name: "",
  email: "",
  token: "",
  superUser: false,
};

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
