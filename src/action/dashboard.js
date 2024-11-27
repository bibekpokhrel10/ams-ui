import * as types from "../constant/actionTypes";
import { getDashboardData } from "../services/apiCall";

export const fetchDashboardData = (query) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_DASHBOARD_REQUEST });
    const token = getState().auth.token;
    const response = await getDashboardData(token, query);
    dispatch({ type: types.FETCH_DASHBOARD_SUCCESS, payload: response.data });
    return { success: true, data: response.data.data };
  } catch (error) {
    dispatch({ 
      type: types.FETCH_DASHBOARD_FAILURE, 
      payload: error.response?.data?.message || error.message 
    });
    return { success: false, message: error.response?.data?.message || error.message };
  }
};