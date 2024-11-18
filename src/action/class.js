import * as types from "../constant/actionTypes";
import { createClassAPI, deleteClassAPI, getClassesAPI, updateClassAPI, getInstructorsAPI, getInstructorClassesAPI, getClassStudentsAPI } from "../services/apiCall";

export const fetchClasses = (courseId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await getClassesAPI(courseId, token);
    dispatch({ type: types.FETCH_CLASSES_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.FETCH_CLASSES_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const fetchInstructors = (institutionId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await getInstructorsAPI(institutionId, token);
    dispatch({ type: types.FETCH_INSTRUCTORS_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.FETCH_INSTRUCTORS_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const createClass = (createClassPayload) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.CREATE_CLASS_REQUEST });
    const token = getState().auth.token;
    const response = await createClassAPI(createClassPayload, token);
    dispatch({ type: types.CREATE_CLASS_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.CREATE_CLASS_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const deleteClass = (classId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await deleteClassAPI(classId, token);
    dispatch({ type: types.DELETE_CLASS_SUCCESS, payload: classId });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.DELETE_CLASS_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const updateClass = (updateClassPayload) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await updateClassAPI(updateClassPayload.id, updateClassPayload, token);
    dispatch({ type: types.UPDATE_CLASS_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.UPDATE_CLASS_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const fetchInstructorClasses = (instructorId) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_INSTRUCTOR_CLASSES_REQUEST });
    const token = getState().auth.token;
    const response = await getInstructorClassesAPI(instructorId, token);
    dispatch({ 
      type: types.FETCH_INSTRUCTOR_CLASSES_SUCCESS, 
      payload: response.data 
    });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ 
      type: types.FETCH_INSTRUCTOR_CLASSES_FAILURE, 
      payload: error.response?.data?.message || 'Failed to fetch classes' 
    });
    return { success: false, message: error.response?.data?.message };
  }
};

export const fetchClassStudents = (query) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_CLASS_STUDENTS_REQUEST });
    const token = getState().auth.token;
    const response = await getClassStudentsAPI(query, token);
    dispatch({ 
      type: types.FETCH_CLASS_STUDENTS_SUCCESS, 
      payload: response.data 
    });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ 
      type: types.FETCH_CLASS_STUDENTS_FAILURE, 
      payload: error.response?.data?.message || 'Failed to fetch students' 
    });
    return { success: false, message: error.response?.data?.message };
  }
};