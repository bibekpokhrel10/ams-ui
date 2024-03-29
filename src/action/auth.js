import * as types from "../constant/actionTypes";
import { registerUser, userLogin } from "../services/apiCall";


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
    console.log("this is response :: ",response)
  } catch (error) {
    console.log("error");
  }
};

export const registerAPI = (registerUserPayload) => async (dispatch) => {
  try {
    const response = await registerUser(registerUserPayload);
    console.log("this is response :: ",response)
  } catch (error) {
    console.log("error");
  }
};