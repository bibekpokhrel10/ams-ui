import * as types from "../constant/actionTypes";
import {  getInstitutions, createInstution, deleteInstution} from "../services/apiCall";
export const fetchInstitutions = () => async (dispatch, getState) => {
    try {
      dispatch({ type: types.FETCH_INSTITUTIONS_REQUEST }); // Add this line
      const token = getState().auth.token;
      const response = await getInstitutions(token);
      dispatch({ type: types.FETCH_INSTITUTIONS_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.FETCH_INSTITUTIONS_FAILURE, payload: error.message });
      return { success: false, message: error.response.data.message };
    }
  };
  
  export const createInstitution = (institutionData) => async (dispatch, getState) => {
    try {
      dispatch({ type: types.CREATE_INSTITUTION_REQUEST }); // Add this line
      const token = getState().auth.token;
      const response = await createInstution(institutionData, token);
      dispatch({ type: types.CREATE_INSTITUTION_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.CREATE_INSTITUTION_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };
  
  export const deleteInstitution = (institutionId) => async (dispatch, getState) => {
    try {
      dispatch({ type: types.DELETE_INSTITUTION_REQUEST });
      const token = getState().auth.token;
      const response = await deleteInstution(institutionId, token);
      dispatch({ type: types.DELETE_INSTITUTION_SUCCESS, payload: institutionId });
      return { success: true, data: response.data };
    } catch (error) {
      dispatch({ type: types.DELETE_INSTITUTION_FAILURE, payload: error.response.data.message });
      return { success: false, message: error.response.data.message };
    }
  };