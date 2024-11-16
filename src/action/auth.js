import { getLinearProgressUtilityClass } from "@mui/material";
import * as types from "../constant/actionTypes";
import { registerUser, userLogin} from "../services/apiCall";


const getAuth = (data) => 
({
  type: types.IS_AUTH,
  payload: data,
});

const handleLanguage = (language) => ({
  type: types.HANDLE_LANGUAGE_CHANGE,
  payload: language,
});

export const auth = (token) => (dispatch) => {
  dispatch(getAuth(token));
};

export const handleChangeLanguage = (language) => (dispatch) => {
  dispatch(handleLanguage(language));
};


export const loginAPI = (loginUserPayload) => async (dispatch) => {
  try {
    const response = await userLogin(loginUserPayload);
    dispatch(getAuth(response.data));
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};

export const registerAPI = (registerUserPayload) => async (dispatch) => {
  try {
    const response = await registerUser(registerUserPayload);
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, message: error.response.data.message };
  }
};


export const logout = () => (dispatch) => {
  // Clear user session without hitting an API
  dispatch({ type: types.LOGOUT });
  // You might want to clear local storage or cookies here as well
  localStorage.removeItem('token');
};





