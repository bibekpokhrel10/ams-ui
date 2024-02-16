import * as types from "../constant/actionTypes";

const INITIAL_STATE = {
  // isAuthenticated: localStorage.getItem("token") ? "true" : "",
  isAuthenticated: "",
  selectLanguage: "",
};
function Auth(state = INITIAL_STATE, action) {
  const { type, payload } = action;
  switch (type) {
    // case types.IS_AUTH:
    //   payload
    //     ? localStorage.setItem("token", payload)
    //     : localStorage.removeItem("token");
    //   return { ...state, isAuthenticated: payload };
    case types.IS_AUTH:
      console.log("this is action :: ",action.payload)
      return {
        ...state,
        isAuthenticated: payload.data.token,
      };
    default:
      return state;
  }
}

export default Auth;
