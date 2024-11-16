import * as types from "../constant/actionTypes";
import { createSemesterAPI, deleteSemesterAPI, getSemestersAPI, updateSemesterAPI } from "../services/apiCall";

export const fetchSemesters = (programId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await getSemestersAPI(programId, token);
    dispatch({ type: types.FETCH_SEMESTERS_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.FETCH_SEMESTERS_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const createSemester = (createSemesterPayload) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.CREATE_SEMESTER_REQUEST });
    const token = getState().auth.token;
    const response = await createSemesterAPI(createSemesterPayload, token);
    dispatch({ type: types.CREATE_SEMESTER_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.CREATE_SEMESTER_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const deleteSemester = (semesterId) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await deleteSemesterAPI(semesterId, token);
    dispatch({ type: types.DELETE_SEMESTER_SUCCESS, payload: semesterId });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.DELETE_SEMESTER_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};

export const updateSemester = (updateSemesterPayload) => async (dispatch, getState) => {
  try {
    const token = getState().auth.token;
    const response = await updateSemesterAPI(updateSemesterPayload.id, updateSemesterPayload, token);
    dispatch({ type: types.UPDATE_SEMESTER_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    dispatch({ type: types.UPDATE_SEMESTER_FAILURE, payload: error.response.data.message });
    return { success: false, message: error.response.data.message };
  }
};