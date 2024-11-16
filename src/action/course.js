import * as types from "../constant/actionTypes";
import { createCourseAPI, deleteCourseAPI, getCoursesAPI, updateCourseAPI } from "../services/apiCall";

export const fetchCourses = (semesterId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await getCoursesAPI(semesterId, token);
    dispatch({ type: types.FETCH_COURSES_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.FETCH_COURSES_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const createCourse = (createCoursePayload) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.CREATE_COURSE_REQUEST });
    const token = getState().auth.token;
    const response = await createCourseAPI(createCoursePayload, token);
    dispatch({ type: types.CREATE_COURSE_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.CREATE_COURSE_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const deleteCourse = (courseId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await deleteCourseAPI(courseId, token);
    dispatch({ type: types.DELETE_COURSE_SUCCESS, payload: courseId });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.DELETE_COURSE_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const updateCourse = (updateCoursePayload) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await updateCourseAPI(updateCoursePayload.id, updateCoursePayload, token);
    dispatch({ type: types.UPDATE_COURSE_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.UPDATE_COURSE_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};