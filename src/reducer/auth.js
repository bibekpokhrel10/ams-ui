import * as types from "../constant/actionTypes";

const INITIAL_STATE = {
  isAuthenticated: localStorage.getItem("token") ? "true" : "",
};

function Auth(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  console.log("payload", payload);
  switch (type) {
    case types.IS_AUTH:
      return {
        ...state,
        isAuthenticated: payload.data.token || "",
      };
    default:
      return state;
  }
}

export default Auth;
