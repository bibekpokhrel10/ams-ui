// actions/enrollmentActions.js
import * as types from '../constant/actionTypes';
import {
  getEnrolledStudentsAPI,
  enrollStudentsAPI,
  unenrollStudentAPI,
  searchAvailableStudentsAPI
} from '../services/apiCall';

export const fetchEnrolledStudents = (programId, params) => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_ENROLLED_STUDENTS_REQUEST });
  try {
    const token = getState().auth.token;
    const response = await getEnrolledStudentsAPI(programId, params, token);
    dispatch({
      type: types.FETCH_ENROLLED_STUDENTS_SUCCESS,
      payload: {
        list: response.data.data,
        total: response.data.count,
        page: response.data.page,
        size: response.data.size
      }
    });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({
      type: types.FETCH_ENROLLED_STUDENTS_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch enrolled students'
    });
    return { success: false, message: error.response?.data?.message };
  }
};

export const enrollStudents = (programId, studentIds) => async (dispatch, getState) => {
  dispatch({ type: types.ENROLL_STUDENTS_REQUEST });
  try {
    const token = getState().auth.token;
    const response = await enrollStudentsAPI(programId, studentIds, token);
    dispatch({ 
      type: types.ENROLL_STUDENTS_SUCCESS, 
      payload: response.data.data 
    });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({
      type: types.ENROLL_STUDENTS_FAILURE,
      payload: error.response?.data?.message || 'Failed to enroll students'
    });
    return { success: false, message: error.response?.data?.message };
  }
};

export const unenrollStudent = (programId, studentId) => async (dispatch, getState) => {
  dispatch({ type: types.UNENROLL_STUDENT_REQUEST });
  try {
    const token = getState().auth.token;
    await unenrollStudentAPI(programId, studentId, token);
    dispatch({ 
      type: types.UNENROLL_STUDENT_SUCCESS, 
      payload: studentId 
    });
    return { success: true };
  } catch (error) {
    dispatch({
      type: types.UNENROLL_STUDENT_FAILURE,
      payload: error.response?.data?.message || 'Failed to unenroll student'
    });
    return { success: false, message: error.response?.data?.message };
  }
};

export const searchAvailableStudents = (query) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await searchAvailableStudentsAPI(query, token);
    return response.data.data;
  } catch (error) {
    console.error('Error searching students:', error);
    return [];
  }
};
