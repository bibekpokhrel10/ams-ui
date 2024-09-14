import { getAttendance } from "../services/apiCall";


export const attendanceAPI = (token) => async (dispatch) => {
    try {
      const response = await getAttendance(token);
      console.log("this is response :: ",response)
    } catch (error) {
      console.log("error");
    }
  };
  