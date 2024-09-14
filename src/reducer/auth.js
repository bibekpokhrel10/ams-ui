import * as types from "../constant/actionTypes";

const initialState = {
  token: null,
  isAuthenticated: false,
};

const Auth = (state = initialState, action) => {
  switch (action.type) {
    case types.IS_AUTH:
      return {
        ...state,
        token: action.payload.data.token,
        isAuthenticated: true,
        role: action.payload.data.role,
      };
    // Add other cases as needed
    default:
      return state;
  }
};

export default Auth;
