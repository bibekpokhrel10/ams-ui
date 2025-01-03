import * as types from "../constant/actionTypes";
import { fetchClassesAPI, takeAttendanceAPI, updateAttendanceAPI, fetchAttendanceHistoryAPI, getAttendanceStatsAPI, getStudentClassAttendanceAPI, getTeacherClassAttendanceAPI, sendAttendanceAlertAPI } from "../services/apiCall";

// Fetch classes for attendance
export const fetchClasses = (institutionId, teacherId = null) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_CLASSES_REQUEST });
    const token = getState().auth.token;
    const response = await fetchClassesAPI(institutionId, teacherId, token);
    dispatch({ type: types.FETCH_CLASSES_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch classes";
    dispatch({ type: types.FETCH_CLASSES_FAILURE, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Take attendance for a class
export const takeAttendance = (attendanceData) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.TAKE_ATTENDANCE_REQUEST });
    const token = getState().auth.token;    
    const response = await takeAttendanceAPI(attendanceData, token);
    dispatch({ type: types.TAKE_ATTENDANCE_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to record attendance";
    dispatch({ type: types.TAKE_ATTENDANCE_FAILURE, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Update existing attendance record
export const updateAttendance = (attendanceId, attendanceData) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.UPDATE_ATTENDANCE_REQUEST });
    const token = getState().auth.token;
    const payload = {
      attendanceId,
      attendanceData,
      updatedAt: new Date().toISOString(),
    };
    
    const response = await updateAttendanceAPI(payload, token);
    dispatch({ type: types.UPDATE_ATTENDANCE_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to update attendance";
    dispatch({ type: types.UPDATE_ATTENDANCE_FAILURE, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

// Fetch attendance history for a class
export const fetchAttendanceHistory = (classId, startDate, endDate) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_ATTENDANCE_HISTORY_REQUEST });
    const token = getState().auth.token;
    const response = await fetchAttendanceHistoryAPI(classId, startDate, endDate, token);
    dispatch({ type: types.FETCH_ATTENDANCE_HISTORY_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch attendance history";
    dispatch({ type: types.FETCH_ATTENDANCE_HISTORY_FAILURE, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

export const fetchAttendanceByDate = (query) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.FETCH_ATTENDANCE_BY_DATE_REQUEST });
    const token = getState().auth.token;
    const response = await fetchAttendanceHistoryAPI(query, token);
    dispatch({ type: types.FETCH_ATTENDANCE_BY_DATE_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch attendance history";
    dispatch({ type: types.FETCH_ATTENDANCE_BY_DATE_FAILURE, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

export const fetchAttendanceStats = ( query ) => async (dispatch, getState)  => {
  try {
    dispatch({ type: types.FETCH_ATTENDANCE_BY_DATE_REQUEST });
    const token = getState().auth.token;
    const response = await getAttendanceStatsAPI( query , token);
    dispatch({ type: types.FETCH_ATTENDANCE_BY_DATE_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch attendance history";
    dispatch({ type: types.FETCH_ATTENDANCE_BY_DATE_FAILURE, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
};

export const fetchClassAttendanceData = (classId, userType) => async (dispatch, getState) => {
  try {
    console.log("fetch class attendance data :: ", classId, userType);
    dispatch({ type: types.FETCH_CLASS_ATTENDANCE_DATA_REQUEST });
    const token = getState().auth.token;
    if (userType === "student") {
      const response = await getStudentClassAttendanceAPI(classId, token);
      dispatch({ type: types.FETCH_CLASS_ATTENDANCE_DATA_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    } else {
      const response = await getTeacherClassAttendanceAPI(classId, token);
      dispatch({ type: types.FETCH_CLASS_ATTENDANCE_DATA_SUCCESS, payload: response.data });
      return { success: true, data: response.data };
    }
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to fetch class attendance data";
    dispatch({ type: types.FETCH_CLASS_ATTENDANCE_DATA_FAILURE, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
}

export const sendAttendanceAlert = (payload) => async (dispatch, getState) => {
  try {
    dispatch({ type: types.SEND_ATTENDANCE_ALERT_REQUEST });
    const token = getState().auth.token;
    const response = await sendAttendanceAlertAPI(payload.user_type, payload.threshold, token);
    dispatch({ type: types.SEND_ATTENDANCE_ALERT_SUCCESS, payload: response.data });
    return { success: true, data: response.data };
  } catch (error) {
    const errorMessage = error.response?.data?.message || "Failed to send attendance alert";
    dispatch({ type: types.SEND_ATTENDANCE_ALERT_FAILURE, payload: errorMessage });
    return { success: false, message: errorMessage };
  }
}