import * as types from '../constant/actionTypes';
import { getInstitutionAdminsAPI, addInstitutionAdminAPI } from '../services/apiCall';

export const fetchInstitutionAdmins = (institutionId, query) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_INSTITUTION_ADMINS_REQUEST });
    const token = getState().auth.token;
    const response = await getInstitutionAdminsAPI(institutionId, query, token);
    dispatch({ 
      type: types.FETCH_INSTITUTION_ADMINS_SUCCESS, 
      payload: response.data 
    });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ 
      type: types.FETCH_INSTITUTION_ADMINS_FAILURE, 
      payload: error.response?.data?.message || 'Failed to fetch institution admins' 
    });
    return { success: false, message: error.response?.data?.message };
  }
};

export const addInstitutionAdmin = (institutionId, userId) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.ADD_INSTITUTION_ADMIN_REQUEST });
    const token = getState().auth.token;
    const response = await addInstitutionAdminAPI(institutionId, userId, token);
    dispatch({ 
      type: types.ADD_INSTITUTION_ADMIN_SUCCESS, 
      payload: response.data 
    });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ 
      type: types.ADD_INSTITUTION_ADMIN_FAILURE, 
      payload: error.response?.data?.message || 'Failed to add institution admin' 
    });
    return { success: false, message: error.response?.data?.message };
  }
};
