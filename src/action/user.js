import * as types from "../constant/actionTypes";
import {  getUsersAPI,getUserProfileAPI,updateUserprofileAPI, updateUserPasswordAPI,deleteUserAPI, getInstitutionUserAPI} from "../services/apiCall";

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
      console.log("fetch user is called ")
      const response = await getUserProfileAPI(token);
      dispatch({ type: types.FETCH_USER_PROFILE_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.FETCH_USER_PROFILE_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };
  
  export const fetchUsers = (listRequest) => async (dispatch, getState) => {
    try {
      dispatch({ type: types.FETCH_USERS_REQUEST });
      const token = getState().auth.token;
      const response = await getUsersAPI(token, listRequest);
      dispatch({ type: types.FETCH_USERS_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.FETCH_USERS_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };

  export const deleteUser = (userId) => async (dispatch, getState) => {
    try {
      dispatch({ type: types.DELETE_USER_REQUEST });
      const token = getState().auth.token;
      const response = await deleteUserAPI(userId, token);
      dispatch({ type: types.DELETE_USER_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.DELETE_USER_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };

  export const fetchInstitutionUser = (institutionId, query) => async (dispatch, getState) => {
    try {
      dispatch({ type: types.FETCH_INSTITUTION_USER_REQUEST });
      const token = getState().auth.token;
      const response = await getInstitutionUserAPI(institutionId, query, token);
      dispatch({ type: types.FETCH_INSTITUTION_USER_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.FETCH_INSTITUTION_USER_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };