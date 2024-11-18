import * as types from '../constant/actionTypes';
import {
  getClassEnrolledStudentsAPI,
  enrollClassStudentsAPI,
  unenrollClassStudentAPI,
} from '../services/apiCall';

export const fetchEnrolledStudents = (classId, params) => async (dispatch, getState) => {
  dispatch({ type: types.FETCH_CLASS_ENROLLED_STUDENTS_REQUEST });
  try {
    const token = getState().auth.token;
    const response = await getClassEnrolledStudentsAPI(classId, params, token);
    dispatch({
      type: types.FETCH_CLASS_ENROLLED_STUDENTS_SUCCESS,
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
      type: types.FETCH_CLASS_ENROLLED_STUDENTS_FAILURE,
      payload: error.response?.data?.message || 'Failed to fetch enrolled students'
    });
    return { success: false, message: error.response?.data?.message };
  }
};

export const enrollStudents = (classId, studentIds) => async (dispatch, getState) => {
  dispatch({ type: types.ENROLL_CLASS_STUDENTS_REQUEST });
  try {
    const token = getState().auth.token;
    const response = await enrollClassStudentsAPI(classId, studentIds, token);
    dispatch({
      type: types.ENROLL_CLASS_STUDENTS_SUCCESS,
      payload: response.data.data
    });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({
      type: types.ENROLL_CLASS_STUDENTS_FAILURE,
      payload: error.response?.data?.message || 'Failed to enroll students'
    });
    return { success: false, message: error.response?.data?.message };
  }
};

export const unenrollStudent = (studentId) => async (dispatch, getState) => {
  dispatch({ type: types.UNENROLL_CLASS_STUDENT_REQUEST });
  try {
    const token = getState().auth.token;
    await unenrollClassStudentAPI(studentId, token);
    dispatch({
      type: types.UNENROLL_CLASS_STUDENT_SUCCESS,
      payload: studentId
    });
    return { success: true };
  } catch (error) {
    dispatch({
      type: types.UNENROLL_CLASS_STUDENT_FAILURE,
      payload: error.response?.data?.message || 'Failed to unenroll student'
    });
    return { success: false, message: error.response?.data?.message };
  }
};