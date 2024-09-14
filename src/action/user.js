import * as types from "../constant/actionTypes";
import {  getUsersAPI,getUserProfileAPI,updateUserprofileAPI, updateUserPasswordAPI} from "../services/apiCall";

export const updateUser = (userId, updateUserprofilePayload) => async (dispatch, getState) => {
    try {
      dispatch({ type: types.UPDATE_USER_PROFILE_REQUEST });
      const token = getState().auth.token;
      const response = await updateUserprofileAPI(userId, updateUserprofilePayload, token);
      dispatch({ type: types.UPDATE_USER_PROFILE_SUCCESS, payload: response.data });
       return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.UPDATE_USER_PROFILE_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };
  
  export const changeUserPassword = (userId, updatePasswordPayload) => async (dispatch, getState) => {
    try {
      dispatch({ type: types.CHANGE_USER_PASSWORD_REQUEST });
      const token = getState().auth.token;
      const response = await updateUserPasswordAPI(userId, updatePasswordPayload, token);
      dispatch({ type: types.CHANGE_USER_PASSWORD_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.CHANGE_USER_PASSWORD_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };

  export const fetchUserProfile = () => async (dispatch, getState) => {
    try {
      dispatch({ type: types.FETCH_USER_PROFILE_REQUEST });
      const token = getState().auth.token;
      const response = await getUserProfileAPI(token);
      dispatch({ type: types.FETCH_USER_PROFILE_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.FETCH_USER_PROFILE_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };
  
  export const fetchUsers = () => async (dispatch, getState) => {
    try {
      dispatch({ type: types.FETCH_USERS_REQUEST });
      const token = getState().auth.token;
      const response = await getUsersAPI(token);
      dispatch({ type: types.FETCH_USERS_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.FETCH_USERS_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };